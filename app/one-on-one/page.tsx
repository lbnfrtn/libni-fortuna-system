import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdWords, EdFinal, EdCtas, tx } from "@/app/components/Editorial";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";
import { getProgram } from "@/config/programs";
import { getOffer } from "@/config/offers";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "1:1 support · Libni Fortuna",
  description: "Private work with Libni Fortuna — a 90-minute Power Hour, or The Becoming, a 12-week 1:1 mentorship. Selective, held, one to one.",
};

export default async function OneOnOne() {
  const content = await getContent();
  const photo = (id: string) => photoFor(content.photos, id)!;
  const becoming = getProgram("the-becoming")!;
  const powerHour = getProgram("ignite")!;
  const ph = getOffer("ignite")!;
  const words = content.stories.slice(0, 3).map((s) => ({ q: s.quote, who: s.name, role: s.role }));

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="Work with me · privately"
        title={<>1:1 <span className="ed-gold">support.</span></>}
        lede="I take a handful of people into private work at a time."
        sub="Two doors. Ninety minutes to move what’s been stuck — or twelve weeks to go to the root and stay there until it’s done. Both are just you and me."
        ctas={[{ label: "Apply for The Becoming", href: "/apply/the-becoming", variant: "gold" }, { label: "Book a Power Hour", href: "/programs/ignite", variant: "light" }]}
        image={photo("oneonone_hero")}
        alt="Libni Fortuna"
      />

      <section className="ed-sec ed-plum">
        <div className="ed-wrap ed-statement">
          <p className="ed-eyebrow ed-reveal">How I work privately</p>
          <h2 className="ed-reveal" style={{ marginTop: 18 }}>Not a program. <span className="ed-gold">A relationship.</span></h2>
          <div className="ed-intro ed-reveal" style={{ transitionDelay: ".2s" }}>
            <p className="ed-lede">Private work with me isn’t a course you move through. It’s being met — exactly where you are — and going beneath the mindset into the subconscious, the nervous system and the body, because that’s where the pattern actually lives.</p>
          </div>
        </div>
      </section>

      {/* 01 · THE BECOMING */}
      <section className="ed-sec ed-ivory" id="the-becoming">
        <div className="ed-wrap ed-oneone">
          <div className="ed-reveal"><img className="ed-oneone-img" src={photo("oneonone_becoming")} alt="The Becoming — 1:1 mentorship" /></div>
          <div className="ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">01 · The deepest work I offer</p>
            <h2 className="ed-display">The Becoming</h2>
            <p className="ed-lede">{tx(becoming.tagline)}</p>
            <div className="ed-copy"><p>{tx(becoming.intro)}</p></div>
            {becoming.forYou && (
              <>
                <p className="ed-eyebrow" style={{ marginTop: 8 }}>For you if</p>
                <ul className="ed-list">{becoming.forYou.map((f) => <li key={f}>{tx(f)}</li>)}</ul>
              </>
            )}
            <p className="ed-oneone-price"><span>Investment</span><b>By application</b><em>12 weeks · weekly 1:1 sessions · support between</em></p>
            <EdCtas ctas={[{ label: "Apply for The Becoming", href: "/apply/the-becoming", variant: "ink" }, { label: "Read the full page", href: "/programs/the-becoming", variant: "ghost" }]} />
          </div>
        </div>
      </section>

      {/* 02 · POWER HOUR */}
      <section className="ed-sec ed-linen" id="power-hour">
        <div className="ed-wrap ed-oneone rev">
          <div className="ed-reveal"><img className="ed-oneone-img" src={photo("oneonone_powerhour")} alt="Power Hour — a 90-minute private session" /></div>
          <div className="ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">02 · One conversation</p>
            <h2 className="ed-display">{ph.name}</h2>
            <p className="ed-lede">{tx(powerHour.tagline)}</p>
            <div className="ed-copy"><p>{tx(powerHour.intro)}</p></div>
            {powerHour.includes && (
              <>
                <p className="ed-eyebrow" style={{ marginTop: 8 }}>Includes</p>
                <ul className="ed-list">{powerHour.includes.map((f) => <li key={f}>{tx(f)}</li>)}</ul>
              </>
            )}
            <p className="ed-oneone-price"><span>Investment</span><b>{peso(ph.pricePHP!)}</b><em>90 minutes · online or in person · pay &amp; book</em></p>
            <EdCtas ctas={[{ label: "Book your session", href: "/programs/ignite#book", variant: "ink" }, { label: "Read the full page", href: "/programs/ignite", variant: "ghost" }]} />
          </div>
        </div>
      </section>

      {/* WHICH DOOR */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Which door?</p><h2 className="ed-display">Start where you are.</h2></div>
            <p className="ed-lede ed-muted">Some people come once and that’s enough. Others discover they want to go deeper. Either way, this is where it begins.</p>
          </div>
          <div className="ed-levels ed-reveal">
            <div className="ed-level"><i>90 min</i><h3>Power Hour</h3><p>One pattern, seen clearly. You leave lighter, with your next honest step. {peso(ph.pricePHP!)} — pay, then choose your time.</p></div>
            <div className="ed-level"><i>12 wks</i><h3>The Becoming</h3><p>Sustained, weekly 1:1 work with me, and practices that hold you between sessions. By application — we talk first, honestly, about whether it’s right.</p></div>
            <div className="ed-level"><i>?</i><h3>Not sure</h3><p>Take the 60-second quiz, or write to me. I’ll tell you plainly which door I’d open for you.</p><p style={{ marginTop: 14 }}><Link href="/quiz" className="ed-link">Take the quiz</Link> · <Link href="/contact" className="ed-link">Write to me</Link></p></div>
          </div>
        </div>
      </section>

      {words.length > 0 && (
        <section className="ed-sec ed-linen">
          <div className="ed-wrap"><EdWords items={words} note={<Link href="/client-love" className="ed-link">More client love</Link>} /></div>
        </section>
      )}

      <EdFinal
        title="Ready to be met?"
        gold="Let’s begin, one to one."
        copy={["Apply for The Becoming and we’ll talk first. Or book a Power Hour and I’ll see you in ninety minutes."]}
        ctas={[{ label: "Apply for The Becoming", href: "/apply/the-becoming", variant: "gold" }, { label: "Book a Power Hour", href: "/programs/ignite", variant: "light" }]}
      />
    </SitePage>
  );
}
