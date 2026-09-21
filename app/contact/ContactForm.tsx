"use client";
import { useState } from "react";

// reason -> offer slug (real slugs route B2B into the right pipeline;
// personal/general go to a plain "general" bucket).
const REASONS: Record<string, string> = {
  "Working with you (for me)": "general",
  "A corporate workshop or retreat": "organizations",
  "Booking you to speak": "speaking",
  "A brand collaboration": "brands",
  "Press / podcast": "general",
  "Something else": "general",
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(Object.keys(REASONS)[0]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const offerSlug = REASONS[reason] || "general";
    const track = offerSlug === "organizations" || offerSlug === "speaking" ? "corporate" : offerSlug === "brands" ? "brand" : "consumer";
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email, offerSlug, track,
        answers: { reason, message },
        consent, source: "contact-page", company_website: hp || undefined,
      }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) setDone("Thank you — I've got your message and I'll be in touch within one business day. 🤍");
    else setErr(j.error || "Something went wrong. Please try again.");
  }

  if (done) return <div className="card"><p className="serif" style={{ fontSize: 22 }}>{done}</p></div>;

  return (
    <form onSubmit={submit} className="card">
      <div className="grid2">
        <div><label>Your name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      </div>
      <label>What&rsquo;s this about?</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        {Object.keys(REASONS).map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <label>Your message</label>
      <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontWeight: 400 }}>
        <input type="checkbox" style={{ width: "auto", marginTop: 4 }} checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span className="muted" style={{ fontSize: 14 }}>I agree to be contacted about my message and to my details being stored, per the Philippine Data Privacy Act.</span>
      </label>
      {err && <p style={{ color: "var(--terracotta)", marginTop: 12 }}>{err}</p>}
      <div style={{ marginTop: 16 }}><button className="btn" disabled={busy}>{busy ? "Sending…" : "Send message"}</button></div>
    </form>
  );
}
