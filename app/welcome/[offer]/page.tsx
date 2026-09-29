import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdFinal } from "@/app/components/Editorial";
import { getOffer } from "@/config/offers";
import { ONBOARDING } from "@/config/onboarding";
import { getContent } from "@/lib/content";
import { store } from "@/lib/store";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

// The page a client lands on after paying (Xendit sends them here; the
// bank-transfer page links here once verified). Copy per offer lives in
// config/onboarding.ts; the Power Hour booking link comes from the Studio.
export default async function WelcomePage({ params, searchParams }: { params: Promise<{ offer: string }>; searchParams: Promise<{ o?: string }> }) {
  const { offer: slug } = await params;
  const { o } = await searchParams;
  const offer = getOffer(slug);
  const packKey = offer?.onboardingPack ?? slug;
  const pack = ONBOARDING[packKey] ?? ONBOARDING.custom;
  const content = await getContent();
  const order = o ? await store().get(o).catch(() => null) : null;
  const booking = content.links.calendlyPowerHour;

  const steps = pack.steps.map((s) => {
    if (packKey === "ignite" && s.ctaHref === "#booking") {
      return booking
        ? { ...s, ctaHref: booking, external: true }
        : { ...s, body: "I'll message you within a day — on WhatsApp if you left a number, otherwise by email — with a few times to choose from. Ninety minutes, just the two of us.", ctaLabel: undefined, ctaHref: undefined };
    }
    if (s.ctaHref?.startsWith("#")) return { ...s, ctaLabel: undefined, ctaHref: undefined };
    return s;
  });

  return (
    <SitePage>
      <section className="ed-hero-simple">
        <div className="ed-wrap">
          <p className="ed-eyebrow">{offer?.name ?? "Welcome"}{order ? ` · ${peso(order.amountPaidPHP || order.totalPHP)}` : ""}</p>
          <h1 className="ed-display" style={{ marginTop: 18 }}>You&rsquo;re in. <span className="ed-plum-text">Welcome home.</span></h1>
          <p className="ed-lede" style={{ maxWidth: "34ch" }}>{pack.intro}</p>
        </div>
      </section>

      <section className="ed-sec ed-linen" style={{ paddingTop: "clamp(40px, 5vw, 72px)" }}>
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c4 ed-reveal"><p className="ed-eyebrow">What happens now</p><h2 className="ed-display-md" style={{ marginTop: 14 }}>A few small things, then we begin.</h2></div>
          <div className="ed-off1 ed-reveal" style={{ transitionDelay: ".15s" }}>
            {steps.map((s, i) => (
              <div key={s.title} className="ed-talk" style={{ gridTemplateColumns: "56px minmax(0,1fr)" }}>
                <span className="ed-talk-when">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                  {s.ctaHref && s.ctaLabel && (
                    <p style={{ marginTop: 14 }}>
                      {"external" in s && s.external ? <a className="ed-btn ed-btn-ink ed-btn-sm" href={s.ctaHref} target="_blank" rel="noreferrer">{s.ctaLabel} ↗</a> : <Link className="ed-btn ed-btn-ink ed-btn-sm" href={s.ctaHref}>{s.ctaLabel}</Link>}
                    </p>
                  )}
                </span>
              </div>
            ))}
            <p className="ed-note" style={{ marginTop: 28 }}>{pack.closing}</p>
          </div>
        </div>
      </section>

      <EdFinal
        title="Until then —"
        gold="breathe. You've already done the brave part."
        ctas={[{ label: "Back to the site", href: "/", variant: "ghost" }, { label: "Say hello", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
