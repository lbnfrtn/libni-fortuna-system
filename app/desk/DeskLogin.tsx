"use client";
import { useState } from "react";

export default function DeskLogin() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/desk/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passcode }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) location.reload();
    else setErr(j.error || "Could not sign in.");
  }

  return (
    <div className="wrap">
      <p className="kicker">Payment Desk</p>
      <h1>Sign in</h1>
      <p className="muted">For Libni and the team only.</p>
      <form onSubmit={submit} className="card" style={{ marginTop: 16 }}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <label>Passcode</label>
        <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoComplete="current-password" />
        {err && <p style={{ color: "var(--terracotta)", marginTop: 12 }}>{err}</p>}
        <div style={{ marginTop: 18 }}>
          <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </div>
      </form>
    </div>
  );
}
