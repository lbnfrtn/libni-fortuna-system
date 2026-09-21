"use client";
import { useEffect, useState } from "react";

const QUOTES: { q: string; who: string }[] = [
  { q: "One of the greatest investments I've ever made.", who: "King Fortuna · Businessman" },
  { q: "I let go of the trauma I'd been carrying and reconnected with who I truly am.", who: "Pepe Herrera · Actor" },
  { q: "A space of deep connection, safety and belonging — a new way of living.", who: "Nadia Montenegro · Actress" },
  { q: "1000+ lives transformed across PH, Australia and Bali.", who: "The Essence Community" },
  { q: "This is not just a talk. It's an experience.", who: "TEDx · Vogue · Manila Bulletin" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((n) => (n + 1) % QUOTES.length);
        setShow(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function go(n: number) {
    if (n === i) return;
    setShow(false);
    setTimeout(() => { setI(n); setShow(true); }, 200);
  }

  return (
    <div>
      <p className="hero-quote" style={{ opacity: show ? 1 : 0 }}>&ldquo;{QUOTES[i].q}&rdquo;</p>
      <p className="hero-quote-who" style={{ opacity: show ? 1 : 0, transition: "opacity .4s ease" }}>{QUOTES[i].who}</p>
      <div className="dots" role="tablist" aria-label="Testimonials">
        {QUOTES.map((_, n) => (
          <button key={n} className={`dot${n === i ? " on" : ""}`} aria-label={`Quote ${n + 1}`} aria-selected={n === i} onClick={() => go(n)} />
        ))}
      </div>
    </div>
  );
}
