import { describe, it, expect } from "vitest";
import { buildDigest } from "@/lib/digest";
import type { Order } from "@/lib/types";

const NOW = new Date("2026-09-17T12:00:00Z").getTime();
const iso = (daysAgo: number) => new Date(NOW - daysAgo * 86_400_000).toISOString();

function order(partial: Partial<Order>): Order {
  return {
    id: "LF-x",
    offerSlug: "ignite",
    offerName: "Ignite",
    planType: "full",
    totalPHP: 7777,
    description: "",
    contact: { name: "A", email: "a@e.com" },
    instalments: [{ n: 1, amountPHP: 7777, dueDate: "2026-09-17", externalId: "x#i1", status: "pending" }],
    amountPaidPHP: 0,
    balancePHP: 7777,
    status: "pending",
    createdAt: iso(1),
    createdBy: "x",
    events: [],
    ...partial,
  };
}

describe("buildDigest", () => {
  it("counts cash collected this week, closes and outstanding balances", () => {
    const paid = order({
      id: "LF-paid",
      status: "paid",
      paidAt: iso(2),
      amountPaidPHP: 7777,
      balancePHP: 0,
      instalments: [{ n: 1, amountPHP: 7777, dueDate: "2026-09-15", externalId: "p#i1", status: "paid", paidAt: iso(2), paidAmountPHP: 7777 }],
    });
    const openOld = order({ id: "LF-stuck", createdAt: iso(20) }); // stuck: 20 days, nothing paid
    const openNew = order({ id: "LF-new", createdAt: iso(1) });

    const d = buildDigest([paid, openOld, openNew], NOW);
    expect(d.cashCollectedPHP).toBe(7777);
    expect(d.closes).toBe(1);
    expect(d.balancesOutstandingPHP).toBe(7777 * 2); // two open orders
    expect(d.openOrders).toBe(2);
    expect(d.stuck).toHaveLength(1);
    expect(d.stuck[0].id).toBe("LF-stuck");
  });

  it("excludes cash paid before the window", () => {
    const oldPaid = order({
      status: "paid",
      paidAt: iso(30),
      amountPaidPHP: 7777,
      balancePHP: 0,
      instalments: [{ n: 1, amountPHP: 7777, dueDate: "x", externalId: "o#i1", status: "paid", paidAt: iso(30), paidAmountPHP: 7777 }],
    });
    expect(buildDigest([oldPaid], NOW).cashCollectedPHP).toBe(0);
  });
});
