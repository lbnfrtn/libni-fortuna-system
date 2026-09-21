import { describe, it, expect, beforeEach } from "vitest";
import { createOrder } from "@/lib/orders";
import { markPaid } from "@/lib/markPaid";
import { useMemStore } from "./helpers";

describe("markPaid", () => {
  beforeEach(() => useMemStore());

  it("marks a full payment paid and sets balance to 0", async () => {
    const o = await createOrder({
      offerSlug: "ignite",
      planType: "full",
      contact: { name: "Ana", email: "ana@example.com" },
      createdBy: "x",
    });
    const r = await markPaid(o.id, {
      amountPHP: 7777,
      method: "gcash",
      paidAt: new Date().toISOString(),
      eventId: "evt-1",
      channel: "xendit",
    });
    expect(r.fullyPaid).toBe(true);
    expect(r.order.status).toBe("paid");
    expect(r.order.balancePHP).toBe(0);
    expect(r.order.amountPaidPHP).toBe(7777);
  });

  it("is idempotent — the same event twice does not double-count", async () => {
    const o = await createOrder({ offerSlug: "ignite", planType: "full", contact: { name: "A", email: "a@e.com" }, createdBy: "x" });
    const p = { amountPHP: 7777, method: "gcash", paidAt: new Date().toISOString(), eventId: "evt-dup", channel: "xendit" as const };
    const r1 = await markPaid(o.id, p);
    const r2 = await markPaid(o.id, p);
    expect(r1.changed).toBe(true);
    expect(r2.changed).toBe(false);
    expect(r2.order.amountPaidPHP).toBe(7777); // not 15554
  });

  it("instalment plan: first payment does not fully pay; last one does", async () => {
    const o = await createOrder({
      offerSlug: "the-becoming",
      planType: "instalment",
      instalmentCount: 3,
      contact: { name: "Bea", email: "bea@example.com" },
      createdBy: "x",
    });
    const amt = o.instalments.map((i) => i.amountPHP);

    const r1 = await markPaid(o.id, { instalmentN: 1, amountPHP: amt[0], method: "card", paidAt: new Date().toISOString(), eventId: "i1", channel: "xendit" });
    expect(r1.fullyPaid).toBe(false);
    expect(r1.order.balancePHP).toBe(amt[1] + amt[2]);

    await markPaid(o.id, { instalmentN: 2, amountPHP: amt[1], method: "card", paidAt: new Date().toISOString(), eventId: "i2", channel: "xendit" });
    const r3 = await markPaid(o.id, { instalmentN: 3, amountPHP: amt[2], method: "card", paidAt: new Date().toISOString(), eventId: "i3", channel: "xendit" });
    expect(r3.fullyPaid).toBe(true);
    expect(r3.order.status).toBe("paid");
    expect(r3.order.balancePHP).toBe(0);
  });
});
