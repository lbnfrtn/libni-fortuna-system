import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { getContent, saveContent, setPhoto, setVideo, setLink, type MediaLink, type Story, type Talk, type PressItem, type MediaKit, type Brand, type Keynote, type BioLink } from "@/lib/content";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const opt = (v: unknown, max: number) => str(v, max) || undefined;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

export async function GET() {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, content: await getContent() });
}

// One endpoint for every Studio edit: clear a photo, set a video link, or
// replace the podcast / write-up lists.
export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { action } = body as { action?: string };

    if (action === "clearPhoto") {
      return NextResponse.json({ ok: true, content: await setPhoto(String(body.slotId), null) });
    }
    if (action === "setVideo") {
      const url = String(body.url ?? "").trim();
      return NextResponse.json({ ok: true, content: await setVideo(String(body.slotId), url || null) });
    }
    if (action === "setLiberate") {
      const lib = body.liberate ?? {};
      const weeks = Array.isArray(lib.weeks) ? lib.weeks.slice(0, 12).map((w: Record<string, unknown>, i: number) => ({
        n: i + 1,
        title: String(w.title ?? "").trim(),
        theme: String(w.theme ?? "").trim(),
        date: String(w.date ?? "").trim() || undefined,
        sessionUrl: String(w.sessionUrl ?? "").trim() || undefined,
        replayUrl: String(w.replayUrl ?? "").trim() || undefined,
        notes: String(w.notes ?? "").trim() || undefined,
        resources: (Array.isArray(w.resources) ? w.resources : []).map((r: Record<string, unknown>) => ({ label: String(r.label ?? "").trim(), url: String(r.url ?? "").trim() })).filter((r: { label: string; url: string }) => r.label && r.url),
      })) : undefined;
      const current = (await getContent()).liberate;
      const liberate = {
        ...current,
        cohortLabel: String(lib.cohortLabel ?? current.cohortLabel).trim() || current.cohortLabel,
        startDate: String(lib.startDate ?? "").trim() || undefined,
        accessCode: String(lib.accessCode ?? "").trim(),
        welcome: String(lib.welcome ?? current.welcome).trim() || current.welcome,
        sessionUrl: String(lib.sessionUrl ?? "").trim() || undefined,
        communityUrl: String(lib.communityUrl ?? "").trim() || undefined,
        communityLabel: String(lib.communityLabel ?? "").trim() || undefined,
        weeks: weeks && weeks.length === 12 ? weeks : current.weeks,
      };
      return NextResponse.json({ ok: true, content: await saveContent({ liberate }) });
    }
    if (action === "setLink") {
      const url = String(body.url ?? "").trim();
      return NextResponse.json({ ok: true, content: await setLink(String(body.key), url || null) });
    }
    if (action === "setStories" || action === "setSpeakingWords") {
      const rows: Story[] = (Array.isArray(body.items) ? body.items : []).map((s: Partial<Story>) => ({
        id: slug(String(s.id || s.name || "")),
        name: str(s.name, 120), role: opt(s.role, 120), program: opt(s.program, 80),
        quote: str(s.quote, 1200), before: opt(s.before, 1200), during: opt(s.during, 1200), after: opt(s.after, 1200),
        featured: Boolean(s.featured),
      })).filter((s: Story) => s.id && s.name && s.quote);
      return NextResponse.json({ ok: true, content: await saveContent(action === "setStories" ? { stories: rows } : { speakingWords: rows }) });
    }
    if (action === "setBrands") {
      const brands: Brand[] = (Array.isArray(body.items) ? body.items : []).map((b: Partial<Brand>) => ({
        id: slug(String(b.id || b.name || "")), name: str(b.name, 120), url: opt(b.url, 500), logo: opt(b.logo, 300),
      })).filter((b: Brand) => b.id && b.name);
      return NextResponse.json({ ok: true, content: await saveContent({ brands }) });
    }
    if (action === "setBioLinks") {
      const bioLinks: BioLink[] = (Array.isArray(body.items) ? body.items : []).map((b: Partial<BioLink>) => ({
        id: slug(String(b.id || b.label || "")), label: str(b.label, 80), note: opt(b.note, 120), href: str(b.href, 500),
      })).filter((b: BioLink) => b.id && b.label && b.href);
      return NextResponse.json({ ok: true, content: await saveContent({ bioLinks }) });
    }
    if (action === "setKeynotes") {
      const keynotes: Keynote[] = (Array.isArray(body.items) ? body.items : []).map((k: Partial<Keynote>) => ({
        id: slug(String(k.id || k.title || "")), category: str(k.category, 80), title: str(k.title, 120), blurb: str(k.blurb, 600),
      })).filter((k: Keynote) => k.id && k.title);
      return NextResponse.json({ ok: true, content: await saveContent({ keynotes }) });
    }
    if (action === "setTalks") {
      const KINDS = ["keynote", "workshop", "panel", "summit", "retreat", "other"] as const;
      const talks: Talk[] = (Array.isArray(body.items) ? body.items : []).map((t: Partial<Talk>) => ({
        id: slug(String(t.id || t.title || "")),
        title: str(t.title, 160), org: str(t.org, 120), date: opt(t.date, 12), location: opt(t.location, 120), url: opt(t.url, 500),
        kind: KINDS.find((k) => k === t.kind) ?? "other", blurb: opt(t.blurb, 400),
      })).filter((t: Talk) => t.id && t.title && t.org);
      return NextResponse.json({ ok: true, content: await saveContent({ talks }) });
    }
    if (action === "setPress") {
      const KINDS = ["podcast", "tv", "article", "video"] as const;
      const press: PressItem[] = (Array.isArray(body.items) ? body.items : []).map((p: Partial<PressItem>) => ({
        id: slug(String(p.id || p.title || "")),
        title: str(p.title, 160), outlet: str(p.outlet, 120), url: opt(p.url, 500), date: opt(p.date, 10),
        kind: KINDS.find((k) => k === p.kind) ?? "podcast", blurb: opt(p.blurb, 400),
      })).filter((p: PressItem) => p.id && p.title && p.outlet);
      return NextResponse.json({ ok: true, content: await saveContent({ press }) });
    }
    if (action === "setMediaKit") {
      const m = body.mediaKit ?? {};
      const current = (await getContent()).mediaKit;
      const mediaKit: MediaKit = {
        oneLiner: str(m.oneLiner, 240) || current.oneLiner,
        shortBio: str(m.shortBio, 1500) || current.shortBio,
        longBio: str(m.longBio, 6000) || current.longBio,
        topics: (Array.isArray(m.topics) ? m.topics : String(m.topics ?? "").split("\n")).map((t: unknown) => str(t, 160)).filter(Boolean).slice(0, 12),
        pressEmail: str(m.pressEmail, 120) || current.pressEmail,
      };
      return NextResponse.json({ ok: true, content: await saveContent({ mediaKit }) });
    }
    if (action === "setList") {
      const key = (["podcast", "writings", "events"] as const).find((k) => k === body.key);
      if (!key) return NextResponse.json({ error: "Unknown list" }, { status: 400 });
      const items: MediaLink[] = (Array.isArray(body.items) ? body.items : [])
        .map((i: Partial<MediaLink>, n: number) => ({
          id: String(i.id || `${key}-${n}-${Date.now()}`),
          title: String(i.title ?? "").trim(),
          url: String(i.url ?? "").trim(),
          blurb: String(i.blurb ?? "").trim() || undefined,
          date: String(i.date ?? "").trim() || undefined,
        }))
        .filter((i: MediaLink) => i.title && i.url);
      return NextResponse.json({ ok: true, content: await saveContent({ [key]: items }) });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/content:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
