import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdStats, EdFinal, EdCtas } from "@/app/components/Editorial";
import { getContent, byDateDesc, fmtWhen } from "@/lib/content";
import { getPodcast } from "@/lib/feeds";
import { CHANNELS } from "@/config/channels";
import { photoFor, spotifyEmbed } from "@/config/site-slots";
import EpisodeList from "./EpisodeList";

export const dynamic = "force-dynamic";

export const metadata = { title: "Anyway, Moving Forward — the podcast · Libni Fortuna" };

export default async function Podcast() {
  const [content, podcast] = await Promise.all([getContent(), getPodcast()]);
  const items = podcast.items;
  const art = photoFor(content.photos, "home_podcast") || podcast.image;
  const spotifyUrl = content.links.spotify || CHANNELS.spotify;
  const appleUrl = content.links.applePodcasts || CHANNELS.applePodcasts;
  const player = spotifyEmbed(spotifyUrl);

  // Guests, most recent first, each once.
  const guests = [...new Set(items.map((e) => e.guest).filter((g): g is string => Boolean(g)))];
  const conversations = items.filter((e) => e.guest).slice(0, 6);
  const since = items.length ? new Date(items[items.length - 1].date).getFullYear() : undefined;
  const asGuest = content.press.filter((p) => p.kind !== "article").sort(byDateDesc);
  const inPrint = content.press.filter((p) => p.kind === "article").sort(byDateDesc);

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="The podcast"
        eyebrow={items.length ? `${items.length} episodes${since ? ` · since ${since}` : ""}` : "Anyway, Moving Forward"}
        title="Anyway, Moving Forward."
        lede="Real stories, raw reflections and soul-deep conversations."
        sub="On self-love, emotional resilience, heartbreak, and rising again. Truth without the fluff — with me, and with the people who’ve lived it."
        ctas={[{ label: "Listen on Spotify", href: spotifyUrl, variant: "gold", external: true }, { label: "Apple Podcasts", href: appleUrl, variant: "light", external: true }]}
        image={photoFor(content.photos, "home_story")!}
        alt="Libni Fortuna"
        objectPosition="50% 20%"
      />

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap">
          <EdStats items={[[String(items.length || "—"), "Episodes"], [since ? `Since ${since}` : "Weekly", "On air"], [String(guests.length || "—"), "Guests so far"], ["Spotify · Apple", "Where to listen"]]} />
        </div>
      </section>

      {player && (
        <section className="ed-sec ed-night" style={{ paddingTop: "clamp(48px, 6vw, 88px)" }}>
          <div className="ed-wrap ed-split ed-split-top">
            <div className="ed-c4 ed-reveal">
              {art && <img className="ed-pod-art" src={art} alt="Anyway, Moving Forward" />}
            </div>
            <div className="ed-c8 ed-reveal" style={{ transitionDelay: ".15s" }}>
              <p className="ed-eyebrow">Press play</p>
              <h2 className="ed-display-md" style={{ marginTop: 12, marginBottom: 24 }}>Start with the latest.</h2>
              <div className="ed-spotify"><iframe src={player} title="Anyway, Moving Forward on Spotify" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /></div>
            </div>
          </div>
        </section>
      )}

      {conversations.length > 0 && (
        <section className="ed-sec ed-night" style={{ paddingTop: 0 }}>
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">Featured guests</p><h2 className="ed-display">Conversations worth your walk home.</h2></div>
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>People who said the quiet part out loud.</p>
            </div>
            <div className="ed-convos ed-reveal">
              {conversations.map((e) => (
                <a key={e.url} className="ed-convo" href={e.url} target="_blank" rel="noreferrer">
                  {(e.image || podcast.image) && <img src={e.image || podcast.image} alt="" />}
                  <div>
                    <b>with {e.guest}</b>
                    <h4>{e.title}</h4>
                    <span>{e.number ? `Episode ${e.number}` : ""}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Every episode</p><h2 className="ed-display">Find the one you need today.</h2></div>
            <p className="ed-lede ed-muted">Search a feeling, a theme, or a name.</p>
          </div>
          <div className="ed-reveal">
            {items.length > 0
              ? <EpisodeList items={items.map((e) => ({ title: e.title, url: e.url, date: e.date, number: e.number, guest: e.guest, blurb: e.blurb }))} guests={guests.slice(0, 24)} />
              : <p className="ed-lede ed-muted">The episode list is loading from Spotify — <a className="ed-link" href={spotifyUrl} target="_blank" rel="noreferrer">listen there</a> in the meantime.</p>}
          </div>
        </div>
      </section>

      {(asGuest.length > 0 || inPrint.length > 0) && (
        <section className="ed-sec ed-linen">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">Libni as a guest</p><h2 className="ed-display">Interviews, podcasts &amp; press.</h2></div>
              <p className="ed-lede ed-muted">Where the conversation travelled.</p>
            </div>
            <div className="ed-reveal">
              {[...asGuest, ...inPrint].map((p) => (
                <a key={p.id} className="ed-talk" href={p.url} target="_blank" rel="noreferrer">
                  <span className="ed-talk-when">{fmtWhen(p.date) || p.outlet}</span>
                  <span>
                    <h4>{p.title}</h4>
                    <p>{p.outlet}{p.blurb ? ` — ${p.blurb}` : ""}</p>
                  </span>
                  <span className="ed-talk-kind">{p.kind}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Want Libni on your show or stage?</p>
            <h2 className="ed-display-md">She speaks to what’s rarely named but deeply felt.</h2>
          </div>
          <div className="ed-off1 ed-reveal">
            <EdCtas ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "ink" }, { label: "Media kit", href: "/media-kit", variant: "ghost" }]} />
            <p style={{ marginTop: 22 }}><Link href="/writings" className="ed-link">Prefer to read? The write-ups</Link></p>
          </div>
        </div>
      </section>

      <EdFinal
        title="You don’t have to figure it out alone."
        gold="Come home."
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Work with me 1:1", href: "/programs/the-becoming", variant: "light" }]}
      />
    </SitePage>
  );
}
