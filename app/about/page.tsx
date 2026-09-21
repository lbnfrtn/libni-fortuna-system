import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdFinal, EdCtas } from "@/app/components/Editorial";
import { PHOTOS } from "@/config/media";

export const dynamic = "force-dynamic";

const HOW = [
  ["The subconscious", "NLP, hypnotherapy and the beliefs underneath the beliefs — the ones you picked up before you were old enough to choose them."],
  ["The nervous system", "Somatic work and breathwork, so your body can feel safe enough to finally let go."],
  ["Energy", "Reiki, meditation and sound — returning to balance through gentle, embodied practice."],
  ["The inner child", "Jungian and inner-child work, meeting the parts of you that learned to shapeshift to stay safe."],
];

const BELIEFS = [
  "You are not a problem to be solved. You are a person to be remembered.",
  "Safety in the body comes before insight in the mind.",
  "Depth, not hustle. Presence, not performance.",
  "Transformation is tender work — it deserves to be held, not rushed.",
];

export default function About() {
  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="About"
        title="I help people come home to themselves."
        lede="Transformational mentor. TEDx speaker. Experience curator. Founder of the Essence Retreat."
        sub="My work lives where coaching meets the nervous system, the subconscious and the body."
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Say hello", href: "/contact", variant: "light" }]}
        image="/photos/liberate-libni-table.jpg"
        alt="Libni Fortuna"
        objectPosition="50% 20%"
      />

      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-sticky ed-figure-34"><img src="/photos/liberate-libni-thought.jpg" alt="Libni Fortuna" /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">My story</p>
            <h2 className="ed-display">Real healing isn’t about becoming someone new.</h2>
            <div className="ed-copy ed-longcopy">
              <p>Every day I work with visionaries, leaders, founders and cycle-breakers who have built successful lives but still feel disconnected within. Together we go beyond mindset and into the roots — the subconscious, the nervous system, the body — to create change that lasts. Because real healing isn’t about becoming someone new. It’s about remembering who you’ve always been.</p>
              <p>My own journey wasn’t linear. I was a single mother, a medical-school dropout, and I rebuilt my life more than once — once with nothing. Today I live a life of freedom and abundance, and the work I do has touched thousands of lives.</p>
            </div>
            <p className="ed-pull">Through every challenge, I discovered that healing didn’t come from trying harder — it came from remembering who I was beneath survival.</p>
            <div className="ed-copy"><p>Today, that is the work I dedicate my life to.</p></div>
            <p className="ed-sign">Libni</p>
          </div>
        </div>
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">How I work</p><h2 className="ed-display">Your mind, body and energy — together.</h2></div>
            <p className="ed-lede ed-muted">Life and energy coaching, NLP, hypnotherapy, somatic and nervous-system work, breathwork, meditation and Reiki, alongside Jungian and inner-child healing.</p>
          </div>
          <div className="ed-index">
            {HOW.map(([t, d], i) => (
              <div className="ed-item ed-reveal" key={t} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure"><img src={PHOTOS.stage} alt="Libni on stage" style={{ objectPosition: "50% 40%" }} /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">What I believe</p>
            <ul className="ed-stack-sm">
              {BELIEFS.map((b, i) => (
                <li key={i} className="ed-lede" style={{ padding: "22px 0", borderTop: "1px solid var(--ed-line-light)" }}>{b}</li>
              ))}
            </ul>
            <p className="ed-creds" style={{ color: "rgba(251,249,246,.55)" }}>US-certified master NLP practitioner · Certified hypnotherapist · Breathwork &amp; meditation practitioner · Reiki practitioner · Trauma-informed coach · TEDx speaker</p>
            <EdCtas ctas={[{ label: "Invite me to speak", href: "/programs/speaking", variant: "light" }]} />
          </div>
        </div>
      </section>

      <EdFinal
        title="You don’t need to become someone else."
        gold="You need the freedom to be yourself."
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Explore Liberate", href: "/liberate", variant: "light" }]}
      />
    </SitePage>
  );
}
