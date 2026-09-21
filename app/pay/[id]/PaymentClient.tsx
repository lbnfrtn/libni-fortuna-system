"use client";

import { useState } from "react";
import Link from "next/link";

export default function PaymentClient({ order, orderId }: { order: any; orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyInvoice = () => {
    if (order.invoiceUrl) {
      navigator.clipboard.writeText(order.invoiceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaymentVerification = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/verify`, { method: "POST" });
      if (res.ok) {
        alert("Payment verified! Checking status...");
        window.location.reload();
      }
    } catch (err) {
      alert("Verification failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const isPaid = order.status === "paid";
  const isExpired = order.expiresAt && new Date(order.expiresAt) < new Date();

  return (
    <div className="wrap" style={{ maxWidth: 600, paddingTop: 80, paddingBottom: 100 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>
          {isPaid ? "✓ Payment Confirmed" : "Complete Your Payment"}
        </h1>
        <p className="muted" style={{ fontSize: 16, marginBottom: 40 }}>
          {isPaid
            ? "Welcome to Liberate. Your onboarding will begin shortly."
            : `Amount: ${order.offer.currency}${order.amount.toLocaleString()}`}
        </p>
      </div>

      {!isPaid && (
        <div style={{ background: "#f7f3eb", padding: 24, borderRadius: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: "#1b1815" }}>Payment Details</h2>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "#5c554c", marginBottom: 4 }}>Program:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1b1815" }}>{order.offer.name}</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "#5c554c", marginBottom: 4 }}>Payment Due:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1b1815" }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style={{ marginBottom: 0 }}>
            <p style={{ fontSize: 14, color: "#5c554c", marginBottom: 4 }}>Status:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: order.status === "pending" ? "#b8623b" : "#5b4470" }}>
              {order.status === "pending" ? "Awaiting Payment" : "Payment Received"}
            </p>
          </div>
        </div>
      )}

      {!isPaid && order.invoiceUrl && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12, color: "#1b1815" }}>Pay Now</h2>
          <a
            href={order.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "16px 24px",
              background: "#5b4470",
              color: "#fff",
              textAlign: "center",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Open Payment Link →
          </a>
          <p style={{ fontSize: 13, color: "#8a7d78", textAlign: "center" }}>
            You'll be directed to Xendit to pay with GCash, PayMaya, QR, or credit card.
          </p>
        </div>
      )}

      {!isPaid && (
        <div style={{ borderTop: "1px solid #c9bfad", paddingTop: 24, marginTop: 32 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12, color: "#1b1815" }}>Already paid?</h3>
          <button
            onClick={handlePaymentVerification}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "#eee7da",
              border: "1px solid #c9bfad",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              color: "#1b1815",
            }}
          >
            {loading ? "Verifying..." : "Verify Payment"}
          </button>
        </div>
      )}

      {isPaid && (
        <div style={{ background: "#f7f3eb", padding: 24, borderRadius: 12, marginBottom: 32, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#5c554c", marginBottom: 12 }}>Your onboarding portal will open soon. Check your email for next steps.</p>
          <Link href="/" style={{ color: "#5b4470", textDecoration: "none", fontWeight: 600 }}>
            ← Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
