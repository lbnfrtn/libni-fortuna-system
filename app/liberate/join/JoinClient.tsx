"use client";
import { useEffect, useState } from "react";
import { peso } from "@/lib/util";

// Pay-now goes through the real Xendit flow (/api/liberate/join). Pay-by-QR is
// self-serve: scan GCash/PNB/BPI and email the proof to hello@libni.co.
const QR_METHODS = [
  { tag: "GCash", src: "/photos/liberate/qr-gcash.png" },
  { tag: "PNB", src: "/photos/liberate/qr-pnb.png" },
  { tag: "BPI", src: "/photos/liberate/qr-bpi.png" },
];

export default function JoinClient({ price, count, refundNote }: { price: number; count: number; refundNote?: string }) {
  const [plan, setPlan] = useState<"full" | "instalment">("full");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [qrOk, setQrOk] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSrc(p.get("src") || p.get("utm_source") || "");
    if (p.get("plan") === "monthly") setPlan("instalment");
  }, []);

  const monthly = Math.floor(price / count);
  const firstPayment = price - monthly * (count - 1);
  const dueNow = plan === "full" ? price : firstPayment;
  const anyQr = Object.values(qrOk).some(Boolean);
  const mailto = `mailto:hello@libni.co?subject=${encodeURIComponent("I'm in Liberate")}&body=${encodeURIComponent("Hi Libni, I've paid for Liberate — my proof of payment is attached.")}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/liberate/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name, email, phone: phone || undefined, consent, source: src || undefined }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      if (j.pay?.link) {
        window.location.href = j.pay.link; // straight to the secure Xendit checkout
        return;
      }
      setLink(j.pay?.manualPayUrl || null);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="ck">
      {/* OPTION 1 — PAY NOW */}
      <p className="ck-opt">Option 1 · Pay now — GCash, Maya, Card or QR</p>
      <form onSubmit={submit} className="ck-card">
        <div className="ck-h"><b>Your details</b><span>Fill these in, then continue to our secure checkout.</span></div>

        <label>Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>WhatsApp number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63…" required />

        <label>Choose your plan</label>
        <div className="ck-plans">
          <button type="button" className={`ck-plan${plan === "full" ? " on" : ""}`} onClick={() => setPlan("full")}>
            <b>{peso(price)}</b><small>Pay in full</small>
          </button>
          <button type="button" className={`ck-plan${plan === "instalment" ? " on" : ""}`} onClick={() => setPlan("instalment")}>
            <b>{peso(firstPayment)}</b><small>today, then {peso(monthly)} ×{count - 1}</small>
          </button>
        </div>

        <div className="ck-sum">
          <p className="ck-k">Order summary</p>
          <div className="ck-row"><span>Liberate — 12-week group experience</span><span>{peso(price)}</span></div>
          <div className="ck-row ck-sub"><span>{plan === "full" ? "Pay in full" : `${count} monthly payments`}</span><span>Begins Nov 3, 2026</span></div>
          <div className="ck-row ck-total"><span>Due today</span><b>{peso(dueNow)}</b></div>
        </div>

        <label className="ck-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          <span>I agree to be contacted about Liberate and to my details being stored, per the Philippine Data Privacy Act.</span>
        </label>
        {refundNote && <p className="ck-note">{refundNote}</p>}
        {err && <p className="ck-err">{err}</p>}

        <button className="ck-pay" disabled={busy}>{busy ? "One moment…" : "Continue to secure checkout →"}</button>
        {link && <p className="ck-note" style={{ textAlign: "center" }}>Your link is ready: <a href={link}>open it here →</a></p>}
        <p className="ck-secure">🔒 100% secure payment via Xendit · GCash · Maya · Card · QR</p>
        <p className="ck-talk">Prefer to talk first? <a href="/liberate/apply">Book a quick call →</a></p>
      </form>

      {/* OPTION 2 — QR */}
      <p className="ck-opt">Option 2 · GCash, PNB or BPI QR</p>
      <div className="ck-card">
        <div className="ck-h"><b>Pay by QR</b><span>Scan with GCash or your bank app, then send me your proof by email.</span></div>

        {anyQr ? (
          <>
            <div className="ck-qrgrid">
              {QR_METHODS.map((m) => (
                <div key={m.tag} className="ck-qrtile" style={{ display: qrOk[m.tag] ? "flex" : "none" }}>
                  <span className="ck-tag">{m.tag}</span>
                  <img src={m.src} alt={`${m.tag} QR`} onError={() => setQrOk((s) => ({ ...s, [m.tag]: false }))} onLoad={() => setQrOk((s) => ({ ...s, [m.tag]: true }))} />
                </div>
              ))}
            </div>
            <p className="ck-qrcap">Scan to pay {peso(dueNow)}</p>
          </>
        ) : (
          // Preload probes (hidden) so we know which QR images exist.
          <div style={{ display: "none" }}>
            {QR_METHODS.map((m) => (
              <img key={m.tag} src={m.src} alt="" onError={() => setQrOk((s) => ({ ...s, [m.tag]: false }))} onLoad={() => setQrOk((s) => ({ ...s, [m.tag]: true }))} />
            ))}
          </div>
        )}

        {!anyQr && (
          <p className="ck-note" style={{ textAlign: "center", margin: "6px 0 16px" }}>
            Paying by GCash, PNB or BPI? Email <strong>hello@libni.co</strong> and I&rsquo;ll send you the QR.
          </p>
        )}

        <div className="ck-mail">
          <b>Then send your proof</b>
          <p>Once you&rsquo;ve paid, email your receipt or screenshot to <strong>hello@libni.co</strong> with the subject &ldquo;I&rsquo;m in Liberate.&rdquo; I&rsquo;ll confirm and send your welcome within a few hours.</p>
          <a className="ck-mailbtn" href={mailto}>Email my proof to hello@libni.co</a>
        </div>
      </div>

      {/* AFTER PAYMENT */}
      <div className="ck-after">
        <h3>What happens after you pay</h3>
        <p className="ck-lead">Whether you pay instantly or by QR, here&rsquo;s exactly what comes next.</p>
        <div className="ck-steps">
          <div className="ck-step"><span className="ck-n">1</span><div><b>I confirm your payment</b><p>Pay-now orders confirm automatically. Paid by QR? Email your proof and I&rsquo;ll verify it — usually within a few hours.</p></div></div>
          <div className="ck-step"><span className="ck-n">2</span><div><b>Your welcome email arrives</b><p>It has your portal access code and the full schedule. Sign in at libni.co/portal with the email you used here.</p></div></div>
          <div className="ck-step"><span className="ck-n">3</span><div><b>You&rsquo;re in the circle</b><p>We begin Tuesday, November 3 at 7 pm (Manila) — Tuesdays with me, Thursdays with the community.</p></div></div>
        </div>
        <p className="ck-afternote">Don&rsquo;t see the email within a few minutes? Check spam / promotions, or just reply and I&rsquo;ll sort it.</p>
      </div>

    </div>
  );
}
