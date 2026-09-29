import { instagramPosts } from "@/lib/instagram";
import { CHANNELS } from "@/config/channels";

// Her latest posts above the footer. Renders nothing until the feed is connected in the Studio.
export default async function InstagramStrip() {
  const posts = await instagramPosts(6);
  if (posts.length < 3) return null;
  return (
    <section className="ig">
      <div className="ig-head">
        <p className="ed-eyebrow">On Instagram</p>
        <a href={CHANNELS.instagram} target="_blank" rel="noreferrer" className="ed-link">Follow @libnifortuna ↗</a>
      </div>
      <div className="ig-grid">
        {posts.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="ig-post" aria-label={p.caption ? p.caption.slice(0, 80) : "Instagram post"}>
            <img src={p.image} alt="" loading="lazy" />
            {p.video && <span className="ig-video" aria-hidden />}
          </a>
        ))}
      </div>
    </section>
  );
}
