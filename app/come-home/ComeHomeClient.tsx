"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** The workbook's butterfly, drawn as a line mark. */
export function Butterfly({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M60 44 C52 20 34 6 18 8 C4 10 2 26 10 36 C18 46 40 46 60 44 Z" />
      <path d="M60 44 C68 20 86 6 102 8 C116 10 118 26 110 36 C102 46 80 46 60 44 Z" />
      <path d="M60 46 C46 46 28 52 24 64 C20 76 30 84 40 80 C50 76 58 62 60 46 Z" />
      <path d="M60 46 C74 46 92 52 96 64 C100 76 90 84 80 80 C70 76 62 62 60 46 Z" />
      <path d="M60 34 V74" strokeWidth="3.4" />
      <path d="M22 18 C34 20 44 28 50 38 M98 18 C86 20 76 28 70 38 M30 70 C38 64 46 58 52 54 M90 70 C82 64 74 58 68 54" strokeWidth="2" opacity=".45" />
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
