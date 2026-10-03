"use client";
import { useEffect, useState } from "react";
import { peso } from "@/lib/util";
import type { SelfPay } from "@/lib/lead";

export default function JoinClient({ price, count, refundNote }: { price: number; count: number; refundNote?: string }) {
  const [plan, setPlan] = useState<"full" | "instalment">("full");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pay, setPay] = useState<SelfPay | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSrc(p.get("src") || p.get("utm_source") || "");
    if (p.get("plan") === "monthly") setPlan("instalment");
  }, []);

  const monthly = Math.floor(price / count);
  const firstPayment = price - monthly * (count - 1);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/liberate/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name, email, phone: phone || undefined, consent, source: src || undefined, company_website: honeypot || undefined }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      setPay(j.pay);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (pay)
    return (
      <div className="card">
        <p className="serif" style={{ fontSize: 24 }}>You’re almost in. 🤍</p>
        <p className="muted">Your place is held the moment this clears. The same link is in your inbox.</p>
        <p style={{ margin: "18px 0 12px" }}>
          <b>{peso(pay.amount)}</b> {pay.plan === "instalment" ? `now — payment 1 of ${pay.instalments.length}` : "in full"}
          {pay.plan === "instalment" && (
            <span className="muted" style={{ display: "block", fontSize: 14 }}>Then {pay.instalments.slice(1).map((i) => `${peso(i.amount)} on ${i.dueDate}`).join(" · ")}</span>
          )}
        </p>
        <div className="row">
          {pay.link && <a className="btn" href={pay.link}>Pay with GCash, Maya or card</a>}
          <a className="btn ghost" href={pay.manualPayUrl}>Pay by bank transfer</a>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>If you close this page, the link in your email still works.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="card">
      <label>How would you like to pay?</label>
      <div className="multi">
        <label className={`multi-opt${plan === "full" ? " on" : ""}`}>
          <input type="radio" name="plan" checked={plan === "full"} onChange={() => setPlan("full")} />
          Pay in full — {peso(price)}
        </label>
        <label className={`multi-opt${plan === "instalment" ? " on" : ""}`}>
          <input type="radio" name="plan" checked={plan === "instalment"} onChange={() => setPlan("instalment")} />
          {count} monthly payments — {peso(firstPayment)} today, then {peso(monthly)} a month
        </label>
      </div>
      <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>Another arrangement in mind? <a href="/liberate/apply">Talk to me first</a> — payment plans are always something we can talk about.</p>

      <div className="grid2" style={{ marginTop: 18 }}>
        <div>
          <label>Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>
      <label>WhatsApp number</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63…" required />

      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <label>Company website</label>
        <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontWeight: 400 }}>
        <input type="checkbox" style={{ width: "auto", marginTop: 4 }} checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span className="muted" style={{ fontSize: 14 }}>I agree to be contacted about Liberate and to my details being stored, per the Philippine Data Privacy Act.</span>
      </label>
      {refundNote && <p className="note" style={{ marginTop: 16 }}>{refundNote}</p>}

      {err && <p style={{ color: "var(--terracotta)", marginTop: 12 }}>{err}</p>}
      <div style={{ marginTop: 18 }}>
        <button className="btn" disabled={busy}>{busy ? "One moment…" : "Continue to payment"}</button>
      </div>
    </form>
  );
}
