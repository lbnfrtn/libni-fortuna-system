import { describe, it, expect, beforeEach } from "vitest";
import { leadSchema } from "@/lib/validate";
import { intakeLead, selfPayAfterApply } from "@/lib/lead";
import { selfPayPlan, questionsFor, LIBERATE_JOIN } from "@/config/forms";
import { useMemStore } from "./helpers";

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

describe("Liberate self-pay application", () => {
  beforeEach(() => useMemStore());

  it("the call application filters on affordability and never self-pays", () => {
    const { questions } = questionsFor("liberate");
    const q = questions.find((x) => x.id === "investment");
    expect(q?.detour?.hard).toBe(true);
    expect(questions.some((x) => x.id === "join")).toBe(false);
    expect(selfPayPlan("liberate", { investment: "Yes — I'm ready to invest" })).toBeNull();
  });

  it("maps the join answer to a plan", () => {
    expect(selfPayPlan("liberate", { join: LIBERATE_JOIN.full })).toBe("full");
    expect(selfPayPlan("liberate", { join: LIBERATE_JOIN.plan })).toBe("instalment");
    expect(selfPayPlan("liberate", { join: LIBERATE_JOIN.call })).toBeNull();
    expect(selfPayPlan("the-becoming", { join: LIBERATE_JOIN.full })).toBeNull();
  });

  it("pay in full: creates the order and hands back the first link", async () => {
    const lead = { name: "Cai", email: "cai@e.com", offerSlug: "liberate", track: "consumer" as const, consent: true as const, answers: { join: LIBERATE_JOIN.full } };
    const r = await intakeLead(lead);
    expect(r.waitlisted).toBe(false);
    const pay = await selfPayAfterApply(lead, r.contactId);
    expect(pay?.plan).toBe("full");
    expect(pay?.amount).toBe(70000);
    expect(pay?.link).toContain("/mock-pay/");
    expect(pay?.manualPayUrl).toContain("/pay/LF-liberate-");
  });

  it("three payments: first instalment now, three in the schedule", async () => {
    const lead = { name: "Dee", email: "dee@e.com", offerSlug: "liberate", track: "consumer" as const, consent: true as const, answers: { join: LIBERATE_JOIN.plan } };
    const pay = await selfPayAfterApply(lead);
    expect(pay?.plan).toBe("instalment");
    expect(pay?.instalments).toHaveLength(3);
    expect(pay?.instalments.reduce((a, i) => a + i.amount, 0)).toBe(70000);
    expect(pay?.amount).toBe(pay?.instalments[0].amount);
  });

  it("talk first: no order", async () => {
    const lead = { name: "Eli", email: "eli@e.com", offerSlug: "liberate", track: "consumer" as const, consent: true as const, answers: { join: LIBERATE_JOIN.call } };
    expect(await selfPayAfterApply(lead)).toBeNull();
  });
});
