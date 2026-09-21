import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdOffer, EdWords, EdFinal, EdCtas, tx } from "@/app/components/Editorial";
import { OFFERS } from "@/config/offers";
import { PROGRAMS } from "@/config/programs";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";

export const dynamic = "force-dynamic";

const WORDS = [
  { q: "Essence created a space of deep connection, safety, and belonging. I discovered a new way of seeing myself and a new way of living.", who: "Nadia Montenegro", role: "Actress · Mother · Businesswoman" },
  { q: "I came with the intention to release and remember, and that’s exactly what happened. I let go of the trauma I’d been carrying and reconnected with who I truly am.", who: "Pepe Herrera", role: "Actor" },
  { q: "I came thinking I was okay. I left realizing I wasn’t. What I found was healing, hope, and a deeper understanding of myself.", who: "King Fortuna", role: "Businessman" },
];

function Row({ n, slug, tag, image, featured }: { n: string; slug: string; tag: string; image?: string; featured?: boolean }) {
  return <EdOffer n={n} slug={slug} tag={tag} tagline={tx(PROGRAMS[slug].tagline)} copy={OFFERS[slug].blurb} image={image} featured={featured} />;
}

export default async function Experiences() {
  const content = await getContent();
  const bannerImg = photoFor(content.photos, "home_experiences");

  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Coming Home experiences"
        title="Gather. Breathe. Come back to yourself."
        lede="Soundbaths, breathwork rituals, private circles and bespoke retreats — held in person, never rushed."
        ctas={[{ label: "Book a private experience", href: "/apply/private-experiences", variant: "ink" }, ...(content.events.length > 0 ? [{ label: "Upcoming events", href: "#upcoming", variant: "ghost" as const }] : [])]}
      />

      {content.events.length > 0 && (
        <section className="ed-sec ed-linen" id="upcoming">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">What’s next</p><h2 className="ed-display">Upcoming events.</h2></div>
              <p className="ed-lede ed-muted">Dates open to everyone. Seats are always limited.</p>
            </div>
            <div className="ed-reveal">
              {content.events.map((e, i) => (
                <a key={e.id} className="ed-episode" href={e.url} target="_blank" rel="noreferrer">
                  <span className="ed-episode-n">{String(i + 1).padStart(2, "0")}</span>
                  <div><h4>{e.title}</h4>{e.blurb && <p>{e.blurb}</p>}</div>
                  <span className="ed-episode-go">{e.date || "Details"}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={bannerImg ? "ed-band" : "ed-final"} style={bannerImg ? undefined : { textAlign: "left" }}>
        {bannerImg && <img src={bannerImg} alt="A Coming Home experience" />}
        <div className="ed-wrap ed-reveal">
          <p className="ed-eyebrow">In person</p>
          <h2 style={{ marginTop: 16, marginLeft: 0, marginRight: 0 }}>Some things can’t be talked through. They have to be lived.</h2>
          <p className="ed-lede" style={{ maxWidth: "34ch", marginTop: 20, color: "rgba(251,249,246,.85)" }}>Bring your people, or come alone and leave with a room full of them.</p>
          <EdCtas ctas={[{ label: "Design something private", href: "/apply/private-experiences", variant: "light" }]} className="ed-ctas" />
        </div>
      </section>

      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Ways to gather</p><h2 className="ed-display-md">Book an experience.</h2></div>
            <p className="ed-lede ed-muted">Private, or with a circle of people also ready to slow down.</p>
          </div>
          <div className="ed-offers">
            <Row n="01" slug="private-studio" featured tag="2 hours · soundbath & breathwork · your group" />
            <Row n="02" slug="private-experiences" tag="Bespoke · designed around you" />
            <Row n="03" slug="workshops" tag="Live workshops & trainings · dated as announced" />
            <Row n="04" slug="founders-circle" tag="A recurring table · small circle of founders" />
            <Row n="05" slug="essence-retreat" tag="The 4-day retreat · next dates to be announced" />
          </div>
        </div>
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <EdWords eyebrow="From the room" items={WORDS} note="Words from people who have been in these rooms. Not reviews. Turning points." />
        </div>
      </section>

      <EdFinal
        title="You don’t need a holiday."
        gold="You need somewhere your nervous system can finally stop bracing."
        ctas={[{ label: "Book a private experience", href: "/apply/private-experiences", variant: "gold" }, { label: "Say hello first", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
