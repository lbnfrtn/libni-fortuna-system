import { describe, it, expect, beforeEach } from "vitest";
import { createOrder } from "@/lib/orders";
import { useMemStore } from "./helpers";

// No XENDIT_SECRET_KEY / GHL_API_TOKEN in the test env -> mock + safe mode.

describe("createOrder", () => {
  beforeEach(() => useMemStore());

  it("creates an Ignite order with a first payment link (mock)", async () => {
    const o = await createOrder({
      offerSlug: "ignite",
      planType: "full",
      contact: { name: "Ana", email: "ana@example.com" },
      createdBy: "hello@libni.co",
    });
    expect(o.id.startsWith("LF-ignite-")).toBe(true);
    expect(o.totalPHP).toBe(7777);
    expect(o.instalments).toHaveLength(1);
    expect(o.instalments[0].invoiceUrl).toContain("/mock-pay/");
    expect(o.balancePHP).toBe(7777);
    expect(o.manual?.reference?.startsWith("LF-")).toBe(true);
  });

  it("creates The Becoming with a 3-payment plan; only the first has a link", async () => {
    const o = await createOrder({
      offerSlug: "the-becoming",
      planType: "instalment",
      instalmentCount: 3,
      contact: { name: "Bea", email: "bea@example.com" },
      createdBy: "hello@libni.co",
    });
    expect(o.instalments).toHaveLength(3);
    expect(o.instalments[0].invoiceUrl).toBeTruthy();
    expect(o.instalments[1].invoiceUrl).toBeUndefined(); // generated when due
    expect(o.instalments.reduce((s, i) => s + i.amountPHP, 0)).toBe(250000);
  });

  it("refuses an instalment plan on an offer that doesn't allow it", async () => {
    await expect(
      createOrder({ offerSlug: "ignite", planType: "instalment", contact: { name: "C", email: "c@e.com" }, createdBy: "x" })
    ).rejects.toThrow(/does not offer instalments/);
  });

  it("refuses a priceless offer without a custom amount", async () => {
    await expect(
      createOrder({ offerSlug: "organizations", planType: "full", contact: { name: "D", email: "d@e.com" }, createdBy: "x" })
    ).rejects.toThrow(/No price/);
  });

  it("accepts a custom amount for a track-D offer", async () => {
    const o = await createOrder({
      offerSlug: "organizations",
      planType: "full",
      customAmountPHP: 180000,
      customDescription: "Half-day corporate reset",
      contact: { name: "Acme", email: "hr@acme.com" },
      createdBy: "hello@libni.co",
    });
    expect(o.totalPHP).toBe(180000);
    expect(o.description).toBe("Half-day corporate reset");
  });
});
