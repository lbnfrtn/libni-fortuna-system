// Read-only feed for the Project Me app (app.libni.co): Libni's interviews (from the
// Studio press list) and her Substack letters with the full text, cleaned for in-app
// reading. Public data only — nothing here is private or writable.
import { NextRequest, NextResponse } from "next/server";
import { getContent, byDateDesc } from "@/lib/content";
import { CHANNELS } from "@/config/channels";
import { safeHtml } from "@/lib/safe-html";
// Every upload on youtube.com/@libnifortuna_ (id, title), captured 2026-11-24. New uploads come from the channel feed below.
import YT_VIDEOS from "@/config/youtube-videos.json";
const YT_CHANNEL = "UCx0NrqMF-WmZ8eB_Jggf3Hg";

export const dynamic = "force-dynamic";

const ALLOW = new Set(["https://app.libni.co", "http://localhost:8899"]);
const SITE = "https://libni.co";
// Libni's picks for the app (2026-11-24): leave these out of the app only — the website keeps them.
const APP_HIDE = /byaheng|dxfe|abante/i;
// Cover images for items without a YouTube/Spotify thumbnail or a Studio photo (press_<id>).
// Outlet images = each article's own share image (og:image), checked 2026-11-24. Facebook's image
// links expire, so those clips (and Manila Bulletin, which blocks lookups) use Libni's own photos.
const THUMB: Record<string, string> = {
  "vogue-hypnotherapy-sound-bath": "https://assets.vogue.ph/wp-content/uploads/2026/03/inner-child-healing-bianca-custodio-experience-vogue-philippines-wellness-L.webp",
  "vogue-editor-sound-bath": "https://assets.vogue.ph/wp-content/uploads/2026/02/danyl-geneciran-pompi-editors-experience-sound-bath-L.webp",
  "bilyonaryo-face-their-shadows": "https://bnc.bilyonaryo.com/wp-content/uploads/2026/06/girl3.jpg",
  "bilyonaryo-depression-expression": "https://bnc.bilyonaryo.com/wp-content/uploads/2026/06/girl.jpg",
  "bilyonaryo-people-pleasing": "https://bnc.bilyonaryo.com/wp-content/uploads/2026/06/girl2.jpg",
  "philstar-awr-asia-lotus": "https://media.philstar.com/photos/2026/06/19/switchplay-yoga-40_2026-06-19_16-22-41.jpg",
  "preview-sound-baths-manila": "https://images.preview.ph/preview/dynsto/1772428764-7E5286C3-FECA-4496-BF52-C4BE71B91552_1_201_a.jpeg",
  "when-in-manila-floatation": "https://www.wheninmanila.com/wp-content/uploads/2025/09/FINAL-Article-HeaderFeatured-Image-Template.png",
  "genz-mag-goal-getters": "https://ph.genz-mag.com/wp-content/uploads/2025/05/GRWM-May-24-0885-scaled.jpg",
  "manila-standard-influencers": "https://cdn.manilastandard.net/wp-content/uploads/2025/05/GRWM-May-24-0238-scaled.jpeg",
  "mb-emotional-safety": "/photos/liberate-libni-thought.jpg",
  "rise-and-shine-pilipinas": "/photos/libni-portrait.jpg",
  "rise-and-shine-mental-health": "/photos/liberate-libni-warm.jpg",
  "bilyonaryo-floatation-feature": "/photos/libni-hero.jpg",
};
// BNC's Daily Dish is a TV programme even when the Studio files it under podcasts.
const kindFor = (p: { kind: string; outlet: string }) => (/bilyonaryo news/i.test(p.outlet) ? "tv" : p.kind);

function cors(req: NextRequest, res: NextResponse) {
  const o = req.headers.get("origin") || "";
  if (ALLOW.has(o)) { res.headers.set("Access-Control-Allow-Origin", o); res.headers.set("Vary", "Origin"); }
  return res;
}
const abs = (u?: string) => (!u ? undefined : u.startsWith("/") ? SITE + u : u);
const pick = (xml: string, name: string) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(xml);
  return m ? m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim() : "";
};
const plain = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#8217;|&rsquo;/g, "’").replace(/&#8216;|&lsquo;/g, "‘").replace(/&#8220;|&ldquo;/g, "“").replace(/&#8221;|&rdquo;/g, "”").replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const ytThumb = (u?: string) => { const m = u && /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{6,})/.exec(u); return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : undefined; };

async function spotifyThumb(u?: string): Promise<string | undefined> {
  if (!u || !/open\.spotify\.com\//.test(u)) return undefined;
  try {
    const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(u)}`, { next: { revalidate: 86400 } });
    const j = r.ok ? await r.json() : null;
    return j && typeof j.thumbnail_url === "string" && j.thumbnail_url.startsWith("https://") ? j.thumbnail_url : undefined;
  } catch { return undefined; }
}

// Her YouTube videos (so the app can offer "Watch" on podcast episodes that also exist as video).
async function videos(): Promise<[string, string][]> {
  const all = new Map<string, string>((YT_VIDEOS as [string, string][]).map(([id, t]) => [id, t]));
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`, { next: { revalidate: 3600 } });
    if (r.ok) for (const m of (await r.text()).matchAll(/<entry>[\s\S]*?<yt:videoId>([\w-]{11})<\/yt:videoId>[\s\S]*?<title>([\s\S]*?)<\/title>/g)) all.set(m[1], plain(m[2]));
  } catch { /* the saved list is enough */ }
  return [...all.entries()];
}

async function letters() {
  try {
    const r = await fetch(CHANNELS.substackRss, { headers: { "User-Agent": "LibniFortuna/1.0" }, next: { revalidate: 900 } });
    if (!r.ok) return [];
    const xml = await r.text();
    return xml.split(/<item>/).slice(1).slice(0, 30).map((it) => {
      const title = plain(pick(it, "title"));
      const link = pick(it, "link");
      const body = pick(it, "content:encoded");
      const img = /<enclosure[^>]+url="([^"]+)"[^>]*type="image/i.exec(it) || /<img[^>]+src="(https:[^"]+)"/i.exec(body);
      return {
        title, link: /^https:\/\//.test(link) ? link : "",
        at: Date.parse(pick(it, "pubDate")) || null,
        subtitle: plain(pick(it, "description")).slice(0, 200),
        image: img ? img[1] : null,
        html: body ? safeHtml(body) : "",
      };
    }).filter((p) => p.title && p.link);
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  const [content, posts, vids] = await Promise.all([getContent(), letters(), videos()]);
  const shown = content.press.filter((p) => p.url && /^https:\/\//.test(p.url) && !APP_HIDE.test(`${p.outlet} ${p.id}`)).sort(byDateDesc);
  const interviews = shown
    .filter((p) => p.kind !== "article")
    .map((p) => ({ id: p.id, title: p.title, outlet: p.outlet, date: p.date || null, kind: kindFor(p), url: p.url, image: abs(content.photos[`press_${p.id}`]) || ytThumb(p.url) || abs(THUMB[p.id]) || null }))
    .sort((a, b) => Number(/tedx/i.test(b.outlet)) - Number(/tedx/i.test(a.outlet)));
  await Promise.all(interviews.map(async (v) => { if (!v.image) v.image = (await spotifyThumb(v.url)) || null; }));
  const features = shown
    .filter((p) => p.kind === "article")
    .map((p) => ({ id: p.id, title: p.title, outlet: p.outlet, date: p.date || null, url: p.url, image: abs(content.photos[`press_${p.id}`]) || abs(THUMB[p.id]) || null }));
  const res = NextResponse.json({ interviews, features, letters: posts, videos: vids, substack: CHANNELS.substack, updated: Date.now() });
  res.headers.set("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  return cors(req, res);
}

export function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  return cors(req, res);
}
