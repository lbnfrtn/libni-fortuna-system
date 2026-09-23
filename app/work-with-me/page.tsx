import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdBtn, EdFinal, offerMeta, tx } from "@/app/components/Editorial";
import { OFFERS } from "@/config/offers";
import { PROGRAMS } from "@/config/programs";
import { PHOTOS, img } from "@/config/media";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work with me — Libni Fortuna",
  description: "Private mentorship, group work, in-person experiences, and work for organisations and brands. Different ways to come home to yourself.",
};

// One offer, the way a map shows it: name, one line, who it's for, one door in.
function offer(slug: string, useBlurb = false) {
  const p = PROGRAMS[slug];
  const o = OFFERS[slug];
  return { name: o.name, desc: tx(useBlurb || !p ? o.blurb : p.tagline), forYou: p?.forYou?.[0] ? tx(p.forYou[0]) : undefined, ...offerMeta(slug) };
}

function Feature({ slug, tag, cta, image, small, flip }: { slug: string; tag: string; cta: string; image?: string; small?: boolean; flip?: boolean }) {
  const x = offer(slug);
  return (
    <div className={`ed-path-feature${small ? " sm" : ""}${flip ? " flip" : ""}${image ? "" : " noimg"} ed-reveal`} id={slug}>
      {image && <div><img src={image} alt={x.name} /></div>}
      <div>
        <p className="ed-eyebrow">{tag}</p>
        <h3>{x.name}</h3>
        <p className="ed-path-desc">{x.desc}</p>
        {x.forYou && <p className="ed-path-for"><b>For you if</b>{x.forYou}</p>}
        <div className="ed-path-cta"><EdBtn href={x.href} variant={small ? "ghost" : "ink"} external={x.external}>{cta}</EdBtn></div>
      </div>
    </div>
  );
}

function Card({ slug, tag, cta, blurb }: { slug: string; tag: string; cta: string; blurb?: boolean }) {
  const x = offer(slug, blurb);
  return (
    <div className="ed-path-card ed-reveal" id={slug}>
      <p className="ed-eyebrow">{tag}</p>
      <h3>{x.name}</h3>
      <p className="ed-path-desc">{x.desc}</p>
      {x.forYou && <p className="ed-path-for"><b>For you if</b>{x.forYou}</p>}
      <p className="ed-path-cta">{x.external ? <a href={x.href} className="ed-link" target="_blank" rel="noreferrer">{cta}</a> : <Link href={x.href} className="ed-link">{cta}</Link>}</p>
    </div>
  );
}

export default async function WorkWithMe() {
  const content = await getContent();
  const photo = (id: string, fallback: string) => photoFor(content.photos, id) || fallback;

  return (
    <SitePage>
      <section className="ed-hero-simple">
        <div className="ed-wrap">
          <p className="ed-eyebrow">Work with me</p>
          <h1 className="ed-display" style={{ marginTop: 18 }}>Come home to yourself.</h1>
          <p className="ed-lede">There are different ways to do this work.</p>
          <ul className="ed-ways ed-reveal">
            <li>You might need one conversation.</li>
            <li>You might be ready for deeper mentorship.</li>
            <li>You might want to experience the work in community.</li>
            <li>Or perhaps you’re looking to bring this work into your organisation.</li>
          </ul>
        </div>
      </section>

      {/* THE MAP */}
      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap">
          <nav className="ed-map ed-reveal" aria-label="Ways to work with Libni">
            <a href="#private"><b>I want personal support</b><span>Private work — The Becoming · Power Hour</span><i>01 →</i></a>
            <a href="#group"><b>I want to do this in community</b><span>Group work — Liberate · Essence</span><i>02 →</i></a>
            <a href="#experiences"><b>I want an experience</b><span>Studio sessions · workshops · private experiences · Founders Circle</span><i>03 →</i></a>
            <a href="#organisations"><b>I want to bring this to my team</b><span>Organisations · speaking · brand partnerships</span><i>04 →</i></a>
          </nav>
        </div>
      </section>

      {/* 01 · PRIVATE WORK */}
      <section className="ed-sec ed-linen" id="private">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">01 · Private work</p><h2 className="ed-display">Personal support, directly from me.</h2></div>
            <p className="ed-lede ed-muted">For people who want direct, personal support — just you and me.</p>
          </div>
          <Feature slug="the-becoming" tag="12-week 1:1 mentorship" cta="Explore The Becoming" image={photo("offer_the_becoming", "/photos/liberate-libni-warm.jpg")} />
          <Feature slug="ignite" tag="A focused private session" cta="Book a Power Hour" small />
        </div>
      </section>

      {/* 02 · GROUP WORK */}
      <section className="ed-sec ed-ivory" id="group">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">02 · Group work</p><h2 className="ed-display">Transformation, in community.</h2></div>
            <p className="ed-lede ed-muted">For people who want to do this work held by others — over a season, or in one immersive stretch.</p>
          </div>
          <Feature slug="liberate" tag="12-week group coaching experience · sustained transformation" cta="Explore Liberate" image={photo("offer_liberate", "/photos/libni-portrait.jpg")} />
          <Feature slug="essence-retreat" tag="Immersive in-person retreat · four days" cta="Explore Essence" image={img(PHOTOS.essence, 900)} small flip />
        </div>
      </section>

      {/* 03 · EXPERIENCES */}
      <section className="ed-sec ed-linen" id="experiences">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">03 · Experiences</p><h2 className="ed-display">Experience the work, without the long container.</h2></div>
            <p className="ed-lede ed-muted">A few hours or a day. In person, with the people you choose.</p>
          </div>
          <div className="ed-path-grid">
            <Card slug="private-studio" tag="2 hours · in person · your group" cta="Book a studio session" />
            <Card slug="workshops" tag="Live · dated as announced" cta="See upcoming workshops" blurb />
            <Card slug="private-experiences" tag="Bespoke · designed with you" cta="Design a private experience" />
            <Card slug="founders-circle" tag="A recurring table · small circle" cta="Join the circle" />
          </div>
        </div>
      </section>

      {/* 04 · ORGANISATIONS & BRANDS */}
      <section className="ed-sec ed-night" id="organisations">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">04 · Organisations &amp; brands</p><h2 className="ed-display">Bring the work to your people.</h2></div>
            <p className="ed-lede" style={{ color: "rgba(251,249,246,.7)" }}>I also bring this work into organisations, events and teams — and into aligned brand collaborations.</p>
          </div>
          <div className="ed-path-grid ed-path-grid-3">
            <Card slug="organizations" tag="Workshops · retreats · The Reset" cta="Enquire for your team" />
            <Card slug="speaking" tag="Keynotes · TEDx · summits" cta="Invite me to speak" />
            <Card slug="brands" tag="Partnerships · KOL collaborations" cta="Start a conversation" />
          </div>
        </div>
      </section>

      {/* SELF-GUIDED */}
      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap">
          <div className="ed-self ed-reveal">
            <div>
              <p className="ed-eyebrow">Want to start on your own?</p>
              <h3>Project Me</h3>
              <p className="ed-path-desc">A daily practice for coming home to yourself.</p>
              <p className="ed-path-for">Breathwork. Meditations. Reflections. Community.</p>
            </div>
            <EdBtn href={offerMeta("project-me").href} variant="ghost" external>Explore Project Me →</EdBtn>
          </div>
        </div>
      </section>

      <EdFinal
        title="Still not sure where to begin?"
        gold="Sixty seconds. Five honest questions."
        copy={["I’ll point you to the right door."]}
        ctas={[{ label: "Take the quiz", href: "/quiz", variant: "gold" }, { label: "Say hello first", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
