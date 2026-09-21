"use client";
import { useState } from "react";

// Newsletter / "letters" signup -> /api/lead (tagged nurture in GHL).
export default function NewsletterForm({ dark }: { dark?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        name: name || email.split("@")[0], email, offerSlug: "general", track: "consumer",
        answers: { requested: "Letters from Libni" }, consent: true, source: "newsletter",
        company_website: hp || undefined,
      }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) setDone("You're in. Watch your inbox for something soft and honest. 🤍");
    else setErr(j.error || "Something went wrong. Please try again.");
  }

  if (done) return <p className="serif" style={{ fontSize: 22, margin: 0, color: dark ? "#fff" : "var(--ink)" }}>{done}</p>;

  return (
    <form onSubmit={submit} className="newsletter-form">
      <input aria-label="Your name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Email" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <button className="btn light" disabled={busy}>{busy ? "…" : "Send me letters"}</button>
      {err && <p style={{ color: dark ? "#f3dede" : "var(--plum)", width: "100%", margin: "8px 0 0", fontSize: 13 }}>{err}</p>}
    </form>
  );
}
