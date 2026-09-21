"use client";
import { useState } from "react";

export default function PortalLogin({ program }: { program: "liberate" | "one-on-one" }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await fetch("/api/portal/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, program }) });
    const j = await res.json();
    setBusy(false);
    if (j.ok) location.href = program === "one-on-one" ? "/portal/one-on-one" : "/portal/liberate";
    else setErr(j.error || "Could not sign in.");
  }

  return (
    <form onSubmit={submit} className="ed-form pt-login">
      <label>{program === "one-on-one" ? "Email you booked with" : "Email you joined with"}</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      {program === "liberate" && (
        <>
          <label>Access code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" placeholder="From your welcome email" />
        </>
      )}
      {err && <p className="ed-note" style={{ marginTop: 18, color: "#8a3b3b", borderLeftColor: "#8a3b3b" }}>{err}</p>}
      <div style={{ marginTop: 28 }}>
        <button className="ed-btn ed-btn-ink" disabled={busy}>{busy ? "One moment…" : program === "one-on-one" ? "Open my 1:1 space" : "Enter the portal"}</button>
      </div>
    </form>
  );
}
