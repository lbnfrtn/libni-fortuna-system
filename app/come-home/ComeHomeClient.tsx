"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** A small botanical sprig — the Come Home emblem (Libni's call, 2026-10-09: no butterfly, it's another coach's mark). */
export function Butterfly({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M50 126 C50 104 50 62 50 24" />
      <path d="M50 92 C34 90 24 80 22 64 C40 66 49 76 50 92Z" fill="currentColor" fillOpacity=".14" />
      <path d="M50 78 C66 76 76 66 78 50 C60 52 51 62 50 78Z" fill="currentColor" fillOpacity=".14" />
      <path d="M50 60 C36 58 27 49 25 35 C41 37 49 46 50 60Z" fill="currentColor" fillOpacity=".14" />
      <circle cx="50" cy="20" r="7" fill="currentColor" fillOpacity=".85" stroke="none" />
    </svg>
  );
}

export function CheckoutForm({ price }: { price: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [manual, setManual] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSrc(p.get("src") || p.get("utm_source") || "");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/come-home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, consent, source: src || undefined }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      if (j.link) {
        window.location.href = j.link; // the secure Xendit checkout
        return;
      }
      setManual(j.manualPayUrl || null);
      setBusy(false);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="ch-form">
      <p className="ch-form-k">Your details</p>
      <p className="ch-form-sub">Your download link goes to this email.</p>
      <label htmlFor="ch-name">First name</label>
      <input id="ch-name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="given-name" />
      <label htmlFor="ch-email">Email</label>
      <input id="ch-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" inputMode="email" />
      <label className="ch-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span>Send me my download and Libni&rsquo;s letters. My details are kept per the Philippine Data Privacy Act, and I can unsubscribe anytime.</span>
      </label>
      {err && <p className="ch-err" role="alert">{err}</p>}
      <button className="ed-btn ed-btn-solid ch-pay" disabled={busy}>{busy ? "One moment…" : `Continue to payment · ${price}`}</button>
      {manual && <p className="ch-form-sub" style={{ textAlign: "center" }}>Your link is ready: <a className="ed-link" href={manual}>open it here →</a></p>}
      <p className="ch-secure">Secure checkout by Xendit · GCash · Maya · QR Ph</p>
    </form>
  );
}

/** Phone-only buy bar: appears after the hero, steps aside once the checkout is on screen. */
export function StickyBuy({ price }: { price: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".ch-hero");
    const get = document.getElementById("get");
    const final = document.querySelector(".ed-final");
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      const heroIn = hero ? seen.get(hero) ?? true : false;
      const getIn = get ? seen.get(get) ?? false : false;
      const finalIn = final ? seen.get(final) ?? false : false;
      setShow(!heroIn && !getIn && !finalIn);
    }, { threshold: 0.05 });
    [hero, get, final].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className={`ch-sticky${show ? " on" : ""}`} aria-hidden={!show}>
      <span><b>Come Home to Yourself</b><small>Workbook + meditation · {price}</small></span>
      <a className="ed-btn ed-btn-solid ed-btn-sm" href="#get" tabIndex={show ? 0 : -1}>Get it</a>
    </div>
  );
}

/** While a just-paid order is still confirming, quietly re-check every few seconds. */
export function RefreshWhilePending({ tries = 30 }: { tries?: number }) {
  const router = useRouter();
  const [left, setLeft] = useState(tries);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => { setLeft((n) => n - 1); router.refresh(); }, 3000);
    return () => clearTimeout(t);
  }, [left, router]);
  return left <= 0 ? <p className="ch-form-sub">Still waiting on the bank — this page will update when you refresh it, and your link is on its way to your inbox.</p> : null;
}
