import { getInstagram, type IgPost } from "@/lib/instagram";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";
import { CHANNELS } from "@/config/channels";

// The latest post leads, large, with its caption when the live feed is on;
// the next five sit beside it. Live posts when INSTAGRAM_ACCESS_TOKEN is set,
// otherwise the Studio's "Instagram" slots (ig_1 is the featured one).
export default async function InstagramStrip() {
  const [live, content] = await Promise.all([getInstagram(6), getContent()]);
  const profile = content.links.instagram || CHANNELS.instagram;
  const handle = profile.replace(/\/$/, "").split("/").pop();
  const posts: IgPost[] = live.length
    ? live
    : ["ig_1", "ig_2", "ig_3", "ig_4", "ig_5", "ig_6"].map((id) => photoFor(content.photos, id)).filter((u): u is string => Boolean(u)).map((image, i) => ({ id: `slot-${i}`, image, permalink: profile }));
  if (!posts.length) return null;
  const [latest, ...rest] = posts;
  const caption = latest.caption?.replace(/\s+/g, " ").trim();

  return (
    <section className="ed-ig">
      <div className="ed-wrap">
        <div className="ed-ig-head ed-reveal">
          <div><p className="ed-eyebrow">Latest on Instagram</p><h2 className="ed-display-md">@{handle}</h2></div>
          <a className="ed-link" href={profile} target="_blank" rel="noreferrer">Follow along</a>
        </div>
        <div className="ed-ig-feature ed-reveal">
          <a className="ed-ig-latest" href={latest.permalink} target="_blank" rel="noreferrer" aria-label={caption?.slice(0, 80) || "Latest Instagram post"}>
            <img src={latest.image} alt="" loading="lazy" />
            <span className="ed-ig-tag">{latest.video ? "Latest reel" : "Latest post"} ↗</span>
          </a>
          <div className="ed-ig-side">
            {caption && <p className="ed-ig-caption">{caption.length > 260 ? caption.slice(0, 257) + "…" : caption}</p>}
            {rest.length > 0 && (
              <div className="ed-ig-grid">
                {rest.map((p) => (
                  <a key={p.id} href={p.permalink} target="_blank" rel="noreferrer" aria-label={p.caption?.slice(0, 80) || "Instagram post"}>
                    <img src={p.image} alt="" loading="lazy" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
