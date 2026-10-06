"use client";

import { useState } from "react";
import Link from "next/link";
import ProofForm from "./ProofForm";
import type { Order } from "@/lib/types";

const peso = (n: number) => `₱${Math.round(n).toLocaleString("en-PH")}`;

type Bank = { name: string; accountName: string; accountNumber: string };

export default function PaymentClient({ order, orderId, bank }: { order: Order; orderId: string; bank: Bank | null }) {
  const [copied, setCopied] = useState("");

  const isPaid = order.status === "paid";
  const inst = order.instalments.find((i) => i.status !== "paid") ?? order.instalments[0];
  const amountDue = inst?.amountPHP ?? order.totalPHP;
  const invoiceUrl = inst?.invoiceUrl;
  const reference = order.manual?.reference || order.id;
  const multi = order.instalments.length > 1;

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 1800);
    });
  };

  const box: React.CSSProperties = { background: "#f7f3eb", border: "1px solid #e4dcd2", padding: 24, borderRadius: 14, marginBottom: 24 };
  const rowLabel: React.CSSProperties = { fontSize: 13, color: "#8a7d78", marginBottom: 2 };
  const rowValue: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: "#2b2528" };

  return (
    <div className="wrap" style={{ maxWidth: 580, paddingTop: 72, paddingBottom: 100 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{ fontFamily: "var(--ed-sans, inherit)", fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#b8955a", fontWeight: 600 }}>
          {order.offerName}
        </p>
        <h1 style={{ fontSize: 34, margin: "12px 0 6px" }}>
          {isPaid ? "Payment confirmed" : "Complete your payment"}
        </h1>
        {!isPaid && (
          <p className="muted" style={{ fontSize: 16 }}>
            {peso(amountDue)} due now{multi ? ` · payment ${inst?.n ?? 1} of ${order.instalments.length}` : ""}
          </p>
        )}
      </div>

      {isPaid ? (
        <div style={{ ...box, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#2b2528", marginBottom: 14 }}>
            Thank you — we&rsquo;ve received your payment. Check your email for your next steps.
          </p>
          <Link href="/" style={{ color: "#5b4470", textDecoration: "none", fontWeight: 600 }}>← Back to home</Link>
        </div>
      ) : (
        <>
          {/* Pay instantly via Xendit */}
          {invoiceUrl && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, marginBottom: 12 }}>Pay instantly</h2>
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", padding: "16px 24px", background: "#5b4470", color: "#fff", textAlign: "center", borderRadius: 10, textDecoration: "none", fontWeight: 600 }}
              >
                Pay with GCash, Maya or QR →
              </a>
              <p className="muted" style={{ fontSize: 13, textAlign: "center", marginTop: 10 }}>
                You&rsquo;ll be taken to our secure checkout. The moment it clears, you&rsquo;ll get everything you need by email.
              </p>
            </div>
          )}

          {/* Manual bank transfer */}
          {bank && (
            <div style={box}>
              <h2 style={{ fontSize: 18, marginBottom: 6 }}>{invoiceUrl ? "Or pay by bank transfer" : "Pay by bank transfer"}</h2>
              <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
                Transfer {peso(amountDue)} to the account below, then send your proof so we can confirm it.
              </p>

              <div style={{ display: "grid", gap: 14 }}>
                <div><p style={rowLabel}>Bank</p><p style={rowValue}>{bank.name}</p></div>
                <div><p style={rowLabel}>Account name</p><p style={rowValue}>{bank.accountName}</p></div>
                <div>
                  <p style={rowLabel}>Account number</p>
                  <p style={rowValue}>
                    {bank.accountNumber}{" "}
                    <button onClick={() => copy("number", bank.accountNumber)} style={{ marginLeft: 8, fontSize: 12, color: "#5b4470", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      {copied === "number" ? "Copied ✓" : "Copy"}
                    </button>
                  </p>
                </div>
                <div>
                  <p style={rowLabel}>Reference (write this in the notes)</p>
                  <p style={rowValue}>
                    {reference}{" "}
                    <button onClick={() => copy("ref", reference)} style={{ marginLeft: 8, fontSize: 12, color: "#5b4470", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      {copied === "ref" ? "Copied ✓" : "Copy"}
                    </button>
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #e4dcd2", marginTop: 20, paddingTop: 18 }}>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>Already transferred?</h3>
                <p className="muted" style={{ fontSize: 13, marginBottom: 2 }}>Paste a link to your receipt or screenshot and we&rsquo;ll verify it.</p>
                <ProofForm orderId={orderId} />
              </div>
            </div>
          )}

          {!invoiceUrl && !bank && (
            <div style={box}>
              <p className="muted" style={{ fontSize: 15 }}>
                Your payment link is being prepared — I&rsquo;ll email it to you shortly. If you need it now, just reply to your email.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
