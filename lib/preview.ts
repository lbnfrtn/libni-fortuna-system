// ============================================================================
// Link previews for the speaking archive and press features. YouTube gives a
// thumbnail from the video id; Spotify and TikTok expose public oEmbed; news
// sites carry an og:image. Facebook and Instagram block all of it, so those
// return nothing and the page shows a platform badge (or Libni's own upload).
// Results are cached in memory for a day; a failed lookup is cached too so a
// dead link never slows the page twice.
// ============================================================================

const TTL = 24 * 60 * 60 * 1000;
const cache = new Map<string, { img?: string; at: number }>();

function host(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

/** "YouTube", "Facebook", "Instagram", "Spotify", "TikTok" or the site name. */
export function platformOf(url?: string): string {
  const h = host(url ?? "");
  if (!h) return "";
  if (h.includes("youtube") || h === "youtu.be") return "YouTube";
  if (h.includes("facebook") || h === "fb.watch") return "Facebook";
  if (h.includes("instagram")) return "Instagram";
  if (h.includes("spotify")) return "Spotify";
  if (h.includes("tiktok")) return "TikTok";
  return h.replace(/\.(com|ph|net|org)$/, "").split(".").slice(-1)[0].replace(/^\w/, (c) => c.toUpperCase());
}

async function get(url: string, as: "json" | "text"): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; libni.co link preview)" }, cache: "no-store" });
    if (!res.ok) return undefined;
    return as === "json" ? res.json() : res.text();
  } catch {
    return undefined;
  } finally {
    clearTimeout(t);
  }
}

async function lookup(url: string): Promise<string | undefined> {
  const yt = url.match(/(?:[?&]v=|youtu\.be\/|\/shorts\/)([\w-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  const h = host(url);
  if (!h || h.includes("facebook") || h.includes("instagram") || h === "fb.watch") return undefined;
  if (h.includes("spotify") || h.includes("tiktok")) {
    const base = h.includes("spotify") ? "https://open.spotify.com/oembed" : "https://www.tiktok.com/oembed";
    const o = (await get(`${base}?url=${encodeURIComponent(url)}`, "json")) as { thumbnail_url?: string } | undefined;
    return o?.thumbnail_url;
  }
  const html = (await get(url, "text")) as string | undefined;
  if (!html) return undefined;
  const head = html.slice(0, 200_000);
  const m = head.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i)
    ?? head.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
    ?? head.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  const img = m?.[1];
  if (!img) return undefined;
  try { return new URL(img, url).toString(); } catch { return undefined; }
}

export async function previewFor(url?: string): Promise<string | undefined> {
  if (!url) return undefined;
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL) return hit.img;
  const img = await lookup(url).catch(() => undefined);
  // A hit lives a day; a miss (timeout, blocked, no og:image) is retried after 10 minutes.
  cache.set(url, { img, at: img ? Date.now() : Date.now() - TTL + 10 * 60 * 1000 });
  return img;
}

/** Previews for many links at once (in parallel, each with its own timeout). */
export async function previewMap(urls: (string | undefined)[]): Promise<Map<string, string>> {
  const list = [...new Set(urls.filter((u): u is string => Boolean(u)))];
  const out = new Map<string, string>();
  const results = await Promise.allSettled(list.map((u) => previewFor(u)));
  results.forEach((r, i) => { if (r.status === "fulfilled" && r.value) out.set(list[i], r.value); });
  return out;
}
