import type { Metadata } from "next";
import { SitePage } from "@/app/components/Chrome";
import { store } from "@/lib/store";
import { DOWNLOADS, orderTokenValid } from "@/lib/downloads";
import { peso } from "@/lib/util";
import { RefreshWhilePending, Butterfly } from "../ComeHomeClient";
import "../come-home.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Welcome home · Come Home to Yourself", robots: { index: false, follow: false } };

// The buyer's own download page. Xendit sends them here after paying, and the
// delivery letter links here. Opens only with the signed token for this order.
export default async function ComeHomeWelcome({ searchParams }: { searchParams: Promise<{ o?: string; t?: string }> }) {
  const { o, t } = await searchParams;
  const valid = !!o && orderTokenValid(o, t);
  const order = valid ? await store().get(o!).catch(() => null) : null;
  const ours = order && order.offerSlug === "come-home";
  const paid = ours && order!.status === "paid";
  const first = ours ? order!.contact.name.trim().split(/\s+/)[0] : "";
  const files = DOWNLOADS["come-home"];

  if (!ours) {
    return (
      <SitePage bare>
        <div className="ch">
          <section className="ch-hero ch-hero-sm">
            <div className="ed-wrap ch-welcome-head">
              <Butterfly className="ch-fly" />
              <p className="ed-eyebrow">Come Home to Yourself</p>
              <h1 className="ch-title ch-title-md">This link doesn&rsquo;t look quite right.</h1>
              <p className="ch-lede">Open the link from your email again, or write to me at <a className="ed-link" href="mailto:hello@libni.co">hello@libni.co</a> with the email you used — I&rsquo;ll send it straight over.</p>
            </div>
          </section>
        </div>
      </SitePage>
    );
  }

  if (!paid) {
    return (
      <SitePage bare>
        <div className="ch">
          <section className="ch-hero ch-hero-sm">
            <div className="ed-wrap ch-welcome-head">
              <Butterfly className="ch-fly ch-fly-pulse" />
              <p className="ed-eyebrow">Confirming your payment</p>
              <h1 className="ch-title ch-title-md">Almost there, {first}.</h1>
              <p className="ch-lede">Your payment is on its way through. This page opens your workbook and meditation the moment it lands — usually within a few seconds.</p>
              <RefreshWhilePending />
              <p className="ch-form-sub" style={{ marginTop: 22 }}>Didn&rsquo;t finish paying? <a className="ed-link" href={order!.instalments[0]?.invoiceUrl || `/pay/${order!.id}`}>Pick up where you left off →</a></p>
            </div>
          </section>
        </div>
      </SitePage>
    );
  }

  return (
    <SitePage bare>
      <div className="ch">
        <section className="ch-hero ch-hero-sm">
          <div className="ed-wrap ch-welcome-head">
            <Butterfly className="ch-fly" />
            <p className="ed-eyebrow">Come Home to Yourself · {peso(order!.amountPaidPHP || order!.totalPHP)}</p>
            <h1 className="ch-title ch-title-md">Welcome home, <em>{first}.</em></h1>
            <p className="ch-lede">I&rsquo;m so proud of you for being here. Go slow. Be gentle. Be honest.</p>
          </div>
        </section>

        <section className="ed-sec ed-ivory ch-dl-sec">
          <div className="ed-wrap ch-dl-grid">
            {files.map((f) => (
              <div key={f.href} className="ch-dl">
                {f.kind === "pdf"
                  ? <img src="/photos/come-home/cover.jpg" alt="" className="ch-dl-cover" />
                  : <div className="ch-dl-audio"><span className="ch-bars"><i /><i /><i /><i /><i /></span></div>}
                <div className="ch-dl-body">
                  <p className="ch-k">{f.kind === "pdf" ? "01 · Read & write" : "02 · Listen"}</p>
                  <h3>{f.label}</h3>
                  <p className="ch-form-sub">{f.detail}</p>
                  {f.kind === "audio" && <audio className="ch-audio" controls preload="none" src={f.href}>Your browser can&rsquo;t play audio here — use the download button.</audio>}
                  <a className="ed-btn ed-btn-ink ed-btn-sm" href={f.href} download>Download</a>
                </div>
              </div>
            ))}
            <p className="ch-note">Keep the email I just sent you — the link in it brings you back here anytime. On iPhone, tap Download, then the share icon to save to Files or Books.</p>
          </div>
        </section>

        <section className="ed-sec ed-linen ch-ritual">
          <div className="ed-wrap">
            <div className="ch-ritual-head">
              <p className="ed-eyebrow">Before you start</p>
              <h2 className="ch-h2">Make it a small ritual.</h2>
            </div>
            <ol className="ch-ritual-grid ch-ritual-3">
              <li><span className="ch-rn">1</span><h4>Find 15 to 20 quiet minutes</h4><p>Phone on silent. Something warm to drink. A pen you like holding.</p></li>
              <li><span className="ch-rn">2</span><h4>Listen first, journal after</h4><p>The meditation walks you through all five practices. Then let the pen move.</p></li>
              <li><span className="ch-rn">3</span><h4>One practice at a time</h4><p>You don&rsquo;t have to finish everything at once. Use the 7-day tracker at the end.</p></li>
            </ol>
          </div>
        </section>

        <section className="ed-sec ed-ivory">
          <div className="ed-wrap ed-split ed-split-top">
            <div className="ed-c4">
              <p className="ed-eyebrow">When you&rsquo;re ready for more</p>
              <h2 className="ch-h2 ch-h2-sm">Not because there&rsquo;s something wrong with you.</h2>
              <p className="ch-italic" style={{ marginTop: 14 }}>Because there is so much more of you waiting to be lived.</p>
            </div>
            <div className="ed-off1 ch-next">
              <a className="ch-next-row" href="/programs/ignite">
                <small>1:1 · 90 minutes</small>
                <h3>Power Hour</h3>
                <p>One focused conversation to move what&rsquo;s been stuck. Ninety minutes, just the two of us.</p>
                <span className="ed-link">Book a Power Hour →</span>
              </a>
              <a className="ch-next-row" href="/programs/the-becoming">
                <small>1:1 · 12 weeks · by application</small>
                <h3>The Becoming</h3>
                <p>My deepest private container. Twelve weeks of sustained 1:1 work with the subconscious, the nervous system and the body.</p>
                <span className="ed-link">Learn about The Becoming →</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </SitePage>
  );
}
