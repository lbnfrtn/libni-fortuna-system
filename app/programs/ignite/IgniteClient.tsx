"use client";
import { useState } from "react";
import Link from "next/link";

type Step = "format" | "pay" | "schedule" | "onboard" | "done";
type Format = "online" | "in-person" | null;

const PRICES = { online: 7777, "in-person": 8888 };
const FORMATS = { online: "Online", "in-person": "In Person" };

// Mock: in real app, these would fetch from the backend
const PAYMENT_METHODS = ["Xendit Checkout (cards, e-wallets)", "Manual Bank Transfer"];
const TIMES = ["9:00 AM Manila", "2:00 PM Manila", "5:00 PM Manila", "10:00 AM Manila (next day)"];
const ONBOARD_STEPS = [
  "Complete your intake form (5 min)",
  "Read what to expect",
  "How to reach us",
  "Get your session prep checklist"
];

export default function IgniteClient() {
  const [step, setStep] = useState<Step>("format");
  const [format, setFormat] = useState<Format>(null);
  const [payMethod, setPayMethod] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const price = format ? PRICES[format] : 0;

  function startPayment() {
    if (!format) return;
    // In real app: POST to /api/orders to create order, then redirect to Xendit checkout or show manual transfer page
    console.log(`Starting payment for ${format} Ignite: ₱${price}`);
    setStep("pay");
  }

  function completePayment() {
    // Simulate payment completion
    setStep("schedule");
  }

  function bookTime() {
    if (!selectedTime || !name || !email) return;
    // In real app: POST to /api/bookings or calendar API
    console.log(`Booking ${format} Ignite at ${selectedTime} for ${name}`);
    setStep("onboard");
  }

  function startOnboarding() {
    // In real app: redirect to /welcome/ignite
    setStep("done");
  }

  return (
    <div>
      {/* STEP 1: Format */}
      {step === "format" && (
        <div className="card" style={{ padding: 40 }}>
          <p className="kicker">Choose your format</p>
          <h2 style={{ marginTop: 6 }}>Online or in person?</h2>
          <p className="muted" style={{ marginTop: 8, maxWidth: "42ch" }}>
            Ninety minutes, just us. One honest conversation that moves what's been stuck.
          </p>
          <div className="grid2" style={{ marginTop: 24, gap: 16 }}>
            {(["online", "in-person"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFormat(f); startPayment(); }}
                style={{
                  padding: 24,
                  border: "2px solid var(--line)",
                  borderRadius: "var(--r)",
                  background: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--plum)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontWeight: 600, fontSize: 20 }}>{FORMATS[f]}</div>
                <div style={{ color: "var(--plum)", fontSize: 28, fontFamily: "var(--font-serif)", marginTop: 6 }}>₱{PRICES[f].toLocaleString()}</div>
                <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
                  {f === "online" ? "Video call with a secure Meet link" : "In-person in Manila or your location"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Payment */}
      {step === "pay" && format && (
        <div className="card" style={{ padding: 40 }}>
          <p className="kicker">Payment</p>
          <h2 style={{ marginTop: 6 }}>₱{PRICES[format].toLocaleString()} · {FORMATS[format]} Power Hour</h2>
          <p className="muted" style={{ marginTop: 12 }}>Choose how you'd like to pay:</p>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setPayMethod(m)}
                style={{
                  padding: 14,
                  border: `2px solid ${payMethod === m ? "var(--plum)" : "var(--line)"}`,
                  borderRadius: "var(--r)",
                  background: payMethod === m ? "var(--lilac)" : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all .15s",
                }}
              >
                <input type="radio" checked={payMethod === m} onChange={() => setPayMethod(m)} style={{ marginRight: 8 }} />
                {m}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 24, gap: 10 }}>
            <button onClick={() => setStep("format")} className="btn ghost small">Back</button>
            <button onClick={completePayment} disabled={!payMethod} className="btn small">Continue to booking</button>
          </div>
        </div>
      )}

      {/* STEP 3: Schedule */}
      {step === "schedule" && format && (
        <div className="card" style={{ padding: 40 }}>
          <p className="kicker">Choose your time</p>
          <h2 style={{ marginTop: 6 }}>When works for you?</h2>
          <p className="muted" style={{ marginTop: 8 }}>Available this week (all times Manila):</p>
          <div className="grid2" style={{ marginTop: 20, gap: 12 }}>
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  padding: 14,
                  border: `2px solid ${selectedTime === t ? "var(--plum)" : "var(--line)"}`,
                  borderRadius: "var(--r)",
                  background: selectedTime === t ? "var(--lilac)" : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: selectedTime === t ? 600 : 400,
                  transition: "all .15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: "var(--linen)", borderRadius: "var(--r)" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Your info</p>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", marginTop: 8, padding: 10, border: "1px solid var(--line)", borderRadius: "var(--r)" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", marginTop: 8, padding: 10, border: "1px solid var(--line)", borderRadius: "var(--r)" }}
            />
          </div>
          <div className="row" style={{ marginTop: 24, gap: 10 }}>
            <button onClick={() => setStep("pay")} className="btn ghost small">Back</button>
            <button onClick={bookTime} disabled={!selectedTime || !name || !email} className="btn small">Confirm booking</button>
          </div>
        </div>
      )}

      {/* STEP 4: Onboarding */}
      {step === "onboard" && format && (
        <div className="card" style={{ padding: 40 }}>
          <p className="kicker">You&rsquo;re in!</p>
          <h2 style={{ marginTop: 6 }}>Your session is booked.</h2>
          <p className="muted" style={{ marginTop: 8 }}>Before we meet, a few quick things:</p>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {ONBOARD_STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ background: "var(--plum)", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 600 }}>
                  {i + 1}
                </div>
                <p style={{ margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 30 }}>
            <Link href="/welcome/ignite" className="btn">Go to your session hub</Link>
            <Link href="/" className="btn ghost">Back to home</Link>
          </div>
        </div>
      )}

      {/* DONE */}
      {step === "done" && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 40, margin: 0 }}>🤍</p>
          <h2 style={{ marginTop: 12 }}>See you soon.</h2>
          <p className="muted">Check your email for your session details and prep guide.</p>
          <Link href="/" className="btn" style={{ marginTop: 20 }}>Back to home</Link>
        </div>
      )}
    </div>
  );
}
