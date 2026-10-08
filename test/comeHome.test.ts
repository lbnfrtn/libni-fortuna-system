import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { createOrder } from "@/lib/orders";
import { markPaid } from "@/lib/markPaid";
import { orderToken, orderTokenValid, welcomeLink, DOWNLOADS } from "@/lib/downloads";
import { upsertContact, resetListCache } from "@/lib/emailoctopus";
import { getOffer } from "@/config/offers";
import { useMemStore } from "./helpers";

describe("Come Home to Yourself", () => {
  beforeEach(() => useMemStore());
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); resetListCache(); });

  it("is priced in offers.ts and hidden from /start", () => {
    const o = getOffer("come-home")!;
    expect(o.pricePHP).toBe(499);
    expect(o.hideFromStart).toBe(true);
    expect(DOWNLOADS["come-home"]).toHaveLength(2);
  });

  it("signs the download page to the order — a bare or wrong token gets nothing", () => {
    const t = orderToken("LF-come-home-abc-1234");
    expect(orderTokenValid("LF-come-home-abc-1234", t)).toBe(true);
    expect(orderTokenValid("LF-come-home-abc-1235", t)).toBe(false);
    expect(orderTokenValid("LF-come-home-abc-1234", "")).toBe(false);
    expect(orderTokenValid("LF-come-home-abc-1234", undefined)).toBe(false);
  });

  it("sends buyers to its own welcome page; other offers keep /welcome/<slug>", async () => {
    const o = await createOrder({ offerSlug: "come-home", planType: "full", contact: { name: "Maria", email: "m@example.com" }, createdBy: "website" });
    expect(o.totalPHP).toBe(499);
    expect(welcomeLink(o)).toContain(`/come-home/welcome?o=${encodeURIComponent(o.id)}&t=${orderToken(o.id)}`);
    expect(welcomeLink({ id: "LF-ignite-x-1", offerSlug: "ignite" })).toContain("/welcome/ignite?o=LF-ignite-x-1&t=");
  });

  it("paying tags the buyer in EmailOctopus with their personal link", async () => {
    vi.stubEnv("EMAILOCTOPUS_API_KEY", "test-key");
    vi.stubEnv("EMAILOCTOPUS_LIST_ID", "list-1");
    const calls: { url: string; method?: string; body?: unknown }[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      return new Response("{}", { status: 200 });
    }));
    const o = await createOrder({ offerSlug: "come-home", planType: "full", contact: { name: "Maria Santos", email: "Maria@Example.com" }, createdBy: "website" });
    await markPaid(o.id, { amountPHP: 499, method: "gcash", paidAt: new Date().toISOString(), eventId: "evt-ch", channel: "xendit" });
    const put = calls.find((c) => c.method === "PUT");
    expect(put?.url).toBe("https://api.emailoctopus.com/lists/list-1/contacts");
    expect(put?.body).toMatchObject({
      email_address: "maria@example.com",
      status: "subscribed",
      tags: { "come-home-buyer": true, "come-home-checkout": false },
      fields: { FirstName: "Maria", LastName: "Santos", ComeHomeLink: welcomeLink(o) },
    });
    vi.unstubAllGlobals();
  });

  it("the list never breaks a sale: no keys = mock, API errors = reported not thrown", async () => {
    expect(await upsertContact({ email: "a@b.co" })).toEqual({ ok: true, mock: true });
    vi.stubEnv("EMAILOCTOPUS_API_KEY", "k");
    vi.stubEnv("EMAILOCTOPUS_LIST_ID", "l");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 401 })));
    const r = await upsertContact({ email: "a@b.co" });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("401");
    vi.unstubAllGlobals();
  });

  it("finds her list by itself when no list id is set (the biggest one)", async () => {
    vi.stubEnv("EMAILOCTOPUS_API_KEY", "k");
    vi.stubEnv("EMAILOCTOPUS_LIST_ID", "");
    const urls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      urls.push(url);
      if (url.endsWith("/lists?limit=100")) return new Response(JSON.stringify({ data: [{ id: "small", counts: { subscribed: 3 } }, { id: "main", name: "Libni", counts: { subscribed: 7183 } }] }), { status: 200 });
      return new Response("{}", { status: 200 });
    }));
    expect((await upsertContact({ email: "a@b.co", tags: { x: true } })).ok).toBe(true);
    expect((await upsertContact({ email: "c@d.co" })).ok).toBe(true);
    expect(urls.filter((u) => u.endsWith("/lists?limit=100"))).toHaveLength(1); // looked up once
    expect(urls.filter((u) => u.endsWith("/lists/main/contacts"))).toHaveLength(2);
  });
});
