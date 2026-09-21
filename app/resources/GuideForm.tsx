"use client";
import { useState } from "react";

// Free lead-magnet capture -> /api/lead (tagged as a nurture/guide lead in GHL).
export default function GuideForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email, offerSlug: "general", track: "consumer",
        answers: { requested: "Come Home to Yourself — 5 Practices" },
        consent, source: "free-guide", company_website: hp || undefined,
      }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) setDone("Check your inbox — your guide is on the way. 🤍");
    else setErr(j.error || "Something went wrong. Please try again.");
  }

  if (done) return <div className="card"><p className="big" style={{ margin: 0 }}>{done}</p></div>;

  return (
    <form onSubmit={submit} className="card">
      <div className="grid2">
        <div><label>Your name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      </div>
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontWeight: 400 }}>
        <input type="checkbox" style={{ width: "auto", marginTop: 4 }} checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span className="muted" style={{ fontSize: 13 }}>Send me the guide and Libni&rsquo;s letters. I can unsubscribe anytime. (RA 10173)</span>
      </label>
      {err && <p style={{ color: "var(--green-deep)", marginTop: 10 }}>{err}</p>}
      <div style={{ marginTop: 14 }}><button className="btn" disabled={busy}>{busy ? "Sending…" : "Send me the guide"}</button></div>
    </form>
  );
}
