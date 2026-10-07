import { describe, it, expect, beforeEach } from "vitest";
import { leadSchema } from "@/lib/validate";
import { intakeLead, selfPayAfterApply, importBacklogRow } from "@/lib/lead";
import { listLeads } from "@/lib/leadlog";
import { people } from "@/lib/crm";
import { selfPayPlan, questionsFor, LIBERATE_JOIN } from "@/config/forms";
import { useMemStore } from "./helpers";

describe("lead validation", () => {
  it("requires consent", () => {
    const r = leadSchema.safeParse({ name: "A", email: "a@e.com", offerSlug: "ignite", consent: false });
    expect(r.success).toBe(false);
  });
  it("ignores a filled honeypot instead of blocking (autofill-safe)", () => {
    const r = leadSchema.safeParse({ name: "A", email: "a@e.com", offerSlug: "ignite", consent: true, company_website: "spam" });
    expect(r.success).toBe(true);
  });
  it("accepts a clean consumer lead", () => {
    const r = leadSchema.safeParse({ name: "Ana", email: "ana@e.com", offerSlug: "ignite", consent: true, source: "instagram" });
    expect(r.success).toBe(true);
  });
});

describe("intakeLead", () => {
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
    const pay = await selfPayAfterApply(lead);
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

describe("the site is the only CRM", () => {
  it("keeps application answers and tags on the lead", async () => {
    await intakeLead({ name: "Fay", email: "fay@e.com", offerSlug: "the-becoming", track: "consumer", consent: true, answers: { where_now: "Tired of holding it all." } });
    const l = (await listLeads()).find((x) => x.email === "fay@e.com");
    expect(l?.answers?.where_now).toBe("Tired of holding it all.");
    expect(l?.tags).toContain("applied:the-becoming");
    const p = (await people()).find((x) => x.email === "fay@e.com");
    expect(p?.stage).toBe("applied");
  });

  it("imports a backlog row into the lead log, tagged nurture", async () => {
    const r = await importBacklogRow({ name: "Gia", email: "gia@e.com", offerSlug: "liberate" });
    expect(r.ok).toBe(true);
    const l = (await listLeads()).find((x) => x.email === "gia@e.com");
    expect(l?.tags).toEqual(["nurture", "lead:liberate"]);
    expect(l?.source).toBe("backlog-import");
  });
});
