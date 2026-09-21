import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember, memberOrders } from "@/lib/portal-auth";
import { getOffer } from "@/config/offers";
import { ONBOARDING } from "@/config/onboarding";
import PortalSignOut from "../liberate/PortalSignOut";
import EditorialFx from "@/app/components/EditorialFx";

export const dynamic = "force-dynamic";

// The 1:1 client's space: what they've booked, the next steps from their
// onboarding pack, and a direct line to Libni. Kept deliberately light —
// sessions, agreements and intakes are all run from GHL.
export default async function OneOnOnePortal() {
  const me = await currentMember();
  if (!me) redirect("/portal?program=one-on-one");
  if (!me.admin && me.program !== "one-on-one") redirect("/portal/liberate");
  const orders = (await memberOrders(me.email, "one-on-one")).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  const first = orders[0]?.contact.name?.split(" ")[0] ?? "";

  return (
    <main className="ed pt">
      <header className="pt-top">
        <Link href="/portal/one-on-one" className="pt-brand"><b>1:1 with Libni</b><span>Your private space</span></Link>
        <nav className="pt-nav">
          <a href="#next">Next steps</a>
          <a href="mailto:hello@libni.co">Reach Libni</a>
          <PortalSignOut admin={me.admin} adminHref="/admin/clients" />
        </nav>
      </header>

      <section className="pt-hero">
        <div className="ed-wrap">
          <p className="ed-eyebrow" style={{ color: "var(--ed-gold-soft)" }}>{first ? `Welcome back, ${first}.` : "Welcome back."}</p>
          <h1 className="ed-display" style={{ marginTop: 14, maxWidth: "18ch" }}>Just you and me, <span className="ed-gold">as promised.</span></h1>
          {orders.length > 0 && (
            <div className="pt-now">
              <div>
                <p className="ed-eyebrow" style={{ color: "rgba(251,249,246,.55)" }}>You’re in</p>
                {orders.map((o) => <b key={o.id}>{getOffer(o.offerSlug)?.name ?? o.offerSlug}</b>)}
              </div>
              <p className="pt-next">Sessions are booked and confirmed by email</p>
            </div>
          )}
        </div>
      </section>

      {orders.map((o) => {
        const pack = ONBOARDING[o.offerSlug];
        if (!pack) return null;
        return (
          <section key={o.id} className="ed-sec ed-ivory" id="next">
            <div className="ed-wrap ed-split ed-split-top">
              <div className="ed-c4 ed-stack ed-reveal">
                <p className="ed-eyebrow">{getOffer(o.offerSlug)?.name}</p>
                <h2 className="ed-display-md">Your next steps.</h2>
                <p className="ed-lede ed-muted">{pack.intro}</p>
              </div>
              <div className="ed-off1 ed-reveal" style={{ transitionDelay: ".15s" }}>
                {pack.steps.map((s, i) => (
                  <div key={s.title} className="ed-talk" style={{ gridTemplateColumns: "56px minmax(0,1fr)" }}>
                    <span className="ed-talk-when">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                      {s.ctaHref && <p style={{ marginTop: 10 }}><a className="ed-link" href={s.ctaHref.startsWith("#") ? `/welcome/${o.offerSlug}${s.ctaHref}` : s.ctaHref}>{s.ctaLabel}</a></p>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="ed-sec-sm ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Between sessions</p>
            <h2 className="ed-display-md">Something came up? Write to me.</h2>
          </div>
          <div className="ed-off1 ed-reveal" style={{ color: "rgba(251,249,246,.75)" }}>
            <p><a href="mailto:hello@libni.co" style={{ borderBottom: "1px solid var(--ed-gold)" }}>hello@libni.co</a></p>
            <p style={{ marginTop: 14, fontSize: 15 }}>Want to go deeper after this? <Link href="/one-on-one" style={{ borderBottom: "1px solid var(--ed-gold)" }}>The two doors</Link> · <Link href="/liberate" style={{ borderBottom: "1px solid var(--ed-gold)" }}>Liberate</Link></p>
          </div>
        </div>
      </section>
      <EditorialFx />
    </main>
  );
}
