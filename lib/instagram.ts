// ============================================================================
// Libni's latest Instagram posts, for the strip above the footer.
// Uses the Instagram Graph API (Instagram Login) with a long-lived token in
// INSTAGRAM_ACCESS_TOKEN. Cached 30 minutes; the last good result is kept if
// Instagram is down. With no token it returns [], and the strip falls back to
// the photos she uploads to the "Instagram" slots in the Studio.
// ============================================================================

export interface IgPost {
  id: string;
  image: string;
  permalink: string;
  caption?: string;
  video?: boolean;
}

const TTL = 30 * 60 * 1000;
let cache: { posts: IgPost[]; at: number } | null = null;

export async function getInstagram(limit = 8): Promise<IgPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];
  if (cache && Date.now() - cache.at < TTL) return cache.posts.slice(0, limit);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit * 2}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`instagram ${res.status}`);
    const json = (await res.json()) as { data?: { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string }[] };
    const posts = (json.data ?? [])
      .map((m) => ({ id: m.id, image: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? "", permalink: m.permalink, caption: m.caption, video: m.media_type === "VIDEO" }))
      .filter((p) => p.image)
      .slice(0, limit);
    cache = { posts, at: Date.now() };
    return posts;
  } catch (err) {
    console.error("instagram:", err);
    return cache?.posts.slice(0, limit) ?? [];
  } finally {
    clearTimeout(t);
  }
}
