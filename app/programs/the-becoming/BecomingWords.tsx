"use client";

import { useEffect, useState } from "react";
import type { CaseStudy } from "@/lib/content";
import { EdCircle, EdVideo } from "@/app/components/Editorial";

type Item = CaseStudy & { photo?: string };

/**
 * The Becoming's own words, kept compact: two tabs (Case Studies · Testimonials).
 * Case studies are small cards; a click opens the full chapter in a pop-up.
 */
export default function BecomingWords({ cases, wall }: { cases: Item[]; wall: Item[] }) {
  const [tab, setTab] = useState<"cases" | "wall">(cases.length ? "cases" : "wall");
  const [open, setOpen] = useState<Item | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div>
      {cases.length > 0 && wall.length > 0 && (
        <div className="bk-tabs ed-reveal" role="tablist" aria-label="Client words">
          <button type="button" role="tab" aria-selected={tab === "cases"} className={tab === "cases" ? "on" : ""} onClick={() => setTab("cases")}>Case Studies <span>{cases.length}</span></button>
          <button type="button" role="tab" aria-selected={tab === "wall"} className={tab === "wall" ? "on" : ""} onClick={() => setTab("wall")}>Testimonials <span>{wall.length}</span></button>
        </div>
      )}

      {tab === "cases" && (
        <div className="bk-case-grid ed-reveal">
          {cases.map((c, i) => (
            <button type="button" key={c.id} className="bk-case-card" onClick={() => setOpen(c)}>
              <EdCircle src={c.photo} name={c.name} size={64} />
              <span className="bk-case-card-body">
                <small>Case {String(i + 1).padStart(2, "0")}</small>
                <strong>{c.name}</strong>
                {c.role && <em>{c.role}</em>}
                <span className="bk-case-card-h">{c.headline || c.quote}</span>
                <span className="bk-case-card-link">Read the story</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {tab === "wall" && (
        <div className="bk-wall ed-reveal">
          {wall.map((w) => (
            <figure key={w.id} className="bk-wall-item">
              {w.video && <EdVideo url={w.video} title={`${w.name} — video testimony`} />}
              <blockquote>{w.quote}</blockquote>
              <figcaption><EdCircle src={w.photo} name={w.name} size={44} /><p className="ed-who">{w.name}{w.role && <span>{w.role}</span>}</p></figcaption>
            </figure>
          ))}
        </div>
      )}

      {open && (
        <div className="bk-modal" role="dialog" aria-modal="true" aria-label={`${open.name} — case study`} onClick={() => setOpen(null)}>
          <div className="bk-modal-box ed" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="bk-modal-x" aria-label="Close" onClick={() => setOpen(null)}>×</button>
            <div className={`bk-case${open.photo ? "" : " noimg"}`}>
              <div className="bk-case-media">
                {open.photo && <div className="ed-figure"><img src={open.photo} alt={open.name} /></div>}
                <div className="bk-case-who">
                  {!open.photo && <EdCircle src={undefined} name={open.name} size={56} />}
                  <p className="ed-who">{open.name}{open.role && <span>{open.role}</span>}</p>
                </div>
              </div>
              <div className="bk-case-body">
                <small className="bk-case-n">Case study</small>
                {open.headline && <h3 className="bk-case-h">{open.headline}</h3>}
                <div className="bk-case-arc">
                  {([["Where she started", open.before], ["The work", open.during], ["Where she is now", open.after]] as [string, string | undefined][])
                    .filter(([, v]) => v)
                    .map(([label, v]) => <div key={label}><small>{label}</small><p>{v}</p></div>)}
                </div>
                <p className="ed-quote bk-case-q">{open.quote}</p>
                {open.video && <div className="bk-case-video"><EdVideo url={open.video} title={`${open.name} — in her own words`} /></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
