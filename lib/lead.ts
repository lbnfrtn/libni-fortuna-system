import type { LeadInput } from "@/lib/validate";
import { getOffer } from "@/config/offers";
import { selfPayPlan } from "@/config/forms";
import { createOrder } from "@/lib/orders";
import { tag } from "@/lib/tags";
import { isFull } from "@/lib/capacity";
import { logLead } from "@/lib/leadlog";
import { enrol } from "@/lib/funnel";
import { getContent } from "@/lib/content";

// ============================================================================
// Lead intake. Every inquiry, application, waitlist and newsletter signup is
// recorded in the site's own lead log (with its tags and, for applications,
// the answers), then the matching email sequence starts. This system is the
// only CRM — nothing is sent to an outside one.
//
// Application answers can be emotional/health-sensitive. They live only in
// the lead log (Firestore in production, access-controlled) and are shown
// only inside the signed-in admin — never in logs, CSV exports or emails.
// ============================================================================

export interface LeadResult {
  ok: boolean;
  waitlisted: boolean;
}

export interface BacklogRow {
  name: string;
  email: string;
  phone?: string;
  offerSlug?: string;
  source?: string;
  sourceDetail?: string;
}

/**
 * Import one backlog row (from a DM/spreadsheet CSV) into the lead log, tagged
 * `nurture` plus the offer-of-interest lead tag, and queue the one-time
 * re-engagement letter (sent only if that sequence is switched on).
 */
export async function importBacklogRow(row: BacklogRow): Promise<{ ok: boolean; email: string; error?: string }> {
  try {
    const offer = row.offerSlug ? getOffer(row.offerSlug) : undefined;
    const tags = [tag.nurture()];
    if (offer) tags.push(tag.lead(offer.slug));
    await logLead({
      at: new Date().toISOString(),
      name: row.name,
      email: row.email,
      phone: row.phone,
      offerSlug: offer?.slug ?? row.offerSlug ?? "",
      track: offer?.track ?? "consumer",
      source: row.source || "backlog-import",
      sourceDetail: row.sourceDetail,
      waitlisted: false,
      tags,
    });
    // One honest re-engagement letter — only if Libni has switched that sequence on.
    await enrol({ email: row.email, name: row.name, trigger: "nurture", key: `nurture:${row.email.toLowerCase()}`, vars: { offer: offer?.name ?? "" } }).catch(() => {});
    return { ok: true, email: row.email };
  } catch (e) {
    return { ok: false, email: row.email, error: String(e instanceof Error ? e.message : e) };
  }
}

/** Which email sequence a new lead starts, from what they actually did. Never throws. */
async function startSequence(lead: LeadInput, waitlisted: boolean): Promise<void> {
  const offer = getOffer(lead.offerSlug);
  const source = lead.source || "website";
  const isApplication = offer?.journey === "B" || offer?.journey === "C";
  let trigger: string;
  if (source === "newsletter" || source === "free-guide") trigger = source;
  else if (!offer) trigger = "newsletter";
  else if (waitlisted) trigger = `waitlist:${offer.slug}`;
  else if (isApplication) {
    if (selfPayPlan(lead.offerSlug, lead.answers)) return; // they chose to pay: the order's payment-link letters take over
    trigger = `applied:${offer.slug}`;
  }
  else if (offer.track === "corporate" || offer.track === "brand" || offer.journey === "D") trigger = `enquiry:${offer.slug}`;
  else return; // a plain lead on a pay-now offer gets the payment-link sequence from the order, not from here
  const vars: Record<string, string> = { offer: offer?.name ?? "" };
  if (offer?.slug === "liberate") {
    const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
    vars.booking_link = (await getContent().catch(() => null))?.links.calendlyLiberate || `${base}/contact`;
  }
  await enrol({ email: lead.email, name: lead.name, trigger, vars }).catch(() => {});
}

export interface SelfPay {
  plan: "full" | "instalment";
  link?: string;
  manualPayUrl: string;
  amount: number;
  total: number;
  offer: string;
  instalments: { n: number; amount: number; dueDate: string }[];
}

/**
 * An applicant who chose to pay (Liberate): create the order now and hand back
 * the first link. If the order can't be made, fall back to the application
 * letters so Libni follows up by hand.
 */
export async function selfPayAfterApply(lead: LeadInput): Promise<SelfPay | null> {
  const plan = selfPayPlan(lead.offerSlug, lead.answers);
  const offer = getOffer(lead.offerSlug);
  if (!plan || !offer || offer.pricePHP == null) return null;
  let order;
  try {
    order = await createOrder({
      offerSlug: offer.slug,
      planType: plan,
      contact: { name: lead.name, email: lead.email, phone: lead.phone },
      createdBy: "website",
    });
  } catch (e) {
    console.error("[lead] self-pay order failed", e);
    await enrol({ email: lead.email, name: lead.name, trigger: `applied:${offer.slug}`, vars: { offer: offer.name } }).catch(() => {});
    return null;
  }
  const first = order.instalments[0];
  const manualPayUrl = `${(process.env.APP_BASE_URL || "").replace(/\/$/, "")}/pay/${order.id}`;
  await enrol({
    email: lead.email, name: lead.name, trigger: "payment-pending",
    vars: { offer: offer.name, payment_link: first.invoiceUrl || manualPayUrl, amount: String(first.amountPHP) },
  }).catch(() => {});
  return {
    plan, link: first.invoiceUrl, manualPayUrl, amount: first.amountPHP, total: order.totalPHP, offer: offer.name,
    instalments: order.instalments.map((i) => ({ n: i.n, amount: i.amountPHP, dueDate: i.dueDate })),
  };
}

export async function intakeLead(lead: LeadInput): Promise<LeadResult> {
  const offer = getOffer(lead.offerSlug);
  // Waitlist if: no price / explicitly waitlist-only / a capped offer is full.
  const full = offer?.capacity ? await isFull(lead.offerSlug) : false;
  const waitlisted = !!offer && (offer.waitlistOnly || offer.pricePHP == null || full);

  const source = lead.source || "website";
  const isApplication = offer?.journey === "B" || offer?.journey === "C";
  const tags = [waitlisted ? tag.waitlist(lead.offerSlug) : isApplication ? tag.applied(lead.offerSlug) : tag.lead(lead.offerSlug)];
  const answers = lead.answers && Object.keys(lead.answers).length ? lead.answers : undefined;

  await logLead({
    at: new Date().toISOString(),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    offerSlug: lead.offerSlug,
    track: lead.track,
    source,
    sourceDetail: lead.sourceDetail || lead.utm?.utm_content,
    waitlisted,
    tags,
    answers,
  });
  // Only once the lead is safely recorded does its email sequence begin.
  await startSequence(lead, waitlisted).catch(() => {});
  return { ok: true, waitlisted };
}
