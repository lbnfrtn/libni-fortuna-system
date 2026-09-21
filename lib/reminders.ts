import type { Order } from "@/lib/types";

// Payment-plan reminders (spec §7.8): 3 days before, on the day, 3 days after,
// then overdue -> EA task (never an automated threat). Pure function so it's
// unit-testable; the cron route applies the actions.

export type ReminderKind = "before3" | "onday" | "after3" | "overdue";

export interface ReminderAction {
  orderId: string;
  instalmentN: number;
  kind: ReminderKind;
  dueDate: string;
  amountPHP: number;
  email: string;
  name: string;
  offerSlug: string;
}

function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00Z").getTime();
  const b = new Date(toISO + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86_400_000);
}

/**
 * For each order with an unpaid instalment, decide if today warrants a nudge.
 * Only the NEXT unpaid instalment is considered (you don't chase payment 3
 * while payment 2 is still open).
 */
export function dueReminders(orders: Order[], todayISO: string): ReminderAction[] {
  const out: ReminderAction[] = [];
  for (const o of orders) {
    if (o.status === "paid" || o.status === "cancelled") continue;
    const next = o.instalments.find((i) => i.status !== "paid");
    if (!next) continue;
    const diff = daysBetween(todayISO, next.dueDate); // +3 = due in 3 days, -3 = 3 days overdue
    let kind: ReminderKind | null = null;
    if (diff === 3) kind = "before3";
    else if (diff === 0) kind = "onday";
    else if (diff === -3) kind = "after3";
    else if (diff < -3) kind = "overdue";
    if (!kind) continue;
    out.push({
      orderId: o.id,
      instalmentN: next.n,
      kind,
      dueDate: next.dueDate,
      amountPHP: next.amountPHP,
      email: o.contact.email,
      name: o.contact.name,
      offerSlug: o.offerSlug,
    });
  }
  return out;
}
