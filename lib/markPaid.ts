import type { Order } from "@/lib/types";
import { getOffer } from "@/config/offers";
import { store } from "@/lib/store";
import { addTags, setCustomFields, upsertOpportunity, notifyTeam } from "@/lib/ghl";
import { PIPELINES, knownFields } from "@/config/ghl-map";
import { tag } from "@/lib/tags";
import { peso } from "@/lib/util";

export interface PaymentInfo {
  /** Which instalment this payment settles (external_id "#iN" -> n). Defaults 1. */
  instalmentN?: number;
  amountPHP: number;
  method: string;
  paidAt: string;
  /** Stable id of the payment event, for idempotency. */
  eventId: string;
  /** "xendit" | "manual" */
  channel: "xendit" | "manual";
}

export interface MarkPaidResult {
  order: Order;
  changed: boolean; // false if this event was already processed (idempotent)
  fullyPaid: boolean;
}

/**
 * markPaid — the single place a payment becomes real (spec §7.6). Everything
 * downstream (welcome email, agreement, booking, reminders) is a GHL workflow
 * listening for the tags this function adds.
 *
 * Idempotent: the same eventId twice is a no-op. Safe for Xendit's retries and
 * for the EA clicking "Verify" twice.
 */
export async function markPaid(orderId: string, payment: PaymentInfo): Promise<MarkPaidResult> {
  const order = await store().get(orderId);
  if (!order) throw new Error(`markPaid: order not found: ${orderId}`);

  // Idempotency: have we already recorded this exact event?
  if (order.events.some((e) => e.type === "paid" && e.note.includes(payment.eventId))) {
    return { order, changed: false, fullyPaid: order.status === "paid" };
  }

  const n = payment.instalmentN ?? 1;
  const inst = order.instalments.find((i) => i.n === n) ?? order.instalments[0];
  if (inst.status !== "paid") {
    inst.status = "paid";
    inst.paidAt = payment.paidAt;
    inst.paidAmountPHP = payment.amountPHP;
    inst.method = payment.method;
  }

  // Recompute totals from the instalments (source of truth).
  order.amountPaidPHP = order.instalments
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.paidAmountPHP ?? i.amountPHP), 0);
  order.balancePHP = Math.max(0, order.totalPHP - order.amountPaidPHP);
  const fullyPaid = order.instalments.every((i) => i.status === "paid");
  order.status = fullyPaid ? "paid" : "pending";
  if (fullyPaid && !order.paidAt) order.paidAt = payment.paidAt;

  order.events.push({
    at: new Date().toISOString(),
    type: "paid",
    note: `event=${payment.eventId} instalment=${n} amount=${peso(payment.amountPHP)} via ${payment.channel}:${payment.method}`,
  });
  await store().put(order);

  // --- GHL: record the money, move the deal, fire the onboarding tag. ---
  const offer = getOffer(order.offerSlug);
  const contactId = order.contact.ghlContactId;
  try {
    if (offer && contactId) {
      const next = order.instalments.find((i) => i.status !== "paid");

      await setCustomFields(
        contactId,
        knownFields({
          amountPaid: order.amountPaidPHP,
          balance: order.balancePHP,
          paymentMethod: payment.method,
          paymentDate: payment.paidAt.slice(0, 10),
          nextInstalmentDue: next ? next.dueDate : "",
        })
      );

      // The onboarding trigger fires on the FIRST payment (spec §7.8),
      // i.e. the first time we add paid:<offer>.
      const firstPayment = order.instalments.filter((i) => i.status === "paid").length === 1;
      const tags: string[] = [];
      if (firstPayment) tags.push(tag.paid(offer.slug), tag.customer(offer.slug));
      if (next) tags.push(tag.instalmentDue());
      if (tags.length) await addTags(contactId, tags);

      // Move opportunity to Paid/Won once fully paid.
      if (fullyPaid) {
        const pipe = PIPELINES[offer.pipeline];
        const wonStage =
          offer.pipeline === "consumer"
            ? pipe.stages["paid-won"]
            : offer.pipeline === "corporate"
              ? pipe.stages["paid-deposit"]
              : pipe.stages["delivered-paid"];
        if (pipe.pipelineId && wonStage) {
          await upsertOpportunity({
            contactId,
            pipelineId: pipe.pipelineId,
            stageId: wonStage,
            name: `${offer.name} — ${order.contact.name}`,
            monetaryValuePHP: order.totalPHP,
            status: "won",
          });
        }
      }
    }

    await notifyTeam(fullyPaid ? "Payment complete" : "Payment received (instalment)", {
      order: order.id,
      offer: order.offerName,
      client: order.contact.name,
      amount: peso(payment.amountPHP),
      balance: peso(order.balancePHP),
      via: `${payment.channel}:${payment.method}`,
    });
  } catch (e) {
    order.events.push({ at: new Date().toISOString(), type: "ghl-error", note: `markPaid GHL: ${e}` });
    await store().put(order);
  }

  return { order, changed: true, fullyPaid };
}
