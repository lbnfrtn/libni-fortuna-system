import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/validate";
import { intakeLead } from "@/lib/lead";

describe("lead validation", () => {
  it("requires consent", () => {
    const r = leadSchema.safeParse({ name: "A", email: "a@e.com", offerSlug: "ignite", consent: false });
    expect(r.success).toBe(false);
  });
  it("rejects a filled honeypot", () => {
    const r = leadSchema.safeParse({ name: "A", email: "a@e.com", offerSlug: "ignite", consent: true, company_website: "spam" });
    expect(r.success).toBe(false);
  });
  it("accepts a clean consumer lead", () => {
    const r = leadSchema.safeParse({ name: "Ana", email: "ana@e.com", offerSlug: "ignite", consent: true, source: "instagram" });
    expect(r.success).toBe(true);
  });
});

describe("intakeLead (GHL safe mode)", () => {
  it("returns ok and flags a waitlisted offer", async () => {
    const r = await intakeLead({
      name: "Bea",
      email: "bea@e.com",
      offerSlug: "essence-retreat", // TBD price -> waitlist
      track: "consumer",
      consent: true,
    });
    expect(r.ok).toBe(true);
    expect(r.waitlisted).toBe(true);
  });
  it("does not waitlist a priced, sellable offer", async () => {
    const r = await intakeLead({
      name: "Ana",
      email: "ana@e.com",
      offerSlug: "ignite",
      track: "consumer",
      consent: true,
    });
    expect(r.ok).toBe(true);
    expect(r.waitlisted).toBe(false);
  });
});
