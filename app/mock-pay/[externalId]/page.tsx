"use client";
import { useState, use } from "react";

// TEST-MODE fake Xendit checkout. Stands in for the hosted GCash/card page so
// the full flow can be tested locally. Never shown once real keys exist.
export default function MockPay({ params }: { params: Promise<{ externalId: string }> }) {
  const { externalId } = use(params);
  const id = decodeURIComponent(externalId);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function pay() {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/mock/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ externalId: id }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) {
      setDone(j.redirect);
      setTimeout(() => (location.href = j.redirect), 1200);
    } else setErr(j.error || "Mock pay failed.");
  }

  return (
    <div className="wrap">
      <div className="note" style={{ marginBottom: 20 }}>
        🧪 <strong>Test mode.</strong> This is a stand-in for Xendit&rsquo;s real GCash/card checkout. No money moves. It exists so you can feel the whole flow before real keys are added.
      </div>
      <div className="card">
        <p className="kicker">Xendit (simulated)</p>
        <h1>Complete your payment</h1>
        <p className="muted">Order reference: <code>{id}</code></p>
        {done ? (
          <p className="serif" style={{ fontSize: 22 }}>Payment received — taking you to your welcome page…</p>
        ) : (
          <>
            {err && <p style={{ color: "var(--terracotta)" }}>{err}</p>}
            <button className="btn" onClick={pay} disabled={busy} style={{ marginTop: 12 }}>
              {busy ? "Processing…" : "Pay now (simulate GCash success)"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
