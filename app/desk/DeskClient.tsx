"use client";
import { useEffect, useState, useCallback } from "react";

type OfferLite = {
  slug: string;
  name: string;
  pricePHP: number | null;
  priceUnit: string | null;
  allowPayInFull: boolean;
  allowInstalments: boolean;
  instalmentCount: number;
  allowDeposit: boolean;
  depositFraction: number | null;
  journey: string;
  waitlistOnly: boolean;
};

type OrderRow = {
  id: string;
  offer: string;
  client: string;
  email: string;
  status: string;
  total: number;
  paid: number;
  balance: number;
  plan: string;
  createdAt: string;
  next?: { n: number; amountPHP: number; dueDate: string; status: string } | null;
  firstLink?: string;
  manualRef?: string;
};

const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");

function Copy({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="copyfield">
      <input readOnly value={value} onFocus={(e) => e.currentTarget.select()} />
      <button
        className="btn small"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        }}
      >
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function DeskClient({
  offers,
  session,
}: {
  offers: OfferLite[];
  session: { email: string; role: string };
}) {
  const [offerSlug, setOfferSlug] = useState(offers[0]?.slug ?? "");
  const offer = offers.find((o) => o.slug === offerSlug);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [planType, setPlanType] = useState<"full" | "instalment" | "deposit">("full");
  const [customAmount, setCustomAmount] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [instalmentCount, setInstalmentCount] = useState(3);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | {
    orderId: string;
    link?: string;
    amount: number;
    manualPayUrl: string;
    instalments: { n: number; amount: number; dueDate: string }[];
  }>(null);
  const [err, setErr] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const needsCustomAmount = offer ? offer.pricePHP == null : false;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const loadOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders((await res.json()).orders);
  }, []);
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Reset plan when offer changes to one that doesn't allow the current plan.
  useEffect(() => {
    if (!offer) return;
    if (planType === "instalment" && !offer.allowInstalments) setPlanType("full");
    if (planType === "deposit" && !offer.allowDeposit) setPlanType("full");
    setInstalmentCount(offer.instalmentCount);
  }, [offerSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setResult(null);
    const body: Record<string, unknown> = {
      offerSlug,
      planType,
      contact: { name, email, phone: phone || undefined },
    };
    if (needsCustomAmount) {
      body.customAmountPHP = Number(customAmount);
      if (customDesc) body.customDescription = customDesc;
    }
    if (planType === "instalment") body.instalmentCount = instalmentCount;

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json();
    setBusy(false);
    if (j.ok) {
      setResult(j);
      loadOrders();
    } else setErr(j.error || "Could not create the order.");
  }

  async function verify(id: string) {
    if (!confirm("Confirm you've SEEN this money land in the bank. This marks the client as paid and starts onboarding.")) return;
    await fetch(`/api/orders/${id}/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    loadOrders();
  }
  async function resend(id: string) {
    const res = await fetch(`/api/orders/${id}/resend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const j = await res.json();
    if (j.ok) {
      navigator.clipboard.writeText(j.link);
      alert(`New link for payment ${j.instalmentN} (${peso(j.amount)}) copied to clipboard.`);
    } else alert(j.error);
  }
  async function cancel(id: string, refunded: boolean) {
    const verb = refunded ? "record a refund for" : "cancel";
    const reason = prompt(`Why ${verb} this order? (optional note)`);
    if (reason === null) return; // cancelled the prompt
    await fetch(`/api/orders/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, refunded }),
    });
    loadOrders();
  }

  const open = orders.filter((o) => o.status !== "paid" && o.status !== "cancelled");
  const recentPaid = orders.filter((o) => o.status === "paid").slice(0, 8);

  return (
    <div className="wrap-wide">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <p className="kicker">Payment Desk</p>
          <h1 style={{ margin: "4px 0" }}>Create a payment link</h1>
        </div>
        <p className="muted" style={{ fontSize: 13 }}>
          {session.email} · {session.role}
        </p>
      </div>

      <div className="grid2" style={{ alignItems: "start", marginTop: 8 }}>
        {/* ---- create form ---- */}
        <form onSubmit={create} className="card">
          <label>Offer</label>
          <select value={offerSlug} onChange={(e) => setOfferSlug(e.target.value)}>
            {offers.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
                {o.pricePHP != null ? ` — ${peso(o.pricePHP)}${o.priceUnit ? " " + o.priceUnit : ""}` : " — custom amount"}
              </option>
            ))}
          </select>

          <div className="grid2">
            <div>
              <label>Client name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <label>Phone (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63…" />

          {needsCustomAmount && (
            <>
              <label>Amount (₱) — this offer has no fixed price</label>
              <input type="number" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} required min={1} />
              <label>Description on the invoice (optional)</label>
              <input value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} placeholder="e.g. Corporate wellness half-day — deposit" />
            </>
          )}

          <label>How are they paying?</label>
          <div className="row">
            {offer?.allowPayInFull && <PlanBtn v="full" cur={planType} set={setPlanType} label="Pay in full" />}
            {offer?.allowInstalments && <PlanBtn v="instalment" cur={planType} set={setPlanType} label="Payment plan" />}
            {offer?.allowDeposit && <PlanBtn v="deposit" cur={planType} set={setPlanType} label={`Deposit${offer.depositFraction ? ` (${Math.round(offer.depositFraction * 100)}%)` : ""} + balance`} />}
          </div>

          {planType === "instalment" && (
            <>
              <label>Number of payments (first due now)</label>
              <select value={instalmentCount} onChange={(e) => setInstalmentCount(Number(e.target.value))}>
                {[2, 3, 4, 6].map((n) => (
                  <option key={n} value={n}>{n} payments</option>
                ))}
              </select>
            </>
          )}

          {err && <p style={{ color: "var(--terracotta)", marginTop: 14 }}>{err}</p>}
          <div style={{ marginTop: 18 }}>
            <button className="btn" disabled={busy}>{busy ? "Creating…" : "Create payment link"}</button>
          </div>
        </form>

        {/* ---- result ---- */}
        <div className="card" style={{ background: result ? "var(--cream)" : "var(--sand-deep)" }}>
          {!result ? (
            <p className="muted">Fill in the client and offer, then create the link. It appears here, ready to copy or send.</p>
          ) : (
            <>
              <p className="kicker">Ready to send</p>
              <p className="big">{peso(result.amount)} <span className="muted" style={{ fontSize: 14 }}>due now</span></p>
              {result.instalments.length > 1 && (
                <p className="muted" style={{ fontSize: 13 }}>
                  Then: {result.instalments.slice(1).map((i) => `${peso(i.amount)} on ${i.dueDate}`).join(" · ")}
                </p>
              )}
              <label>Payment link (GCash / card / etc.) — send by DM, Viber or WhatsApp</label>
              <Copy value={result.link || ""} />
              <label style={{ marginTop: 16 }}>Or the bank-transfer page (with reference + proof upload)</label>
              <Copy value={`${baseUrl}${result.manualPayUrl.replace(baseUrl, "")}`} />
              <p className="note" style={{ marginTop: 16 }}>
                When they pay, everything else happens on its own — confirmation, welcome email, agreement and booking. You don't touch anything.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ---- open orders ---- */}
      <h2 style={{ marginTop: 40 }}>Open orders</h2>
      <p className="muted" style={{ marginTop: -8, fontSize: 14 }}>Pending links, submitted transfers awaiting your check, and instalment balances.</p>
      <div className="card" style={{ marginTop: 12, padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr><th>Client</th><th>Offer</th><th>Status</th><th>Balance</th><th>Next due</th><th></th></tr>
          </thead>
          <tbody>
            {open.length === 0 && (
              <tr><td colSpan={6} className="muted" style={{ padding: 20 }}>Nothing open. Nice and clean.</td></tr>
            )}
            {open.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.client}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{o.email}</span></td>
                <td>{o.offer}<br /><span className="muted" style={{ fontSize: 12 }}>{o.plan}</span></td>
                <td><span className={`pill ${o.status}`}>{o.status}</span>{o.status === "submitted" && o.manualRef && <><br /><span className="muted" style={{ fontSize: 12 }}>ref {o.manualRef}</span></>}</td>
                <td>{peso(o.balance)}<br /><span className="muted" style={{ fontSize: 12 }}>of {peso(o.total)}</span></td>
                <td>{o.next ? <>{peso(o.next.amountPHP)}<br /><span className="muted" style={{ fontSize: 12 }}>{o.next.dueDate}</span></> : "—"}</td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    {o.status === "submitted" && <button className="btn small" onClick={() => verify(o.id)}>Verify</button>}
                    <button className="btn small ghost" onClick={() => resend(o.id)}>Resend link</button>
                    <button className="btn small ghost" onClick={() => cancel(o.id, false)}>Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- recently paid (for recording refunds) ---- */}
      {recentPaid.length > 0 && (
        <>
          <h2 style={{ marginTop: 40 }}>Recently paid</h2>
          <div className="card" style={{ marginTop: 12, padding: 0, overflow: "hidden" }}>
            <table>
              <thead><tr><th>Client</th><th>Offer</th><th>Paid</th><th></th></tr></thead>
              <tbody>
                {recentPaid.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.client}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{o.email}</span></td>
                    <td>{o.offer}</td>
                    <td>{peso(o.paid)}</td>
                    <td><button className="btn small ghost" onClick={() => cancel(o.id, true)}>Record refund</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
            &ldquo;Record refund&rdquo; only notes it here — issue the actual refund in Xendit (SOP 4).
          </p>
        </>
      )}
    </div>
  );
}

function PlanBtn({ v, cur, set, label }: { v: "full" | "instalment" | "deposit"; cur: string; set: (v: "full" | "instalment" | "deposit") => void; label: string }) {
  return (
    <button type="button" className={`btn small ${cur === v ? "" : "ghost"}`} onClick={() => set(v)}>
      {label}
    </button>
  );
}
