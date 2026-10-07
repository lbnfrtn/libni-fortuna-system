import type { Order } from "@/lib/types";
import { store } from "@/lib/store";
import { notifyTeam } from "@/lib/notify";
import { tag } from "@/lib/tags";
import { enrol, stopOnPaid } from "@/lib/funnel";
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
 * downstream (welcome letters, onboarding) starts here: pre-sale nudges stop
 * and the paid:<offer> sequence begins on the first payment.
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

  // --- Email: pre-sale nudges stop; the welcome sequence for this offer begins on the first payment. ---
  try {
    await stopOnPaid(order.contact.email);
    if (order.instalments.filter((i) => i.status === "paid").length === 1) {
      const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
      await enrol({
        email: order.contact.email, name: order.contact.name, trigger: tag.paid(order.offerSlug),
        vars: { offer: order.offerName, welcome_link: `${base}/welcome/${order.offerSlug}?o=${encodeURIComponent(order.id)}`, amount: peso(payment.amountPHP) },
      });
    }
  } catch (e) {
    order.events.push({ at: new Date().toISOString(), type: "mail-error", note: `markPaid email: ${e}` });
    await store().put(order);
  }

  // --- Internal alert for Libni / the EA. ---
  await notifyTeam(fullyPaid ? "Payment complete" : "Payment received (instalment)", {
    order: order.id,
    offer: order.offerName,
    client: order.contact.name,
    amount: peso(payment.amountPHP),
    balance: peso(order.balancePHP),
    via: `${payment.channel}:${payment.method}`,
  }).catch(() => {});

  return { order, changed: true, fullyPaid };
}
