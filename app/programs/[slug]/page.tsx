import { notFound, redirect } from "next/navigation";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdWords, EdFinal, tx } from "@/app/components/Editorial";
import { getOffer, isSellable } from "@/config/offers";
import { getProgram } from "@/config/programs";
import { img } from "@/config/media";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

// Real portraits where the mood image in config/media is only a stand-in.
const REAL_PHOTO: Record<string, string> = {
  ignite: "/photos/libni-portrait.jpg",
  "the-becoming": "/photos/liberate-libni-warm.jpg",
  speaking: "/photos/libni-stage.jpg",
  organizations: "/photos/libni-stage.jpg",
  brands: "/photos/liberate-libni-dark.jpg",
  "founders-circle": "/photos/liberate-libni-table.jpg",
  "private-studio": "/photos/libni-portrait.jpg",
  workshops: "/photos/libni-hero.jpg",
};

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "liberate") redirect("/liberate");
  const offer = getOffer(slug);
  const p = getProgram(slug);
  if (!offer || !p) notFound();

  const waitlist = offer.waitlistOnly || offer.pricePHP == null;
  const sellable = isSellable(offer);
  const trackLabel = offer.track === "consumer" ? "Work with me" : offer.track === "corporate" ? "For organisations" : "For brands";
  const cta =
    offer.journey === "D" ? { label: "Enquire", href: `/apply/${slug}` }
    : waitlist ? { label: "Apply / join the waitlist", href: `/apply/${slug}` }
    : offer.journey === "B" ? { label: "Apply now", href: `/apply/${slug}` }
    : { label: "Begin", href: `/apply/${slug}` };
  const priceLabel = offer.hidePrice ? "By application" : sellable ? `${peso(offer.pricePHP!)}${offer.priceUnit ? " · " + offer.priceUnit : ""}` : offer.journey === "D" ? "By proposal" : "By application";
  const photo = REAL_PHOTO[slug] ?? img(p.photo, 1400);
  const paras = (p.longCopy ?? []).map(tx);

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow={trackLabel}
        title={offer.name}
        lede={tx(p.tagline)}
        sub={tx(p.intro)}
        meta={{ label: "Investment", value: priceLabel }}
        ctas={[{ label: cta.label, href: cta.href, variant: "gold" }, { label: "Talk to me first", href: "/contact", variant: "light" }]}
        image={photo}
        alt={offer.name}
        objectPosition={slug === "speaking" || slug === "organizations" ? "50% 40%" : undefined}
      />

      {paras.length > 0 && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap ed-split ed-split-top">
            <div className="ed-c4 ed-reveal">
              <p className="ed-eyebrow">The story</p>
              <h2 className="ed-display-md" style={{ marginTop: 14 }}>{tx(p.tagline)}</h2>
            </div>
            <div className="ed-off1 ed-copy ed-longcopy ed-reveal" style={{ transitionDelay: ".15s" }}>
              {paras.map((para, i) => <p key={i} style={{ fontSize: "clamp(17px, 1.9vw, 20px)" }}>{para}</p>)}
            </div>
          </div>
        </section>
      )}

      {p.testimonial && (
        <section className="ed-sec ed-linen">
          <div className="ed-wrap"><EdWords eyebrow="In their words" items={[p.testimonial]} /></div>
        </section>
      )}

      {(p.forYou || p.includes) && (
        <section className={`ed-sec ${p.testimonial ? "ed-ivory" : "ed-linen"}`}>
          <div className="ed-wrap ed-split ed-split-top">
            {p.forYou && (
              <div className="ed-c6 ed-reveal">
                <p className="ed-eyebrow" style={{ marginBottom: 24 }}>This is for you if</p>
                <div className="ed-index ed-index-1">
                  {p.forYou.map((f, i) => (
                    <div key={i} className="ed-item"><div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div><div><h3 style={{ fontSize: "clamp(20px, 2vw, 26px)", marginBottom: 0 }}>{tx(f)}</h3></div></div>
                  ))}
                </div>
              </div>
            )}
            {p.includes && (
              <div className={`${p.forYou ? "ed-off-right5" : "ed-c8"} ed-reveal`} style={{ transitionDelay: ".15s" }}>
                <p className="ed-eyebrow" style={{ marginBottom: 24 }}>What’s included</p>
                <ul className="ed-list">{p.includes.map((f, i) => <li key={i}>{tx(f)}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      )}

      {p.how && (
        <section className="ed-sec ed-night">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">How it works</p><h2 className="ed-display-md">Three honest steps.</h2></div>
            </div>
            <div className="ed-steps ed-reveal">
              {p.how.map((s, i) => (
                <div key={i} className="ed-step"><small>Step 0{i + 1}</small><h4>{tx(s.t)}</h4><p>{tx(s.d)}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(p.details || p.faq || offer.refundNote) && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap ed-stack" style={{ gap: "clamp(48px, 6vw, 80px)" }}>
            {p.details && (
              <div className="ed-tiles ed-reveal">
                {p.details.map((d, i) => <div key={i} className="ed-tile"><b>{tx(d.value)}</b><span>{tx(d.label)}</span></div>)}
              </div>
            )}
            {p.faq && (
              <div className="ed-split ed-split-top ed-reveal">
                <div className="ed-c4"><p className="ed-eyebrow">Good to know</p></div>
                <div className="ed-off1 ed-faq">
                  {p.faq.map((f, i) => (
                    <details key={i}><summary>{tx(f.q)}</summary><p className="ed-faq-a">{tx(f.a)}</p></details>
                  ))}
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
      )}

      <EdFinal
        title={offer.name + "."}
        gold="Ready when you are."
        meta={[["Investment", priceLabel]]}
        ctas={[{ label: cta.label, href: cta.href, variant: "gold" }, { label: "Say hello first", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
