"use client";
import { useEffect, useState } from "react";
import type { Question } from "@/config/forms";

export default function LeadForm({
  offerSlug,
  track,
  questions,
}: {
  offerSlug: string;
  track: string;
  questions: Question[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ message: string } | null>(null);
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
    if (j.ok) setDone({ message: j.message });
    else setErr(j.error || "Something went wrong. Please try again.");
  }

  if (done)
    return (
      <div className="card">
        <p className="serif" style={{ fontSize: 24 }}>Thank you. 🤍</p>
        <p className="muted">{done.message}</p>
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
      <label>Phone / WhatsApp (optional)</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63…" />

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
          ) : (
            <input type={q.type} value={answers[q.id] || ""} onChange={(e) => setA(q.id, e.target.value)} placeholder={q.placeholder} required={q.required} />
          )}
        </div>
      ))}

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
