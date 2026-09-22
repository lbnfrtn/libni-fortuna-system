import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdFinal, EdOffer, EdCtas, EdCircle, EdGuideCover, EdLogos } from "@/app/components/Editorial";
import NewsletterForm from "@/app/components/NewsletterForm";
import { getContent, storyPhoto } from "@/lib/content";
import { photoFor, embedUrl } from "@/config/site-slots";
import { getPodcast, getWritings, fmtDate } from "@/lib/feeds";
import { CHANNELS } from "@/config/channels";
import { previewMap } from "@/lib/preview";
import { PressCard } from "@/app/components/Features";
import { byDateDesc } from "@/lib/content";

export const dynamic = "force-dynamic";

const SPACES = [
  ["Awareness", "See the pattern you’ve been living inside."],
  ["Safety", "Give your body permission to feel."],
  ["Release", "Put down what was never yours to carry."],
  ["Reconnection", "Remember who you were before the world told you."],
  ["Embodiment", "Live it — daily, quietly, for real."],
];

export default async function Home() {
  const content = await getContent();
  const photo = (id: string) => photoFor(content.photos, id);

  const experiencesImg = photo("home_experiences");
  const podcastArt = photo("home_podcast");
  const videos = ["video_1", "video_2", "video_3", "video_4", "video_5", "video_6"]
    .map((id) => ({ id, embed: embedUrl(content.videos[id] ?? "") }))
    .filter((v) => v.embed)
    .slice(0, 3);
  const [podcast, writings] = await Promise.all([getPodcast(), getWritings()]);
  const spotifyUrl = content.links.spotify || CHANNELS.spotify;
  const substack = content.links.substack || CHANNELS.substack;
  const episodes = podcast.items.slice(0, 4);
  const posts = writings.items.slice(0, 4);
  // Podcasts she has been a guest on — the six most recent, with link previews.
  const guestPods = [...content.press].filter((p) => p.kind === "podcast").sort(byDateDesc).slice(0, 6);
  const prev = await previewMap(guestPods.map((p) => p.url));
  const picked = content.stories.filter((s) => s.featured);
  const [featured, ...restWords] = (picked.length ? picked : content.stories).slice(0, 3);

  const heroCredentials = [
    { num: "100+", label: "Engagements facilitated" },
    { num: "1,000+", label: "Lives impacted" },
    { num: "TEDx", label: "Speaker · 2024" },
    { num: "PH · AU", label: "International reach" },
    { num: "6+", label: "Years guiding transformation" },
  ];

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="Transformational mentor · TEDx speaker · Experience curator"
        title="Come home to yourself."
        lede="You’ve held everyone together. Who’s been holding you?"
        sub="There’s a version of you — whole, free, fully alive — beneath everything you carry. I’ve guided 1,000+ people back to her. Let’s do it together, one to one."
        ctas={[{ label: "Work with me 1:1", href: "/programs/the-becoming", variant: "gold" }, { label: "Find your path", href: "/start", variant: "light" }]}
        image={photo("home_hero")!}
        alt="Libni Fortuna"
        credentials={heroCredentials}
      />

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap ed-reveal" style={{ marginBottom: 28 }}>
          <p className="ed-eyebrow" style={{ textAlign: "center" }}>As seen on · trusted by</p>
        </div>
        <EdLogos />
      </section>

      {/* I SEE YOU */}
      <section className="ed-sec ed-ivory" style={{ paddingTop: "clamp(24px, 4vw, 56px)" }}>
        <div className="ed-wrap ed-split">
          <div className="ed-figure ed-c5 ed-reveal"><img src={photo("home_seeyou")} alt="Libni Fortuna" /></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">I see you</p>
            <h2 className="ed-display">All of you. The grief, the pace, the ache you can’t quite name.</h2>
            <div className="ed-copy">
              <p>You’ve done the books, the workshops, the affirmations. You know the theory. And still — something underneath won’t settle. You’re tired of holding it together and calling it fine.</p>
              <p>Here, you don’t have to perform okay. You get to be held while you come home.</p>
            </div>
            <p className="ed-pull">Nothing about you is broken. You are a person to be remembered — not a problem to be solved.</p>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="ed-sec ed-plum">
        <div className="ed-wrap ed-statement">
          <h2 className="ed-reveal">This isn’t a pep talk you’ll forget by Monday.<br /><span className="ed-gold">It’s a path your body can actually follow.</span></h2>
          <div className="ed-intro ed-reveal" style={{ transitionDelay: ".2s" }}>
            <p className="ed-lede">I work with the subconscious, the nervous system and the body — because real change lives in all three.</p>
          </div>
        </div>
      </section>

      {/* FIVE SPACES */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The framework</p><h2 className="ed-display">Every path moves through five spaces.</h2></div>
            <p className="ed-lede ed-muted">Awareness to embodiment. The order matters; the pace is yours.</p>
          </div>
          <div className="ed-index">
            {SPACES.map(([t, d], i) => (
              <div className="ed-item ed-reveal" key={t} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOORS */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Choose your door</p><h2 className="ed-display">Four ways to begin.</h2></div>
            <p className="ed-lede ed-muted">One framework. Different doors. Start where you are — or <Link href="/quiz" style={{ borderBottom: "1px solid var(--ed-gold)" }}>take the 60-second quiz</Link> and I’ll point you to the right one.</p>
          </div>
          <div className="ed-offers">
            <EdOffer n="01" slug="ignite" tag="Start here · 90 minutes · private" tagline="One focused conversation to move what’s been stuck." copy="One honest, held conversation that moves what’s been stuck for months. You’ll leave clearer, lighter, and with a real next step." image={photo("offer_ignite")} />
            <EdOffer n="02" slug="the-becoming" featured tag="Go deepest · 12 weeks · 1:1" tagline="My deepest private container." copy="Twelve weeks of sustained 1:1 work — energy work, shadow work, inner-child healing, the subconscious, the nervous system and the body. We stop circling the pattern and meet what’s underneath, together." image={photo("offer_the_becoming")} />
            <EdOffer n="03" slug="liberate" tag="Next intake · October 2026 · group coaching experience" tagline="For the soul-led ones ready to let go of the weight and come home to their power." copy="A 3-month transformational group coaching experience for people ready to break free from emotional patterns, people-pleasing, overthinking, and the quiet exhaustion of holding it all together." image={photo("offer_liberate")} priceLabel="Group coaching experience" />
            <EdOffer n="04" slug="project-me" tag="Practice daily · the app" tagline="A pocket sanctuary. Daily practice, in your hands." copy="Tell it how you feel and it walks you through — something to listen to, a way to breathe, a place to write it out." image={photo("offer_project_me")} phone />
          </div>
          <p style={{ marginTop: 32 }}><Link href="/work-with-me" className="ed-link">See everything I offer — experiences, group work and more</Link></p>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className={experiencesImg ? "ed-band" : "ed-final"} style={experiencesImg ? undefined : { textAlign: "left", paddingTop: "clamp(90px, 12vw, 150px)", paddingBottom: "clamp(90px, 12vw, 150px)" }}>
        {experiencesImg && <img src={experiencesImg} alt="Coming Home experiences" />}
        <div className="ed-wrap ed-reveal">
          <p className="ed-eyebrow">Coming Home experiences</p>
          <h2 style={{ marginTop: 16, fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.02, maxWidth: "18ch", marginLeft: 0, marginRight: 0 }}>Gather. Breathe. Come back to yourself — in person.</h2>
          <p className="ed-lede" style={{ maxWidth: "34ch", marginTop: 22, color: "rgba(251,249,246,.85)" }}>Soundbaths, breathwork rituals, private circles and bespoke retreats — designed around you and the people you bring.</p>
          <EdCtas
            ctas={[
              { label: "Book a private experience", href: "/apply/private-experiences", variant: "gold" },
              { label: "Discover experiences", href: "/experiences", variant: "light" },
              ...(content.events.length > 0 ? [{ label: "Upcoming events", href: "/experiences#upcoming", variant: "light" as const }] : []),
            ]}
            className="ed-ctas"
          />
        </div>
      </section>

      {/* WORDS */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          {featured && (
            <div className="ed-feature ed-reveal">
              <div>
                <p className="ed-eyebrow" style={{ marginBottom: 24 }}>Real people. Real shifts.</p>
                <p className="ed-quote">{featured.quote}</p>
                <div className="ed-who-row">
                  <EdCircle src={storyPhoto(content.photos, featured.id)} name={featured.name} size={64} />
                  <p className="ed-who">{featured.name}{featured.role && <span>{featured.role}</span>}</p>
                </div>
              </div>
              <p className="ed-lede ed-muted" style={{ maxWidth: "24ch" }}>Words from people who have done this work with Libni. Not reviews. Turning points.</p>
            </div>
          )}

          <div className="ed-words">
            {restWords.map((w, i) => (
              <div key={w.id} className="ed-word ed-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <EdCircle src={storyPhoto(content.photos, w.id)} name={w.name} />
                <div>
                  <p className="ed-quote">{w.quote}</p>
                  <p className="ed-who">{w.name}{w.role && <span>{w.role}</span>}</p>
                </div>
              </div>
            ))}
          </div>

          {videos.length > 0 && (
            <div className="ed-videos ed-reveal">
              {videos.map((v, i) => (
                <div key={v.id}>
                  <div className="ed-video"><iframe src={v.embed!} title={`Video testimony ${i + 1}`} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>
                  <p className="ed-video-cap">In their own words</p>
                </div>
              ))}
            </div>
          )}

          <div className="ed-ctas" style={{ marginTop: 40, gap: 28 }}>
            <Link href="/stories" className="ed-link">Read the full stories</Link>
            <Link href="/client-love" className="ed-link">Watch &amp; see — videos and messages</Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-sticky"><img src={photo("home_story")} alt="Libni Fortuna" /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">My story</p>
            <h2 className="ed-display">Hi, I’m Libni.</h2>
            <div className="ed-copy">
              <p>A soul-led mentor here to bring you home — not home as a place, but as the truest version of who you were before the world told you who you had to be. I work with the subconscious, the nervous system and the body, because real change lives in all three.</p>
              <p>My own road wasn’t linear. Single mother. Medical-school dropout. Rebuilt my life more than once — once with nothing. Today I live a life of freedom and abundance, and this work has touched thousands of lives.</p>
            </div>
            <p className="ed-pull">Healing didn’t come from trying harder. It came from remembering who I was beneath survival.</p>
            <p className="ed-sign">Libni</p>
            <p className="ed-creds">US-certified master NLP practitioner · Certified hypnotherapist · Breathwork &amp; somatic facilitator · Reiki · Trauma-informed</p>
            <EdCtas ctas={[{ label: "Read my story", href: "/about", variant: "ghost" }]} />
          </div>
        </div>
      </section>

      {/* ORGANISATIONS & STAGES */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">For organisations &amp; stages</p>
            <h2 className="ed-display">This is not just a talk. <span className="ed-gold">It’s an experience.</span></h2>
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.82)" }}>
              <p>Wellbeing your people actually feel — not a lecture, an experience, with nervous-system tools your team uses on Monday.</p>
              <p>TEDx, summits, TV and intimate rooms. I speak to what’s rarely named but deeply felt.</p>
            </div>
            <EdCtas ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "gold" }, { label: "Explore for teams", href: "/programs/organizations", variant: "light" }, { label: "Stages so far", href: "/speaking", variant: "light" }]} />
          </div>
          <div className="ed-off-right5 ed-reveal" style={{ transitionDelay: ".15s" }}><div className="ed-figure"><img src={photo("home_stage")} alt="Libni on stage" style={{ objectPosition: "50% 40%" }} /></div></div>
        </div>
      </section>


      {/* PODCAST */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The podcast · {podcast.items.length ? `${podcast.items.length} episodes` : "Anyway, Moving Forward"}</p><h2 className="ed-display">Anyway, Moving Forward.</h2></div>
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.8)" }}>
              <p>Real stories, raw reflections and soul-deep conversations about self-love, emotional resilience, heartbreak, and rising again. Truth without the fluff.</p>
              <EdCtas ctas={[
                { label: "Listen on Spotify", href: spotifyUrl, variant: "gold", external: true },
                { label: "Apple Podcasts", href: content.links.applePodcasts || CHANNELS.applePodcasts, variant: "light", external: true },
              ]} />
            </div>
          </div>

          <div className="ed-pod ed-reveal">
            <div>
              {podcastArt || podcast.image ? <img className="ed-pod-art" src={podcastArt || podcast.image} alt="Anyway, Moving Forward" /> : null}
            </div>
            <div>
              <p className="ed-eyebrow" style={{ marginBottom: 6 }}>Latest episodes</p>
              <div className="ed-eps">
                {episodes.map((ep) => (
                  <a key={ep.url} className="ed-ep ed-ep-text" href={ep.url} target="_blank" rel="noreferrer">
                    <span>
                      {ep.number && <span className="ed-ep-n">Episode {ep.number}</span>}
                      <h4>{ep.title}</h4>
                      {ep.guest && <span className="ed-ep-guest">with {ep.guest}</span>}
                      <span className="ed-ep-date">{fmtDate(ep.date)}</span>
                    </span>
                  </a>
                ))}
                {episodes.length === 0 && content.podcast.slice(0, 4).map((ep) => (
                  <a key={ep.id} className="ed-ep ed-ep-text" href={ep.url} target="_blank" rel="noreferrer"><span><h4>{ep.title}</h4>{ep.blurb && <span className="ed-ep-date">{ep.blurb}</span>}</span></a>
                ))}
              </div>
              <p style={{ marginTop: 32 }}><Link href="/podcast" className="ed-link" style={{ borderBottomColor: "var(--ed-gold)" }}>All episodes, guests &amp; interviews</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* PODCAST FEATURES — as a guest */}
      {guestPods.length > 0 && (
        <section className="ed-sec ed-night" style={{ paddingTop: 0 }}>
          <div className="ed-wrap">
            <div className="ed-head ed-reveal" style={{ paddingTop: "clamp(48px, 6vw, 88px)", borderTop: "1px solid var(--ed-line-light)" }}>
              <div><p className="ed-eyebrow">Podcast features · as a guest</p><h2 className="ed-display">The conversations other hosts invited her into.</h2></div>
              <div className="ed-stack-sm">
                <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>Bare It All, The Break Down, Behind the Scenes with Ynna, Life Over Whiskey and more.</p>
                <EdCtas ctas={[{ label: "All features — podcasts, TV, press", href: "/features", variant: "light" }]} />
              </div>
            </div>
            <div className="ed-press ed-reveal">{guestPods.map((p) => <PressCard key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
          </div>
        </section>
      )}

      {/* WRITINGS */}
      {(posts.length > 0 || content.writings.length > 0) && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">Write-ups &amp; letters · Substack</p><h2 className="ed-display">Words for the road home.</h2></div>
              <div className="ed-stack-sm">
                <p className="ed-lede ed-muted">Essays and reflections, published as they’re written.</p>
                <EdCtas ctas={[{ label: "All write-ups", href: "/writings", variant: "ink" }, { label: "Read on Substack", href: substack, variant: "ghost", external: true }]} />
              </div>
            </div>
            <div className="ed-reveal">
              {(posts.length > 0 ? posts.map((w) => ({ id: w.url, title: w.title, url: w.url, blurb: w.blurb, date: fmtDate(w.date) })) : content.writings.slice(0, 4)).map((w, i) => (
                <a key={w.id} className="ed-post" href={w.url} target="_blank" rel="noreferrer">
                  <span className="ed-episode-n">{String(i + 1).padStart(2, "0")}</span>
                  <div><h4>{w.title}</h4>{w.blurb && <p>{w.blurb}</p>}</div>
                  <span className="ed-episode-go">{w.date || "Read"}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LETTERS */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c4 ed-reveal"><EdGuideCover /></div>
          <div className="ed-c8 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Letters from Libni · free guide</p>
            <h2 className="ed-display-md">Soft reminders. Honest reflections. A gentle nudge home.</h2>
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.75)" }}>
              <p>Once in a while, a letter that meets you where you are. No noise. Unsubscribe anytime. You’ll also get my free guide — <em>Come Home to Yourself: 5 Practices to Begin Your Return</em>.</p>
            </div>
            <div className="ed-form"><NewsletterForm dark /></div>
          </div>
        </div>
      </section>

      <EdFinal
        title="Maybe the next chapter isn’t about adding another layer —"
        gold="but taking some off."
        copy={["Until you meet the person underneath."]}
        ctas={[{ label: "Work with me 1:1", href: "/programs/the-becoming", variant: "gold" }, { label: "Say hello first", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
