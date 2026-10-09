"use client";
import { useState } from "react";
import type { ProofShot, ProofStory } from "@/config/one-on-one-proof";

// The 1:1 proof block, in the Liberate rhythm: a spotlight you can tap through
// (poster + their words, and a player once the video is on Vimeo), a quote wall
// you can scroll, and the DM screenshots exactly as they were written.

function Spotlight({ stories }: { stories: ProofStory[] }) {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const s = stories[i];
  if (!s) return null;
  const go = (n: number) => { setI((n + stories.length) % stories.length); setPlay(false); };
  return (
    <div className="oo-spot ed-reveal">
      <div className="oo-spot-media">
        {play && s.vimeo ? (
          <div className="oo-player"><iframe src={`https://player.vimeo.com/video/${s.vimeo}?autoplay=1&title=0&byline=0&portrait=0`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={`${s.name} — in their words`} /></div>
        ) : s.poster ? (
          <figure className="oo-poster">
            <img src={s.poster} alt={`${s.name} — in their words`} />
            {s.vimeo && (
              <button type="button" className="oo-play" onClick={() => setPlay(true)}>
                <span className="oo-play-ring"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg></span>Watch {s.name}
              </button>
            )}
          </figure>
        ) : (
          <div className="oo-poster oo-poster-quiet"><span className="oo-initial">{s.name.slice(0, 1)}</span></div>
        )}
      </div>
      <div className="oo-spot-copy">
        <p className="ed-eyebrow">In their words</p>
        <blockquote className="oo-quote">&ldquo;{s.quote}&rdquo;</blockquote>
        <p className="oo-who"><b>{s.name}</b>{s.role && <span> · {s.role}</span>}</p>
        <div className="oo-nav" aria-label="More client stories">
          <div className="oo-dots">
            {stories.map((x, n) => (
              <button type="button" key={x.id} className={`oo-dot${n === i ? " on" : ""}`} onClick={() => go(n)} aria-label={x.name}>{x.name}</button>
            ))}
          </div>
          <div className="oo-arrows">
            <button type="button" className="oo-arrow" onClick={() => go(i - 1)} aria-label="Previous">←</button>
            <button type="button" className="oo-arrow" onClick={() => go(i + 1)} aria-label="Next">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OneOnOneProof({ stories, shots, eyebrow = "Real people. Real shifts.", title, shotsTitle = "As they wrote it" }: {
  stories: ProofStory[]; shots: ProofShot[]; eyebrow?: string; title: React.ReactNode; shotsTitle?: string;
}) {
  return (
    <div className="oo">
      <div className="oo-head ed-reveal">
        <p className="ed-eyebrow">{eyebrow}</p>
        <h2 className="ed-display-md" style={{ marginTop: 14 }}>{title}</h2>
      </div>
      <Spotlight stories={stories} />
      {shots.length > 0 && (
        <div className="oo-shots-wrap ed-reveal">
          <p className="ed-eyebrow">{shotsTitle}</p>
          <div className="oo-shots">
            {shots.map((sh) => (
              <figure key={sh.src} className="oo-shot"><img src={sh.src} alt={sh.alt} loading="lazy" /></figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
