import { CHANNELS } from "@/config/channels";

// ============================================================================
// Live RSS for the podcast and the Substack, so the site always shows the
// latest episodes and write-ups without anyone pasting anything. Cached in
// memory for 30 minutes; if a fetch fails we keep serving the last good copy.
// ============================================================================

export interface FeedItem {
  title: string;
  url: string;
  date: string; // ISO
  blurb?: string;
  image?: string;
  /** Parsed from titles like "133: Remembering Who You Are with Nadia Montenegro". */
  guest?: string;
  number?: string;
}

export interface Feed {
  title: string;
  image?: string;
  items: FeedItem[];
  fetchedAt: number;
}

const TTL = 30 * 60 * 1000;
const cache = new Map<string, Feed>();

function tag(xml: string, name: string): string | undefined {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  if (!m) return undefined;
  return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
}
function attr(xml: string, name: string, attrName: string): string | undefined {
  const m = xml.match(new RegExp(`<${name}\\b[^>]*\\b${attrName}=["']([^"']+)["']`, "i"));
  return m?.[1];
}
const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "’", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", mdash: "—", ndash: "–" };
function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
}
// Buzzsprout escapes the HTML inside the XML (&lt;p&gt;…), so decode, strip
// the tags that appear, then decode once more for entities that were nested.
function text(html: string | undefined, max = 220): string | undefined {
  if (!html) return undefined;
  const t = decode(decode(html).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  return t.length > max ? t.slice(0, max - 1).replace(/\s\S*$/, "") + "…" : t;
}
function parseTitle(raw: string): { title: string; number?: string; guest?: string } {
  let title = raw.replace(/\s+/g, " ").trim();
  let number: string | undefined;
  const n = title.match(/^(?:episode\s*)?(\d{1,4})\s*[:.\-–|]\s*/i) ?? title.match(/^(\d{1,4})\s+/);
  if (n) { number = n[1]; title = title.slice(n[0].length).trim(); }
  const g = title.match(/\b(?:with|ft\.?|feat\.?|featuring)\s+([A-Z][\w'’.-]+(?:\s+[A-Z][\w'’.-]+){0,3})\s*$/);
  const guest = g?.[1];
  return { title, number, guest };
}

async function fetchFeed(url: string): Promise<Feed | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "libni.co site" }, cache: "no-store" });
    if (!res.ok) return null;
    const xml = await res.text();
    const channel = xml.split(/<item\b/i)[0];
    const title = text(tag(channel, "title"), 120) ?? "";
    const image = attr(channel, "itunes:image", "href") ?? tag(tag(channel, "image") ?? "", "url");
    const items: FeedItem[] = xml.split(/<item\b/i).slice(1).map((chunk) => {
      const rawTitle = tag(chunk, "title") ?? "";
      const { title: t2, number, guest } = parseTitle(rawTitle);
      const link = tag(chunk, "link") ?? attr(chunk, "enclosure", "url") ?? "";
      const pub = tag(chunk, "pubDate");
      const date = pub ? new Date(pub).toISOString() : "";
      const img = attr(chunk, "itunes:image", "href") ?? (attr(chunk, "enclosure", "type")?.startsWith("image") ? attr(chunk, "enclosure", "url") : undefined);
      const blurb = text(tag(chunk, "itunes:summary") ?? tag(chunk, "description"));
      return { title: t2, url: link, date, blurb, image: img, guest, number };
    }).filter((i) => i.title && i.url);
    return { title, image, items, fetchedAt: Date.now() };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function cached(url: string): Promise<Feed> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.fetchedAt < TTL) return hit;
  const fresh = await fetchFeed(url);
  if (fresh) { cache.set(url, fresh); return fresh; }
  return hit ?? { title: "", items: [], fetchedAt: 0 };
}

export const getPodcast = () => cached(CHANNELS.podcastRss);
export const getWritings = () => cached(CHANNELS.substackRss);

export function fmtDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}
