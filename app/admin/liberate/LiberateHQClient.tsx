"use client";

import { useState } from "react";
import type { LiberateHQ, PortalWeek } from "@/lib/content";

export default function LiberateHQClient({ initial }: { initial: LiberateHQ }) {
  const [hq, setHq] = useState<LiberateHQ>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function week(n: number, patch: Partial<PortalWeek>) {
    setHq((h) => ({ ...h, weeks: h.weeks.map((w) => (w.n === n ? { ...w, ...patch } : w)) }));
  }
  function resource(n: number, i: number, patch: Partial<{ label: string; url: string }> | null) {
    setHq((h) => ({
      ...h,
      weeks: h.weeks.map((w) => {
        if (w.n !== n) return w;
        const res = patch === null ? w.resources.filter((_, k) => k !== i) : w.resources.map((r, k) => (k === i ? { ...r, ...patch } : r));
        return { ...w, resources: res };
      }),
    }));
  }

  async function save() {
    setBusy(true); setMsg("");
    const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "setLiberate", liberate: hq }) });
    const j = await res.json();
    setBusy(false);
    setMsg(j.ok ? "Saved — members see this now." : j.error || "Could not save.");
    window.setTimeout(() => setMsg(""), 4000);
  }

  return (
    <div style={{ marginTop: 44 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div><h2 style={{ margin: 0 }}>Member portal</h2><p className="muted" style={{ margin: "4px 0 0" }}>What your cohort sees at /portal. Save once, it’s live.</p></div>
        <div className="row"><a className="btn ghost small" href="/portal/liberate" target="_blank" rel="noreferrer">Preview as a member</a><button className="btn small" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save portal"}</button></div>
      </div>
      {msg && <p className="note" style={{ marginTop: 12 }}>{msg}</p>}

      <div className="card" style={{ marginTop: 16 }}>
        <div className="grid2">
          <div><label>Cohort name</label><input value={hq.cohortLabel} onChange={(e) => setHq({ ...hq, cohortLabel: e.target.value })} /></div>
          <div><label>Start date</label><input type="date" value={hq.startDate ?? ""} onChange={(e) => setHq({ ...hq, startDate: e.target.value })} /></div>
          <div><label>Access code (members sign in with email + this)</label><input value={hq.accessCode} onChange={(e) => setHq({ ...hq, accessCode: e.target.value })} placeholder="e.g. HOME2026" /></div>
          <div><label>Default session link (Zoom)</label><input value={hq.sessionUrl ?? ""} onChange={(e) => setHq({ ...hq, sessionUrl: e.target.value })} placeholder="https://zoom.us/j/…" /></div>
          <div><label>Community link</label><input value={hq.communityUrl ?? ""} onChange={(e) => setHq({ ...hq, communityUrl: e.target.value })} placeholder="WhatsApp / Telegram / GHL community" /></div>
          <div><label>Community button label</label><input value={hq.communityLabel ?? ""} onChange={(e) => setHq({ ...hq, communityLabel: e.target.value })} placeholder="Open the circle" /></div>
        </div>
        <label>Welcome note (top of the portal)</label>
        <textarea rows={3} value={hq.welcome} onChange={(e) => setHq({ ...hq, welcome: e.target.value })} />
        <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>Put the access code in the Liberate welcome email in GoHighLevel. Anyone with a paid Liberate order can then sign in.</p>
      </div>

      <h3 style={{ marginTop: 32 }}>The twelve weeks</h3>
      <p className="muted" style={{ fontSize: 14 }}>Set each week’s date, and drop in the replay and resources after each session. Titles come from the roadmap.</p>
      {hq.weeks.map((w) => (
        <details key={w.n} className="card" style={{ marginTop: 10, padding: 0 }}>
          <summary style={{ cursor: "pointer", padding: "14px 18px", listStyle: "none", display: "flex", gap: 14, alignItems: "baseline" }}>
            <span className="kicker">Week {String(w.n).padStart(2, "0")}</span>
            <strong>{w.title}</strong>
            <span className="muted" style={{ fontSize: 13 }}>{w.date || "no date yet"}{w.replayUrl ? " · replay ✓" : ""}{w.resources.length ? ` · ${w.resources.length} resources` : ""}</span>
          </summary>
          <div style={{ padding: "0 18px 18px" }}>
            <div className="grid2">
              <div><label>Date</label><input type="date" value={w.date ?? ""} onChange={(e) => week(w.n, { date: e.target.value })} /></div>
              <div><label>Theme line</label><input value={w.theme} onChange={(e) => week(w.n, { theme: e.target.value })} /></div>
              <div><label>Session link (overrides default)</label><input value={w.sessionUrl ?? ""} onChange={(e) => week(w.n, { sessionUrl: e.target.value })} placeholder="https://zoom.us/j/…" /></div>
              <div><label>Replay (YouTube / Vimeo / any link)</label><input value={w.replayUrl ?? ""} onChange={(e) => week(w.n, { replayUrl: e.target.value })} placeholder="https://youtu.be/…" /></div>
            </div>
            <label>Notes for members</label>
            <textarea rows={3} value={w.notes ?? ""} onChange={(e) => week(w.n, { notes: e.target.value })} placeholder="What to bring, what to practice this week, a reflection prompt…" />
            <label>Resources</label>
            {w.resources.map((r, i) => (
              <div key={i} className="row" style={{ marginBottom: 8 }}>
                <input value={r.label} placeholder="Label (e.g. Week 3 meditation)" onChange={(e) => resource(w.n, i, { label: e.target.value })} style={{ flex: 1 }} />
                <input value={r.url} placeholder="https://…" onChange={(e) => resource(w.n, i, { url: e.target.value })} style={{ flex: 2 }} />
                <button type="button" className="btn small ghost" onClick={() => resource(w.n, i, null)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn small ghost" onClick={() => week(w.n, { resources: [...w.resources, { label: "", url: "" }] })}>Add a resource</button>
          </div>
        </details>
      ))}
      <div className="row" style={{ marginTop: 18 }}><button className="btn" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save portal"}</button></div>
    </div>
  );
}
