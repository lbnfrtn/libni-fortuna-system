import type { LeadInput } from "@/lib/validate";
import { getOffer } from "@/config/offers";
import { upsertContact, addTags, setCustomFields, upsertOpportunity } from "@/lib/ghl";
import { PIPELINES, knownFields } from "@/config/ghl-map";
import { tag } from "@/lib/tags";
import { isFull } from "@/lib/capacity";
import { logLead } from "@/lib/leadlog";
import { promises as fs } from "node:fs";
import path from "node:path";

// ============================================================================
// Lead intake (spec §7.2). Upsert the contact in GHL, set source fields, add
// the tag, create the opportunity in the right pipeline. If GHL is down, the
// lead is parked to disk and never lost.
//
// Application answers can be emotional/health-sensitive: they go to GHL only,
// NEVER to logs or the parked-lead file (we store just that answers existed).
// ============================================================================

const PARK_DIR = path.join(process.cwd(), "data");
const PARK_FILE = path.join(PARK_DIR, "parked-leads.json");

async function parkLead(lead: LeadInput): Promise<void> {
  await fs.mkdir(PARK_DIR, { recursive: true });
  let arr: unknown[] = [];
  try {
    arr = JSON.parse(await fs.readFile(PARK_FILE, "utf8"));
  } catch {
    /* first parked lead */
  }
  // Strip sensitive answers before parking to disk.
  const { answers, ...safe } = lead;
  arr.push({ at: new Date().toISOString(), hadAnswers: !!answers, lead: safe });
  await fs.writeFile(PARK_FILE, JSON.stringify(arr, null, 2), "utf8");
}

export interface LeadResult {
  ok: boolean;
  contactId?: string;
  parked?: boolean;
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
 * Import one backlog row (from a DM/spreadsheet CSV). Upserts the contact,
 * tags it with the offer-of-interest lead tag (if any) plus `nurture`, and
 * records the source. No opportunity is created — these are warm-but-cold
 * leads for one honest re-engagement message, not active deals.
 */
export async function importBacklogRow(row: BacklogRow): Promise<{ ok: boolean; email: string; error?: string }> {
  try {
    const offer = row.offerSlug ? getOffer(row.offerSlug) : undefined;
    const { contactId } = await upsertContact({
      name: row.name,
      email: row.email,
      phone: row.phone,
      source: row.source || "backlog-import",
    });
    const tags = [tag.nurture()];
    if (offer) tags.push(tag.lead(offer.slug));
    await addTags(contactId, tags);
    await setCustomFields(
      contactId,
      knownFields({
        offerOfInterest: offer?.name ?? row.offerSlug ?? "",
        leadSource: row.source || "backlog-import",
        sourceDetail: row.sourceDetail || "",
      })
    );
    return { ok: true, email: row.email };
  } catch (e) {
    return { ok: false, email: row.email, error: String(e instanceof Error ? e.message : e) };
  }
}

export async function intakeLead(lead: LeadInput): Promise<LeadResult> {
  const offer = getOffer(lead.offerSlug);
  // Waitlist if: no price / explicitly waitlist-only / a capped offer is full.
  const full = offer?.capacity ? await isFull(lead.offerSlug) : false;
  const waitlisted = !!offer && (offer.waitlistOnly || offer.pricePHP == null || full);

  try {
    const source = lead.source || "website";
    const isApplication = offer?.journey === "B" || offer?.journey === "C";

    const { contactId } = await upsertContact({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source,
    });

    // Tag: waitlist / applied / lead depending on offer + journey.
    const tags: string[] = [];
    if (waitlisted) tags.push(tag.waitlist(lead.offerSlug));
    else if (isApplication) tags.push(tag.applied(lead.offerSlug));
    else tags.push(tag.lead(lead.offerSlug));
    await addTags(contactId, tags);

    // Fields: source detail + offer of interest. Answers (sensitive) go into
    // GHL's custom fields too, but only if a field id is configured; we keep
    // them out of everything else.
    const fields = knownFields({
      offerOfInterest: offer?.name ?? lead.offerSlug,
      leadSource: source,
      sourceDetail: lead.sourceDetail || lead.utm?.utm_content || "",
    });
    await setCustomFields(contactId, fields);

    // Opportunity in the right pipeline at the entry stage.
    if (offer) {
      const pipe = PIPELINES[offer.pipeline];
      const stageKey =
        offer.pipeline === "consumer" ? (isApplication ? "applied" : "new-lead") : "new-inquiry";
      const stageId = pipe.stages[stageKey];
      if (pipe.pipelineId && stageId) {
        await upsertOpportunity({
          contactId,
          pipelineId: pipe.pipelineId,
          stageId,
          name: `${offer.name} — ${lead.name}`,
          monetaryValuePHP: offer.pricePHP ?? undefined,
          status: "open",
        });
      }
    }

    await logLead({
      at: new Date().toISOString(), name: lead.name, email: lead.email, offerSlug: lead.offerSlug,
      track: lead.track, source, sourceDetail: lead.sourceDetail, waitlisted, ghlContactId: contactId,
    }).catch(() => {});
    return { ok: true, contactId, waitlisted };
  } catch (e) {
    // GHL failed — never lose the lead.
    // eslint-disable-next-line no-console
    console.error("[lead] GHL failed, parking lead", String(e));
    await parkLead(lead);
    await logLead({
      at: new Date().toISOString(), name: lead.name, email: lead.email, offerSlug: lead.offerSlug,
      track: lead.track, source: lead.source || "website", sourceDetail: lead.sourceDetail, waitlisted, parked: true,
    }).catch(() => {});
    return { ok: true, parked: true, waitlisted };
  }
}
