import Link from "next/link";
import type { ReactNode } from "react";
import { OFFERS, isSellable } from "@/config/offers";
import { peso } from "@/lib/util";
import { LOGOS } from "@/config/logos";

// Shared editorial building blocks (server components). Pages compose these
// with the `ed-*` classes in app/editorial.css.

export type Cta = { label: string; href: string; variant?: "gold" | "light" | "ink" | "ghost" | "solid"; external?: boolean };

export function EdBtn({ href, variant = "ink", external, children, small }: { href: string; variant?: Cta["variant"]; external?: boolean; children: ReactNode; small?: boolean }) {
  const cls = `ed-btn ed-btn-${variant}${small ? " ed-btn-sm" : ""}`;
  if (external || href.startsWith("http") || href.startsWith("#")) {
    return <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
  }
  return <Link href={href} className={cls}>{children}</Link>;
}

export function EdCtas({ ctas, className }: { ctas: Cta[]; className?: string }) {
  return (
    <div className={`ed-ctas${className ? " " + className : ""}`}>
      {ctas.map((c) => <EdBtn key={c.href + c.label} href={c.href} variant={c.variant} external={c.external}>{c.label}</EdBtn>)}
    </div>
  );
}

export type HeroCredential = { num: string; label: string };

export function HeroCredibilityStrip({ credentials }: { credentials: HeroCredential[] }) {
  return (
    <div className="ed-hero-cred">
      {credentials.map((c, i) => (
        <div key={c.label} className="ed-hero-cred-item">
          <div className="ed-hero-cred-num">{c.num}</div>
          <div className="ed-hero-cred-label">{c.label}</div>
          {i < credentials.length - 1 && <div className="ed-hero-cred-divider" />}
        </div>
      ))}
    </div>
  );
}

export function EdHero({ eyebrowStrong, eyebrow, title, xl, lede, sub, meta, ctas, image, alt, objectPosition, credentials }: {
  eyebrowStrong?: string; eyebrow?: string; title: ReactNode; xl?: boolean; lede?: ReactNode; sub?: ReactNode;
  meta?: { label: string; value: string }; ctas: Cta[]; image: string; alt: string; objectPosition?: string; credentials?: HeroCredential[];
}) {
  return (
    <section className="ed-hero">
      <div className="ed-hero-panel">
        {(eyebrow || eyebrowStrong) && (
          <p className="ed-eyebrow ed-hero-who">{eyebrowStrong && <strong>{eyebrowStrong}</strong>}{eyebrow}</p>
        )}
        <h1 className={`ed-hero-title${xl ? " xl" : ""}`}>{title}</h1>
        {lede && <p className="ed-hero-lede">{lede}</p>}
        {sub && <p className="ed-hero-sub">{sub}</p>}
        {meta && <p className="ed-hero-meta"><span>{meta.label}</span><strong>{meta.value}</strong></p>}
        <EdCtas ctas={ctas} />
      </div>
      <div className="ed-hero-media"><img src={image} alt={alt} style={objectPosition ? { objectPosition } : undefined} /></div>
      {credentials && <HeroCredibilityStrip credentials={credentials} />}
    </section>
  );
}

export function EdHeroSimple({ eyebrow, title, lede, ctas, aside }: { eyebrow: string; title: ReactNode; lede?: ReactNode; ctas?: Cta[]; aside?: ReactNode }) {
  return (
    <section className="ed-hero-simple">
      <div className={`ed-wrap${aside ? " ed-hero-simple-grid" : ""}`}>
        <div>
          <p className="ed-eyebrow">{eyebrow}</p>
          <h1 className="ed-display" style={{ marginTop: 18 }}>{title}</h1>
          {lede && <p className="ed-lede">{lede}</p>}
          {ctas && <EdCtas ctas={ctas} />}
        </div>
        {aside}
      </div>
    </section>
  );
}

export type Word = { q: string; who: string; role?: string; photo?: string };

export function EdWords({ eyebrow = "Real people. Real shifts.", items, note }: { eyebrow?: string; items: Word[]; note?: ReactNode }) {
  const [first, ...rest] = items;
  return (
    <div>
      <div className="ed-feature ed-reveal">
        <div>
          <p className="ed-eyebrow" style={{ marginBottom: 24 }}>{eyebrow}</p>
          <p className="ed-quote">{first.q}</p>
          {first.photo ? (
            <div className="ed-who-row"><EdCircle src={first.photo} name={first.who} size={64} /><p className="ed-who">{first.who}{first.role && <span>{first.role}</span>}</p></div>
          ) : (
            <p className="ed-who">{first.who}{first.role && <span>{first.role}</span>}</p>
          )}
        </div>
        {note && <p className="ed-lede ed-muted" style={{ maxWidth: "24ch" }}>{note}</p>}
      </div>
      {rest.length > 0 && (
        <div className="ed-words">
          {rest.map((w, i) => (
            <div key={w.who + i} className={`ed-reveal${w.photo ? " ed-word" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
              {w.photo && <EdCircle src={w.photo} name={w.who} />}
              <div><p className="ed-quote">{w.q}</p><p className="ed-who">{w.who}{w.role && <span>{w.role}</span>}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EdStats({ items }: { items: [string, string][] }) {
  return (
    <div className="ed-stats ed-reveal">
      {items.map(([n, l]) => <div key={l} className="ed-stat"><b>{n}</b><span>{l}</span></div>)}
    </div>
  );
}

export function EdFinal({ title, gold, copy, meta, ctas }: { title: ReactNode; gold?: ReactNode; copy?: ReactNode[]; meta?: [string, string][]; ctas: Cta[] }) {
  return (
    <section className="ed-final">
      <div className="ed-wrap">
        <h2 className="ed-reveal">{title}{gold && <> <span className="ed-gold">{gold}</span></>}</h2>
        {copy && <div className="ed-copy ed-reveal" style={{ transitionDelay: ".15s" }}>{copy.map((c, i) => <p key={i}>{c}</p>)}</div>}
        {meta && (
          <div className="ed-final-meta ed-reveal" style={{ transitionDelay: ".25s" }}>
            {meta.map(([l, v]) => <div key={l}>{l}<b>{v}</b></div>)}
          </div>
        )}
        <EdCtas ctas={ctas} className="ed-reveal" />
      </div>
    </section>
  );
}

// Facts for an offer row, straight from config/offers.ts so pages never drift
// from what the Payment Desk charges.
export function offerMeta(slug: string): { price: string; unit?: string; href: string; cta: string; external: boolean } {
  const o = OFFERS[slug];
  const external = o.journey === "E";
  const href = slug === "liberate" ? "/liberate" : external ? (o.externalUrl ?? "#") : `/programs/${slug}`;
  const price = o.hidePrice ? "By application" : o.journey === "E" && o.pricePHP ? peso(o.pricePHP) : isSellable(o) ? peso(o.pricePHP!) : o.journey === "D" ? "By proposal" : "By application";
  const cta = external ? "Open the app" : o.journey === "D" ? "Enquire" : slug === "liberate" ? "Explore Liberate" : isSellable(o) ? "Explore" : "Apply / waitlist";
  return { price, unit: o.priceUnit, href, cta, external };
}

/** One scrolling row of real logos. */
export function EdLogos({ items = LOGOS, rev }: { items?: [string, string, number][]; rev?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className={`marquee-track${rev ? " rev" : ""}`}>
        {doubled.map(([file, name, h], i) => (
          <span key={file + i} className="marquee-item">
            <img className="ed-logo" src={`/logos/${file}.png`} alt={name} style={{ "--h": `${h}px` } as React.CSSProperties} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** A phone around an app screenshot — the screen image should be a tall (≈9:16) capture. */
export function EdPhone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="ed-phone" aria-hidden="false">
      <div className="ed-phone-island" />
      <img src={src} alt={alt} />
    </div>
  );
}

/** Small circular portrait; falls back to an initials monogram so a row never shows an empty box. */
export function EdCircle({ src, name, size = 72 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  return src
    ? <img className="ed-circle" src={src} alt={name} style={{ width: size, height: size }} />
    : <span className="ed-circle ed-circle-mono" style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }} aria-hidden="true">{initials}</span>;
}

/** The free guide, rendered as a cover so the letters section has a real object to look at. */
export function EdGuideCover() {
  return (
    <div className="ed-guide">
      <div className="ed-guide-cover">
        <span className="ed-guide-kicker">A free guide · Libni Fortuna</span>
        <span className="ed-guide-title">Come Home to Yourself</span>
        <span className="ed-guide-rule" />
        <span className="ed-guide-sub">5 Practices to Begin Your Return</span>
        <span className="ed-guide-foot">Breathwork · Reflection · Nervous-system tools</span>
      </div>
    </div>
  );
}

export function EdOffer({ n, slug, tag, tagline, copy, image, featured, priceNote, priceLabel, phone }: {
  n: string; slug: string; tag: string; tagline: string; copy: string; image?: string; featured?: boolean; priceNote?: string;
  /** Replace the price entirely, e.g. “Group coaching experience”. */
  priceLabel?: string;
  /** Render the image inside a phone frame (app screenshots). */
  phone?: boolean;
}) {
  const o = OFFERS[slug];
  const m = offerMeta(slug);
  return (
    <div className={`ed-offer${featured ? " ed-offer-featured" : ""} ed-reveal`}>
      <div className="ed-offer-n">{n}</div>
      <div>
        <span className="ed-offer-tag">{tag}</span>
        <h3>{o.name}</h3>
        <p className="ed-offer-tagline">{tagline}</p>
      </div>
      <div>
        {image && (phone ? <div style={{ marginBottom: 18 }}><EdPhone src={image} alt={o.name} /></div> : <img src={image} alt={o.name} style={{ marginBottom: 18 }} />)}
        <p className="ed-offer-copy">{copy}</p>
      </div>
      <div className="ed-offer-side">
        {priceLabel
          ? <p className="ed-offer-price ed-offer-price-label">{priceLabel}</p>
          : <p className="ed-offer-price">{m.price}{!o.hidePrice && (m.unit || priceNote) && <small>{[m.unit, priceNote].filter(Boolean).join(" · ")}</small>}</p>}
        <EdBtn href={m.href} variant={featured ? "ink" : "ghost"} external={m.external} small>{m.cta}</EdBtn>
      </div>
    </div>
  );
}

/** Decode the few HTML entities used in config copy strings. */
export function tx(s: string): string {
  return s.replace(/&rsquo;/g, "’").replace(/&amp;/g, "&").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/<\/?em>/g, "");
}
