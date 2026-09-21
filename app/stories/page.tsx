import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdFinal, EdCircle, EdCtas } from "@/app/components/Editorial";
import { getContent, storyPhoto } from "@/lib/content";
import { embedUrl } from "@/config/site-slots";

export const dynamic = "force-dynamic";

export const metadata = { title: "Client stories · Libni Fortuna" };

export default async function Stories() {
  const content = await getContent();
  const stories = [...content.stories].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const videos = ["video_1", "video_2", "video_3", "video_4", "video_5", "video_6"].map((id) => embedUrl(content.videos[id] ?? "")).filter((v): v is string => Boolean(v));

  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Client stories"
        title="Where they started. What shifted. Who they are now."
        lede="Real people, in their own words. Nothing here is invented, and nothing is published without permission."
        ctas={[{ label: "Find your path", href: "/start", variant: "ink" }, { label: "Videos & messages", href: "/client-love", variant: "ghost" }]}
      />

      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap">
          {stories.map((s, i) => {
            const arc = [["Where they started", s.before], ["The work", s.during], ["Where they are now", s.after]].filter(([, v]) => v);
            return (
              <article key={s.id} className="ed-story ed-reveal" style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <EdCircle src={storyPhoto(content.photos, s.id)} name={s.name} size={96} />
                <div>
                  <p className="ed-story-meta"><b>{s.name}</b>{s.role ? ` · ${s.role}` : ""}{s.program ? ` · ${s.program}` : ""}</p>
                  <p className="ed-quote">{s.quote}</p>
                  {arc.length > 0 && (
                    <div className="ed-story-arc">
                      {arc.map(([h, v]) => <div key={h}><h5>{h}</h5><p>{v}</p></div>)}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          {stories.length === 0 && <p className="ed-lede ed-muted">Stories are added as clients give their blessing.</p>}
        </div>
      </section>

      {videos.length > 0 && (
        <section className="ed-sec ed-linen">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">In their own words</p><h2 className="ed-display">Watch.</h2></div>
            </div>
            <div className="ed-videos ed-reveal" style={{ marginTop: 0 }}>
              {videos.map((v, i) => (
                <div key={v}><div className="ed-video"><iframe src={v} title={`Video testimony ${i + 1}`} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div></div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Proof, not promises</p>
            <h2 className="ed-display-md">When you come home to yourself, everything begins to shift.</h2>
          </div>
          <div className="ed-off1 ed-reveal">
            <EdCtas ctas={[{ label: "Explore Liberate", href: "/liberate", variant: "ink" }, { label: "Work with me 1:1", href: "/programs/the-becoming", variant: "ghost" }]} />
            <p style={{ marginTop: 22 }}><Link href="/client-love" className="ed-link">Videos, screenshots and more</Link></p>
          </div>
        </div>
      </section>

      <EdFinal title="Your story could be" gold="the next turning point." ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Say hello first", href: "/contact", variant: "light" }]} />
    </SitePage>
  );
}
