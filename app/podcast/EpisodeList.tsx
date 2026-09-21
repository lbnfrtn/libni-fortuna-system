"use client";

import { useMemo, useState } from "react";

export interface Ep { title: string; url: string; date: string; number?: string; guest?: string; blurb?: string }

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "");

export default function EpisodeList({ items, guests }: { items: Ep[]; guests: string[] }) {
  const [q, setQ] = useState("");
  const [guest, setGuest] = useState<string | null>(null);
  const [shown, setShown] = useState(30);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((e) => (!guest || e.guest === guest) && (!s || `${e.number ?? ""} ${e.title} ${e.guest ?? ""} ${e.blurb ?? ""}`.toLowerCase().includes(s)));
  }, [items, q, guest]);

  return (
    <div>
      <input className="ed-search" value={q} onChange={(e) => { setQ(e.target.value); setShown(30); }} placeholder="Search an episode, a theme, a guest…" aria-label="Search episodes" />
      {guests.length > 0 && (
        <div className="ed-chips">
          <button type="button" className={`ed-chip${guest === null ? " on" : ""}`} onClick={() => setGuest(null)}>All</button>
          {guests.map((g) => <button key={g} type="button" className={`ed-chip${guest === g ? " on" : ""}`} onClick={() => { setGuest(guest === g ? null : g); setShown(30); }}>{g}</button>)}
        </div>
      )}
      <p className="ed-count">{list.length} of {items.length} episodes</p>
      <div style={{ marginTop: 10 }}>
        {list.slice(0, shown).map((e) => (
          <a key={e.url} className="ed-episode" href={e.url} target="_blank" rel="noreferrer">
            <span className="ed-episode-n">{e.number ?? "·"}</span>
            <span>
              <h4>{e.title}</h4>
              {(e.guest || e.blurb) && <p>{e.guest ? <b style={{ fontWeight: 600 }}>with {e.guest}</b> : null}{e.guest && e.blurb ? " — " : ""}{e.blurb}</p>}
            </span>
            <span className="ed-episode-go">{fmt(e.date)}</span>
          </a>
        ))}
      </div>
      {shown < list.length && (
        <div style={{ marginTop: 28 }}><button type="button" className="ed-btn ed-btn-light" onClick={() => setShown((n) => n + 40)}>Show more</button></div>
      )}
    </div>
  );
}
