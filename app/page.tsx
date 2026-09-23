import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdFinal, EdOffer, EdCtas, EdCircle, EdGuideCover, EdLogos, EdVideo } from "@/app/components/Editorial";
import NewsletterForm from "@/app/components/NewsletterForm";
import { getContent, storyPhoto, byDateDesc } from "@/lib/content";
import { photoFor, resolveVideo } from "@/config/site-slots";
import { getPodcast, fmtDate } from "@/lib/feeds";
import { CHANNELS } from "@/config/channels";
import { previewMap } from "@/lib/preview";
import { PressCard } from "@/app/components/Features";

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
  const podcast = await getPodcast();
  const spotifyUrl = content.links.spotify || CHANNELS.spotify;
  const substack = content.links.substack || CHANNELS.substack;
  const episodes = podcast.items.slice(0, 3);
  // Libni picks and orders these in the Studio ("Home page order"); until she does, the six most recent.
  const handPicked = content.press.filter((p) => Number(p.featured) > 0).sort((a, b) => Number(a.featured) - Number(b.featured));
  const featuredIn = handPicked.length ? handPicked : [...content.press].sort(byDateDesc).slice(0, 6);
  const prev = await previewMap(featuredIn.map((p) => p.url));
  const picked = content.stories.filter((s) => s.featured);
  const [featured, ...restWords] = (picked.length ? picked : content.stories).slice(0, 3);
  // Video testimonies — appear here once Libni pastes YouTube/Vimeo links in the Studio.
  const videos = ["video_1", "video_2", "video_3"].map((id) => content.videos[id] ?? "").filter((u) => resolveVideo(u));

  const heroCredentials = [
    { num: "1,000+", label: "People guided" },
    { num: "TEDx", label: "Speaker · 2024" },
    { num: "100+", label: "Experiences & engagements" },
    { num: "PH · AU", label: "Where the work has travelled" },
  ];

  return (
    <SitePage navOverlay>
      {/* 1 · HERO */}
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="Life Strategist · Transformational mentor · TEDx speaker · Experience curator"
        title="Come home to yourself."
        lede="You’ve held everyone together. Who’s been holding you?"
        sub="There’s a version of you — whole, free, fully alive — beneath everything you carry. I’ve guided 1,000+ people back to her. There are different ways in; let’s find yours."
        ctas={[{ label: "Work with me 1:1", href: "/programs/the-becoming", variant: "gold" }, { label: "Find your path", href: "/start", variant: "solid" }]}
        image={photo("home_hero")!}
        alt="Libni Fortuna"
        credentials={heroCredentials}
      />

      {/* 2 · PROOF */}
      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap ed-reveal" style={{ marginBottom: 28 }}>
          <p className="ed-eyebrow" style={{ textAlign: "center" }}>As seen on · trusted by</p>
        </div>
        <EdLogos />
      </section>

      {/* 3 · I SEE YOU */}
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

      {/* 4 · THE FRAMEWORK */}
      <section className="ed-sec ed-plum">
        <div className="ed-wrap ed-statement">
          <p className="ed-eyebrow ed-reveal">How I work</p>
          <h2 className="ed-reveal" style={{ marginTop: 18 }}>This isn’t a pep talk you’ll forget by Monday.<br /><span className="ed-gold">It’s a path your body can actually follow.</span></h2>
          <div className="ed-intro ed-reveal" style={{ transitionDelay: ".2s" }}>
            <p className="ed-lede">I work with the subconscious, the nervous system and the body — because real change lives in all three. Every way of working with me moves through the same five spaces.</p>
          </div>
        </div>
      </section>
      <section className="ed-sec ed-linen" style={{ paddingTop: "clamp(56px, 7vw, 96px)" }}>
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The framework</p><h2 className="ed-display">Awareness → Safety → Release → Reconnection → Embodiment.</h2></div>
            <p className="ed-lede ed-muted">One philosophy beneath everything. The order matters; the pace is yours.</p>
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

      {/* 5 · FIND YOUR WAY IN */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Find your way in</p><h2 className="ed-display">One philosophy. Different ways in.</h2></div>
            <p className="ed-lede ed-muted">Start where you are. Not sure which door? <Link href="/start" style={{ borderBottom: "1px solid var(--ed-gold)" }}>Find your path</Link> and I’ll point you to the right one.</p>
          </div>
          <div className="ed-offers">
            <EdOffer n="01" slug="the-becoming" featured tag="Come with me · 3 months · 1:1" tagline="My deepest private container." copy="Twelve weeks of sustained 1:1 work — energy work, shadow work, inner-child healing, the subconscious, the nervous system and the body. We stop circling the pattern and meet what’s underneath, together." image={photo("offer_the_becoming")} />
            <EdOffer n="02" slug="ignite" tag="Come for a moment · 90 minutes · private" tagline="One focused conversation to move what’s been stuck." copy="One honest, held conversation that moves what’s been stuck for months. You’ll leave clearer, lighter, and with a real next step." image={photo("offer_ignite")} />
            <EdOffer n="03" slug="liberate" tag="Come with others · next intake October 2026" tagline="For the soul-led ones ready to let go of the weight and come home to their power." copy="A 3-month transformational group coaching experience for people ready to break free from emotional patterns, people-pleasing, overthinking, and the quiet exhaustion of holding it all together." image={photo("offer_liberate")} priceLabel="Group coaching experience" />
            <EdOffer n="04" slug="project-me" tag="Come practice on your own · the app" tagline="A pocket sanctuary. Daily practice, in your hands." copy="Tell it how you feel and it walks you through — something to listen to, a way to breathe, a place to write it out." image={photo("offer_project_me")} phone />
          </div>
          <p style={{ marginTop: 32 }}><Link href="/work-with-me" className="ed-link">All pathways — experiences, organisations and speaking</Link></p>
        </div>
      </section>

      {/* 6 · CLIENT STORIES */}
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
            <div className="ed-videos ed-reveal" style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
              {videos.map((v, i) => (
                <div key={v}>
                  <EdVideo url={v} title={`Video testimony ${i + 1}`} />
                  <p className="ed-video-cap">In their own words</p>
                </div>
              ))}
            </div>
          )}

          <div className="ed-ctas" style={{ marginTop: 40, gap: 28 }}>
            <Link href="/client-love" className="ed-link">More client stories — videos and messages</Link>
          </div>
        </div>
      </section>

      {/* 7 · MY STORY */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-sticky"><img src={photo("home_story")} alt="Libni Fortuna" /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">My story</p>
            <h2 className="ed-display">Hi, I’m Libni.</h2>
            <div className="ed-copy">
              <p>A soul-led mentor here to bring you home — not home as a place, but as the truest version of who you were before the world told you who you had to be.</p>
              <p>My own road wasn’t linear. Single mother. Medical-school dropout. Rebuilt my life more than once — once with nothing. Today I live a life of freedom and abundance, and this work has touched thousands of lives.</p>
            </div>
            <p className="ed-pull">Healing didn’t come from trying harder. It came from remembering who I was beneath survival.</p>
            <p className="ed-sign">Libni</p>
            <p className="ed-creds">Master NLP practitioner · Certified hypnotherapist · Breathwork &amp; somatic facilitator · TEDx speaker</p>
            <EdCtas ctas={[{ label: "Read my story", href: "/about", variant: "ghost" }]} />
          </div>
        </div>
      </section>

      {/* 8 · ORGANISATIONS & SPEAKING */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Organisations &amp; speaking</p>
            <h2 className="ed-display">This is not just a talk. <span className="ed-gold">It’s an experience.</span></h2>
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.82)" }}>
              <p><b style={{ color: "var(--ed-ivory)", fontWeight: 600 }}>On stage</b> — TEDx, summits, TV and intimate rooms. I speak to what’s rarely named but deeply felt.</p>
              <p><b style={{ color: "var(--ed-ivory)", fontWeight: 600 }}>Inside organisations</b> — wellbeing your people actually feel. Not a lecture: an experience, with nervous-system tools your team uses on Monday.</p>
            </div>
            <EdCtas ctas={[{ label: "Invite me to speak", href: "/speaking", variant: "gold" }, { label: "Bring this to your team", href: "/programs/organizations", variant: "light" }]} />
          </div>
          <div className="ed-off-right5 ed-reveal" style={{ transitionDelay: ".15s" }}><div className="ed-figure"><img src={photo("home_stage")} alt="Libni on stage" style={{ objectPosition: "50% 40%" }} /></div></div>
        </div>
      </section>

      {/* 9 · COMING HOME EXPERIENCES */}
      <section className={experiencesImg ? "ed-band" : "ed-final"} style={experiencesImg ? undefined : { textAlign: "left", paddingTop: "clamp(90px, 12vw, 150px)", paddingBottom: "clamp(90px, 12vw, 150px)" }}>
        {experiencesImg && <img src={experiencesImg} alt="Coming Home experiences" />}
        <div className="ed-wrap ed-reveal">
          <p className="ed-eyebrow">Coming Home experiences</p>
          <h2 style={{ marginTop: 16, fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.02, maxWidth: "18ch", marginLeft: 0, marginRight: 0 }}>Gather. Breathe. Come back to yourself — in person.</h2>
          <p className="ed-lede" style={{ maxWidth: "34ch", marginTop: 22, color: "rgba(251,249,246,.85)" }}>Soundbaths, breathwork rituals, private circles, Essence and bespoke retreats — curated around you and the people you bring.</p>
          <EdCtas
            ctas={[
              { label: "Discover experiences", href: "/experiences", variant: "gold" },
              ...(content.events.length > 0 ? [{ label: "Upcoming events", href: "/experiences#upcoming", variant: "light" as const }] : []),
            ]}
            className="ed-ctas"
          />
        </div>
      </section>

      {/* 10 · FEATURED */}
      {featuredIn.length > 0 && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">As seen, heard &amp; featured</p><h2 className="ed-display">Where the conversation has travelled.</h2></div>
              <div className="ed-stack-sm">
                <p className="ed-lede ed-muted">Television, guest podcast conversations and national publications.</p>
                <EdCtas ctas={[{ label: "See all features", href: "/features", variant: "ghost" }]} />
              </div>
            </div>
            <div className="ed-press ed-press-lead ed-reveal">{featuredIn.map((p) => <PressCard key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
          </div>
        </section>
      )}

      {/* 11 · LISTEN & READ */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Listen &amp; read · my own podcast</p><h2 className="ed-display">Anyway, Moving Forward.</h2></div>
            <div className="ed-stack-sm">
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.8)" }}>Real stories, raw reflections and soul-deep conversations about self-love, emotional resilience, heartbreak, and rising again.</p>
              <EdCtas ctas={[{ label: "Listen on Spotify", href: spotifyUrl, variant: "gold", external: true }, { label: "Apple Podcasts", href: content.links.applePodcasts || CHANNELS.applePodcasts, variant: "light", external: true }]} />
            </div>
          </div>

          <div className="ed-pod ed-reveal">
            <div>
              {podcastArt || podcast.image ? <img className="ed-pod-art" src={podcastArt || podcast.image} alt="Anyway, Moving Forward" /> : null}
            </div>
            <div>
              <p className="ed-eyebrow" style={{ marginBottom: 6 }}>Latest episodes</p>
              <div className="ed-eps" style={{ gridTemplateColumns: "1fr" }}>
                {episodes.map((ep) => (
                  <a key={ep.url} className="ed-ep ed-ep-text" href={ep.url} target="_blank" rel="noreferrer">
                    <span>
                      {ep.number && <span className="ed-ep-n">Episode {ep.number}</span>}
                      <h4>{ep.title}</h4>
                      <span className="ed-ep-date">{fmtDate(ep.date)}</span>
                    </span>
                  </a>
                ))}
                {episodes.length === 0 && content.podcast.slice(0, 3).map((ep) => (
                  <a key={ep.id} className="ed-ep ed-ep-text" href={ep.url} target="_blank" rel="noreferrer"><span><h4>{ep.title}</h4></span></a>
                ))}
              </div>
              <div className="ed-ctas" style={{ marginTop: 32, gap: 28 }}>
                <Link href="/podcast" className="ed-link" style={{ borderBottomColor: "var(--ed-gold)" }}>All episodes &amp; guests</Link>
                <Link href="/writings" className="ed-link" style={{ borderBottomColor: "var(--ed-gold)" }}>Letters &amp; blog</Link>
                <a href={substack} className="ed-link" target="_blank" rel="noreferrer" style={{ borderBottomColor: "var(--ed-gold)" }}>Substack</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LETTERS */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split">
          <div className="ed-c4 ed-reveal"><EdGuideCover /></div>
          <div className="ed-c8 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Letters from Libni · free guide</p>
            <h2 className="ed-display-md">Soft reminders. Honest reflections. A gentle nudge home.</h2>
            <div className="ed-copy">
              <p>Once in a while, a letter that meets you where you are. No noise. Unsubscribe anytime. You’ll also get my free guide — <em>Come Home to Yourself: 5 Practices to Begin Your Return</em>.</p>
            </div>
            <div className="ed-form"><NewsletterForm /></div>
          </div>
        </div>
      </section>

      {/* 12 · FINAL CTA */}
      <EdFinal
        title="Maybe the next chapter isn’t about adding another layer —"
        gold="but taking some off."
        copy={["You don’t have to figure out the next step alone."]}
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Say hello", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
