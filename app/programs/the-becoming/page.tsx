import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdCtas, EdCircle, EdFinal, tx } from "@/app/components/Editorial";
import { getOffer } from "@/config/offers";
import { getProgram } from "@/config/programs";
import { getContent, storyPhoto } from "@/lib/content";
import { photoFor, embedUrl } from "@/config/site-slots";

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

export default async function TheBecoming() {
  const offer = getOffer("the-becoming")!;
  const p = getProgram("the-becoming")!;
  const content = await getContent();
  const photo = (id: string, fallback: string) => photoFor(content.photos, id) || fallback;

  // Real client words only. Stories tagged for The Becoming first; otherwise the featured ones from across the work.
  const becoming = content.stories.filter((s) => /becoming/i.test(s.program ?? ""));
  const words = becoming.length ? becoming : content.stories.filter((s) => s.featured);
  const wordsAreBecoming = becoming.length > 0;
  const videos = ["video_1", "video_2", "video_3"].map((id) => embedUrl(content.videos[id] ?? "")).filter((v): v is string => Boolean(v));
  const gallery = ["becoming_gallery_1", "becoming_gallery_2", "becoming_gallery_3", "becoming_gallery_4"].map((id) => content.photos[id]).filter(Boolean);
  const portal = content.photos.becoming_portal;

  const apply = { label: "Apply for The Becoming", href: "/apply/the-becoming", variant: "gold" as const };

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
          <div className={`bk-gets${portal ? " has-portal" : ""}`}>
            <ul className="bk-get-list ed-reveal">
              {(p.includes ?? []).map((inc, i) => (
                <li key={i}><span className="bk-get-n">{String(i + 1).padStart(2, "0")}</span><span>{tx(inc)}</span></li>
              ))}
            </ul>
            {portal && (
              <figure className="bk-portal ed-reveal" style={{ transitionDelay: ".15s" }}>
                <img src={portal} alt="Your online meditation portal" />
                <figcaption>Your online meditation portal</figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The roadmap</p><h2 className="ed-display">Twelve weeks, five spaces.</h2></div>
            <p className="ed-lede ed-muted">The order matters; the pace is yours. Every week goes a little deeper than the last.</p>
          </div>
          <div className="bk-road ed-reveal">
            {ROADMAP.map((r) => (
              <div className="bk-phase" key={r.phase}>
                <small>{r.phase} · {r.weeks}</small>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
          <div className="bk-arrival ed-reveal">
            <div><small>Week 12 · The arrival</small><h3>Not a new you. The one who was here all along.</h3></div>
            <p>By week twelve the shift isn’t something you have to remember to do. It’s who you are.</p>
          </div>
        </div>
      </section>

      {/* GALLERY — moments from the work, shown once Libni uploads them */}
      {gallery.length > 0 && (
        <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
          <div className="ed-wrap">
            <div className={`ab-gallery ab-gallery-${gallery.length} light ed-reveal`} style={{ marginTop: 0 }}>
              {gallery.map((src, i) => <figure key={src}><img src={src} alt={`The Becoming — moment ${i + 1}`} loading="lazy" /></figure>)}
            </div>
          </div>
        </section>
      )}

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

      {/* WORDS */}
      {words.length > 0 && (
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
                  <div key={v}><div className="ed-video"><iframe src={v} title={`Video testimony ${i + 1}`} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div><p className="ed-video-cap">In their own words</p></div>
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
    </SitePage>
  );
}
