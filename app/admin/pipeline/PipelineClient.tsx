"use client";

import { useMemo, useState } from "react";

export interface Card {
  email: string; name: string; phone?: string; ghlContactId?: string;
  stage: string; derived: boolean; offers: string[]; interestedIn: string[]; sources: string[];
  lastActivity: string; paidPHP: number; balancePHP: number; openOrderId?: string;
  note?: string; nextAction?: string;
}

const MANUAL = ["call", "proposal", "lost"];
const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");
const age = (iso: string) => { const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000); return d <= 0 ? "today" : d === 1 ? "1 day" : `${d} days`; };

export default function PipelineClient({ cards: initial, stages, labels, ghlLocation }: { cards: Card[]; stages: string[]; labels: Record<string, string>; ghlLocation: string }) {
  const [cards, setCards] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? cards.filter((c) => `${c.name} ${c.email} ${c.offers.join(" ")} ${c.interestedIn.join(" ")}`.toLowerCase().includes(s)) : cards;
  }, [cards, q]);
  const columns = stages.filter((s) => s !== "lost");
  const lost = visible.filter((c) => c.stage === "lost");
  const sel = cards.find((c) => c.email === open);

  async function save(email: string, patch: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, ...patch }) });
    const j = await res.json();
    setBusy(false);
    if (!j.ok) { alert(j.error || "Could not save"); return; }
    // Re-derive locally: a manual stage sticks unless cleared.
    setCards((cs) => cs.map((c) => c.email !== email ? c : {
      ...c,
      note: "note" in patch ? String(patch.note ?? "") : c.note,
      nextAction: "nextAction" in patch ? String(patch.nextAction ?? "") : c.nextAction,
      stage: "stage" in patch ? (patch.stage ? String(patch.stage) : c.derived ? c.stage : "inquiry") : c.stage,
      derived: "stage" in patch ? !patch.stage : c.derived,
      lastActivity: new Date().toISOString(),
    }));
    if ("stage" in patch && !patch.stage) location.reload();
  }

  return (
    <div style={{ marginTop: 22 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a name, email or program" style={{ maxWidth: 360 }} />
        <span className="muted" style={{ fontSize: 13 }}>{visible.length} people · {lost.length} marked not now</span>
      </div>

      <div className="pipe">
        {columns.map((s) => {
          const list = visible.filter((c) => c.stage === s);
          const money = list.reduce((t, c) => t + (s === "paid" || s === "onboarded" ? c.paidPHP : c.balancePHP), 0);
          return (
            <div key={s} className="pipe-col">
              <div className="pipe-head">
                <b>{labels[s]}</b>
                <span>{list.length}{money > 0 ? ` · ${peso(money)}` : ""}</span>
              </div>
              {list.length === 0 && <p className="muted" style={{ fontSize: 12, padding: "8px 4px" }}>—</p>}
              {list.map((c) => (
                <button key={c.email} type="button" className={`pipe-card${open === c.email ? " on" : ""}`} onClick={() => setOpen(c.email)}>
                  <b>{c.name || c.email}</b>
                  <span>{(c.offers.length ? c.offers : c.interestedIn).slice(0, 2).join(" · ") || "—"}</span>
                  <small>{age(c.lastActivity)}{c.nextAction ? ` · ${c.nextAction}` : ""}</small>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {lost.length > 0 && (
        <details style={{ marginTop: 18 }}>
          <summary className="muted" style={{ cursor: "pointer", fontSize: 13 }}>Not now ({lost.length})</summary>
          <div className="row" style={{ marginTop: 10 }}>
            {lost.map((c) => <button key={c.email} type="button" className="chip" onClick={() => setOpen(c.email)}>{c.name || c.email}</button>)}
          </div>
        </details>
      )}

      {sel && (
        <div className="pipe-drawer" role="dialog" aria-label={sel.name}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="kicker">{labels[sel.stage]}{sel.derived ? "" : " · set by you"}</p>
              <h2 style={{ margin: "4px 0 2px", fontSize: 26 }}>{sel.name || sel.email}</h2>
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>{sel.email}{sel.phone ? ` · ${sel.phone}` : ""} · first seen {sel.lastActivity.slice(0, 10)}</p>
            </div>
            <button type="button" className="btn small ghost" onClick={() => setOpen(null)}>Close</button>
          </div>

          <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 16 }}>
            <div className="tile"><div className="n" style={{ fontSize: 22 }}>{peso(sel.paidPHP)}</div><div className="l">Paid</div></div>
            <div className="tile"><div className="n" style={{ fontSize: 22 }}>{sel.balancePHP ? peso(sel.balancePHP) : "—"}</div><div className="l">Owed</div></div>
            <div className="tile"><div className="n" style={{ fontSize: 16 }}>{(sel.offers.length ? sel.offers : sel.interestedIn).join(", ") || "—"}</div><div className="l">{sel.offers.length ? "Programs" : "Interested in"}</div></div>
          </div>

          <label>Move to</label>
          <div className="row">
            {MANUAL.map((s) => (
              <button key={s} type="button" disabled={busy} className={`btn small ${sel.stage === s && !sel.derived ? "" : "ghost"}`} onClick={() => save(sel.email, { stage: s })}>{labels[s]}</button>
            ))}
            {!sel.derived && <button type="button" disabled={busy} className="btn small ghost" onClick={() => save(sel.email, { stage: "" })}>Back to automatic</button>}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>Applied, link sent, paid and onboarded move on their own.</p>

          <label>Next action</label>
          <input defaultValue={sel.nextAction ?? ""} placeholder="e.g. Send proposal by Friday" onBlur={(e) => e.target.value !== (sel.nextAction ?? "") && save(sel.email, { nextAction: e.target.value })} />
          <label>Notes</label>
          <textarea rows={4} defaultValue={sel.note ?? ""} placeholder="What you want to remember about this person." onBlur={(e) => e.target.value !== (sel.note ?? "") && save(sel.email, { note: e.target.value })} />

          <div className="row" style={{ marginTop: 16 }}>
            {sel.openOrderId && <a className="btn small" href="/desk">Open in Payment Desk</a>}
            {!sel.openOrderId && sel.stage !== "paid" && sel.stage !== "onboarded" && <a className="btn small" href="/desk">Create a payment link</a>}
            {sel.ghlContactId && ghlLocation && <a className="btn small ghost" href={`https://app.gohighlevel.com/v2/location/${ghlLocation}/contacts/detail/${sel.ghlContactId}`} target="_blank" rel="noreferrer">Open in GoHighLevel</a>}
            <a className="btn small ghost" href={`mailto:${sel.email}`}>Email</a>
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>Sources: {sel.sources.join(", ") || "—"}</p>
        </div>
      )}
    </div>
  );
}
