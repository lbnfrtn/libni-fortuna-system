"use client";
import { useEffect, useState } from "react";

type Step = "details" | "pay";

// Power Hour books online only (Libni, 2026-10-09). In person is by request —
// a line below points people to /contact instead of a second buy button. The
// price comes back from the server with the payment link.
export default function IgniteClient() {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intention, setIntention] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [src, setSrc] = useState("");
  const [order, setOrder] = useState<{ link?: string; manualPayUrl: string; amount: number; offer: string } | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSrc(p.get("src") || p.get("utm_source") || "");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/powerhour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "online", name, email, phone: phone || undefined, intention: intention || undefined, consent, source: src || undefined, company_website: hp || undefined }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      setOrder({ link: j.link, manualPayUrl: j.manualPayUrl, amount: j.amount, offer: j.offer });
      setStep("pay");
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ph">
      <ol className="ph-steps" aria-label="Booking steps">
        {(["details", "pay"] as Step[]).map((s, i) => (
          <li key={s} className={step === s ? "on" : (["details", "pay"].indexOf(step) > i ? "done" : "")}>
            <i>{i + 1}</i>{["Your details", "Pay & book"][i]}
          </li>
        ))}
      </ol>

      {step === "details" && (
        <form onSubmit={submit} className="ph-form">
          <p className="ph-chosen">Online · 90 minutes · a private video call, wherever you are</p>
          <div className="grid2">
            <div><label>Your name</label><input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></div>
            <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
          </div>
          <label>WhatsApp number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63…" autoComplete="tel" />
          <label>In a sentence — what's drawing you to this right now? (optional)</label>
          <textarea rows={3} value={intention} onChange={(e) => setIntention(e.target.value)} placeholder="However it comes out is fine." />
          <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
            <label>Company website</label><input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
          </div>
          <label className="ph-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
            <span>I agree to be contacted about my session and to my details being stored, per the Philippine Data Privacy Act.</span>
          </label>
          {err && <p className="ph-err">{err}</p>}
          <div className="row" style={{ marginTop: 22, gap: 14 }}>
            <button className="ed-btn ed-btn-ink" disabled={busy}>{busy ? "One moment…" : "Continue to payment"}</button>
          </div>
          <p className="ph-note" style={{ marginTop: 18 }}>Prefer to meet in person? That&rsquo;s by request — <a className="ed-link" href="/contact">message me</a> and we&rsquo;ll arrange it.</p>
        </form>
      )}

      {step === "pay" && order && (
        <div className="ph-pay">
          <p className="ph-chosen">{order.offer} · ₱{order.amount.toLocaleString("en-PH")}</p>
          <h3>Secure your session.</h3>
          <p className="ed-muted" style={{ maxWidth: "46ch" }}>Pay in the way that&rsquo;s easiest for you. The moment it clears, you&rsquo;ll be taken straight to my calendar to choose your time.</p>
          <div className="ph-paybtns">
            {order.link && <a className="ed-btn ed-btn-gold" href={order.link}>Pay with GCash, Maya or card</a>}
            <a className="ed-btn ed-btn-ghost" href={order.manualPayUrl}>Pay by bank transfer</a>
          </div>
          <p className="ph-note">A confirmation is on its way to {email}. If you close this page, the payment link in that email still works.</p>
        </div>
      )}
    </div>
  );
}
