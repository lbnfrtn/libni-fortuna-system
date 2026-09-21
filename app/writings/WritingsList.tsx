"use client";

import { useMemo, useState } from "react";

export interface Post { title: string; url: string; date: string; blurb?: string }

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "");

export default function WritingsList({ items }: { items: Post[] }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((p) => `${p.title} ${p.blurb ?? ""}`.toLowerCase().includes(s)) : items;
  }, [items, q]);

  return (
    <div>
      <input className="ed-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the letters…" aria-label="Search write-ups" />
      <p className="ed-count">{list.length} {list.length === 1 ? "piece" : "pieces"}</p>
      <div style={{ marginTop: 10 }}>
        {list.map((p, i) => (
          <a key={p.url} className="ed-post" href={p.url} target="_blank" rel="noreferrer">
            <span className="ed-episode-n">{String(i + 1).padStart(2, "0")}</span>
            <div><h4>{p.title}</h4>{p.blurb && <p>{p.blurb}</p>}</div>
            <span className="ed-episode-go">{fmt(p.date) || "Read"}</span>
          </a>
        ))}
        {list.length === 0 && <p className="ed-lede ed-muted" style={{ marginTop: 24 }}>Nothing with those words yet.</p>}
      </div>
    </div>
  );
}
