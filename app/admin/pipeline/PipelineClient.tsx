"use client";

import { useEffect, useMemo, useState } from "react";
import "./pipeline.css";

export interface Card {
  email: string; name: string; phone?: string;
  stage: string; derived: boolean; offers: string[]; interestedIn: string[]; sources: string[];
  firstSeen: string; lastActivity: string; paidPHP: number; balancePHP: number; openOrderId?: string;
  note?: string; nextAction?: string;
  tags: string[];
  orders: { id: string; offerName: string; totalPHP: number; amountPaidPHP: number; balancePHP: number; status: string; instalments: { n: number; amountPHP: number; dueDate: string; status: string }[] }[];
  answers: { form: string; at: string; items: [string, string][] }[];
  timeline: { at: string; text: string }[];
}

// One colour per stage, used for the column dot and the stage badge.
const STAGE_COLOUR: Record<string, string> = {
  inquiry: "#8e8e93", applied: "#0a84ff", call: "#5e5ce6", proposal: "#bf5af2", link: "#ff9f0a",
  awaiting: "#ffb340", paid: "#34c759", onboarded: "#30b0c7", lost: "#aeaeb2",
};
// What makes an automatic column fill itself — shown when you try to drag into it.
const AUTO_HINT: Record<string, string> = {
  inquiry: "fills itself when someone reaches out",
  applied: "fills itself when someone applies",
  link: "fills itself when a payment link is sent",
  awaiting: "fills itself when bank-transfer proof comes in",
  paid: "fills itself when a payment clears",
  onboarded: "fills itself when onboarding is ticked off",
};
const AVATAR = ["#5e5ce6", "#0a84ff", "#30b0c7", "#34c759", "#ff9f0a", "#ff375f", "#bf5af2", "#a2845e"];

const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");
const age = (iso: string) => { const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000); return d <= 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`; };
const day = (iso: string) => new Date(iso).toLocaleDateString("en-PH", { day: "numeric", month: "short", year: "numeric" });
const initials = (c: Card) => (c.name || c.email).split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
const avatarColour = (email: string) => AVATAR[[...email].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % AVATAR.length];
// Philippine mobiles are often written 09…; WhatsApp wants 639….
const whatsapp = (phone: string) => { let d = phone.replace(/\D/g, ""); if (d.startsWith("0")) d = "63" + d.slice(1); return `https://wa.me/${d}`; };

export default function PipelineClient({ cards: initial, stages, labels, manual }: { cards: Card[]; stages: string[]; labels: Record<string, string>; manual: string[] }) {
  const [cards, setCards] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? cards.filter((c) => `${c.name} ${c.email} ${c.offers.join(" ")} ${c.interestedIn.join(" ")}`.toLowerCase().includes(s)) : cards;
  }, [cards, q]);
  const sel = cards.find((c) => c.email === open);

  function flash(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 2600);
  }

  // Esc closes the record; the page behind doesn't scroll while it's open.
  useEffect(() => {
    if (!sel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [sel]);

  async function save(email: string, patch: Record<string, unknown>): Promise<boolean> {
    setBusy(true);
    try {
      const res = await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, ...patch }) });
      if (res.status === 401) { location.reload(); return false; }
      const j = await res.json();
      if (!j.ok) { flash(j.error || "Couldn't save — try again."); return false; }
    } catch {
      flash("Couldn't save — check your connection.");
      return false;
    } finally {
      setBusy(false);
    }
    setCards((cs) => cs.map((c) => c.email !== email ? c : {
      ...c,
      note: "note" in patch ? String(patch.note ?? "") : c.note,
      nextAction: "nextAction" in patch ? String(patch.nextAction ?? "") : c.nextAction,
      stage: "stage" in patch && patch.stage ? String(patch.stage) : c.stage,
      derived: "stage" in patch ? !patch.stage : c.derived,
      lastActivity: new Date().toISOString(),
    }));
    // Going back to automatic: the server re-works-out the stage from what actually happened.
    if ("stage" in patch && !patch.stage) location.reload();
    return true;
  }

  async function moveTo(email: string, stage: string) {
    const c = cards.find((x) => x.email === email);
    if (!c || (c.stage === stage && !c.derived)) return;
    if (await save(email, { stage })) flash(`${c.name || c.email} → ${labels[stage]}`);
  }

  async function saveField(email: string, patch: Record<string, unknown>) {
    if (await save(email, patch)) { setSaved(true); window.setTimeout(() => setSaved(false), 1600); }
  }

  return (
    <div className="pb">
      <div className="pb-top">
        <div>
          <p className="kicker">Pipeline</p>
          <h1>Every client, where they really are</h1>
          <p className="muted">Drag someone into <b>Call booked</b>, <b>Proposal sent</b> or <b>Not now</b>. The other columns move by themselves as people apply, get a link, pay and finish onboarding. Click anyone to open their record.</p>
        </div>
        <div className="pb-search">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people or programs" aria-label="Search people" />
        </div>
      </div>

      <div className={`pb-board${dragging ? " is-dragging" : ""}`}>
        {stages.map((s) => {
          const list = visible.filter((c) => c.stage === s);
          const isManual = manual.includes(s);
          const money = list.reduce((t, c) => t + (s === "paid" || s === "onboarded" ? c.paidPHP : c.balancePHP), 0);
          return (
            <section
              key={s}
              className={`pb-col ${isManual ? "manual" : "auto"}${over === s ? " over" : ""}${s === "lost" ? " lost" : ""}`}
              onDragOver={(e) => { if (isManual) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (over !== s) setOver(s); } }}
              onDragLeave={() => setOver((o) => (o === s ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                const email = e.dataTransfer.getData("text/plain");
                setOver(null); setDragging(null);
                if (isManual) moveTo(email, s);
                else flash(`${labels[s]} ${AUTO_HINT[s] ?? "moves on its own"}.`);
              }}
            >
              <header className="pb-col-head">
                <span className="pb-dot" style={{ background: STAGE_COLOUR[s] }} />
                <b>{labels[s]}</b>
                <span className="pb-count">{list.length}</span>
              </header>
              <p className="pb-money">{money > 0 ? peso(money) : isManual ? "Set by you" : "Automatic"}</p>
              <div className="pb-list">
                {list.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData("text/plain", c.email); e.dataTransfer.effectAllowed = "move"; setDragging(c.email); }}
                    onDragEnd={() => { setDragging(null); setOver(null); }}
                    className={`pb-card${open === c.email ? " on" : ""}${dragging === c.email ? " ghosted" : ""}`}
                    onClick={() => setOpen(c.email)}
                  >
                    <span className="pb-av" style={{ background: avatarColour(c.email) }}>{initials(c)}</span>
                    <span className="pb-card-main">
                      <b>{c.name || c.email}</b>
                      <small>{(c.offers.length ? c.offers : c.interestedIn).slice(0, 2).join(" · ") || "—"}</small>
                      <span className="pb-meta">
                        {age(c.lastActivity)}
                        {c.balancePHP > 0 && <em className="owed">{peso(c.balancePHP)} owed</em>}
                      </span>
                      {c.nextAction && <span className="pb-next">{c.nextAction}</span>}
                    </span>
                  </button>
                ))}
                {list.length === 0 && <p className="pb-empty">{isManual ? "Drag someone here" : "Nobody here right now"}</p>}
              </div>
            </section>
          );
        })}
      </div>

      {sel && (
        <>
          <div className="pb-scrim" onClick={() => setOpen(null)} />
          <aside className="pb-sheet" role="dialog" aria-modal="true" aria-label={sel.name || sel.email}>
            <header className="pb-sheet-head">
              <span className="pb-av lg" style={{ background: avatarColour(sel.email) }}>{initials(sel)}</span>
              <div className="pb-who">
                <h2>{sel.name || sel.email}</h2>
                <p>{sel.email}{sel.phone ? ` · ${sel.phone}` : ""}</p>
                <span className="pb-badge" style={{ background: STAGE_COLOUR[sel.stage] }}>{labels[sel.stage]}</span>
              </div>
              <button type="button" className="pb-x" aria-label="Close" onClick={() => setOpen(null)}>×</button>
            </header>

            <div className="pb-actions">
              <a className="btn small ghost" href={`mailto:${sel.email}`}>Email</a>
              {sel.phone && <a className="btn small ghost" href={whatsapp(sel.phone)} target="_blank" rel="noreferrer">WhatsApp</a>}
              {sel.openOrderId
                ? <a className="btn small" href="/desk">Open their payment</a>
                : sel.stage !== "paid" && sel.stage !== "onboarded" && <a className="btn small" href="/desk">Create a payment link</a>}
            </div>

            <section className="pb-group">
              <h3>Stage</h3>
              <div className="pb-seg" role="group" aria-label="Stage">
                <button type="button" disabled={busy} className={sel.derived ? "on" : ""} onClick={() => !sel.derived && save(sel.email, { stage: "" })}>Automatic</button>
                {manual.map((s) => (
                  <button key={s} type="button" disabled={busy} className={!sel.derived && sel.stage === s ? "on" : ""} onClick={() => moveTo(sel.email, s)}>{labels[s]}</button>
                ))}
              </div>
              <p className="pb-hint">
                {sel.derived
                  ? <>Right now: <b>{labels[sel.stage]}</b> — this moves by itself as they apply, pay and finish onboarding.</>
                  : <>You set this by hand. Choose <b>Automatic</b> to let the system place them again.</>}
              </p>
            </section>

            <section className="pb-group">
              <div className="pb-tiles">
                <div><b>{peso(sel.paidPHP)}</b><span>Paid</span></div>
                <div><b>{sel.balancePHP ? peso(sel.balancePHP) : "—"}</b><span>Still owed</span></div>
                <div><b className="small">{(sel.offers.length ? sel.offers : sel.interestedIn).join(", ") || "—"}</b><span>{sel.offers.length ? "Programs" : "Interested in"}</span></div>
              </div>
            </section>

            <section className="pb-group">
              <h3>Next step & notes {saved && <span className="pb-saved">Saved</span>}</h3>
              <label htmlFor="pb-next">Next step</label>
              <input id="pb-next" key={`n-${sel.email}`} defaultValue={sel.nextAction ?? ""} placeholder="e.g. Send proposal by Friday" onBlur={(e) => e.target.value !== (sel.nextAction ?? "") && saveField(sel.email, { nextAction: e.target.value })} />
              <label htmlFor="pb-note">Notes</label>
              <textarea id="pb-note" key={`t-${sel.email}`} rows={4} defaultValue={sel.note ?? ""} placeholder="What you want to remember about this person." onBlur={(e) => e.target.value !== (sel.note ?? "") && saveField(sel.email, { note: e.target.value })} />
              <p className="pb-hint">Saves when you click away.</p>
            </section>

            {sel.orders.length > 0 && (
              <section className="pb-group">
                <h3>Payments</h3>
                {sel.orders.map((o) => (
                  <div key={o.id} className="pb-order">
                    <div className="pb-order-head">
                      <b>{o.offerName}</b>
                      <span className={`pill ${o.status === "verified" ? "paid" : o.status}`}>{o.status === "pending" ? "Awaiting payment" : o.status === "submitted" ? "Proof sent" : o.status === "cancelled" ? "Cancelled" : "Paid"}</span>
                    </div>
                    <p className="pb-hint" style={{ margin: "2px 0 8px" }}>{peso(o.amountPaidPHP)} of {peso(o.totalPHP)} paid{o.balancePHP > 0 && o.status !== "cancelled" ? ` · ${peso(o.balancePHP)} to go` : ""}</p>
                    {o.instalments.length > 1 && (
                      <ul className="pb-inst">
                        {o.instalments.map((i) => {
                          const overdue = i.status !== "paid" && i.dueDate < new Date().toISOString().slice(0, 10);
                          return (
                            <li key={i.n}>
                              <span>Payment {i.n}</span>
                              <span>{peso(i.amountPHP)}</span>
                              <span className={i.status === "paid" ? "ok" : overdue ? "late" : ""}>{i.status === "paid" ? "Paid" : overdue ? `Overdue · ${day(i.dueDate)}` : `Due ${day(i.dueDate)}`}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {sel.answers.map((a, i) => (
              <section key={i} className="pb-group">
                <h3>Their answers · {a.form}</h3>
                <p className="pb-hint" style={{ marginTop: -4 }}>{day(a.at)} · private to you</p>
                <dl className="pb-answers">
                  {a.items.map(([question, answer], j) => (
                    <div key={j}><dt>{question}</dt><dd>{answer}</dd></div>
                  ))}
                </dl>
              </section>
            ))}

            {sel.timeline.length > 0 && (
              <section className="pb-group">
                <h3>Timeline</h3>
                <ol className="pb-timeline">
                  {sel.timeline.map((t, i) => <li key={i}><span>{day(t.at)}</span>{t.text}</li>)}
                </ol>
              </section>
            )}

            <section className="pb-group">
              <h3>Where they came from</h3>
              <div className="pb-chips">
                {sel.sources.map((s) => <span key={s} className="chip">{s}</span>)}
                {sel.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <p className="pb-hint">First seen {day(sel.firstSeen)}.</p>
            </section>
          </aside>
        </>
      )}

      {toast && <div className="pb-toast" role="status">{toast}</div>}
    </div>
  );
}
