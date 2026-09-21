import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdWords, tx } from "@/app/components/Editorial";
import IgniteClient from "./IgniteClient";
import { getProgram } from "@/config/programs";
import { getOffer } from "@/config/offers";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

export default async function IgnitePage() {
  const p = getProgram("ignite");
  const offer = getOffer("ignite");
  if (!p || !offer) return null;
  const paras = (p.longCopy ?? []).map(tx);

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="Work with me · 90 minutes · online or in person"
        title={offer.name}
        xl
        lede={tx(p.tagline)}
        sub={tx(p.intro)}
        meta={{ label: "Investment", value: peso(offer.pricePHP!) }}
        ctas={[{ label: "Book your session", href: "#book", variant: "gold" }, { label: "Talk to me first", href: "/contact", variant: "light" }]}
        image="/photos/libni-portrait.jpg"
        alt="Ignite"
      />

      <section className="ed-sec ed-ivory" id="book">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c4 ed-reveal">
            <p className="ed-eyebrow">Begin</p>
            <h2 className="ed-display-md" style={{ marginTop: 14 }}>Secure your session, then choose a time that’s yours.</h2>
          </div>
          <div className="ed-off1 ed-form ed-reveal" style={{ transitionDelay: ".15s" }}><IgniteClient /></div>
        </div>
      </section>

      {paras.length > 0 && (
        <section className="ed-sec ed-linen">
          <div className="ed-wrap ed-split ed-split-top">
            <div className="ed-c4 ed-reveal">
              <p className="ed-eyebrow">What to expect</p>
              <h2 className="ed-display-md" style={{ marginTop: 14 }}>90 minutes of real work.</h2>
            </div>
            <div className="ed-off1 ed-copy ed-longcopy ed-reveal" style={{ transitionDelay: ".15s" }}>
              {paras.map((para, i) => <p key={i} style={{ fontSize: "clamp(17px, 1.9vw, 20px)" }}>{para}</p>)}
            </div>
          </div>
        </section>
      )}

      {p.testimonial && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap"><EdWords eyebrow="In their words" items={[p.testimonial]} /></div>
        </section>
      )}

      {p.faq && p.faq.length > 0 && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap ed-split ed-split-top ed-reveal">
            <div className="ed-c4"><p className="ed-eyebrow">Questions?</p></div>
            <div className="ed-off1 ed-faq">
              {p.faq.map((f, i) => (
                <details key={i}><summary>{tx(f.q)}</summary><p className="ed-faq-a">{tx(f.a)}</p></details>
              ))}
              {offer.refundNote && <p className="ed-note" style={{ marginTop: 28 }}>{offer.refundNote}</p>}
            </div>
          </div>
        </section>
      )}
    </SitePage>
  );
}
