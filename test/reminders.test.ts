import { describe, it, expect } from "vitest";
import { dueReminders } from "@/lib/reminders";
import type { Order } from "@/lib/types";

function orderWithNextDue(dueDate: string, status: Order["status"] = "pending"): Order {
  return {
    id: "LF-the-becoming-x",
    offerSlug: "the-becoming",
    offerName: "The Becoming",
    planType: "instalment",
    totalPHP: 250000,
    description: "",
    contact: { name: "Bea", email: "bea@e.com" },
    instalments: [
      { n: 1, amountPHP: 83334, dueDate: "2026-09-01", externalId: "x#i1", status: "paid" },
      { n: 2, amountPHP: 83333, dueDate, externalId: "x#i2", status: "pending" },
      { n: 3, amountPHP: 83333, dueDate: "2026-11-17", externalId: "x#i3", status: "pending" },
    ],
    amountPaidPHP: 83334,
    balancePHP: 166666,
    status,
    createdAt: "2026-09-01T00:00:00Z",
    createdBy: "x",
    events: [],
  };
}

const TODAY = "2026-10-17";

describe("dueReminders", () => {
  it("fires 3 days before", () => {
    const r = dueReminders([orderWithNextDue("2026-10-20")], TODAY);
    expect(r).toHaveLength(1);
    expect(r[0].kind).toBe("before3");
    expect(r[0].instalmentN).toBe(2); // the next unpaid one
  });
  it("fires on the day", () => {
    expect(dueReminders([orderWithNextDue("2026-10-17")], TODAY)[0].kind).toBe("onday");
  });
  it("fires 3 days after", () => {
    expect(dueReminders([orderWithNextDue("2026-10-14")], TODAY)[0].kind).toBe("after3");
  });
  it("marks overdue when more than 3 days late", () => {
    expect(dueReminders([orderWithNextDue("2026-10-01")], TODAY)[0].kind).toBe("overdue");
  });
  it("says nothing on an ordinary day", () => {
    expect(dueReminders([orderWithNextDue("2026-12-01")], TODAY)).toHaveLength(0);
  });
  it("ignores fully paid / cancelled orders", () => {
    expect(dueReminders([orderWithNextDue("2026-10-17", "paid")], TODAY)).toHaveLength(0);
    expect(dueReminders([orderWithNextDue("2026-10-17", "cancelled")], TODAY)).toHaveLength(0);
  });
});
