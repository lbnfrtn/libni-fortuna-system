import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdFinal, offerMeta, opensInNewTab, tx } from "@/app/components/Editorial";
import { OFFERS } from "@/config/offers";
import { PROGRAMS } from "@/config/programs";
import { getContent, talkPhotos } from "@/lib/content";
import { photoFor } from "@/config/site-slots";
import { PhotoMarquee } from "@/app/components/Engagements";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work with me — Libni Fortuna",
  description:
    "Private mentorship, group work, in-person experiences, and work for organisations and brands. Different ways to come home to yourself.",
};

// A clean, boxed card per program — photo, name, one line, who it's for, one door in.
function PillLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  if (external || href.startsWith("http") || href.startsWith("#")) {
    return (
      <a className="ww-pill" href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  if (opensInNewTab(href)) return <Link className="ww-pill" href={href} target="_blank" rel="noreferrer">{children}</Link>;
  return <Link className="ww-pill" href={href}>{children}</Link>;
}

function ProgramCard({ slug, tag, cta, image }: { slug: string; tag: string; cta: string; image: string }) {
  const o = OFFERS[slug];
  const p = PROGRAMS[slug];
  const name = o.name;
  const desc = tx(p?.tagline || o.blurb);
  const forYou = p?.forYou?.[0] ? tx(p.forYou[0]) : undefined;
  const { href, external } = offerMeta(slug);
  return (
    <article className="ww-card ed-reveal" id={slug}>
      <div className="ww-cimg">
        <img src={image} alt={name} loading="lazy" />
        <span className="ww-ctag">{tag}</span>
      </div>
      <div className="ww-cbody">
        <h3>{name}</h3>
        <p className="ww-desc">{desc}</p>
        {forYou && (
          <div className="ww-foryou">
            <span>For you if</span>
            <em>{forYou}</em>
          </div>
        )}
        <PillLink href={href} external={external}>{cta}</PillLink>
      </div>
    </article>
  );
}

// Real experience / stage photos, so the galleries show even before the Studio is filled.
const EXP_FALLBACK = [
  "/photos/liberate/retreat-3.jpg", "/photos/liberate/inside-2.jpg", "/photos/liberate/retreat-2.jpg",
  "/photos/liberate/inside-5.jpg", "/photos/liberate/retreat-4.jpg", "/photos/liberate/retreat-5.jpg",
  "/photos/liberate/retreat-6.jpg", "/photos/liberate/moments-1.jpg",
];
const STAGE_FALLBACK = [
  "/photos/stage-tedx.jpg", "/photos/libni-stage.jpg", "/photos/stage-goalgetters.jpg",
  "/photos/stage-dove.jpg", "/photos/stage-retreat.jpg", "/photos/libni-portrait.jpg", "/photos/libni-hero.jpg",
];

export default async function WorkWithMe() {
  const content = await getContent();
  const photo = (id: string, fallback: string) => photoFor(content.photos, id) || fallback;

  // Galleries: the Studio's engagement/stage photos, else the real fallbacks above.
  const stages = ["stage_1", "stage_2", "stage_3", "stage_4", "stage_5", "stage_6", "stage_7", "stage_8"]
    .map((id) => photoFor(content.photos, id)).filter((u): u is string => Boolean(u));
  const rooms = [...new Set([...content.talks.flatMap((t) => talkPhotos(content.photos, t)), ...stages])];
  const studioExp = [...new Set(["founders-circle", "workshops", "private-studio", "private-experiences"]
    .flatMap((slug) => [1, 2, 3, 4].map((n) => content.photos[`prog_${slug}_${n}`])).filter(Boolean))] as string[];
  const expPhotos = studioExp.length >= 3 ? studioExp : EXP_FALLBACK;
  const stagePhotos = rooms.length >= 3 ? rooms : STAGE_FALLBACK;

  const pm = PROGRAMS["project-me"];
  const pmFeats = (pm?.includes ?? []).map(tx);
  const pmDetails = pm?.details ?? [];

  return (
    <SitePage navOverlay>
      {/* HERO */}
      <section className="ww-hero">
        <div className="ww-hero-img"><img src={photo("offer_hero", "/photos/libni-hero.jpg")} alt="Libni Fortuna" /></div>
        <p className="ed-eyebrow">Work with me</p>
        <h1 className="ed-display">Come home to yourself.</h1>
        <p className="ww-hero-sub">There are different ways to do this work.</p>
      </section>

      {/* CHOOSER */}
      <section className="ed-sec-sm ed-ivory ww-chooser">
        <div className="ed-wrap">
          <div className="ww-chooser-lead ed-reveal">
            <p className="ed-eyebrow">Where would you like to start?</p>
            <h2 className="ed-display-md" style={{ marginTop: 12 }}>Four doors in.</h2>
          </div>
          <nav className="ww-doors ed-reveal" aria-label="Ways to work with Libni">
            <a className="ww-door" href="#personal"><i>01</i><b>Personal support</b><span>Just you and me →</span></a>
            <a className="ww-door" href="#community"><i>02</i><b>In community</b><span>Held by a circle →</span></a>
            <a className="ww-door" href="#experiences"><i>03</i><b>An experience</b><span>A few hours or a day →</span></a>
            <a className="ww-door" href="#organisations"><i>04</i><b>For my team or brand</b><span>Bring it to your people →</span></a>
          </nav>
        </div>
      </section>

      {/* 01 · PRIVATE */}
      <section className="ed-sec ed-ivory" id="personal">
        <div className="ed-wrap">
          <div className="ww-shead ed-reveal">
            <p className="ed-eyebrow">01 · Private work</p>
            <h2 className="ed-display">Personal support, directly from me.</h2>
            <p className="ed-lede ed-muted">Just you and me — direct, personal, and deep.</p>
          </div>
          <div className="ww-grid g2">
            <ProgramCard slug="the-becoming" tag="1:1 · 12 weeks" cta="Explore The Becoming" image={photo("offer_the_becoming", "/photos/liberate-libni-warm.jpg")} />
            <ProgramCard slug="ignite" tag="1:1 · 90 minutes" cta="Book a Power Hour" image={photo("offer_ignite", "/photos/liberate-libni-thought.jpg")} />
          </div>
        </div>
      </section>

      {/* 02 · COMMUNITY */}
      <section className="ed-sec ed-linen" id="community">
        <div className="ed-wrap">
          <div className="ww-shead ed-reveal">
            <p className="ed-eyebrow">02 · Group work</p>
            <h2 className="ed-display">Transformation, in community.</h2>
            <p className="ed-lede ed-muted">Held by others — over a season, or one immersive stretch.</p>
          </div>
          <div className="ww-grid g2">
            <ProgramCard slug="liberate" tag="Group · 12 weeks" cta="Explore Liberate" image={photo("offer_liberate", "/photos/liberate/inside-8.jpg")} />
            <ProgramCard slug="essence-retreat" tag="Retreat · 4 days · Siargao" cta="Explore Essence" image={photo("offer_essence", "/photos/liberate/retreat-1.jpg")} />
          </div>
        </div>
      </section>

      {/* 03 · EXPERIENCES */}
      <section className="ed-sec ed-ivory" id="experiences">
        <div className="ed-wrap">
          <div className="ww-shead ed-reveal">
            <p className="ed-eyebrow">03 · Experiences</p>
            <h2 className="ed-display">The work, without the long container.</h2>
            <p className="ed-lede ed-muted">A few hours or a day. In person, with the people you choose.</p>
          </div>
          <div className="ww-gallery ed-reveal"><PhotoMarquee photos={expPhotos} alt="Experiences with Libni" /></div>
          <div className="ww-grid g4">
            <ProgramCard slug="private-studio" tag="2 hours · in person" cta="Book a session" image={photo("offer_private_studio", "/photos/liberate/inside-3.jpg")} />
            <ProgramCard slug="workshops" tag="Live · dated soon" cta="See workshops" image={photo("offer_workshops", "/photos/libni-stage.jpg")} />
            <ProgramCard slug="private-experiences" tag="Bespoke" cta="Design one" image={photo("offer_private_experiences", "/photos/liberate/retreat-6.jpg")} />
            <ProgramCard slug="founders-circle" tag="A recurring table" cta="Join the circle" image={photo("offer_founders", "/photos/liberate-libni-table.jpg")} />
          </div>
        </div>
      </section>

      {/* 04 · ORGANISATIONS & BRANDS */}
      <section className="ed-sec ed-night" id="organisations">
        <div className="ed-wrap">
          <div className="ww-shead ed-reveal">
            <p className="ed-eyebrow">04 · Organisations &amp; brands</p>
            <h2 className="ed-display">Bring the work to your people.</h2>
            <p className="ed-lede" style={{ color: "rgba(251,249,246,.72)" }}>Into organisations, events and teams — and aligned brand collaborations.</p>
          </div>
          <div className="ww-gallery ed-reveal"><PhotoMarquee photos={stagePhotos} rev alt="Libni Fortuna — organisations and stages" /></div>
          <div className="ww-grid g3">
            <ProgramCard slug="organizations" tag="Workshops · The Reset" cta="Enquire for your team" image={photo("offer_organizations", "/photos/stage-dove.jpg")} />
            <ProgramCard slug="speaking" tag="Keynotes · TEDx" cta="Invite me to speak" image={photo("offer_speaking", "/photos/stage-tedx.jpg")} />
            <ProgramCard slug="brands" tag="Partnerships · KOL" cta="Start a conversation" image={photo("offer_brands", "/photos/libni-portrait.jpg")} />
          </div>
        </div>
      </section>

      {/* PROJECT ME */}
      <section className="ed-sec ww-pm" id="project-me">
        <div className="ed-wrap">
          <div className="ww-pm-grid">
            <div className="ww-pm-phone-wrap ed-reveal">
              <div className="ww-pm-glow" />
              <div className="ww-pm-phone"><img src={photo("offer_projectme", "/photos/projectme-screen.jpg")} alt="The Project Me app" /></div>
            </div>
            <div className="ed-reveal">
              <p className="ed-eyebrow">Start on your own</p>
              <h2>Project Me</h2>
              <p className="ww-pm-tag">{tx(pm?.tagline || "A pocket sanctuary. Daily practice, in your hands.")}</p>
              {pm?.intro && <p className="ww-pm-intro">{tx(pm.intro)}</p>}
              {pmFeats.length > 0 && (
                <ul className="ww-pm-feats">
                  {pmFeats.map((f) => <li key={f} className="ww-pm-feat"><span className="dot" />{f}</li>)}
                </ul>
              )}
              {pmDetails.length > 0 && (
                <div className="ww-pm-meta">
                  {pmDetails.map((d) => <div key={d.label}>{d.label}<b>{tx(d.value)}</b></div>)}
                </div>
              )}
              <PillLink href={offerMeta("project-me").href} external>Explore Project Me</PillLink>
            </div>
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
