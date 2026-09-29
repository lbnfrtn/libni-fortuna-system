"use client";
import { useEffect, useState } from "react";
import type { FunnelData, Sequence, FunnelStep } from "@/lib/funnel";

const VARS = ["first_name", "offer", "payment_link", "booking_link", "welcome_link", "portal_link", "access_code", "amount", "due", "guide_link", "site"];

export default function FunnelClient({ initial, configured, from, me, owner }: { initial: FunnelData; configured: boolean; from: string; me: string; owner: boolean }) {
  const [data, setData] = useState<FunnelData>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [letter, setLetter] = useState({ subject: "", body: "", audience: "letters" });
  const [count, setCount] = useState<number | null>(null);

  function flash(kind: "ok" | "err", text: string) { setNote({ kind, text }); window.setTimeout(() => setNote(null), 6000); }

  async function post(body: Record<string, unknown>, label: string) {
    setBusy(label);
    try {
      const res = await fetch("/api/funnel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json();
      if (res.status === 401) { flash("err", "Your sign-in expired — reloading."); window.setTimeout(() => window.location.reload(), 1200); return null; }
      if (!res.ok || j.error) { flash("err", j.error || "Something went wrong."); return null; }
      if (j.funnel) setData(j.funnel);
      return j;
    } finally { setBusy(""); }
  }

  useEffect(() => { post({ action: "audienceCount", audience: letter.audience }, "").then((j) => j && setCount(j.count)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [letter.audience]);

  const active = data.enrolments.filter((e) => e.status === "active").sort((a, b) => a.nextAt.localeCompare(b.nextAt));
  const recent = [...data.log].reverse().slice(0, 40);
  const seqName = (id: string) => data.sequences.find((s) => s.id === id)?.name ?? id;
  const when = (iso: string) => { const d = new Date(iso).getTime() - Date.now(); if (d <= 0) return "due now"; const h = Math.round(d / 3.6e6); return h < 24 ? `in ${h}h` : `in ${Math.round(h / 24)}d`; };

  return (
    <div style={{ marginTop: 24 }}>
      {note && <div className={`note ${note.kind}`} style={{ position: "sticky", top: 8, zIndex: 5, background: note.kind === "ok" ? "var(--lilac)" : "#f6dcdc", color: "var(--ink)" }}>{note.text}</div>}

      {/* status */}
      <div className="card" style={{ borderColor: configured ? undefined : "var(--plum)" }}>
        {configured ? (
          <p style={{ margin: 0 }}><strong>Sending is on.</strong> Letters go out as <code>{from}</code>. Replies come to hello@libni.co.</p>
        ) : (
          <>
            <p style={{ margin: 0 }}><strong>Sending isn&rsquo;t connected yet.</strong> Everything below still works — letters are recorded here instead of delivered — so you can read and edit every word first. When you&rsquo;re ready, I&rsquo;ll connect it (one key in Vercel and three DNS records) and the next letters go out for real.</p>
          </>
        )}
        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          <span className="pill paid">{active.length} people in sequences</span>
          <span className="pill submitted">{data.suppressed.length} unsubscribed</span>
          <button className="btn small ghost" disabled={busy === "run"} onClick={() => post({ action: "runDue" }, "run").then((j) => j && flash("ok", `Sent ${j.sent} due letter${j.sent === 1 ? "" : "s"}${j.failed ? `, ${j.failed} failed` : ""}.`))}>{busy === "run" ? "Sending…" : "Send what's due now"}</button>
        </div>
      </div>

      {/* sequences */}
      <h2 style={{ marginTop: 40 }}>Sequences</h2>
      <p className="muted" style={{ maxWidth: "70ch" }}>Each one starts from something a person does. Days are counted from the previous letter. You can use {VARS.map((v) => <code key={v} style={{ fontSize: 12, marginRight: 6 }}>{`{{${v}}}`}</code>)} anywhere — they fill in for each person.</p>
      {data.sequences.map((s) => (
        <SequenceCard key={s.id} seq={s} open={open === s.id} onOpen={() => setOpen(open === s.id ? null : s.id)} inIt={data.enrolments.filter((e) => e.sequenceId === s.id && e.status === "active").length}
          busy={busy} me={me}
          onSave={(seq) => post({ action: "saveSequence", sequence: seq }, `save-${s.id}`).then((j) => j && flash("ok", `Saved “${seq.name}”.`))}
          onTest={(st) => post({ action: "test", subject: st.subject, body: st.body }, `test-${st.id}`).then((j) => j && flash("ok", j.mock ? `Test recorded (sending not connected yet) — it would go to ${j.to}.` : `Test sent to ${j.to}.`))}
        />
      ))}

      {/* letter */}
      <h2 id="letter" style={{ marginTop: 48 }}>Write a letter</h2>
      <p className="muted" style={{ maxWidth: "70ch" }}>One letter, to everyone who asked for them. Plain words — blank line between paragraphs, links become clickable. Send yourself a test first.</p>
      <div className="card">
        <label>To</label>
        <select value={letter.audience} onChange={(e) => setLetter({ ...letter, audience: e.target.value })}>
          <option value="letters">Letters &amp; free-guide subscribers{count != null && letter.audience === "letters" ? ` (${count})` : ""}</option>
          <option value="everyone">Everyone who ever signed up or applied{count != null && letter.audience === "everyone" ? ` (${count})` : ""}</option>
        </select>
        <label>Subject</label>
        <input value={letter.subject} onChange={(e) => setLetter({ ...letter, subject: e.target.value })} placeholder="A soft reminder, {{first_name}}" />
        <label>The letter</label>
        <textarea rows={12} value={letter.body} onChange={(e) => setLetter({ ...letter, body: e.target.value })} placeholder={"{{first_name}},\n\n…\n\n— Libni"} />
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn ghost" disabled={busy === "lt" || !letter.subject || !letter.body} onClick={() => post({ action: "test", subject: letter.subject, body: letter.body }, "lt").then((j) => j && flash("ok", j.mock ? "Test recorded (sending not connected yet)." : `Test sent to ${j.to}.`))}>Send me a test</button>
          <button className="btn" disabled={!owner || busy === "send" || !letter.subject || !letter.body} onClick={() => {
            if (!window.confirm(`Send this letter to ${count ?? "all"} people now?`)) return;
            post({ action: "letter", audience: letter.audience, subject: letter.subject, body: letter.body }, "send").then((j) => { if (j) { flash("ok", j.mock ? `Recorded for ${j.sent} people (sending not connected yet).` : `Sent to ${j.sent} people${j.failed ? `, ${j.failed} failed` : ""}.`); setLetter({ ...letter, subject: "", body: "" }); } });
          }}>{busy === "send" ? "Sending…" : `Send to ${count ?? "…"} people`}</button>
          {!owner && <span className="muted" style={{ fontSize: 13 }}>Only Libni can send to the list.</span>}
        </div>
      </div>

      {/* people */}
      <h2 style={{ marginTop: 48 }}>People in sequences right now</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>Who</th><th>Sequence</th><th>Next letter</th><th></th></tr></thead>
          <tbody>
            {active.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{e.email}</span></td>
                <td>{seqName(e.sequenceId)}</td>
                <td>{data.sequences.find((s) => s.id === e.sequenceId)?.steps[e.step]?.subject ?? "—"}<br /><span className="muted" style={{ fontSize: 12 }}>{when(e.nextAt)}</span></td>
                <td style={{ textAlign: "right" }}><button className="btn small ghost" disabled={busy === e.id} onClick={() => post({ action: "stopEnrolment", id: e.id }, e.id)}>Stop</button></td>
              </tr>
            ))}
            {active.length === 0 && <tr><td colSpan={4} className="muted" style={{ padding: 20 }}>Nobody right now. People appear here the moment they sign up, apply or get a payment link.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* log */}
      <h2 style={{ marginTop: 48 }}>Recently sent</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>When</th><th>To</th><th>Subject</th><th>Status</th></tr></thead>
          <tbody>
            {recent.map((l, i) => (
              <tr key={i}><td className="muted" style={{ fontSize: 12, whiteSpace: "nowrap" }}>{l.at.slice(0, 16).replace("T", " ")}</td><td style={{ fontSize: 13 }}>{l.to}</td><td style={{ fontSize: 13 }}>{l.subject}<br /><span className="muted" style={{ fontSize: 11 }}>{l.kind}{l.sequenceId ? ` · ${seqName(l.sequenceId)}` : ""}</span></td><td><span className={`pill ${l.ok ? (l.mock ? "pending" : "paid") : "cancelled"}`}>{l.ok ? (l.mock ? "recorded" : "sent") : "failed"}</span>{l.error && <div className="muted" style={{ fontSize: 11 }}>{l.error}</div>}</td></tr>
            ))}
            {recent.length === 0 && <tr><td colSpan={4} className="muted" style={{ padding: 20 }}>Nothing sent yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {data.suppressed.length > 0 && (
        <>
          <h2 style={{ marginTop: 48 }}>Unsubscribed</h2>
          <div className="card"><div className="row" style={{ gap: 8 }}>{data.suppressed.map((e) => <span key={e} className="chip">{e} <button className="muted" style={{ all: "unset", cursor: "pointer", marginLeft: 6, fontSize: 11 }} title="They asked to come back" onClick={() => post({ action: "resubscribe", email: e }, e)}>↺</button></span>)}</div></div>
        </>
      )}
    </div>
  );
}

function SequenceCard({ seq: initial, open, onOpen, inIt, busy, onSave, onTest }: { seq: Sequence; open: boolean; onOpen: () => void; inIt: number; busy: string; me: string; onSave: (s: Sequence) => void; onTest: (s: FunnelStep) => void }) {
  const [seq, setSeq] = useState<Sequence>(initial);
  useEffect(() => setSeq(initial), [initial]);
  const setStep = (i: number, patch: Partial<FunnelStep>) => setSeq({ ...seq, steps: seq.steps.map((s, n) => (n === i ? { ...s, ...patch } : s)) });
  return (
    <div className="card" style={{ marginBottom: 10, padding: 0, borderColor: seq.active ? undefined : "var(--line)" }}>
      <button type="button" onClick={onOpen} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", width: "100%", padding: "16px 18px", boxSizing: "border-box" }}>
        <span className={`pill ${seq.active ? "paid" : "cancelled"}`} style={{ flexShrink: 0 }}>{seq.active ? "on" : "paused"}</span>
        <span style={{ flex: 1 }}><strong>{seq.name}</strong><br /><span className="muted" style={{ fontSize: 13 }}>{seq.description}</span></span>
        <span className="muted" style={{ fontSize: 12, whiteSpace: "nowrap" }}>{seq.steps.length} letter{seq.steps.length === 1 ? "" : "s"} · {inIt} in it · {open ? "Close" : "Edit"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px" }}>
          <div className="grid2">
            <div><label>Name</label><input value={seq.name} onChange={(e) => setSeq({ ...seq, name: e.target.value })} /></div>
            <div><label>Starts when</label><input value={seq.triggers.join(", ")} onChange={(e) => setSeq({ ...seq, triggers: e.target.value.split(",").map((t) => t.trim()) })} /><span className="muted" style={{ fontSize: 11 }}>e.g. paid:ignite · applied:* · newsletter</span></div>
          </div>
          <label>What it&rsquo;s for</label><input value={seq.description} onChange={(e) => setSeq({ ...seq, description: e.target.value })} />
          <div className="row" style={{ marginTop: 14, gap: 18 }}>
            <label className="check" style={{ margin: 0, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}><input type="checkbox" checked={seq.active} onChange={(e) => setSeq({ ...seq, active: e.target.checked })} /> Sending</label>
            <label className="check" style={{ margin: 0, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}><input type="checkbox" checked={Boolean(seq.stopOnPaid)} onChange={(e) => setSeq({ ...seq, stopOnPaid: e.target.checked })} /> Stop when they pay</label>
            <label className="check" style={{ margin: 0, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}><input type="checkbox" checked={Boolean(seq.stopOnStage)} onChange={(e) => setSeq({ ...seq, stopOnStage: e.target.checked })} /> Stop when I mark call / proposal / not now</label>
          </div>
          {seq.steps.map((st, i) => (
            <div key={st.id} style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Letter {i + 1}</strong>
                <span className="row" style={{ gap: 8 }}>
                  <span className="muted" style={{ fontSize: 13 }}>{i === 0 ? "sent" : "days after the previous"}</span>
                  <input type="number" min={0} max={90} value={st.delayDays} onChange={(e) => setStep(i, { delayDays: Number(e.target.value) })} style={{ width: 70 }} />
                  <span className="muted" style={{ fontSize: 13 }}>{i === 0 ? (st.delayDays === 0 ? "straight away" : "days after they act") : "days later"}</span>
                </span>
              </div>
              <label>Subject</label><input value={st.subject} onChange={(e) => setStep(i, { subject: e.target.value })} />
              <label>Letter</label><textarea rows={Math.min(16, Math.max(6, st.body.split("\n").length + 1))} value={st.body} onChange={(e) => setStep(i, { body: e.target.value })} />
              <div className="row" style={{ marginTop: 10 }}>
                <button type="button" className="btn small ghost" disabled={busy === `test-${st.id}`} onClick={() => onTest(st)}>Send me a test</button>
                <button type="button" className="btn small ghost" onClick={() => setSeq({ ...seq, steps: seq.steps.filter((_, n) => n !== i) })}>Remove this letter</button>
              </div>
            </div>
          ))}
          <div className="row" style={{ marginTop: 18, justifyContent: "space-between" }}>
            <button type="button" className="btn small ghost" onClick={() => setSeq({ ...seq, steps: [...seq.steps, { id: `${seq.id}-${Date.now().toString(36)}`, delayDays: 3, subject: "", body: "" }] })}>Add a letter</button>
            <button type="button" className="btn small" disabled={busy === `save-${seq.id}`} onClick={() => onSave(seq)}>{busy === `save-${seq.id}` ? "Saving…" : "Save"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
