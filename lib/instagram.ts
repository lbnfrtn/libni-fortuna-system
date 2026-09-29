import { getContent } from "@/lib/content";

// Latest posts from @libnifortuna, via the feed link Libni pastes in the Studio
// (Behold turns her Instagram login into a public JSON feed — Instagram itself
// doesn't let websites read posts). Cached in memory for 30 minutes; a failed
// fetch keeps serving the last good copy so the footer never breaks.

export interface IgPost {
  id: string;
  url: string;
  image: string;
  caption?: string;
  video?: boolean;
}

const TTL = 30 * 60 * 1000;
let cache: { key: string; posts: IgPost[]; at: number } | null = null;

type Raw = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : "");

function parse(json: unknown): IgPost[] {
  const list: Raw[] = Array.isArray(json) ? (json as Raw[]) : Array.isArray((json as Raw)?.posts) ? ((json as Raw).posts as Raw[]) : [];
  return list
    .map((p) => {
      const sizes = (p.sizes as Raw | undefined) ?? {};
      const medium = (sizes.medium as Raw | undefined) ?? (sizes.large as Raw | undefined) ?? {};
      const image = str(medium.mediaUrl) || str(p.thumbnailUrl) || str(p.mediaUrl);
      return { id: str(p.id) || str(p.permalink), url: str(p.permalink), image, caption: str(p.caption) || undefined, video: str(p.mediaType) === "VIDEO" };
    })
    .filter((p) => p.url && p.image);
}

export async function instagramPosts(limit = 6): Promise<IgPost[]> {
  const feed = (await getContent()).links.instagramFeed;
  if (!feed) return [];
  if (cache && cache.key === feed && Date.now() - cache.at < TTL) return cache.posts.slice(0, limit);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(feed, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const posts = parse(await res.json());
    cache = { key: feed, posts, at: Date.now() };
    return posts.slice(0, limit);
  } catch {
    return cache?.key === feed ? cache.posts.slice(0, limit) : [];
  } finally {
    clearTimeout(t);
  }
}
