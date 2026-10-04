import { DEFAULT_LIBERATE_VIDEOS, vimeoId, type LiberateVideo } from "@/config/liberate-videos";

// Vimeo's public oEmbed gives a poster, size and title for any public video — enough to
// render a Studio-pasted link as a proper card. Cached in memory; failures just render plain.
const cache = new Map<string, { at: number; meta: Omit<LiberateVideo, "url"> | null }>();
const TTL = 6 * 60 * 60 * 1000;

function nameFromTitle(title?: string): string | undefined {
  if (!title) return undefined;
  const t = title.trim();
  return /^[A-Za-z][A-Za-z .'’-]{0,30}$/.test(t) ? t : undefined;
}

async function oembed(url: string): Promise<Omit<LiberateVideo, "url"> | null> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL) return hit.meta;
  let meta: Omit<LiberateVideo, "url"> | null = null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=1280`, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (res.ok) {
      const j = (await res.json()) as { title?: string; thumbnail_url?: string; width?: number; height?: number; duration?: number };
      meta = { poster: j.thumbnail_url, name: nameFromTitle(j.title), w: j.width, h: j.height, dur: j.duration };
    }
  } catch {
    meta = null;
  }
  cache.set(url, { at: Date.now(), meta });
  return meta;
}

/** Turn Studio video links into cards: known Vimeo ids keep Libni's name/intake, the rest get oEmbed details. */
export async function enrichVideos(urls: string[]): Promise<LiberateVideo[]> {
  return Promise.all(
    urls.map(async (url) => {
      const id = vimeoId(url);
      const known = id ? DEFAULT_LIBERATE_VIDEOS.find((v) => vimeoId(v.url) === id) : undefined;
      if (known) return { ...known, url };
      if (!id) return { url };
      const meta = await oembed(url);
      return meta ? { url, ...meta } : { url };
    })
  );
}
