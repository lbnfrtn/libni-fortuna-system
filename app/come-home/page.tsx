import type { Metadata } from "next";
import { SitePage } from "@/app/components/Chrome";
import { EdFinal } from "@/app/components/Editorial";
import { getOffer } from "@/config/offers";
import { peso } from "@/lib/util";
import { CheckoutForm, StickyBuy, Butterfly } from "./ComeHomeClient";
import "./come-home.css";

// Come Home to Yourself — the workbook + guided meditation. Every line of copy
// on this page is taken from the workbook itself (Libni's words).

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL || "https://libni.co"),
  title: "Come Home to Yourself · Workbook + Guided Meditation · Libni Fortuna",
  description: "5 practices for anyone who has lost themselves in love, in heartbreak, in burnout, or in giving too much. A 17-page workbook and a 15-minute guided meditation by Libni Fortuna.",
  openGraph: {
    title: "Come Home to Yourself — a workbook + guided meditation by Libni Fortuna",
    description: "5 practices for anyone who has lost themselves in love, in heartbreak, in burnout, or in giving too much.",
    images: [{ url: "/photos/come-home/cover.jpg", width: 1240, height: 1754 }],
  },
};

const PRACTICES = [
  { n: "01", area: "The body", title: "Arrive in Your Body", line: "Coming home doesn't start with figuring it all out. It starts with arriving." },
  { n: "02", area: "The inner child", title: "Meet the Little You", line: "The little you is still in there. Still waiting for someone to come back for them." },
  { n: "03", area: "The shadow", title: "Name the Part That's Running the Show", line: "The part of you that disappears to keep the peace isn't your enemy. It's a protector." },
  { n: "04", area: "Beliefs & meaning", title: "Rewrite the Story", line: "You can't change what happened. But you can change what you've made it mean." },
  { n: "05", area: "Energy", title: "Call Your Energy Back", line: "When you give too much, you leave little pieces of yourself everywhere." },
];

const PAGES = [
  { src: "/photos/come-home/letter.jpg", cap: "A letter before we begin" },
  { src: "/photos/come-home/practice.jpg", cap: "Five practices, step by step" },
  { src: "/photos/come-home/journal.jpg", cap: "Journal pages for each one" },
  { src: "/photos/come-home/tracker.jpg", cap: "Your 7-day Come-Home tracker" },
];

const RITUAL = [
  { t: "Make it a small ritual", d: "Find 15 to 20 quiet minutes. Phone on silent. Something warm to drink. A pen you like holding." },
  { t: "One practice at a time", d: "Do one practice per sitting, or one a day. You don't have to finish everything at once." },
  { t: "Read, practice, then write", d: "Each practice has a short “why,” simple steps, and journal prompts. Do the steps first, then let the pen move." },
  { t: "Pair it with the audio", d: "Listen first and journal after. It walks you through all five practices." },
  { t: "You're in charge", d: "If anything feels like too much, stop. Open your eyes. Feel your feet on the floor. You can skip, pause, or come back later." },
  { t: "Keep coming back", d: "Use the 7-day tracker at the end. Coming home isn't one big moment. It's a choice you make again and again." },
];

export default function ComeHomePage() {
  const offer = getOffer("come-home")!;
  const price = peso(offer.pricePHP!);

  return (
    <SitePage bare>
      <div className="ch">
        {/* 01 — HERO */}
        <section className="ch-hero">
          <div className="ed-wrap ch-hero-grid">
            <div className="ch-hero-copy">
              <p className="ed-eyebrow">A workbook + guided meditation</p>
              <h1 className="ch-title">Come Home <em>to Yourself</em></h1>
              <span className="ch-rule" aria-hidden />
              <p className="ch-lede">5 practices for anyone who has lost themselves in love, in heartbreak, in burnout, or in giving too much.</p>
              <div className="ch-buy">
                <a className="ed-btn ed-btn-solid" href="#get">Get it for {price}</a>
                <a className="ch-link" href="#inside">Look inside ↓</a>
              </div>
              <ul className="ch-facts">
                <li><b>17</b>page workbook</li>
                <li><b>15</b>minute guided meditation</li>
                <li><b>5</b>practices · 7-day tracker</li>
              </ul>
            </div>

            <div className="ch-stage" aria-hidden>
              <div className="ch-arch" />
              <img className="ch-page-back" src="/photos/come-home/practice.jpg" alt="" />
              <img className="ch-cover" src="/photos/come-home/cover.jpg" alt="Come Home to Yourself workbook cover" />
              <div className="ch-track">
                <span className="ch-bars"><i /><i /><i /><i /><i /></span>
                <span><b>Guided meditation</b><small>Come Home to Yourself · 15 min</small></span>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — THE LETTER */}
        <section className="ed-sec ed-linen ch-letter">
          <div className="ed-wrap ch-letter-grid">
            <figure className="ch-portrait ed-reveal">
              <img src="/photos/libni-portrait.jpg" alt="Libni Fortuna" />
            </figure>
            <div className="ch-letter-copy ed-reveal" style={{ transitionDelay: ".12s" }}>
              <p className="ed-eyebrow">A letter before we begin</p>
              <p className="ch-hi">Hi, love.</p>
              <p className="ch-p">If you found your way here, I&rsquo;m guessing a part of you feels far away from yourself right now.</p>
              <ul className="ch-maybes">
                <li>Maybe you gave so much in a relationship that you forgot what you actually like.</li>
                <li>Maybe a heartbreak cracked something open.</li>
                <li>Maybe you&rsquo;re running on empty from holding everything together.</li>
                <li>Maybe you&rsquo;ve said yes so many times you don&rsquo;t know what your no sounds like anymore.</li>
              </ul>
              <p className="ch-truth">There is nothing wrong with you.</p>
              <p className="ch-p">You didn&rsquo;t lose yourself because you&rsquo;re weak. Somewhere along the way, you learned that to be loved, to be safe, to be good, you had to leave a little of yourself behind.</p>
              <p className="ch-p"><strong>And what was learned can be unlearned.</strong></p>
              <p className="ch-sign">Libni</p>
            </div>
          </div>
        </section>

        {/* 03 — THE FIVE PRACTICES */}
        <section className="ed-sec ed-ivory ch-practices">
          <div className="ed-wrap ch-practices-grid">
            <div className="ch-practices-head ed-reveal">
              <Butterfly className="ch-fly" />
              <p className="ed-eyebrow">The five practices</p>
              <h2 className="ch-h2">Drawn from the way I work.</h2>
              <p className="ch-p">Through the body, the little one inside you, the parts of you that learned to survive, the stories you&rsquo;ve been believing, and your energy.</p>
              <p className="ch-italic">They&rsquo;re not here to fix you. They&rsquo;re here to help you come home.</p>
            </div>
            <ol className="ch-list">
              {PRACTICES.map((p, i) => (
                <li key={p.n} className="ed-reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <span className="ch-num">{p.n}</span>
                  <span>
                    <small>{p.area}</small>
                    <h3>{p.title}</h3>
                    <p>{p.line}</p>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 04 — LOOK INSIDE */}
        <section className="ed-sec ch-inside" id="inside">
          <div className="ed-wrap">
            <div className="ch-inside-head ed-reveal">
              <p className="ed-eyebrow">Look inside</p>
              <h2 className="ch-h2">Read, practice, <em>then write.</em></h2>
              <p className="ch-p">Each practice has a short &ldquo;why,&rdquo; simple steps, and journal prompts. Do the steps first, then let the pen move.</p>
            </div>
            <div className="ch-pages">
              {PAGES.map((p, i) => (
                <figure key={p.src} className="ch-pagecard ed-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <img src={p.src} alt={p.cap} loading="lazy" />
                  <figcaption>{p.cap}</figcaption>
                </figure>
              ))}
            </div>
            <div className="ch-two">
              <div className="ch-thing ed-reveal">
                <p className="ch-k">The workbook · PDF</p>
                <h3>17 pages to come back to.</h3>
                <ul>
                  <li>A letter before we begin</li>
                  <li>Five practices, each with why it matters, the steps, and a gentle note</li>
                  <li>Journal prompts for every practice</li>
                  <li>Your 7-day Come-Home tracker</li>
                  <li>A closing letter</li>
                </ul>
              </div>
              <div className="ch-thing ed-reveal" style={{ transitionDelay: ".12s" }}>
                <p className="ch-k">The guided meditation · MP3</p>
                <h3>15 minutes to listen first.</h3>
                <ul>
                  <li>Listen first and journal after</li>
                  <li>It walks you through all five practices</li>
                  <li>Play it on your download page, or save it to your phone</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — RITUAL */}
        <section className="ed-sec ed-linen ch-ritual">
          <div className="ed-wrap">
            <div className="ch-ritual-head ed-reveal">
              <p className="ed-eyebrow">Before you start</p>
              <h2 className="ch-h2">There&rsquo;s no right way to come home. <em>There&rsquo;s only your way.</em></h2>
            </div>
            <ol className="ch-ritual-grid">
              {RITUAL.map((r, i) => (
                <li key={r.t} className="ed-reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <span className="ch-rn">{i + 1}</span>
                  <h4>{r.t}</h4>
                  <p>{r.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 06 — CHECKOUT */}
        <section className="ed-sec ed-ivory ch-get" id="get">
          <div className="ed-wrap ch-get-grid">
            <div className="ch-get-copy ed-reveal">
              <p className="ed-eyebrow">Begin tonight</p>
              <h2 className="ch-h2">Go slow. Be gentle. <em>Be honest.</em></h2>
              <div className="ch-price"><b>{price}</b><span>one-time · yours to keep</span></div>
              <ul className="ch-includes">
                <li>The <em>Come Home to Yourself</em> workbook (PDF, 17 pages)</li>
                <li>The 15-minute guided meditation (MP3)</li>
                <li>The 7-day Come-Home tracker</li>
                <li>Instant access — your download page opens the moment you&rsquo;ve paid, and the link comes to your inbox too</li>
              </ul>
            </div>
            <div className="ch-form-card ed-reveal" style={{ transitionDelay: ".12s" }}>
              <CheckoutForm price={price} />
            </div>
          </div>
        </section>

        {/* 07 — CARE + QUESTIONS */}
        <section className="ed-sec ed-ivory ch-faq-sec">
          <div className="ed-wrap ed-split ed-split-top ed-reveal">
            <div className="ed-c4">
              <p className="ed-eyebrow">Questions</p>
              <h2 className="ch-h2 ch-h2-sm">A few things you might be wondering.</h2>
            </div>
            <div className="ed-off1 ed-faq">
              <details><summary>How do I get my workbook and meditation?</summary><p className="ed-faq-a">Right after you pay, you&rsquo;ll land on your own download page. I&rsquo;ll also email you the link, so you can come back to it anytime.</p></details>
              <details><summary>How do I pay?</summary><p className="ed-faq-a">Through Xendit&rsquo;s secure checkout — GCash, Maya, QR Ph and the other methods shown there.</p></details>
              <details><summary>Can I listen on my phone?</summary><p className="ed-faq-a">Yes. The meditation is an MP3 — play it right on your download page, or save it to your phone and listen anywhere.</p></details>
              <details><summary>Is this therapy?</summary><p className="ed-faq-a">No. This workbook is a space for reflection and personal growth. It is not therapy, counselling, or medical or psychological treatment, and it doesn&rsquo;t replace them. If you&rsquo;re working with a therapist, counsellor, or doctor, you&rsquo;re welcome to bring what comes up here into your sessions with them. If you are in crisis, you are not alone — the NCMH Crisis Hotline is available 24/7 at <strong>1553</strong>.</p></details>
              <details><summary>What if I want to go deeper?</summary><p className="ed-faq-a">These practices are a doorway. If something opened in you and you&rsquo;d like someone to walk through it with you, this is the work I love doing. <a className="ed-link" href="/work-with-me">See the ways we can work together →</a></p></details>
            </div>
          </div>
        </section>

        <EdFinal
          title="Coming home isn't one big moment."
          gold="It's a choice you make again and again."
          ctas={[{ label: `Get it for ${price}`, href: "#get", variant: "gold" }]}
        />
        <StickyBuy price={price} />
      </div>
    </SitePage>
  );
}
