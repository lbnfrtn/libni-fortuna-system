import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdFinal, EdLogos } from "@/app/components/Editorial";
import { getContent, byDateDesc, fmtWhen } from "@/lib/content";
import { getPodcast } from "@/lib/feeds";
import { photoFor } from "@/config/site-slots";
import { CHANNELS } from "@/config/channels";
import { PRESS_LOGOS } from "@/config/logos";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Media kit · Libni Fortuna" };

export default async function MediaKit() {
  const [content, podcast] = await Promise.all([getContent(), getPodcast()]);
  const kit = content.mediaKit;
  const heads = ["headshot_1", "headshot_2", "headshot_3", "headshot_4"].map((id) => photoFor(content.photos, id)).filter((u): u is string => Boolean(u));
  const press = [...content.press].sort(byDateDesc).slice(0, 8);
  const eps = podcast.items.length;

  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Media kit"
        title="Everything you need to introduce Libni."
        lede="Bios, headshots, topics and facts — ready to copy. For event organisers, podcast hosts and press."
        ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "ink" }]}
        aside={<div style={{ alignSelf: "end" }}><PrintButton /></div>}
      />

      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap">
          <p className="ed-eyebrow ed-reveal" style={{ marginBottom: 22 }}>Headshots · click to download</p>
          <div className="ed-kit-heads ed-reveal">
            {heads.map((u, i) => (
              <div key={u} className="ed-kit-head">
                <img src={u} alt={`Libni Fortuna — headshot ${i + 1}`} />
                <a className="ed-link" href={u} download={`libni-fortuna-${i + 1}`}>Download</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c4 ed-stack ed-reveal">
            <p className="ed-eyebrow">One line</p>
            <p className="ed-lede">{kit.oneLiner}</p>
            <p className="ed-eyebrow" style={{ marginTop: 20 }}>Credentials</p>
            <p className="ed-creds">Master NLP practitioner · Certified hypnotherapist · Breathwork &amp; somatic facilitator · TEDx speaker</p>
          </div>
          <div className="ed-off1 ed-stack ed-reveal ed-bio" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Short bio</p>
            <div className="ed-copy"><p>{kit.shortBio}</p></div>
            <p className="ed-eyebrow" style={{ marginTop: 20 }}>Long bio</p>
            <div className="ed-copy"><p>{kit.longBio}</p></div>
          </div>
        </div>
      </section>

      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">At a glance</p><h2 className="ed-display">The facts.</h2></div>
          </div>
          <div className="ed-facts ed-reveal">
            {[
              ["100+", "Engagements facilitated"], ["1,000+", "Lives impacted"], ["TEDx", "Speaker · 2024"],
              ["PH · AU · Bali", "International reach"], [eps ? `${eps}` : "—", "Podcast episodes"], ["Anyway, Moving Forward", "The podcast"],
            ].map(([n, l]) => <div key={l} className="ed-fact"><b>{n}</b><span>{l}</span></div>)}
          </div>
        </div>
      </section>

      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap ed-reveal" style={{ marginBottom: 28 }}><p className="ed-eyebrow" style={{ textAlign: "center" }}>As seen on</p></div>
        <EdLogos items={PRESS_LOGOS} />
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal">
            <p className="ed-eyebrow">Speaking topics</p>
            <h2 className="ed-display-md" style={{ marginTop: 12 }}>Shaped to the room.</h2>
          </div>
          <div className="ed-off1 ed-reveal" style={{ transitionDelay: ".15s" }}>
            <ul className="ed-list">
              {kit.topics.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {press.length > 0 && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">Recent features</p><h2 className="ed-display">In the press &amp; on other shows.</h2></div>
              <p className="ed-lede ed-muted"><Link href="/features" className="ed-link">All features — podcasts, TV, publications, events</Link></p>
            </div>
            <div className="ed-reveal">
              {press.map((p) => (
                <a key={p.id} className="ed-talk" href={p.url} target="_blank" rel="noreferrer">
                  <span className="ed-talk-when">{fmtWhen(p.date) || p.outlet}</span>
                  <span><h4>{p.title}</h4><p>{p.outlet}</p></span>
                  <span className="ed-talk-kind">{p.kind}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ed-sec-sm ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Press &amp; bookings</p>
            <h2 className="ed-display-md">Say hello.</h2>
            <p className="ed-copy" style={{ color: "rgba(251,249,246,.8)" }}><a href={`mailto:${kit.pressEmail}`} style={{ borderBottom: "1px solid var(--ed-gold)" }}>{kit.pressEmail}</a></p>
          </div>
          <div className="ed-off1 ed-stack-sm ed-reveal" style={{ color: "rgba(251,249,246,.75)" }}>
            <p className="ed-eyebrow">Links</p>
            <p><a href={CHANNELS.spotify} target="_blank" rel="noreferrer">Spotify</a> · <a href={CHANNELS.applePodcasts} target="_blank" rel="noreferrer">Apple Podcasts</a> · <a href={CHANNELS.youtube} target="_blank" rel="noreferrer">YouTube</a> · <a href={CHANNELS.substack} target="_blank" rel="noreferrer">Substack</a> · <a href={CHANNELS.instagram} target="_blank" rel="noreferrer">Instagram</a></p>
            <p><a href={CHANNELS.tedx} target="_blank" rel="noreferrer" style={{ borderBottom: "1px solid var(--ed-gold)" }}>Watch the TEDx talk</a></p>
          </div>
        </div>
      </section>

      <EdFinal title="Bring the room home to itself." ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "gold" }, { label: "Stages so far", href: "/speaking", variant: "light" }]} />
    </SitePage>
  );
}
