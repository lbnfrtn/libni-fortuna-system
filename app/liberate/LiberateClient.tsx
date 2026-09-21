"use client";

import Link from "next/link";
import { OFFERS } from "@/config/offers";

type Photos = Record<string, string>;

const INSIDE = [
  ["Weekly live group sessions", "Guided coaching, shadow work, and somatic healing practices in a safe, intimate setting on Zoom.", "inside_1"],
  ["Subconscious reprogramming", "Release old beliefs and patterns stored deep within, and create new ones rooted in self-trust and truth.", "inside_2"],
  ["Energetic exploration and chakra alignment", "Understand your energy body and return to balance through breathwork and gentle practices.", "inside_3"],
  ["Spiritual tools and intuitive activation", "Deepen your connection with intuition, inner knowing, and your spiritual path.", "inside_4"],
  ["Journaling and breakthrough exercises", "Process each layer of your transformation with clarity and intention, guided every step of the way.", "inside_5"],
  ["Private community", "You’re not doing this alone. You’ll be surrounded by like-hearted people walking this path with you.", "inside_6"],
  ["Online portal", "A library of guided meditations, workshops, practices, and resources to support you throughout.", "inside_7"],
  ["In-person celebratory retreat", "Anchor everything you’ve integrated in a closing retreat designed to help you ground your growth and embody your liberation.", "inside_8"],
] as const;

const ROADMAP = [
  { month: "Month one", theme: "See", weeks: [
    ["01", "Awareness", "See your patterns."],
    ["02", "The root", "Understand where they came from."],
    ["03", "Identity", "Question the identities built around old beliefs."],
    ["04", "The body", "Listen to what your body has been communicating."],
  ]},
  { month: "Month two", theme: "Feel", weeks: [
    ["05", "Emotions", "Feel what you’ve learned to suppress."],
    ["06", "Subconscious", "Work beneath conscious understanding."],
    ["07", "Self-trust", "Reconnect with your own voice."],
    ["08", "Boundaries", "Choose yourself without guilt."],
  ]},
  { month: "Month three", theme: "Become", weeks: [
    ["09", "Repatterning", "Practice a new way of being."],
    ["10", "Nervous system", "Create more capacity for safety, receiving, and expression."],
    ["11", "Integration", "Bring the work into real life."],
  ]},
];

const RETREAT_SLOTS = [
  ["retreat_1", "Nature"], ["retreat_2", "Food, the table"], ["retreat_3", "Movement"],
  ["retreat_4", "Meditation"], ["retreat_5", "Connection"], ["retreat_6", "Golden hour"], ["retreat_7", "The place"],
] as const;

// Real, published client words (also shown on /testimony).
const WORDS = [
  { q: "I came with the intention to release and remember, and that’s exactly what happened. I was able to let go of the trauma I’d been carrying and reconnect with who I truly am.", who: "Pepe Herrera", role: "Actor" },
  { q: "I came thinking I was okay. I left realizing I wasn’t. What I found was healing, hope, and a deeper understanding of myself. One of the greatest investments I’ve ever made.", who: "King Fortuna", role: "Businessman" },
  { q: "Essence created a space of deep connection, safety, and belonging. I discovered a new way of seeing myself and a new way of living.", who: "Nadia Montenegro", role: "Actress · Mother · Businesswoman" },
];

const INCLUDED = [
  "12-week group experience", "Weekly live sessions", "Subconscious work", "Shadow work", "Somatic practices", "Breathwork",
  "Energetic exploration", "Guided meditations", "Private community", "Online resource portal", "Celebratory overnight retreat, in person",
];

export default function LiberateClient({ photos = {} }: { photos?: Photos }) {
  const offer = OFFERS.liberate;
  const price = offer.pricePHP ? `₱${offer.pricePHP.toLocaleString("en-PH")}` : "TBA";

  const heroImg = photos.hero_portrait || "/photos/libni-hero.jpg";
  const momentImg = photos.moment_portrait || "/photos/libni-portrait.jpg";
  const weightImg = photos.bath_portrait || "/photos/liberate-libni-thought.jpg";
  const storyImg = photos.story_portrait || "/photos/liberate-libni-warm.jpg";
  const retreatPhotos = RETREAT_SLOTS.filter(([id]) => photos[id]);

  return (
    <div className="lb">
      <style>{`
        .lb {
          --lb-ink: #2b2528; --lb-night: #241c2a; --lb-plum: #5b4470; --lb-plum-deep: #3e2d4e;
          --lb-ivory: #fbf9f6; --lb-linen: #f1ece5; --lb-sand: #e4dcd2;
          --lb-gold: #b8955a; --lb-gold-soft: #d8c39a; --lb-muted: #7d716d;
          --lb-line: rgba(43,37,40,.14); --lb-line-light: rgba(251,249,246,.18);
          --serif: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          --sans: var(--font-body), Karla, ui-sans-serif, system-ui, sans-serif;
          color: var(--lb-ink); background: var(--lb-ivory); font-family: var(--sans); font-size: 17px; line-height: 1.7; overflow-x: clip;
        }
        .lb h1, .lb h2, .lb h3 { margin: 0; font-family: var(--serif); font-weight: 400; color: inherit; letter-spacing: -0.015em; }
        .lb p { margin: 0; }
        :where(.lb) a { color: inherit; }
        .lb img { display: block; max-width: 100%; }

        .lb-wrap { max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 64px); }
        .lb-eyebrow { font-family: var(--sans); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; font-weight: 600; color: var(--lb-gold); }
        .lb-display { font-size: clamp(40px, 5.4vw, 78px); line-height: 1.02; }
        .lb-lede { font-family: var(--serif); font-size: clamp(22px, 2.3vw, 31px); line-height: 1.3; font-weight: 400; }
        .lb-copy { max-width: 56ch; display: grid; gap: 1.1em; }
        .lb-copy p { font-size: 17px; line-height: 1.75; }
        .lb-copy p.lb-lede { font-family: var(--serif); font-size: clamp(22px, 2.3vw, 31px); line-height: 1.3; }
        .lb-muted { color: var(--lb-muted); }
        .lb-gold { color: var(--lb-gold-soft); font-style: italic; }
        .lb-em { font-style: italic; }
        .lb-rule { width: 56px; height: 1px; background: var(--lb-gold); }

        .lb-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 56px; padding: 0 34px; font-family: var(--sans); font-size: 12px; letter-spacing: .22em; text-transform: uppercase; font-weight: 600; border: 1px solid currentColor; border-radius: 0; text-decoration: none; transition: background .35s ease, color .35s ease, border-color .35s ease, transform .35s ease; white-space: nowrap; }
        .lb-btn:hover { transform: translateY(-1px); }
        .lb-btn-gold { background: var(--lb-gold-soft); border-color: var(--lb-gold-soft); color: var(--lb-night); }
        .lb-btn-gold:hover { background: #fff; border-color: #fff; color: var(--lb-night); }
        .lb-btn-light { color: var(--lb-ivory); border-color: rgba(251,249,246,.6); }
        .lb-btn-light:hover { background: var(--lb-ivory); color: var(--lb-night); border-color: var(--lb-ivory); }
        .lb-btn-ink { background: var(--lb-ink); border-color: var(--lb-ink); color: var(--lb-ivory); }
        .lb-btn-ink:hover { background: var(--lb-plum); border-color: var(--lb-plum); color: #fff; }
        .lb-btn-ghost { color: var(--lb-ink); border-color: var(--lb-ink); }
        .lb-btn-ghost:hover { background: var(--lb-ink); color: var(--lb-ivory); }
        .lb-ctas { display: flex; flex-wrap: wrap; gap: 14px; }

        /* reveal */
        .lb-reveal { opacity: 0; transform: translateY(26px); transition: opacity 1s ease, transform 1s cubic-bezier(.2,.7,.2,1); }
        .lb-reveal.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .lb-reveal { opacity: 1; transform: none; transition: none; } .lb-hero-media img, .lb-hero-panel > * { animation: none !important; } }

        /* 01 HERO */
        .lb-hero { position: relative; min-height: 100svh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); background: var(--lb-night); color: var(--lb-ivory); }
        .lb-hero-panel { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(130px, 16vh, 180px) clamp(20px, 5vw, 64px) clamp(44px, 7vh, 72px) clamp(20px, 6vw, 96px); background: radial-gradient(120% 80% at 0% 100%, rgba(91,68,112,.55) 0%, rgba(36,28,42,0) 60%), var(--lb-night); }
        .lb-hero-panel > * { animation: lbUp 1.1s cubic-bezier(.2,.7,.2,1) both; }
        .lb-hero-panel > :nth-child(2) { animation-delay: .12s; } .lb-hero-panel > :nth-child(3) { animation-delay: .24s; }
        .lb-hero-panel > :nth-child(4) { animation-delay: .36s; } .lb-hero-panel > :nth-child(5) { animation-delay: .48s; } .lb-hero-panel > :nth-child(6) { animation-delay: .6s; }
        @keyframes lbUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        .lb-hero-media { position: relative; overflow: hidden; min-height: 100svh; }
        .lb-hero-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; animation: lbZoom 2.2s ease-out both; }
        @keyframes lbZoom { from { transform: scale(1.07); } to { transform: scale(1); } }
        .lb-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, var(--lb-night) 0%, rgba(36,28,42,.35) 22%, rgba(36,28,42,0) 48%), linear-gradient(180deg, rgba(36,28,42,.55) 0%, rgba(36,28,42,0) 30%, rgba(36,28,42,0) 70%, rgba(36,28,42,.55) 100%); }
        .lb-hero-who { color: rgba(251,249,246,.72); }
        .lb-hero-who strong { display: block; color: var(--lb-ivory); font-weight: 600; letter-spacing: .3em; margin-bottom: 6px; }
        .lb-hero-title { font-size: clamp(84px, 13.5vw, 196px); line-height: .92; letter-spacing: -0.03em; margin: 22px 0 26px; font-weight: 400; }
        .lb-hero-lede { font-family: var(--serif); font-size: clamp(24px, 2.5vw, 36px); line-height: 1.22; font-style: italic; max-width: 20ch; color: var(--lb-ivory); }
        .lb-hero-sub { max-width: 46ch; color: rgba(251,249,246,.75); font-size: 16px; margin-top: 30px; }
        .lb-hero-meta { display: flex; align-items: baseline; gap: 16px; margin: 32px 0 26px; padding-top: 22px; border-top: 1px solid var(--lb-line-light); font-family: var(--sans); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(251,249,246,.6); }
        .lb-hero-meta strong { font-family: var(--serif); font-size: 24px; letter-spacing: 0; text-transform: none; color: var(--lb-gold-soft); font-weight: 400; font-style: italic; }

        /* sections */
        .lb-sec { padding: clamp(88px, 11vw, 150px) 0; }
        .lb-ivory { background: var(--lb-ivory); } .lb-linen { background: var(--lb-linen); }
        .lb-plum { background: var(--lb-plum); color: var(--lb-ivory); } .lb-night { background: var(--lb-night); color: var(--lb-ivory); }

        .lb-split { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: clamp(28px, 4vw, 64px); align-items: center; }
        .lb-c5 { grid-column: span 5; } .lb-c6 { grid-column: span 6; } .lb-c7 { grid-column: span 7; }
        .lb-off1 { grid-column: 7 / span 6; }
        .lb-figure { position: relative; }
        .lb-figure img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; }
        .lb-figure::before { content: ""; position: absolute; inset: 0; transform: translate(16px, 16px); border: 1px solid var(--lb-gold); opacity: .55; pointer-events: none; z-index: 0; }
        .lb-figure img { position: relative; z-index: 1; }
        .lb-figure-tall img { aspect-ratio: 3 / 4; }
        .lb-bleed-right { grid-column: 8 / span 5; margin-right: calc(-1 * (max(50vw - 640px, 0px) + clamp(20px, 5vw, 64px))); }
        .lb-bleed-right img { width: 100%; height: clamp(560px, 80vh, 780px); object-fit: cover; object-position: 50% 12%; aspect-ratio: auto; }
        .lb-tools { display: grid; gap: 4px; font-family: var(--serif); font-size: clamp(22px, 2vw, 28px); font-style: italic; line-height: 1.3; }
        .lb-tools span:nth-child(2) { color: #5e5450; } .lb-tools span:nth-child(3) { color: #86796f; } .lb-tools span:nth-child(4) { color: #a89a93; }
        .lb-stack { display: grid; gap: clamp(22px, 2.6vw, 34px); }

        /* 04 statement */
        .lb-statement { text-align: center; max-width: 1000px; margin: 0 auto; }
        .lb-statement h2 { font-size: clamp(42px, 6.4vw, 92px); line-height: 1; }
        .lb-statement .lb-intro { max-width: 62ch; margin: 0 auto; display: grid; gap: 1.1em; color: rgba(251,249,246,.86); }
        .lb-logo { width: min(100%, 380px); margin: 0 auto; opacity: .95; }
        .lb-zoom { margin-top: clamp(48px, 6vw, 80px); border: 1px solid var(--lb-line-light); padding: 10px; }
        .lb-zoom img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }

        /* 05 inside */
        .lb-head { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end; margin-bottom: clamp(48px, 6vw, 84px); }
        .lb-index { display: grid; grid-template-columns: 1fr 1fr; column-gap: clamp(40px, 6vw, 96px); }
        .lb-item { padding: 34px 0 36px; border-top: 1px solid var(--lb-line); display: grid; grid-template-columns: 64px 1fr; gap: 18px; }
        .lb-item-n { font-family: var(--serif); font-size: 30px; color: var(--lb-gold); line-height: 1; padding-top: 6px; }
        .lb-item h3 { font-size: clamp(24px, 2.1vw, 30px); line-height: 1.15; margin-bottom: 10px; }
        .lb-item p { font-size: 15.5px; color: var(--lb-muted); max-width: 40ch; }
        .lb-item img { grid-column: 1 / -1; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; margin-bottom: 8px; }

        /* 06 roadmap */
        .lb-road { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(32px, 5vw, 72px); margin-top: clamp(48px, 6vw, 80px); }
        .lb-col { position: relative; padding-left: 34px; }
        .lb-col::before { content: ""; position: absolute; left: 6px; top: 6px; bottom: 0; width: 1px; background: linear-gradient(180deg, var(--lb-gold), rgba(184,149,90,.2)); transform: scaleY(0); transform-origin: top; transition: transform 1.6s cubic-bezier(.2,.7,.2,1) .2s; }
        .is-in .lb-col::before { transform: scaleY(1); }
        .lb-col-head { margin-bottom: 30px; position: relative; }
        .lb-col-head::before { content: ""; position: absolute; left: -34px; top: 4px; width: 13px; height: 13px; border-radius: 50%; background: var(--lb-plum); box-shadow: 0 0 0 4px var(--lb-linen); }
        .lb-col-head .lb-eyebrow { color: var(--lb-muted); }
        .lb-col-head h3 { font-size: clamp(38px, 4vw, 56px); line-height: 1; font-style: italic; color: var(--lb-plum); margin-top: 6px; }
        .lb-week { position: relative; padding: 0 0 28px; }
        .lb-week::before { content: ""; position: absolute; left: -31px; top: 12px; width: 7px; height: 7px; border-radius: 50%; background: var(--lb-gold); }
        .lb-week small { font-family: var(--sans); font-size: 11px; letter-spacing: .26em; color: var(--lb-gold); font-weight: 600; }
        .lb-week h4 { font-family: var(--serif); font-weight: 400; font-size: 26px; line-height: 1.1; margin: 4px 0 4px; }
        .lb-week p { font-size: 15px; color: var(--lb-muted); }
        .lb-finale { margin-top: clamp(24px, 4vw, 48px); padding-top: clamp(40px, 5vw, 64px); border-top: 1px solid var(--lb-gold); display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end; }
        .lb-finale small { font-family: var(--sans); font-size: 11px; letter-spacing: .3em; color: var(--lb-gold); font-weight: 600; }
        .lb-finale h3 { font-size: clamp(64px, 9vw, 140px); line-height: .95; font-style: italic; color: var(--lb-plum); margin-top: 8px; }
        .lb-finale p { font-family: var(--serif); font-size: clamp(22px, 2.2vw, 30px); line-height: 1.3; max-width: 22ch; }

        /* 07 retreat */
        .lb-retreat-head { max-width: 900px; }
        .lb-retreat-head h2 span { display: block; }
        .lb-ribbon { margin-top: clamp(48px, 6vw, 84px); padding: clamp(28px, 4vw, 40px) 0; border-top: 1px solid var(--lb-line-light); border-bottom: 1px solid var(--lb-line-light); display: flex; flex-wrap: wrap; gap: 10px 0; font-family: var(--serif); font-style: italic; font-size: clamp(22px, 2.6vw, 38px); line-height: 1.2; color: rgba(251,249,246,.9); }
        .lb-ribbon span + span::before { content: "·"; color: var(--lb-gold); margin: 0 .5em; font-style: normal; }
        .lb-retreat-hero { margin-top: clamp(48px, 6vw, 84px); }
        .lb-retreat-hero img { width: 100%; aspect-ratio: 21 / 9; object-fit: cover; }
        .lb-mosaic { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 10px; }
        .lb-mosaic figure { margin: 0; position: relative; grid-column: span 2; }
        .lb-mosaic figure:first-child { grid-column: span 4; grid-row: span 2; }
        .lb-mosaic img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 1; }
        .lb-mosaic figure:first-child img { aspect-ratio: auto; }
        .lb-mosaic figcaption { position: absolute; left: 14px; bottom: 12px; font-family: var(--sans); font-size: 10px; letter-spacing: .24em; text-transform: uppercase; color: var(--lb-ivory); }

        /* 08 story */
        .lb-story-img { position: sticky; top: 110px; }
        .lb-story-img img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: 50% 20%; }
        .lb-pull { font-family: var(--serif); font-style: italic; font-size: clamp(28px, 3vw, 42px); line-height: 1.2; color: var(--lb-plum); padding: 10px 0 10px 26px; border-left: 1px solid var(--lb-gold); margin: 10px 0; }
        .lb-sign { font-family: var(--font-signature), cursive; font-size: 46px; color: var(--lb-plum); line-height: 1; margin-top: 8px; }
        .lb-creds { margin-top: 34px; padding-top: 22px; border-top: 1px solid var(--lb-line); font-family: var(--sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--lb-muted); line-height: 2; }

        /* 09 words */
        .lb-feature { display: grid; grid-template-columns: 7fr 5fr; gap: clamp(32px, 5vw, 80px); align-items: end; padding-bottom: clamp(40px, 5vw, 64px); border-bottom: 1px solid var(--lb-line); }
        .lb-quote { font-family: var(--serif); font-style: italic; font-size: clamp(28px, 3.3vw, 46px); line-height: 1.2; text-indent: -.4em; }
        .lb-quote::before { content: "“"; color: var(--lb-gold); }
        .lb-who { font-family: var(--sans); font-size: 11px; letter-spacing: .26em; text-transform: uppercase; font-weight: 600; margin-top: 22px; }
        .lb-who span { display: block; color: var(--lb-muted); font-weight: 500; margin-top: 4px; }
        .lb-words { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 80px); padding-top: clamp(40px, 5vw, 64px); }
        .lb-words .lb-quote { font-size: clamp(22px, 2vw, 28px); }

        /* 10 investment */
        .lb-invest { display: grid; grid-template-columns: 6fr 5fr; gap: clamp(40px, 6vw, 110px); align-items: start; }
        .lb-price { font-family: var(--serif); font-size: clamp(64px, 8vw, 112px); line-height: 1; margin: 22px 0 8px; letter-spacing: -0.02em; }
        .lb-plan { font-family: var(--serif); font-style: italic; font-size: 22px; color: var(--lb-muted); }
        .lb-note { font-size: 15px; color: var(--lb-muted); max-width: 44ch; margin-top: 18px; }
        .lb-list { list-style: none; margin: 0; padding: 0; }
        .lb-list li { padding: 14px 0; border-top: 1px solid var(--lb-line); font-family: var(--serif); font-size: 21px; display: flex; gap: 16px; align-items: baseline; }
        .lb-list li::before { content: counter(lb) ; counter-increment: lb; font-family: var(--sans); font-size: 10px; letter-spacing: .2em; color: var(--lb-gold); font-weight: 600; min-width: 20px; }
        .lb-list { counter-reset: lb; }
        .lb-list li:last-child { border-bottom: 1px solid var(--lb-line); }

        /* 11 peace */
        .lb-peace { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(32px, 5vw, 96px); align-items: start; }
        .lb-peace .lb-copy p:first-child { font-family: var(--serif); font-size: 26px; line-height: 1.3; }

        /* 12 final */
        .lb-final { position: relative; color: var(--lb-ivory); text-align: center; padding: clamp(110px, 16vw, 200px) 0; background: radial-gradient(70% 60% at 50% 100%, rgba(91,68,112,.7) 0%, rgba(36,28,42,0) 70%), var(--lb-night); }
        .lb-final h2 { font-size: clamp(44px, 7vw, 108px); line-height: .98; max-width: 14ch; margin: 0 auto; }
        .lb-final .lb-copy { margin: 36px auto 0; text-align: center; color: rgba(251,249,246,.8); max-width: 52ch; }
        .lb-final-meta { display: flex; justify-content: center; flex-wrap: wrap; gap: 0 48px; margin: 48px auto 40px; padding: 26px 0; border-top: 1px solid var(--lb-line-light); border-bottom: 1px solid var(--lb-line-light); max-width: 720px; font-family: var(--sans); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(251,249,246,.6); }
        .lb-final-meta b { display: block; font-family: var(--serif); font-size: 26px; font-weight: 400; letter-spacing: 0; text-transform: none; color: var(--lb-ivory); margin-top: 4px; }
        .lb-final .lb-ctas { justify-content: center; }

        @media (max-width: 960px) {
          .lb-hero { grid-template-columns: 1fr; min-height: auto; }
          .lb-hero-media { order: -1; min-height: 62svh; max-height: 640px; }
          .lb-hero-media::after { background: linear-gradient(180deg, rgba(36,28,42,.5) 0%, rgba(36,28,42,0) 30%, rgba(36,28,42,0) 62%, var(--lb-night) 100%); }
          .lb-hero-panel { padding: 8px 20px 48px; margin-top: -60px; background: none; }
          .lb-hero-title { font-size: clamp(76px, 24vw, 130px); margin: 16px 0 18px; }
          .lb-split { grid-template-columns: 1fr; gap: 36px; }
          .lb-c5, .lb-c6, .lb-c7, .lb-off1, .lb-bleed-right { grid-column: auto; }
          .lb-split > .lb-figure, .lb-split > .lb-bleed-right { order: -1; }
          .lb-bleed-right { margin-right: 0; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); }
          .lb-bleed-right img { height: 68svh; }
          .lb-head, .lb-index, .lb-road, .lb-finale, .lb-feature, .lb-words, .lb-invest, .lb-peace { grid-template-columns: 1fr; }
          .lb-road { gap: 48px; }
          .lb-story-img { position: static; }
          .lb-mosaic { grid-template-columns: 1fr 1fr; }
          .lb-mosaic figure, .lb-mosaic figure:first-child { grid-column: span 2; grid-row: auto; }
          .lb-ctas { flex-direction: column; } .lb-ctas .lb-btn { width: 100%; }
        }
      `}</style>

      {/* 01 — HERO */}
      <section className="lb-hero" id="top">
        <div className="lb-hero-panel">
          <p className="lb-eyebrow lb-hero-who"><strong>Libni Fortuna</strong>Transformational mentor · Experience curator</p>
          <h1 className="lb-hero-title">Liberate</h1>
          <p className="lb-hero-lede">For the soul-led ones ready to let go of the weight and come home to their power.</p>
          <p className="lb-hero-sub">A 3-month transformational experience for people ready to break free from emotional patterns, people-pleasing, overthinking, and the quiet exhaustion of holding it all together.</p>
          <p className="lb-hero-meta"><span>Next intake</span><strong>October 2026</strong></p>
          <div className="lb-ctas">
            <Link href="/liberate/apply" className="lb-btn lb-btn-gold">I’m ready to Liberate</Link>
            <a href="#lb-for-me" className="lb-btn lb-btn-light">Is this for me?</a>
          </div>
        </div>
        <div className="lb-hero-media"><img src={heroImg} alt="Libni Fortuna" /></div>
      </section>

      {/* 02 — THE MOMENT */}
      <section className="lb-sec lb-ivory">
        <div className="lb-wrap lb-split">
          <div className="lb-figure lb-c5 lb-reveal"><img src={momentImg} alt="Libni, seated and still" /></div>
          <div className="lb-off1 lb-stack lb-reveal" style={{ transitionDelay: ".15s" }}>
            <h2 className="lb-display">There comes a moment when the tools stop working.</h2>
            <div className="lb-tools"><span>The affirmation.</span><span>The mindset shift.</span><span>The journaling.</span><span>The spiritual checklist.</span></div>
            <div className="lb-copy">
              <p>They once brought comfort, but now they feel like surface noise.</p>
              <p>Not because you’re doing it wrong. Because you’re ready for something deeper.</p>
              <p>Liberate is a 3-month group coaching experience for soul-led humans ready to break free from emotional patterns, people-pleasing, and the quiet burnout of holding it all together, and step into their next level of wholeness, power, and spiritual expansion.</p>
            </div>
            <div className="lb-ctas"><a href="#lb-for-me" className="lb-btn lb-btn-ghost">Is this for me?</a></div>
          </div>
        </div>
      </section>

      {/* 03 — THE WEIGHT */}
      <section className="lb-sec lb-linen" id="lb-for-me">
        <div className="lb-wrap lb-split">
          <div className="lb-c6 lb-stack lb-reveal">
            <h2 className="lb-display">They’ve called you intuitive. Grounded. <span className="lb-em" style={{ color: "var(--lb-plum)" }}>Even strong.</span></h2>
            <p className="lb-lede">But what they don’t see is the quiet weight you carry.</p>
            <div className="lb-copy">
              <p>The overthinking. The people-pleasing. The constant shapeshifting just to feel safe or seen.</p>
              <p>You’ve built a life, maybe even a business, but deep down, you still question your worth. You still feel the pull of old stories, emotional loops, and spiritual disconnection.</p>
              <p>And yet there’s a whisper beneath it all. A part of you that knows it’s time to break the cycle. To stop managing your healing and start embodying it.</p>
            </div>
            <p className="lb-pull">To feel safe in your body. Clear in your boundaries. Free in your energy. To lead your life from your center, not from your wounds.</p>
          </div>
          <div className="lb-c6 lb-bleed-right lb-reveal" style={{ transitionDelay: ".15s" }}><img src={weightImg} alt="Libni" /></div>
        </div>
      </section>

      {/* 04 — STATEMENT + INTRODUCING */}
      <section className="lb-sec lb-plum">
        <div className="lb-wrap lb-statement lb-stack">
          <h2 className="lb-reveal">This isn’t about becoming someone else.<br /><span className="lb-gold">It’s about coming home to yourself.</span></h2>
          <div className="lb-reveal" style={{ transitionDelay: ".2s", display: "grid", gap: 26, justifyItems: "center", paddingTop: 30 }}>
            <p className="lb-eyebrow" style={{ color: "rgba(251,249,246,.7)" }}>Introducing</p>
            <img className="lb-logo" src="/liberate-logo-white.png" alt="Liberate with Libni" />
            <div className="lb-intro">
              <p className="lb-lede">A 3-month group experience that will help you release yourself from what no longer serves, reconnect with your truth, and rise, fully and unapologetically.</p>
              <p>This is where deep healing meets grounded embodiment. You won’t just talk about change. You’ll feel it in your body, your energy, your boundaries, and your life.</p>
            </div>
          </div>
          {photos.zoom_screenshot && (
            <div className="lb-zoom lb-reveal"><img src={photos.zoom_screenshot} alt="A Liberate group session" /></div>
          )}
        </div>
      </section>

      {/* 05 — INSIDE */}
      <section className="lb-sec lb-ivory">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">What happens inside</p><h2 className="lb-display" style={{ marginTop: 14 }}>Here’s what you’ll experience inside.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "30ch" }}>Eight threads, woven over twelve weeks. Nothing you have to perform. Everything you get to feel.</p>
          </div>
          <div className="lb-index">
            {INSIDE.map(([title, body, slot], i) => (
              <div className="lb-item lb-reveal" key={slot} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                {photos[slot] && <img src={photos[slot]} alt={title} />}
                <div className="lb-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — ROADMAP */}
      <section className="lb-sec lb-linen">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">The roadmap</p><h2 className="lb-display" style={{ marginTop: 14 }}>Your 12-week journey.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "30ch" }}>Each week goes a little deeper than the last. You start by seeing the pattern. You end by living without it.</p>
          </div>
          <div className="lb-road lb-reveal">
            {ROADMAP.map((m) => (
              <div className="lb-col" key={m.theme}>
                <div className="lb-col-head"><p className="lb-eyebrow">{m.month}</p><h3>{m.theme}</h3></div>
                {m.weeks.map(([n, t, d]) => (
                  <div className="lb-week" key={n}><small>Week {n}</small><h4>{t}</h4><p>{d}</p></div>
                ))}
              </div>
            ))}
          </div>
          <div className="lb-finale lb-reveal">
            <div><small>Week 12 · The arrival</small><h3>Liberation.</h3></div>
            <p>Step into greater freedom and choice. Not a new you. The one who was here all along.</p>
          </div>
        </div>
      </section>

      {/* 07 — RETREAT */}
      <section className="lb-sec lb-night">
        <div className="lb-wrap">
          <div className="lb-retreat-head lb-stack lb-reveal">
            <p className="lb-eyebrow">The retreat</p>
            <h2 className="lb-display"><span>It doesn’t end on Zoom.</span><span className="lb-gold">It ends with a celebration.</span></h2>
            <div className="lb-copy" style={{ color: "rgba(251,249,246,.82)" }}>
              <p>The journey culminates in an in-person overnight retreat where we slow down, connect, integrate, celebrate, and embody everything you’ve experienced.</p>
              <p>Because sometimes transformation needs more than another Zoom call.</p>
              <p className="lb-lede" style={{ color: "var(--lb-ivory)" }}>It needs to be lived.</p>
            </div>
          </div>
          {photos.retreat_hero && (
            <div className="lb-retreat-hero lb-reveal"><img src={photos.retreat_hero} alt="The Liberate retreat" /></div>
          )}
          {retreatPhotos.length > 0 ? (
            <div className="lb-mosaic lb-reveal">
              {retreatPhotos.map(([id, label]) => (
                <figure key={id}><img src={photos[id]} alt={label} /><figcaption>{label}</figcaption></figure>
              ))}
            </div>
          ) : (
            <div className="lb-ribbon lb-reveal">
              <span>Nature</span><span>Food, the table</span><span>Movement</span><span>Meditation</span><span>Connection</span><span>Golden hour</span>
            </div>
          )}
        </div>
      </section>

      {/* 08 — STORY */}
      <section className="lb-sec lb-ivory">
        <div className="lb-wrap lb-split" style={{ alignItems: "start" }}>
          <div className="lb-c5 lb-reveal"><div className="lb-story-img lb-figure"><img src={storyImg} alt="Libni Fortuna" /></div></div>
          <div className="lb-off1 lb-stack lb-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="lb-eyebrow">My story</p>
            <h2 className="lb-display">Why I created Liberate.</h2>
            <div className="lb-copy">
              <p>If you’re reading this, I want you to know I see you. I know that feeling.</p>
              <p>For years, I carried so much that wasn’t mine: the weight of expectations, emotional baggage I didn’t even realize I was holding, and patterns that kept me stuck in cycles I desperately wanted to break.</p>
              <p>I did all the things. The self-help books. The affirmations. The journaling. And while they helped, I still felt like something was missing. Like there was something deeper blocking me from fully stepping into who I was meant to be.</p>
            </div>
            <p className="lb-pull">It wasn’t until I went beyond mindset work and into deep subconscious and energetic healing that everything changed.</p>
            <div className="lb-copy">
              <p>I started working with my chakras, rewiring my subconscious mind, releasing stored trauma, and integrating the spiritual side of healing. And for the first time, I felt free.</p>
              <p>That’s why I created Liberate. Because I know you’ve done the work, but something still isn’t clicking. And I want to take you beyond surface-level healing into the deep, soul-shifting work that truly sets you free.</p>
              <p>If you’re ready for that, welcome home. This is your space.</p>
            </div>
            <p className="lb-sign">Libni</p>
            <p className="lb-creds">TEDx speaker · Founder, Essence Retreat Philippines · Certified hypnotherapist · NLP master practitioner · Breathwork &amp; somatic facilitator</p>
          </div>
        </div>
      </section>

      {/* 09 — WORDS */}
      <section className="lb-sec lb-linen">
        <div className="lb-wrap">
          <div className="lb-feature lb-reveal">
            <div>
              <p className="lb-eyebrow" style={{ marginBottom: 24 }}>Real people. Real shifts.</p>
              <p className="lb-quote">{WORDS[0].q}</p>
              <p className="lb-who">{WORDS[0].who}<span>{WORDS[0].role}</span></p>
            </div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "24ch" }}>Words from people who have done this work with Libni. Not reviews. Turning points.</p>
          </div>
          <div className="lb-words">
            {WORDS.slice(1).map((w, i) => (
              <div key={w.who} className="lb-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <p className="lb-quote">{w.q}</p>
                <p className="lb-who">{w.who}<span>{w.role}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — INVESTMENT */}
      <section className="lb-sec lb-ivory" id="investment">
        <div className="lb-wrap lb-invest">
          <div className="lb-reveal">
            <p className="lb-eyebrow">The investment</p>
            <h2 className="lb-display" style={{ marginTop: 14, maxWidth: "14ch" }}>Liberate, a 3-month group coaching experience.</h2>
            <p className="lb-price">{price}</p>
            {offer.allowInstalments && offer.instalmentCount && (
              <p className="lb-plan">Pay in full, or in {offer.instalmentCount} instalments.</p>
            )}
            <div className="lb-ctas" style={{ marginTop: 30 }}>
              <Link href="/liberate/apply" className="lb-btn lb-btn-ink">I’m ready to Liberate</Link>
              <Link href="/book" className="lb-btn lb-btn-ghost">Book a call</Link>
            </div>
            <p className="lb-note">This takes you to a short application, then a call with me. No payment is taken until we both know it’s the right space for you.</p>
          </div>
          <div className="lb-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="lb-eyebrow" style={{ marginBottom: 18 }}>What’s included</p>
            <ul className="lb-list">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* 11 — PEACE OF MIND */}
      <section className="lb-sec lb-linen">
        <div className="lb-wrap lb-peace">
          <div className="lb-reveal">
            <p className="lb-eyebrow">Before you say yes</p>
            <h2 className="lb-display" style={{ marginTop: 14 }}>Your peace of mind matters.</h2>
            <div className="lb-rule" style={{ marginTop: 28 }} />
          </div>
          <div className="lb-stack lb-reveal" style={{ transitionDelay: ".15s" }}>
            <div className="lb-copy">
              <p>Liberate is a sacred container, and joining it is a meaningful choice.</p>
              <p>We honor the depth of this kind of work, and we believe it deserves a full-body yes.</p>
              <p>That’s why Liberate does not offer refunds. Not because we don’t care, but because we do.</p>
              <p>Because this space isn’t built on urgency, pressure, or impulse decisions. It’s built on alignment, trust, and mutual devotion.</p>
              <p>If you’re unsure, it’s okay to take your time. Feel into it. Ask your questions. Breathe with the decision.</p>
              <p>And when you say yes, let it be a full yes, one your whole being can stand behind.</p>
              <p className="lb-em" style={{ fontFamily: "var(--serif)", fontSize: 24 }}>We’ll meet you there.</p>
            </div>
            <div className="lb-ctas"><Link href="/liberate/apply" className="lb-btn lb-btn-ink">I’m ready to be held</Link></div>
          </div>
        </div>
      </section>

      {/* 12 — FINAL */}
      <section className="lb-final">
        <div className="lb-wrap">
          <h2 className="lb-reveal">You don’t need to become someone else. <span className="lb-gold">You need the freedom to be yourself.</span></h2>
          <div className="lb-copy lb-reveal" style={{ transitionDelay: ".15s" }}>
            <p>Break free from the emotional weight you’ve been carrying. From the people-pleasing, the patterns, the quiet exhaustion that’s become your normal.</p>
            <p>Liberate is your space to unravel, rebuild, and rise. This is your next chapter, and it doesn’t have to be written in pain.</p>
            <p style={{ color: "var(--lb-ivory)" }}>We begin October 2026. Spots are limited and held with intention.</p>
          </div>
          <div className="lb-final-meta lb-reveal" style={{ transitionDelay: ".25s" }}>
            <div>Liberate<b>3-month group experience</b></div>
            <div>Next intake<b>October 2026</b></div>
            <div>Investment<b>{price}</b></div>
          </div>
          <div className="lb-ctas lb-reveal" style={{ transitionDelay: ".35s" }}>
            <Link href="/liberate/apply" className="lb-btn lb-btn-gold">I’m ready to Liberate</Link>
            <Link href="/book" className="lb-btn lb-btn-light">Book a call</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
