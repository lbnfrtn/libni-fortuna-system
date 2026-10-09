import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdCtas, EdCircle, EdFinal, EdVideo, tx } from "@/app/components/Editorial";
import { getOffer } from "@/config/offers";
import { getProgram } from "@/config/programs";
import { getContent, storyPhoto } from "@/lib/content";
import { photoFor, resolveVideo } from "@/config/site-slots";
import OneOnOneProof from "@/app/components/OneOnOneProof";
import BecomingJourney, { type JourneyStop } from "@/app/components/BecomingJourney";
import LifeWheel, { type WheelArea } from "@/app/components/LifeWheel";
import StickyApply from "@/app/components/StickyApply";
import { ONE_ON_ONE_STORIES, shotsFor } from "@/config/one-on-one-proof";
import { BOOKING } from "@/config/channels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Becoming — 12-week 1:1 mentorship with Libni Fortuna",
  description: "My deepest private container. Twelve weeks of sustained 1:1 work with the mind, body, soul and emotions — weekly sessions, your own meditation portal, real-time support between sessions.",
};

// The four places the work happens. Each maps to what we actually do there.
const REALMS: [string, string, string][] = [
  ["Mind", "Subconscious patterns, NLP, hypnotherapy", "The beliefs underneath the beliefs — the ones you picked up before you were old enough to choose them."],
  ["Body", "Nervous system, somatics, breathwork", "So your body can feel safe enough to finally let go, instead of bracing through another season."],
  ["Soul", "Identity, energy work, meditation", "Who you were before the world told you who to be — and what your life wants to look like now."],
  ["Emotion", "Feeling what was suppressed, held", "The grief, the anger, the ache you couldn’t name. Felt all the way through, with someone beside you."],
];

// Twelve weeks through the five spaces the whole practice moves through.
const ROADMAP: { phase: string; weeks: string; title: string; body: string }[] = [
  { phase: "01", weeks: "Weeks 1–2", title: "Awareness", body: "We map the pattern you’ve been living inside — where it shows up, what it costs, what it protects." },
  { phase: "02", weeks: "Weeks 3–4", title: "Safety", body: "Before anything can move, the body has to feel safe. Nervous-system work and breath, so there’s room to feel." },
  { phase: "03", weeks: "Weeks 5–7", title: "Release", body: "We go to the root — subconscious, somatic, emotional — and put down what was never yours to carry." },
  { phase: "04", weeks: "Weeks 8–10", title: "Reconnection", body: "You come back to your own voice, your boundaries, your wants. Decisions start coming from a different place." },
  { phase: "05", weeks: "Weeks 11–12", title: "Embodiment", body: "The shift stops being something you remember to do. It’s who you are — and we build the life that can hold her." },
];

// The roadmap, as an interactive journey — the five phases plus the arrival as a final stop you can tap through.
const JOURNEY: JourneyStop[] = [
  ...ROADMAP,
  { phase: "12", weeks: "Week 12", title: "The one who was here all along.", body: "Not a new you. By week twelve the shift isn’t something you have to remember to do — it’s who you are. You make decisions from a different place, and the life you’ve built can finally hold her.", arrival: true },
];

// Real 1:1 moments from her Instagram highlight — Zoom sessions and the first time meeting a client in person.
// Replaced the moment Libni uploads her own in the Studio.
const GALLERY_FALLBACK = ["/photos/one-on-one/sessions/river.jpg", "/photos/one-on-one/sessions/cafe.jpg", "/photos/one-on-one/sessions/nadia.jpg", "/photos/one-on-one/sessions/zoom.jpg"];

// One private client's own life-wheel scores, six weeks apart (April 29 → June 10), exactly as Libni shared them.
const WHEEL: WheelArea[] = [
  { label: "Health", before: 5, after: 10 }, { label: "Career", before: 5, after: 7 }, { label: "Love", before: 1, after: 8 }, { label: "Spirituality", before: 1, after: 6 },
  { label: "Family", before: 5, after: 8 }, { label: "Money", before: 3, after: 7 }, { label: "Fun", before: 5, after: 9 }, { label: "Friends", before: 5, after: 10 },
];
// What changed for her, in Libni's words from that same post.
const WHEEL_OUTCOMES = [
  "More money — the by-product of self work, clarity and clearing off energies",
  "Bigger opportunities, based on what you desire",
  "More self-discipline and consistency",
  "Healthier body, clearer communication",
  "Desires manifesting",
  "More self-love, on a deeper level",
  "Spirituality unlocked, and a deeper understanding of how energy works",
];
// The faces under the hero — real 1:1 clients whose words are on this page.
const FACES = [
  ["/photos/one-on-one/posters/jana.jpg", "Jana"], ["/photos/one-on-one/posters/zyra.jpg", "Zyra"], ["/photos/one-on-one/posters/hannah.jpg", "Hannah"],
  ["/photos/one-on-one/posters/yokie.jpg", "Yokie"], ["/photos/one-on-one/posters/mika.jpg", "Mika"], ["/photos/one-on-one/posters/nadia.jpg", "Nadia"],
  ["/photos/one-on-one/posters/dane.jpg", "Dane"],
];

export default async function TheBecoming() {
  const offer = getOffer("the-becoming")!;
  const p = getProgram("the-becoming")!;
  const content = await getContent();
  const photo = (id: string, fallback: string) => photoFor(content.photos, id) || fallback;

  // Real client words only. Stories tagged for The Becoming first; otherwise the featured ones from across the work.
  const becoming = content.stories.filter((s) => /becoming/i.test(s.program ?? ""));
  const words = becoming.length ? becoming : content.stories.filter((s) => s.featured);
  const wordsAreBecoming = becoming.length > 0;
  const videos = ["video_1", "video_2", "video_3"].map((id) => content.videos[id] ?? "").filter((u) => resolveVideo(u));

  // The Becoming's own series — case studies (with an arc) and shorter testimonies (quote only). Separate from the shared stories.
  const hasSeries = content.becomingStories.length > 0;
  const uploadedGallery = ["becoming_gallery_1", "becoming_gallery_2", "becoming_gallery_3", "becoming_gallery_4"].map((id) => content.photos[id]).filter(Boolean);
  const gallery = uploadedGallery.length ? uploadedGallery : GALLERY_FALLBACK;
  const portal = content.photos.becoming_portal;

  // Applications go to Libni's Tally form for now (her call, 2026-10-09). Opens in a new tab.
  const apply = { label: "Apply for The Becoming", href: BOOKING.tallyBecoming, variant: "gold" as const, external: true };

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="1:1 mentorship · 12 weeks"
        title={offer.name}
        lede={tx(p.tagline)}
        sub={tx(p.intro)}
        meta={{ label: "Investment", value: "By application" }}
        ctas={[apply, { label: "Talk to me first", href: "/contact", variant: "light" }]}
        image={photo("becoming_hero", "/photos/liberate-libni-warm.jpg")}
        alt="The Becoming — 1:1 mentorship with Libni Fortuna"
      />

      {/* FACES — the people whose words are on this page */}
      <section className="ed-ivory" style={{ paddingTop: 8 }}>
        <div className="ed-wrap">
          <div className="bk-faces ed-reveal">
            <div className="bk-faces-row">{FACES.map(([src, name]) => <img key={name} src={src} alt={name} loading="lazy" />)}</div>
            <p>Jana, Zyra, Hannah, Yokie, Mika, Nadia, Dane.<span>Real 1:1 clients · in their own words below</span></p>
            <Link href="#in-their-words" className="ed-link">Hear from them</Link>
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c4 ed-reveal">
            <p className="ed-eyebrow">The story</p>
            <h2 className="ed-display-md" style={{ marginTop: 14 }}>Not a program. A relationship.</h2>
            <div className="ed-figure ed-figure-34" style={{ marginTop: 28 }}><img src={photo("becoming_portrait", "/photos/liberate-libni-thought.jpg")} alt="Libni Fortuna" /></div>
          </div>
          <div className="ed-off1 ed-copy ed-reveal" style={{ transitionDelay: ".15s" }}>
            {(p.longCopy ?? []).map((para, i) => <p key={i} style={{ fontSize: "clamp(17px, 1.9vw, 20px)" }}>{tx(para)}</p>)}
          </div>
        </div>
      </section>

      {/* THE SHIFT, MEASURED — one client's life wheel, six weeks apart */}
      <section className="ed-sec ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The shift, measured</p><h2 className="ed-display">Six weeks in. <span className="ed-plum-text">Scored by her, not by me.</span></h2></div>
            <p className="ed-lede ed-muted">A private 1:1 client&rsquo;s own life-wheel check-in, April 29 to June 10 — exactly as Libni shared it. Watch it move, or tap Before and After.</p>
          </div>
          <div className="ed-reveal">
            <LifeWheel areas={WHEEL} beforeLabel="April 29" afterLabel="June 10" />
          </div>
          <div className="ed-reveal" style={{ marginTop: "clamp(28px, 3.5vw, 48px)" }}>
            <p className="ed-eyebrow">What changed for her — in Libni&rsquo;s words</p>
            <ul className="lw-outcomes">{WHEEL_OUTCOMES.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* WHY I CREATED THIS — meet Libni, why work with me */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal">
            <div className="ed-figure ed-figure-sticky ed-figure-34"><img src={photo("becoming_about", "/photos/liberate-libni-table.jpg")} alt="Libni Fortuna" /></div>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Why I created The Becoming</p>
            <h2 className="ed-display-md">I built this for the work I love most — guiding people, all the way through.</h2>
            <div className="ed-copy">
              <p>I&rsquo;ve been a lot of people. A daughter, a mother, a single mom, a corporate leader, an entrepreneur — a woman who has built things, lost things, questioned things, and had to start again. I don&rsquo;t do this work because I have life figured out. I do it because I&rsquo;ve lived enough versions of myself to know what happens when we keep forcing ourselves into a life we&rsquo;ve already outgrown.</p>
              <p>I created The Becoming because what I really wanted was to <em>guide</em> people — not from a stage, not for a single hour, but all the way through. Twelve weeks, just us, going to the root together. It&rsquo;s the deepest, most personal work I offer, and the work I was made for.</p>
            </div>
            <p className="ed-pull">I don&rsquo;t want to sit above the people I work with. I want to sit across from them.</p>
            <div className="bk-trust">
              <div><b>1,000+</b><span>Lives impacted</span></div>
              <div><b>TEDx</b><span>Speaker · 2024</span></div>
              <div><b>2023</b><span>The work began</span></div>
              <div><b>A few</b><span>1:1 clients at a time</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* MIND · BODY · SOUL · EMOTION */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Where the work happens</p><h2 className="ed-display">Mind. Body. Soul. <span className="ed-gold">Emotion.</span></h2></div>
            <p className="ed-lede" style={{ color: "rgba(251,249,246,.8)" }}>Most work touches one of these. Twelve weeks together lets us work all four — because the pattern lives in all four.</p>
          </div>
          <div className="bk-realms ed-reveal">
            <svg className="bk-ring" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(251,249,246,.14)" strokeWidth="1" />
              <circle cx="200" cy="200" r="96" fill="none" stroke="rgba(251,249,246,.14)" strokeWidth="1" />
              <circle cx="200" cy="200" r="42" fill="none" stroke="#d8c39a" strokeWidth="1" />
              <line x1="200" y1="50" x2="200" y2="350" stroke="rgba(251,249,246,.14)" strokeWidth="1" />
              <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(251,249,246,.14)" strokeWidth="1" />
              <text x="200" y="205" textAnchor="middle" fill="#d8c39a" fontFamily="var(--ed-serif)" fontSize="16" fontStyle="italic">you</text>
              <text x="200" y="36" textAnchor="middle" fill="#fbf9f6" fontFamily="var(--ed-sans)" fontSize="11" letterSpacing="3">MIND</text>
              <text x="200" y="378" textAnchor="middle" fill="#fbf9f6" fontFamily="var(--ed-sans)" fontSize="11" letterSpacing="3">BODY</text>
              <text x="26" y="204" textAnchor="middle" fill="#fbf9f6" fontFamily="var(--ed-sans)" fontSize="11" letterSpacing="3">SOUL</text>
              <text x="372" y="204" textAnchor="middle" fill="#fbf9f6" fontFamily="var(--ed-sans)" fontSize="11" letterSpacing="3">EMOTION</text>
            </svg>
            <div className="bk-realm-list">
              {REALMS.map(([t, tools, body], i) => (
                <div className="bk-realm" key={t}>
                  <span className="bk-realm-n">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3>{t}</h3><small>{tools}</small><p>{body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">What you get</p><h2 className="ed-display">Held for the whole season, not just the hour.</h2></div>
            <p className="ed-lede ed-muted">Everything inside the container, from the first session to the last.</p>
          </div>
          <div className="bk-get-grid">
            {(p.includes ?? []).map((inc, i) => {
              // Card 2 is the portal: her mock-up wins over the stock photo once uploaded.
              const src = (i === 1 && portal) || photo(`becoming_get_${i + 1}`, "");
              return (
                <figure key={i} className="bk-get-card ed-reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                  {src && <img src={src} alt="" loading="lazy" />}
                  <figcaption><span className="bk-get-n">{String(i + 1).padStart(2, "0")}</span><span>{tx(inc)}</span></figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The roadmap</p><h2 className="ed-display">Twelve weeks, five spaces.</h2></div>
            <p className="ed-lede ed-muted">The order matters; the pace is yours. Move through it — hover or tap each stop to feel where the work goes.</p>
          </div>
          <BecomingJourney stops={JOURNEY} />
        </div>
      </section>

      {/* GALLERY — real 1:1 moments: Zoom sessions, and meeting clients in person */}
      {gallery.length > 0 && (
        <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">From Zoom calls to meeting in real life</p><h2 className="ed-display-md">What 1:1 with Libni actually looks like.</h2></div>
              <p className="ed-lede ed-muted">Weekly sessions wherever you are in the world — and, when the time is right, a table for two.</p>
            </div>
            <div className={`ab-gallery ab-gallery-${gallery.length} light ed-reveal`} style={{ marginTop: "clamp(28px, 3.5vw, 48px)" }}>
              {gallery.map((src, i) => <figure key={src}><img src={src} alt={`1:1 with Libni — moment ${i + 1}`} loading="lazy" /></figure>)}
            </div>
          </div>
        </section>
      )}

      {/* PROOF — moved up, right under the roadmap */}
      <section className="ed-sec ed-linen" id="in-their-words">
        <div className="ed-wrap">
          <OneOnOneProof
            stories={ONE_ON_ONE_STORIES}
            shots={shotsFor("becoming")}
            eyebrow="From 1:1 clients"
            title={<>Twelve weeks, just us. <span className="ed-plum-text">Here&rsquo;s what it did for them.</span></>}
          />
        </div>
      </section>

      {/* NOT FOR EVERYBODY — the honest filter */}
      <section className="ed-sec ed-plum">
        <div className="ed-wrap">
          <div className="bk-filter">
            <div className="ed-reveal">
              <p className="ed-eyebrow">An honest word before you apply</p>
              <h2 className="ed-display" style={{ marginTop: 14 }}>This work isn&rsquo;t for everybody.</h2>
              <div className="ed-copy" style={{ color: "rgba(251,249,246,.82)", marginTop: 24 }}>
                <p>And I say that with love. This is my deepest container, and holding it takes a lot of me — so I choose carefully who I take in. It has to be a yes on both sides.</p>
                <p>Because this work will push you to choose <em>you</em>. And choosing yourself has a cost.</p>
              </div>
            </div>
            <div>
              <ul className="bk-cost">
                <li className="ed-reveal">You may lose some people.</li>
                <li className="ed-reveal" style={{ transitionDelay: ".1s" }}>You may outgrow rooms you used to belong to.</li>
                <li className="ed-reveal" style={{ transitionDelay: ".2s" }}>You may disappoint the version of you that kept everyone comfortable.</li>
                <li className="ed-reveal" style={{ transitionDelay: ".3s" }}>And you will finally <em>choose you.</em></li>
              </ul>
            </div>
          </div>
          <p className="bk-filter-lede ed-reveal" style={{ marginTop: "clamp(32px, 4vw, 56px)", maxWidth: "72ch" }}>
            That&rsquo;s not the work going wrong. That&rsquo;s the work. The Becoming is for those who are ready — ready to tell the truth, ready to stop performing okay, ready for the next step of who they&rsquo;re becoming.
          </p>
          <div className="ed-reveal" style={{ marginTop: 32 }}>
            <EdCtas ctas={[{ ...apply, variant: "gold" }]} />
          </div>
        </div>
      </section>

      {/* FOR YOU IF */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal">
            <p className="ed-eyebrow">This is for you if</p>
            <div className="ed-index ed-index-1">
              {(p.forYou ?? []).map((f, i) => (
                <div key={i} className="ed-item"><div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div><div><h3 style={{ fontSize: "clamp(20px, 2vw, 26px)", marginBottom: 0 }}>{tx(f)}</h3></div></div>
              ))}
            </div>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-pull">I only take a handful of people into this at a time. It has to be a yes on both sides.</p>
            <div className="ed-copy"><p>If you read the story above and felt it in your chest — that’s usually the sign. You don’t need to arrive with a five-year plan. You just need to be willing to tell the truth.</p></div>
            <EdCtas ctas={[{ ...apply, variant: "ink" }]} />
          </div>
        </div>
      </section>

      {/* WORDS — the shared stories, only until The Becoming has its own series */}
      {!hasSeries && words.length > 0 && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap">
            <div className="ed-feature ed-reveal">
              <div>
                <p className="ed-eyebrow" style={{ marginBottom: 24 }}>{wordsAreBecoming ? "From inside The Becoming" : "Real people. Real shifts."}</p>
                <p className="ed-quote">{words[0].quote}</p>
                <div className="ed-who-row">
                  <EdCircle src={storyPhoto(content.photos, words[0].id)} name={words[0].name} size={64} />
                  <p className="ed-who">{words[0].name}{words[0].role && <span>{words[0].role}</span>}</p>
                </div>
              </div>
              <p className="ed-lede ed-muted" style={{ maxWidth: "24ch" }}>{wordsAreBecoming ? "Words from people who have done this exact work, one to one." : "Words from people who have done this work with Libni. Not reviews. Turning points."}</p>
            </div>
            {words.length > 1 && (
              <div className="ed-words">
                {words.slice(1).map((w, i) => (
                  <div key={w.id} className="ed-word ed-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                    <EdCircle src={storyPhoto(content.photos, w.id)} name={w.name} />
                    <div><p className="ed-quote">{w.quote}</p><p className="ed-who">{w.name}{w.role && <span>{w.role}</span>}</p></div>
                  </div>
                ))}
              </div>
            )}
            {videos.length > 0 && (
              <div className="ed-videos ed-reveal" style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
                {videos.map((v, i) => (
                  <div key={v}><EdVideo url={v} title={`Video testimony ${i + 1}`} /><p className="ed-video-cap">In their own words</p></div>
                ))}
              </div>
            )}
            <p style={{ marginTop: 40 }}><Link href="/client-love" className="ed-link">More client stories</Link></p>
          </div>
        </section>
      )}

      {/* THREE STEPS */}
      {p.how && (
        <section className="ed-sec ed-night">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">How it works</p><h2 className="ed-display-md">Three honest steps.</h2></div>
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>Apply, we talk, and if it’s a yes on both sides, we begin.</p>
            </div>
            <div className="ed-steps ed-reveal">
              {p.how.map((s, i) => <div key={i} className="ed-step"><small>Step 0{i + 1}</small><h4>{tx(s.t)}</h4><p>{tx(s.d)}</p></div>)}
            </div>
          </div>
        </section>
      )}

      {/* DETAILS · FAQ · PEACE OF MIND */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-stack" style={{ gap: "clamp(48px, 6vw, 80px)" }}>
          {p.details && (
            <div className="ed-tiles ed-reveal">
              {p.details.map((d, i) => <div key={i} className="ed-tile"><b>{tx(d.value)}</b><span>{tx(d.label)}</span></div>)}
              <div className="ed-tile"><b>By application</b><span>Investment</span></div>
            </div>
          )}
          {p.faq && (
            <div className="ed-split ed-split-top ed-reveal">
              <div className="ed-c4"><p className="ed-eyebrow">Good to know</p></div>
              <div className="ed-off1 ed-faq">
                {p.faq.map((f, i) => <details key={i}><summary>{tx(f.q)}</summary><p className="ed-faq-a">{tx(f.a)}</p></details>)}
              </div>
            </div>
          )}
          {offer.refundNote && (
            <div className="ed-split ed-split-top ed-reveal">
              <div className="ed-c4"><p className="ed-eyebrow">Peace of mind</p></div>
              <p className="ed-off1 ed-note">{offer.refundNote}</p>
            </div>
          )}
        </div>
      </section>

      <EdFinal
        title="The Becoming."
        gold="Ready when you are."
        copy={["Twelve weeks. Just you and me. Everything you carry, finally set down."]}
        meta={[["Investment", "By application"], ["Length", "12 weeks"], ["Format", "1:1"]]}
        ctas={[apply, { label: "Say hello first", href: "/contact", variant: "light" }]}
      />
      <StickyApply href={apply.href} label="Apply" note="The Becoming · 12 weeks, just us" />
    </SitePage>
  );
}
