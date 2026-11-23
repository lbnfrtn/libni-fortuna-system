// Read-only feed for the Project Me app (app.libni.co): Libni's interviews (from the
// Studio press list) and her Substack letters with the full text, cleaned for in-app
// reading. Public data only — nothing here is private or writable.
import { NextRequest, NextResponse } from "next/server";
import { getContent, byDateDesc } from "@/lib/content";
import { photoFor } from "@/config/site-slots";
import { CHANNELS } from "@/config/channels";
import { safeHtml } from "@/lib/safe-html";

export const dynamic = "force-dynamic";

const ALLOW = new Set(["https://app.libni.co", "http://localhost:8899"]);
const SITE = "https://libni.co";

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
  const [content, posts] = await Promise.all([getContent(), letters()]);
  const interviews = content.press
    .filter((p) => p.kind !== "article" && p.url && /^https:\/\//.test(p.url))
    .sort(byDateDesc)
    .map((p) => ({ id: p.id, title: p.title, outlet: p.outlet, date: p.date || null, kind: p.kind, url: p.url, image: abs(photoFor(content.photos, `press_${p.id}`)) || ytThumb(p.url) || null }));
  const res = NextResponse.json({ interviews, letters: posts, substack: CHANNELS.substack, updated: Date.now() });
  res.headers.set("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  return cors(req, res);
}

export function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  return cors(req, res);
}
