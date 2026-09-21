"use client";
import { useState } from "react";

export default function ProofForm({ orderId }: { orderId: string }) {
  const [proofUrl, setProofUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch(`/api/orders/${orderId}/submit-proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofUrl }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) setMsg(j.message);
    else setErr(j.error || "Something went wrong.");
  }

  if (msg)
    return (
      <div className="card" style={{ marginTop: 12 }}>
        <p className="serif" style={{ fontSize: 20 }}>{msg}</p>
      </div>
    );

  return (
    <form onSubmit={submit} style={{ marginTop: 12 }}>
      <label>Link to your proof of payment</label>
      <input value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="https://…" required />
      {err && <p style={{ color: "var(--terracotta)", marginTop: 10 }}>{err}</p>}
      <div style={{ marginTop: 14 }}>
        <button className="btn" disabled={busy}>{busy ? "Sending…" : "I've paid — send my proof"}</button>
      </div>
    </form>
  );
}
