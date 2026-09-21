import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdOffer, EdFinal, tx } from "@/app/components/Editorial";
import { OFFERS } from "@/config/offers";
import { PROGRAMS } from "@/config/programs";
import { PHOTOS, img } from "@/config/media";

export const dynamic = "force-dynamic";

function Row({ n, slug, tag, image, featured, priceNote, tagline }: { n: string; slug: string; tag: string; image?: string; featured?: boolean; priceNote?: string; tagline?: string }) {
  return <EdOffer n={n} slug={slug} tag={tag} tagline={tagline ?? tx(PROGRAMS[slug].tagline)} copy={OFFERS[slug].blurb} image={image} featured={featured} priceNote={priceNote} />;
}

export default function WorkWithMe() {
  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Work with me"
        title="Every way in."
        lede="One framework, different doors. Start where you are — a single session, a daily practice, or the deepest work I offer."
        ctas={[{ label: "Take the 60-second quiz", href: "/quiz", variant: "ink" }, { label: "Help me choose", href: "/start", variant: "ghost" }]}
      />

      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Start here</p><h2 className="ed-display-md">Two gentle first steps.</h2></div>
          </div>
          <div className="ed-offers">
            <Row n="01" slug="ignite" tag="90 minutes · private · online or in person" image="/photos/liberate-libni-thought.jpg" />
            <Row n="02" slug="project-me" tag="The app · daily practice" />
          </div>
        </div>
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Go deepest</p><h2 className="ed-display-md">When you’re ready to go to the root.</h2></div>
            <p className="ed-lede ed-muted">Sustained work with the subconscious, the nervous system and the body — held 1:1, or in a small circle.</p>
          </div>
          <div className="ed-offers">
            <Row n="03" slug="liberate" featured tag="3 months · small group · next intake October 2026" tagline="For the soul-led ones ready to let go of the weight and come home to their power." image="/photos/libni-portrait.jpg" priceNote="or 3 instalments" />
            <Row n="04" slug="the-becoming" tag="12 weeks · 1:1 mentorship" image="/photos/liberate-libni-warm.jpg" priceNote="or 3 monthly payments" />
          </div>
        </div>
      </section>

      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Immersive &amp; in person</p><h2 className="ed-display-md">Step away. Come home.</h2></div>
          </div>
          <div className="ed-offers">
            <Row n="05" slug="essence-retreat" tag="4 days · Siargao · maximum 20" image={img(PHOTOS.essence, 900)} />
            <Row n="06" slug="private-studio" tag="2 hours · in person · your group" />
            <Row n="07" slug="workshops" tag="Live · dated as announced" />
            <Row n="08" slug="founders-circle" tag="A recurring table · small circle" />
            <Row n="09" slug="private-experiences" tag="Bespoke · designed around you" />
          </div>
        </div>
      </section>

      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">For organisations &amp; brands</p><h2 className="ed-display-md">Bring the work to your people.</h2></div>
            <p className="ed-lede" style={{ color: "rgba(251,249,246,.7)" }}>Not a lecture — an experience, with tools your team actually uses on Monday.</p>
          </div>
          <div className="ed-offers">
            <Row n="10" slug="organizations" tag="Workshops · retreats · The Reset" />
            <Row n="11" slug="speaking" tag="Keynotes · TEDx · summits" image={PHOTOS.stage} />
            <Row n="12" slug="brands" tag="Partnerships · KOL collaborations" />
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
