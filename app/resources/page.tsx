import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple } from "@/app/components/Editorial";
import NewsletterForm from "@/app/components/NewsletterForm";
import GuideForm from "./GuideForm";
import { CHANNELS } from "@/config/channels";

export const dynamic = "force-dynamic";

const CHANNEL_ROWS = [
  ["The podcast", "Anyway, Moving Forward", "Real stories, raw reflections and soul-deep conversations about self-love, emotional resilience, heartbreak, and rising again. Truth without the fluff.", CHANNELS.spotify, "Listen in"],
  ["The blog", "Letters & reflections", "Quiet invitations to pause, reflect and return to yourself. For when you’re longing for slower, deeper, truer.", CHANNELS.substack, "Read the blog"],
];

export default function Resources() {
  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Resources"
        title="Soft reminders. Gentle truths."
        lede="Words, practices and conversations that meet you where you are — start whenever you’re ready, no cost."
      />

      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-sticky"><img src="/photos/liberate-libni-warm.jpg" alt="Libni Fortuna" /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">A free gift</p>
            <h2 className="ed-display-md">Come Home to Yourself: 5 Practices to Begin Your Return.</h2>
            <div className="ed-copy">
              <p>The same practices I use inside my private work — breathwork, reflection and nervous-system tools you can start tonight. No cost. No catch. Just a beginning.</p>
            </div>
            <div className="ed-form"><GuideForm /></div>
            <p className="ed-note">You’ll also receive my letters — soft reminders and honest reflections. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Listen &amp; read</p><h2 className="ed-display-md">Conversations for the road home.</h2></div>
          </div>
          <div className="ed-index">
            {CHANNEL_ROWS.map(([k, t, d, href, cta], i) => (
              <div className="ed-item ed-reveal" key={t} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <p className="ed-eyebrow" style={{ marginBottom: 10 }}>{k}</p>
                  <h3>{t}</h3>
                  <p>{d}</p>
                  <a className="ed-link" href={href} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 18 }}>{cta}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-sec ed-night" id="newsletter">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Letters from Libni</p>
            <h2 className="ed-display-md">Soft reminders. Honest reflections. A gentle nudge home.</h2>
            <p className="ed-copy" style={{ color: "rgba(251,249,246,.75)" }}>Once in a while, a letter that meets you where you are. No noise. Unsubscribe anytime.</p>
          </div>
          <div className="ed-off1 ed-form ed-reveal" style={{ transitionDelay: ".15s" }}><NewsletterForm dark /></div>
        </div>
      </section>
    </SitePage>
  );
}
