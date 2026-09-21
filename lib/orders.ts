import type { Instalment, Order, PaymentMethod, PaymentPlanType } from "@/lib/types";
import { getOffer } from "@/config/offers";
import { store } from "@/lib/store";
import { createInvoice } from "@/lib/xendit";
import { upsertContact, addTags, setCustomFields, upsertOpportunity } from "@/lib/ghl";
import { PIPELINES, knownFields } from "@/config/ghl-map";
import { tag } from "@/lib/tags";
import {
  addMonths,
  instalmentExternalId,
  manualReference,
  newOrderId,
  peso,
  splitInstalments,
  todayISO,
} from "@/lib/util";

export interface CreateOrderInput {
  offerSlug: string;
  planType: PaymentPlanType;
  contact: { name: string; email: string; phone?: string; ghlContactId?: string };
  createdBy: string; // desk user email
  /** Track D custom amount + description. If omitted, uses offer price. */
  customAmountPHP?: number;
  customDescription?: string;
  /** Instalment plan overrides. */
  instalmentCount?: number;
  /** Deposit plan: when the balance is due (ISO). Defaults to +1 month. */
  balanceDueDate?: string;
  /** Override methods (rare). */
  methods?: PaymentMethod[];
  now?: number;
}

function baseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:4310").replace(/\/$/, "");
}

/** Build the instalment schedule (amounts + due dates) for a plan. No I/O. */
export function buildSchedule(
  planType: PaymentPlanType,
  total: number,
  opts: { instalmentCount?: number; depositFraction?: number; balanceDueDate?: string; now?: number }
): Array<{ n: number; amountPHP: number; dueDate: string }> {
  const today = todayISO(opts.now);
  if (planType === "full") {
    return [{ n: 1, amountPHP: total, dueDate: today }];
  }
  if (planType === "instalment") {
    const count = Math.max(1, opts.instalmentCount ?? 3);
    const parts = splitInstalments(total, count);
    return parts.map((amountPHP, i) => ({
      n: i + 1,
      amountPHP,
      dueDate: i === 0 ? today : addMonths(today, i),
    }));
  }
  // deposit + balance
  const frac = opts.depositFraction ?? 0.5;
  const deposit = Math.round(total * frac);
  const balance = total - deposit;
  return [
    { n: 1, amountPHP: deposit, dueDate: today },
    { n: 2, amountPHP: balance, dueDate: opts.balanceDueDate ?? addMonths(today, 1) },
  ];
}

/**
 * Create an order: compute the plan, generate the Xendit link for the FIRST
 * (due-now) instalment, save the order, and update GHL (stage -> payment
 * pending, tag, fields). Later instalments get their link generated when due
 * (see generateInstalmentLink) so links never expire before they're needed.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const offer = getOffer(input.offerSlug);
  if (!offer) throw new Error(`unknown offer: ${input.offerSlug}`);

  const total = input.customAmountPHP ?? offer.pricePHP ?? 0;
  if (total <= 0) {
    throw new Error(
      `No price for "${offer.name}". Set a price in config/offers.ts or pass a custom amount.`
    );
  }
  // Guard against plans the offer doesn't allow.
  if (input.planType === "instalment" && !offer.allowInstalments)
    throw new Error(`${offer.name} does not offer instalments`);
  if (input.planType === "deposit" && !offer.allowDeposit)
    throw new Error(`${offer.name} does not offer a deposit plan`);

  const now = input.now ?? Date.now();
  const id = newOrderId(offer.slug, now);
  const methods = input.methods ?? offer.methods;
  const description =
    input.customDescription || `${offer.name}${offer.priceUnit ? ` (${offer.priceUnit})` : ""}`;

  const schedule = buildSchedule(input.planType, total, {
    instalmentCount: input.instalmentCount ?? offer.instalmentCount,
    depositFraction: offer.depositFraction,
    balanceDueDate: input.balanceDueDate,
    now,
  });

  const instalments: Instalment[] = schedule.map((s) => ({
    n: s.n,
    amountPHP: s.amountPHP,
    dueDate: s.dueDate,
    externalId: instalmentExternalId(id, s.n),
    status: "pending",
  }));

  // Generate the link for the first instalment (due now).
  const first = instalments[0];
  const inv = await createInvoice({
    externalId: first.externalId,
    amountPHP: first.amountPHP,
    payerEmail: input.contact.email,
    description:
      instalments.length > 1 ? `${description} — payment 1 of ${instalments.length}` : description,
    methods,
    successRedirectUrl: `${baseUrl()}/welcome/${offer.slug}?o=${encodeURIComponent(id)}`,
  });
  first.invoiceUrl = inv.invoiceUrl;
  first.xenditInvoiceId = inv.xenditInvoiceId;

  const order: Order = {
    id,
    offerSlug: offer.slug,
    offerName: offer.name,
    planType: input.planType,
    totalPHP: total,
    description,
    contact: input.contact,
    instalments,
    amountPaidPHP: 0,
    balancePHP: total,
    status: "pending",
    createdAt: new Date(now).toISOString(),
    createdBy: input.createdBy,
    manual: { reference: manualReference() },
    events: [{ at: new Date(now).toISOString(), type: "created", note: `plan=${input.planType} total=${peso(total)}` }],
  };

  await store().put(order);

  // --- GHL: this person owes money now. Move them, tag them, set fields. ---
  try {
    const contactId =
      input.contact.ghlContactId ||
      (await upsertContact({
        name: input.contact.name,
        email: input.contact.email,
        phone: input.contact.phone,
        source: "payment-desk",
      })).contactId;
    order.contact.ghlContactId = contactId;

    const pipe = PIPELINES[offer.pipeline];
    const stageId =
      offer.pipeline === "consumer"
        ? pipe.stages["payment-pending"]
        : pipe.stages["invoice-sent"];
    if (pipe.pipelineId && stageId) {
      await upsertOpportunity({
        contactId,
        pipelineId: pipe.pipelineId,
        stageId,
        name: `${offer.name} — ${input.contact.name}`,
        monetaryValuePHP: total,
        status: "open",
      });
    }
    await addTags(contactId, [tag.paymentPending(offer.slug)]);
    await setCustomFields(
      contactId,
      knownFields({
        orderId: id,
        amountDue: first.amountPHP,
        balance: order.balancePHP,
        paymentPlan: input.planType === "full" ? "no" : `yes (${input.planType})`,
        offerOfInterest: offer.name,
      })
    );
    await store().put(order); // persist contactId
  } catch (e) {
    // GHL problems must not lose the order or block the link. Log on the order.
    order.events.push({ at: new Date().toISOString(), type: "ghl-error", note: String(e) });
    await store().put(order);
  }

  return order;
}

/** Generate (or regenerate) the Xendit link for a specific instalment. */
export async function generateInstalmentLink(orderId: string, n: number): Promise<Instalment> {
  const order = await store().get(orderId);
  if (!order) throw new Error("order not found");
  const inst = order.instalments.find((i) => i.n === n);
  if (!inst) throw new Error("instalment not found");
  if (inst.status === "paid") return inst;
  const offer = getOffer(order.offerSlug)!;
  const inv = await createInvoice({
    externalId: inst.externalId,
    amountPHP: inst.amountPHP,
    payerEmail: order.contact.email,
    description: `${order.description} — payment ${n} of ${order.instalments.length}`,
    methods: offer.methods,
    successRedirectUrl: `${baseUrl()}/welcome/${offer.slug}?o=${encodeURIComponent(order.id)}`,
  });
  inst.invoiceUrl = inv.invoiceUrl;
  inst.xenditInvoiceId = inv.xenditInvoiceId;
  order.events.push({ at: new Date().toISOString(), type: "link-generated", note: `instalment ${n}` });
  await store().put(order);
  return inst;
}

/** The next unpaid instalment (for the Desk balances view). */
export function nextUnpaid(order: Order): Instalment | undefined {
  return order.instalments.find((i) => i.status !== "paid");
}
