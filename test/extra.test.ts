import { describe, it, expect, beforeEach } from "vitest";
import { createOrder } from "@/lib/orders";
import { paidSeats, remainingSeats, isFull } from "@/lib/capacity";
import { markPaid } from "@/lib/markPaid";
import { parseCsv } from "@/lib/csv";
import { useMemStore } from "./helpers";

describe("deposit plan", () => {
  beforeEach(() => useMemStore());
  it("creates a 50% deposit + balance order for a custom track-D amount", async () => {
    const o = await createOrder({
      offerSlug: "private-experiences",
      planType: "deposit",
      customAmountPHP: 100000,
      contact: { name: "Custom Client", email: "c@e.com" },
      createdBy: "x",
    });
    expect(o.instalments).toHaveLength(2);
    expect(o.instalments[0].amountPHP).toBe(50000); // 50% deposit
    expect(o.instalments[1].amountPHP).toBe(50000);
    expect(o.instalments[0].invoiceUrl).toBeTruthy(); // deposit link ready now
    expect(o.instalments[1].invoiceUrl).toBeUndefined(); // balance link generated later
  });
});

describe("essence capacity", () => {
  beforeEach(() => useMemStore());
  it("counts paid seats and flips to full at 20", async () => {
    expect(await remainingSeats("essence-retreat")).toBe(20);
    // Create + pay 20 essence deposit orders.
    for (let i = 0; i < 20; i++) {
      const o = await createOrder({
        offerSlug: "essence-retreat",
        planType: "deposit",
        customAmountPHP: 100000,
        contact: { name: `Guest ${i}`, email: `g${i}@e.com` },
        createdBy: "x",
      });
      await markPaid(o.id, { instalmentN: 1, amountPHP: 30000, method: "gcash", paidAt: new Date().toISOString(), eventId: `seat-${i}`, channel: "xendit" });
    }
    expect(await paidSeats("essence-retreat")).toBe(20);
    expect(await isFull("essence-retreat")).toBe(true);
    expect(await remainingSeats("essence-retreat")).toBe(0);
  });
  it("reports no cap for an uncapped offer", async () => {
    expect(await remainingSeats("ignite")).toBeNull();
    expect(await isFull("ignite")).toBe(false);
  });
});

describe("csv parser", () => {
  it("parses headers and rows, handling quoted commas", () => {
    const rows = parseCsv('name,email,note\n"Santos, Maria",m@e.com,"hi, there"\nJo,j@e.com,plain');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ name: "Santos, Maria", email: "m@e.com", note: "hi, there" });
    expect(rows[1].name).toBe("Jo");
  });
  it("returns [] when there is only a header", () => {
    expect(parseCsv("name,email")).toEqual([]);
  });
});
