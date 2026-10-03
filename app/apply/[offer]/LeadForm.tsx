"use client";
import { useEffect, useState } from "react";
import type { Question, PhoneField } from "@/config/forms";
import type { SelfPay } from "@/lib/lead";
import { peso } from "@/lib/util";

export default function LeadForm({
  offerSlug,
  track,
  questions,
  phone: phoneField,
}: {
  offerSlug: string;
  track: string;
  questions: Question[];
  phone?: PhoneField;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ message: string; pay?: SelfPay | null } | null>(null);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [src, setSrc] = useState("");

  // Capture source automatically: UTM params + ?src= shortcode.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const u: Record<string, string> = {};
    p.forEach((v, k) => {
      if (k.startsWith("utm_")) u[k] = v;
    });
    setUtm(u);
    setSrc(p.get("src") || "");
  }, []);

  function setA(id: string, v: string) {
    setAnswers((a) => ({ ...a, [id]: v }));
  }
  function toggleMulti(id: string, opt: string) {
    setAnswers((a) => {
      const cur = (a[id] || "").split(", ").filter(Boolean);
      const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
      return { ...a, [id]: next.join(", ") };
    });
  }
  // A select answer can redirect the whole application (e.g. “start with a Power Hour first”).
  const detour = questions.find((q) => q.detour && q.detourOn && answers[q.id] === q.detourOn)?.detour;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phone || undefined,
        offerSlug,
        track,
        answers,
        consent,
        source: src || utm.utm_source || answers.how_found || "website",
        sourceDetail: src || utm.utm_content || answers.how_found || undefined,
        utm: Object.keys(utm).length ? utm : undefined,
        company_website: honeypot || undefined,
      }),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) setDone({ message: j.message, pay: j.pay });
    else setErr(j.error || "Something went wrong. Please try again.");
  }

  if (done)
    return (
      <div className="card">
        <p className="serif" style={{ fontSize: 24 }}>Thank you. 🤍</p>
        <p className="muted">{done.message}</p>
        {done.pay && (
          <div style={{ marginTop: 18 }}>
            <p style={{ margin: "0 0 12px" }}>
              <b>{peso(done.pay.amount)}</b> {done.pay.plan === "instalment" ? `now — payment 1 of ${done.pay.instalments.length}` : "in full"}
              {done.pay.plan === "instalment" && (
                <span className="muted" style={{ display: "block", fontSize: 14 }}>
                  Then {done.pay.instalments.slice(1).map((i) => `${peso(i.amount)} on ${i.dueDate}`).join(" · ")}
                </span>
              )}
            </p>
            <div className="row">
              {done.pay.link && <a className="btn" href={done.pay.link}>Pay with GCash, Maya or card</a>}
              <a className="btn ghost" href={done.pay.manualPayUrl}>Pay by bank transfer</a>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>If you close this page, the link in your email still works.</p>
          </div>
        )}
        {detour && <p style={{ marginTop: 16 }}><a className="btn" href={detour.href}>{detour.cta} →</a></p>}
      </div>
    );

  return (
    <form onSubmit={submit} className="card">
      <div className="grid2">
        <div>
          <label>Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>
      <label>{phoneField ? `${phoneField.label}${phoneField.required ? " *" : ""}` : "Phone / WhatsApp (optional)"}</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63…" required={phoneField?.required} />

      {questions.map((q) => (
        <div key={q.id}>
          <label>{q.label}{q.required ? " *" : ""}</label>
          {q.type === "textarea" ? (
            <textarea rows={3} value={answers[q.id] || ""} onChange={(e) => setA(q.id, e.target.value)} placeholder={q.placeholder} required={q.required} />
          ) : q.type === "select" ? (
            <select value={answers[q.id] || ""} onChange={(e) => setA(q.id, e.target.value)} required={q.required}>
              <option value="">Choose…</option>
              {q.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : q.type === "multi" ? (
            <div className="multi">
              {q.options?.map((o) => {
                const on = (answers[q.id] || "").split(", ").includes(o);
                return (
                  <label key={o} className={`multi-opt${on ? " on" : ""}`}>
                    <input type="checkbox" checked={on} onChange={() => toggleMulti(q.id, o)} />
                    {o}
                  </label>
                );
              })}
              {q.required && <input tabIndex={-1} aria-hidden style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} value={answers[q.id] || ""} onChange={() => {}} required />}
            </div>
          ) : (
            <input type={q.type} value={answers[q.id] || ""} onChange={(e) => setA(q.id, e.target.value)} placeholder={q.placeholder} required={q.required} />
          )}
        </div>
      ))}

      {detour && (
        <div className="note" style={{ marginTop: 20, padding: 22, background: "var(--lilac-tint)", color: "var(--ink)" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.35 }}>{detour.text}</p>
          <div className="row" style={{ marginTop: 14 }}>
            <a className="btn" href={detour.href}>{detour.cta} →</a>
            <span className="muted" style={{ fontSize: 13 }}>Or keep going below and send the application anyway.</span>
          </div>
        </div>
      )}

      {/* Honeypot — hidden from people, catches bots. */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <label>Company website</label>
        <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontWeight: 400 }}>
        <input type="checkbox" style={{ width: "auto", marginTop: 4 }} checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span className="muted" style={{ fontSize: 14 }}>
          I agree to be contacted about my enquiry and to my details being stored, per the Philippine Data Privacy Act. Your answers stay private.
        </span>
      </label>

      {err && <p style={{ color: "var(--terracotta)", marginTop: 12 }}>{err}</p>}
      <div style={{ marginTop: 18 }}>
        <button className="btn" disabled={busy}>{busy ? "Sending…" : "Send"}</button>
      </div>
    </form>
  );
}
