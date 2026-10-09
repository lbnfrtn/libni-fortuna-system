"use client";
import { useEffect, useRef, useState } from "react";

// A client's own life-wheel scores, before and after — drawn as the wheel she
// filled in, then animated to the "after" the moment it scrolls into view.
// Tap Before / After to move it yourself.
export type WheelArea = { label: string; before: number; after: number };

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function LifeWheel({ areas, beforeLabel, afterLabel }: { areas: WheelArea[]; beforeLabel: string; afterLabel: string }) {
  const [after, setAfter] = useState(false);
  const [t, setT] = useState(0); // 0 = before, 1 = after
  const ref = useRef<HTMLDivElement>(null);

  // Flip to "after" once the wheel has been on screen for a beat.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setAfter(true), 900); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tween the wedges between the two states.
  useEffect(() => {
    const from = t, to = after ? 1 : 0, dur = 1100, start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      setT(from + (to - from) * ease(k));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [after]);

  const n = areas.length, cx = 200, cy = 200, R = 150, slice = (Math.PI * 2) / n;
  const pt = (a: number, r: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

  return (
    <div className={`lw${after ? " after" : ""}`} ref={ref}>
      <div>
        <svg className="lw-svg" viewBox="0 0 400 400" aria-hidden="true">
          {[2, 4, 6, 8, 10].map((v) => <circle key={v} cx={cx} cy={cy} r={(v / 10) * R} fill="none" stroke="rgba(36,28,42,.12)" strokeWidth="1" />)}
          {areas.map((a, i) => {
            const a0 = -Math.PI / 2 + i * slice, a1 = a0 + slice;
            const v = a.before + (a.after - a.before) * t;
            const r = (v / 10) * R;
            const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
            const [lx, ly] = pt(a0 + slice / 2, R + 24);
            return (
              <g key={a.label}>
                <path d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={after ? "#b8955a" : "#5b4470"} fillOpacity={0.55 + (i % 2) * 0.25} stroke="#fbf9f6" strokeWidth="1.5" />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--ed-sans)" fontSize="9.5" letterSpacing="2" fill="#5b4470">{a.label.toUpperCase()}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="3" fill="#241c2a" />
        </svg>
        <div className="lw-toggle" role="group" aria-label="Before or after">
          <button type="button" className={after ? "" : "on"} onClick={() => setAfter(false)}>{beforeLabel}</button>
          <button type="button" className={after ? "on" : ""} onClick={() => setAfter(true)}>{afterLabel}</button>
        </div>
      </div>
      <div className="lw-list">
        {areas.map((a) => {
          const v = after ? a.after : a.before;
          return (
            <div className="lw-row" key={a.label}>
              <span>{a.label}</span>
              <span className="lw-bar"><i style={{ width: `${v * 10}%` }} /></span>
              <span className="lw-num">{v}<small> / 10</small></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
