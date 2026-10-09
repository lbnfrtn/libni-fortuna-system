"use client";
import { useState } from "react";

// The 12-week roadmap, made to move. Each stop is a node on a filling line;
// hover or tap one and the detail panel below transitions in, so you can
// feel your way through the journey before you ever apply.
export type JourneyStop = { phase: string; weeks: string; title: string; body: string; arrival?: boolean };

export default function BecomingJourney({ stops }: { stops: JourneyStop[] }) {
  const [i, setI] = useState(0);
  const n = stops.length;
  const s = stops[i];
  const pct = n > 1 ? (i / (n - 1)) * 100 : 0;
  return (
    <div className="bj">
      <div className="bj-rail ed-reveal" style={{ ["--bj-n" as string]: String(n) }}>
        <div className="bj-rail-track"><span className="bj-rail-fill" style={{ width: `${pct}%` }} /></div>
        <div className="bj-nodes">
          {stops.map((p, k) => (
            <button
              key={p.phase}
              type="button"
              className={`bj-node${k === i ? " on" : ""}${k < i ? " done" : ""}${p.arrival ? " arr" : ""}`}
              aria-pressed={k === i}
              aria-label={`${p.title}, ${p.weeks}`}
              onMouseEnter={() => setI(k)}
              onFocus={() => setI(k)}
              onClick={() => setI(k)}
            >
              <span className="bj-mark" aria-hidden />
              <span className="bj-node-n">{p.phase}</span>
              <span className="bj-node-t">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bj-stage ed-reveal">
        <div className="bj-card" key={i}>
          <small>{s.arrival ? "Week 12 · The arrival" : `${s.phase} · ${s.weeks}`}</small>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      </div>
    </div>
  );
}
