"use client";
import { useEffect, useState } from "react";

// A quiet apply bar that slides in once you're past the hero and steps away
// near the end of the page (the final section has its own buttons).
export default function StickyApply({ href, label, note }: { href: string; label: string; note: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const check = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      setOn(y > 720 && y < h - 900);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  return (
    <div className={`bk-sticky${on ? " on" : ""}`} aria-hidden={!on}>
      <span>{note}</span>
      <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1}>{label} →</a>
    </div>
  );
}
