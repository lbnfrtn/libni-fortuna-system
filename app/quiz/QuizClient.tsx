"use client";
import { useState } from "react";
import Link from "next/link";

// "Which space are you in?" — maps to Libni's five-space framework, then
// recommends a door. Answers are never stored; purely an experience.

type Space = "awareness" | "safety" | "release" | "reconnection" | "embodiment";
type Door = "ignite" | "project-me" | "essence-retreat" | "the-becoming" | "liberate";

const SPACE_Q: { q: string; opts: { t: string; s: Space }[] }[] = [
  {
    q: "Right now, the truest thing is…",
    opts: [
      { t: "I keep repeating a pattern I can't quite see clearly.", s: "awareness" },
      { t: "I know what's wrong, but I don't feel safe enough to face it.", s: "safety" },
      { t: "I'm carrying something heavy and I'm ready to put it down.", s: "release" },
      { t: "I've lost touch with who I actually am.", s: "reconnection" },
      { t: "I know who I am — I want to live it, daily.", s: "embodiment" },
    ],
  },
  {
    q: "When things get hard, I usually…",
    opts: [
      { t: "Analyze it endlessly in my head.", s: "awareness" },
      { t: "Shut down, numb out, get busy.", s: "safety" },
      { t: "Hold it all in and keep going.", s: "release" },
      { t: "Become whoever the room needs me to be.", s: "reconnection" },
      { t: "Cope fine — but I want more than coping.", s: "embodiment" },
    ],
  },
  {
    q: "What I want most is…",
    opts: [
      { t: "Clarity.", s: "awareness" },
      { t: "Calm in my body.", s: "safety" },
      { t: "Relief. Lightness.", s: "release" },
      { t: "To feel like me again.", s: "reconnection" },
      { t: "Consistency and practice.", s: "embodiment" },
    ],
  },
];

const DOOR_Q: { q: string; opts: { t: string; d: Door }[] } = {
  q: "How much support feels right for this season?",
  opts: [
    { t: "One honest conversation to start.", d: "ignite" },
    { t: "A gentle daily practice I can keep.", d: "project-me" },
    { t: "A few days away to fully reset.", d: "essence-retreat" },
    { t: "Deep 1:1 work over a full season.", d: "the-becoming" },
    { t: "A circle — I don't want to do this alone.", d: "liberate" },
  ],
};

const SPACES: Record<Space, { name: string; line: string; body: string }> = {
  awareness: { name: "Awareness", line: "You're ready to see the pattern.", body: "You've been living inside a story you didn't write. The work now is to see it clearly — without shame — so it stops running you from the shadows." },
  safety: { name: "Safety", line: "Your body needs to feel safe before your mind can let go.", body: "Insight isn't the missing piece; safety is. We start with the nervous system, so that feeling becomes possible again." },
  release: { name: "Release", line: "You're ready to put it down.", body: "You've carried it long enough. The work now is letting the body release what it's been holding — grief, pressure, old roles — so you can breathe." },
  reconnection: { name: "Reconnection", line: "It's time to remember who you are.", body: "Beneath the roles and the performance, there's a you that was never lost. This is the work of coming back to her." },
  embodiment: { name: "Embodiment", line: "You know who you are. Now, live it daily.", body: "Transformation is only real when it's embodied. The work now is practice — quiet, consistent, yours." },
};

const DOORS: Record<Door, { name: string; why: string; href: string; cta: string }> = {
  ignite: { name: "Power Hour", why: "One focused 90-minute session — the simplest, most honest way to begin.", href: "/programs/ignite", cta: "Explore Power Hour" },
  "project-me": { name: "Project Me", why: "A daily practice in your pocket — something to listen to, a way to breathe, a place to write it out.", href: "https://projectme.libni.co", cta: "Open Project Me" },
  "essence-retreat": { name: "Essence Retreat", why: "Four days in Siargao to come all the way home, held in a circle of twenty.", href: "/programs/essence-retreat", cta: "Discover Essence" },
  "the-becoming": { name: "The Becoming", why: "Twelve weeks of sustained 1:1 work at the root — my deepest container.", href: "/programs/the-becoming", cta: "Explore The Becoming" },
  liberate: { name: "Liberate", why: "Transformation held in a small circle — depth, with the strength of not being alone.", href: "/liberate", cta: "Explore Liberate" },
};

export default function QuizClient() {
  const [step, setStep] = useState(0); // 0..2 space, 3 door, 4 result
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [door, setDoor] = useState<Door | null>(null);
  const total = SPACE_Q.length + 1;

  function pickSpace(s: Space) { setSpaces((a) => [...a, s]); setStep((n) => n + 1); }
  function pickDoor(d: Door) { setDoor(d); setStep(total); }
  function reset() { setStep(0); setSpaces([]); setDoor(null); }

  if (step === total && door) {
    const counts = spaces.reduce((m, s) => ((m[s] = (m[s] || 0) + 1), m), {} as Record<Space, number>);
    const top = (Object.keys(counts) as Space[]).sort((a, b) => counts[b] - counts[a])[0] ?? "awareness";
    const sp = SPACES[top];
    const dr = DOORS[door];
    const ext = dr.href.startsWith("http");
    return (
      <div>
        <p className="kicker">Your space right now</p>
        <h2 style={{ marginTop: 6 }}>{sp.name}</h2>
        <p className="lead" style={{ maxWidth: "30ch" }}>{sp.line}</p>
        <p className="muted">{sp.body}</p>
        <div className="card" style={{ background: "var(--linen)", border: "none", marginTop: 22 }}>
          <p className="kicker" style={{ color: "var(--umber)" }}>I&rsquo;d start you here</p>
          <h3 style={{ marginTop: 6 }}>{dr.name}</h3>
          <p className="muted">{dr.why}</p>
          <div className="row">
            {ext ? <a href={dr.href} target="_blank" rel="noreferrer" className="btn">{dr.cta}</a> : <Link href={dr.href} className="btn">{dr.cta}</Link>}
            <Link href="/work-with-me" className="btn ghost small">See all doors</Link>
          </div>
        </div>
        <button className="btn ghost small" style={{ marginTop: 18 }} onClick={reset}>Take it again</button>
      </div>
    );
  }

  const isDoor = step === SPACE_Q.length;
  const q = isDoor ? DOOR_Q.q : SPACE_Q[step].q;
  return (
    <div>
      <div className="quiz-progress"><div style={{ width: `${(step / total) * 100}%` }} /></div>
      <p className="kicker" style={{ marginTop: 18 }}>Question {step + 1} of {total}</p>
      <h2 style={{ marginTop: 6, fontSize: "clamp(26px,3.4vw,38px)" }}>{q}</h2>
      <div style={{ marginTop: 8 }}>
        {isDoor
          ? DOOR_Q.opts.map((o) => <button key={o.t} className="quiz-opt" onClick={() => pickDoor(o.d)}>{o.t}</button>)
          : SPACE_Q[step].opts.map((o) => <button key={o.t} className="quiz-opt" onClick={() => pickSpace(o.s)}>{o.t}</button>)}
      </div>
    </div>
  );
}
