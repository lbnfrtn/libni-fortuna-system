import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdStats, EdFinal, EdCtas, EdCircle } from "@/app/components/Editorial";
import { getContent, storyPhoto } from "@/lib/content";
import { embedUrl, photoFor } from "@/config/site-slots";

export const dynamic = "force-dynamic";

export const metadata = { title: "Client love · Libni Fortuna" };

export default async function ClientLove() {
  const content = await getContent();
  const stories = [...content.stories].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const [first, ...rest] = stories;
  const videos = ["video_1", "video_2", "video_3", "video_4", "video_5", "video_6"].map((id) => embedUrl(content.videos[id] ?? "")).filter((v): v is string => Boolean(v));
  const shots = ["screenshot_1", "screenshot_2", "screenshot_3", "screenshot_4", "screenshot_5", "screenshot_6"].map((id) => content.photos[id]).filter(Boolean);

  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Client love"
        title="Real lives. Real turning points."
        lede="These are the people who said yes — to themselves, their healing, their wholeness. Not testimonials. Turning points."
      />

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap">
          <EdStats items={[["1,000+", "Lives impacted"], ["100+", "Engagements facilitated"], ["TEDx", "Speaker · 2024"], ["2023", "Essence began"]]} />
        </div>
      </section>

      {first && (
        <section className="ed-sec ed-linen">
          <div className="ed-wrap">
            <div className="ed-feature ed-reveal">
              <div>
                <p className="ed-eyebrow" style={{ marginBottom: 24 }}>In their words</p>
                <p className="ed-quote">{first.quote}</p>
                <div className="ed-who-row">
                  <EdCircle src={storyPhoto(content.photos, first.id)} name={first.name} size={64} />
                  <p className="ed-who">{first.name}{first.role && <span>{first.role}</span>}</p>
                </div>
              </div>
              <p className="ed-lede ed-muted" style={{ maxWidth: "24ch" }}>What you’ll read here aren’t reviews. They’re turning points.</p>
            </div>
            <div className="ed-words">
              {rest.map((w, i) => (
                <div key={w.id} className="ed-word ed-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                  <EdCircle src={storyPhoto(content.photos, w.id)} name={w.name} />
                  <div>
                    <p className="ed-quote">{w.quote}</p>
                    <p className="ed-who">{w.name}{w.role && <span>{w.role}</span>}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 40 }}><Link href="/stories" className="ed-link">Read the full stories — before, the work, after</Link></p>
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="ed-sec ed-night">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">Video testimonies</p><h2 className="ed-display">In their own words.</h2></div>
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>Unscripted. Recorded after the work.</p>
            </div>
            <div className="ed-videos ed-reveal" style={{ marginTop: 0 }}>
              {videos.map((v, i) => (
                <div key={v}><div className="ed-video"><iframe src={v} title={`Video testimony ${i + 1}`} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {shots.length > 0 && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">Messages</p><h2 className="ed-display">What arrives in the inbox afterwards.</h2></div>
              <p className="ed-lede ed-muted">Shared with permission. Names blurred where asked.</p>
            </div>
            <div className="ed-shots ed-reveal">
              {shots.map((u, i) => <img key={u} src={u} alt={`Client message ${i + 1}`} loading="lazy" />)}
            </div>
          </div>
        </section>
      )}

      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split">
          <div className="ed-figure ed-c5 ed-reveal"><img src={photoFor(content.photos, "home_stage")} alt="Libni on stage" style={{ objectPosition: "50% 40%" }} /></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Proof, not promises</p>
            <h2 className="ed-display">When you come home to yourself, everything begins to shift.</h2>
            <div className="ed-copy">
              <p>More stories from the Essence Retreat, Liberate and private mentorship are added as clients give their blessing. Real lives. Real breakthroughs. Nothing here is invented, and nothing is published without permission.</p>
            </div>
            <EdCtas ctas={[{ label: "Find your path", href: "/start", variant: "ink" }]} />
          </div>
        </div>
      </section>

      <EdFinal
        title="Your story could be"
        gold="the next turning point."
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Explore Liberate", href: "/liberate", variant: "light" }]}
      />
    </SitePage>
  );
}
