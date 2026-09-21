import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdStats, EdFinal, EdCtas, EdLogos } from "@/app/components/Editorial";
import { getContent, byDateDesc } from "@/lib/content";
import { getPodcast } from "@/lib/feeds";
import { previewMap } from "@/lib/preview";
import { PRESS_LOGOS } from "@/config/logos";
import { CHANNELS } from "@/config/channels";
import { TalkRow, PressCard, PressRow } from "@/app/components/Features";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Features — podcasts, television, publications & events · Libni Fortuna",
  description: "Where Libni Fortuna has been featured: podcast interviews, TV segments, national publications, and the stages and events she has led.",
};

const TABS: [string, string][] = [["#podcasts", "Podcasts"], ["#television", "Television"], ["#publications", "Publications"], ["#events", "Events"]];

export default async function Features() {
  const [content, podcast] = await Promise.all([getContent(), getPodcast()]);
  const podcasts = [...content.press].filter((p) => p.kind === "podcast").sort(byDateDesc);
  const television = [...content.press].filter((p) => p.kind === "tv" || p.kind === "video").sort(byDateDesc);
  const publications = [...content.press].filter((p) => p.kind === "article").sort(byDateDesc);
  const events = [...content.talks].sort(byDateDesc);
  const recent = events.slice(0, 12);
  const prev = await previewMap([...content.press.map((p) => p.url), ...recent.map((t) => t.url)]);
  const outlets = new Set(content.press.map((p) => p.outlet.split(" · ")[0]));

  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Features"
        title="Where the conversation has travelled."
        lede="Podcast interviews, television, national publications — and the stages and rooms she has led. Every link, in one place."
        ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "ink" }, { label: "Media kit", href: "/media-kit", variant: "ghost" }]}
      />

      <nav className="ed-subnav" aria-label="Sections">
        <div className="ed-wrap">
          {TABS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
      </nav>

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap">
          <EdStats items={[[String(podcasts.length), "Podcast features"], [String(television.length), "TV & video"], [String(publications.length), "Publications"], [String(events.length), "Events & stages"]]} />
        </div>
      </section>

      {/* PODCASTS */}
      <section className="ed-sec ed-night" id="podcasts">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">01 · Podcast features</p><h2 className="ed-display">As a guest.</h2></div>
            <div className="ed-stack-sm">
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>The conversations other hosts invited her into.</p>
              <p style={{ color: "rgba(251,249,246,.6)", fontSize: 15 }}>Her own show, <Link href="/podcast" style={{ borderBottom: "1px solid var(--ed-gold)" }}>Anyway, Moving Forward</Link>{podcast.items.length ? ` — ${podcast.items.length} episodes` : ""}.</p>
            </div>
          </div>
          {podcasts.length > 0
            ? <div className="ed-press ed-reveal">{podcasts.map((p) => <PressCard key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
            : <p className="ed-lede" style={{ color: "rgba(251,249,246,.6)" }}>Podcast features are added from the Studio.</p>}
        </div>
      </section>

      {/* TELEVISION */}
      <section className="ed-sec ed-ivory" id="television">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">02 · Television &amp; video</p><h2 className="ed-display">On air.</h2></div>
            <p className="ed-lede ed-muted">NET25, Bilyonaryo News Channel, Rise &amp; Shine Pilipinas, Abante, TEDx and more.</p>
          </div>
          <div className="ed-press ed-reveal">{television.map((p) => <PressCard key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section className="ed-sec ed-linen" id="publications">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">03 · Publications</p><h2 className="ed-display">In print.</h2></div>
            <p className="ed-lede ed-muted">{[...outlets].filter((o) => publications.some((p) => p.outlet.startsWith(o))).join(", ")}.</p>
          </div>
          <div className="ed-reveal">{publications.map((p) => <PressRow key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
        </div>
      </section>

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap ed-reveal" style={{ marginBottom: 28 }}><p className="ed-eyebrow" style={{ textAlign: "center" }}>As seen on</p></div>
        <EdLogos items={PRESS_LOGOS} />
      </section>

      {/* EVENTS */}
      <section className="ed-sec ed-ivory" id="events" style={{ paddingTop: 0 }}>
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">04 · Events &amp; stages</p><h2 className="ed-display">The most recent rooms.</h2></div>
            <div className="ed-stack-sm">
              <p className="ed-lede ed-muted">Keynotes, workshops, panels, retreats and facilitations.</p>
              <p><Link href="/speaking#events" className="ed-link">The full archive by year — {events.length} and counting</Link></p>
            </div>
          </div>
          <div className="ed-reveal">{recent.map((t) => <TalkRow key={t.id} t={t} photos={content.photos} prev={prev} />)}</div>
        </div>
      </section>

      <section className="ed-sec-sm ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Press &amp; bookings</p>
            <h2 className="ed-display-md">Want Libni on your show, page or stage?</h2>
          </div>
          <div className="ed-off1 ed-reveal">
            <EdCtas ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "gold" }, { label: "Download the media kit", href: "/media-kit", variant: "light" }]} />
            <p style={{ marginTop: 22, color: "rgba(251,249,246,.7)" }}>Or write to <a href={`mailto:${content.mediaKit.pressEmail}`} style={{ borderBottom: "1px solid var(--ed-gold)" }}>{content.mediaKit.pressEmail}</a> · <a href={CHANNELS.instagram} target="_blank" rel="noreferrer" style={{ borderBottom: "1px solid var(--ed-gold)" }}>@libnifortuna</a></p>
          </div>
        </div>
      </section>

      <EdFinal title="Bring the room home to itself." ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "gold" }, { label: "Hear the podcast", href: "/podcast", variant: "light" }]} />
    </SitePage>
  );
}
