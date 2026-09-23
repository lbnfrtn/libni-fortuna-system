"use client";
import { useState } from "react";

export default function DeskLogin() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
      <p className="kicker">Studio &amp; Payment Desk</p>
      <h1>Sign in</h1>
      <p className="muted">For Libni and the team only. You stay signed in for 30 days on this device.</p>
      <form onSubmit={submit} className="card" style={{ marginTop: 16 }}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <label>Passcode</label>
        <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoComplete="current-password" />
        {err && <p style={{ color: "var(--terracotta)", marginTop: 12 }}>{err}</p>}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <button type="button" onClick={() => setShowHelp((v) => !v)} style={{ background: "none", border: 0, padding: 0, color: "var(--mist)", fontSize: 14, textDecoration: "underline", cursor: "pointer" }}>
            Forgot your passcode?
          </button>
        </div>
        {showHelp && (
          <div style={{ marginTop: 18, padding: "16px 18px", borderRadius: 12, background: "var(--lilac-tint, #f3eef7)", fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>
            <p style={{ margin: 0 }}><b>No problem.</b> Your admin is protected by a single passcode you chose when the site was set up — the same one for every backend page.</p>
            <p style={{ margin: "10px 0 0" }}>If you’re locked out, you can reset it from your Vercel dashboard: open the <b>libni-fortuna-system</b> project → <b>Environment Variables</b> → edit <b>DESK_PASSCODE</b> to a new passcode, then redeploy. It takes about two minutes.</p>
            <p style={{ margin: "10px 0 0", color: "var(--muted, #7d716d)" }}>Prefer help? Email <a href="mailto:hello@libni.co" style={{ color: "var(--plum)" }}>hello@libni.co</a> and it can be reset for you.</p>
          </div>
        )}
      </form>
    </div>
  );
}
