"use client";
import { useState } from "react";

const SAMPLE = `name,email,phone,offerSlug,source,sourceDetail
Maria Santos,maria@example.com,+639170000001,the-becoming,instagram,DM Aug
Jorge Cruz,jorge@example.com,,ignite,referral,from Pepe`;

export default function ImportClient() {
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | { imported: number; skipped: number; errors: string[] }>(null);
  const [err, setErr] = useState("");

  async function run() {
    setBusy(true);
    setErr("");
    setResult(null);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) setResult(j);
    else setErr(j.error || "Import failed.");
  }

  return (
    <div className="wrap">
      <p className="kicker">Payment Desk</p>
      <h1>Import your backlog</h1>
      <p className="muted">
        Paste your old warm leads as CSV. First line must be the headers below. Everyone imported is tagged <code>nurture</code> (and their offer, if given) so you can send one honest re-engagement message — not dropped into a hard sell.
      </p>
      <div className="note" style={{ margin: "12px 0" }}>
        Headers: <code>name,email,phone,offerSlug,source,sourceDetail</code><br />
        <span className="muted">Only name and email are required. <code>offerSlug</code> is the short offer name, e.g. <code>the-becoming</code>, <code>ignite</code>.</span>
      </div>
      <textarea rows={10} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={SAMPLE} style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }} />
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn" onClick={run} disabled={busy || !csv.trim()}>{busy ? "Importing…" : "Import"}</button>
        <button className="btn ghost small" onClick={() => setCsv(SAMPLE)}>Load example</button>
      </div>
      {err && <p style={{ color: "var(--terracotta)", marginTop: 12 }}>{err}</p>}
      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="serif" style={{ fontSize: 20 }}>Imported {result.imported} · skipped {result.skipped}</p>
          {result.errors.length > 0 && (
            <>
              <p className="muted">Skipped rows:</p>
              <ul>{result.errors.map((e, i) => <li key={i} className="muted" style={{ fontSize: 13 }}>{e}</li>)}</ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
