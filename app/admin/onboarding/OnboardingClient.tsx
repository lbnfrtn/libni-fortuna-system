"use client";
import { useState } from "react";

export type ObRow = {
  id: string; client: string; email: string; offer: string; paidAt: string; hoursSincePaid: number;
  ob: { welcomeSent?: boolean; agreementSigned?: boolean; intakeDone?: boolean; sessionBooked?: boolean; complete?: boolean; notes?: string };
};

const STEPS: [keyof ObRow["ob"], string][] = [
  ["welcomeSent", "Welcome sent"],
  ["agreementSigned", "Agreement signed"],
  ["intakeDone", "Intake done"],
  ["sessionBooked", "First session booked"],
];

export default function OnboardingClient({ initial }: { initial: ObRow[] }) {
  const [rows, setRows] = useState(initial);

  async function toggle(id: string, key: string, value: boolean) {
    const res = await fetch(`/api/orders/${id}/onboarding`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }),
    });
    const j = await res.json();
    if (j.ok) setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ob: j.onboarding } : r)));
  }
  async function saveNotes(id: string, notes: string) {
    await fetch(`/api/orders/${id}/onboarding`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes }),
    });
  }

  const pending = rows.filter((r) => !r.ob.complete);
  const done = rows.filter((r) => r.ob.complete);

  return (
    <>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>Client</th><th>Program</th><th>Steps</th><th>Notes</th></tr></thead>
          <tbody>
            {pending.length === 0 && <tr><td colSpan={4} className="muted" style={{ padding: 20 }}>Nobody waiting. Everyone&rsquo;s onboarded. 🤍</td></tr>}
            {pending.map((r) => {
              const nudge = r.hoursSincePaid > 48;
              return (
                <tr key={r.id}>
                  <td>
                    <strong>{r.client}</strong><br />
                    <span className="muted" style={{ fontSize: 12 }}>{r.email}</span><br />
                    {nudge && <span className="pill pending" style={{ marginTop: 6 }}>paid {Math.floor(r.hoursSincePaid / 24)}d ago · nudge?</span>}
                  </td>
                  <td>{r.offer}<br /><span className="muted" style={{ fontSize: 12 }}>paid {r.paidAt.slice(0, 10)}</span></td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {STEPS.map(([k, label]) => (
                        <label key={k} className="check" style={{ textTransform: "none", margin: 0, fontWeight: 400 }}>
                          <input type="checkbox" checked={!!r.ob[k]} onChange={(e) => toggle(r.id, k, e.target.checked)} /> {label}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td style={{ minWidth: 200 }}>
                    <textarea rows={3} defaultValue={r.ob.notes || ""} placeholder="e.g. prefers Viber, session Tues 3pm" onBlur={(e) => saveNotes(r.id, e.target.value)} style={{ fontSize: 13 }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {done.length > 0 && (
        <>
          <h2 style={{ marginTop: 32 }}>Onboarded</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead><tr><th>Client</th><th>Program</th><th>Status</th></tr></thead>
              <tbody>
                {done.map((r) => (
                  <tr key={r.id}><td><strong>{r.client}</strong></td><td>{r.offer}</td><td><span className="pill paid">complete</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
