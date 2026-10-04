"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OFFERS } from "@/config/offers";
import { resolveVideo } from "@/config/site-slots";
import { DEFAULT_LIBERATE_VIDEOS, type LiberateVideo } from "@/config/liberate-videos";

type Photos = Record<string, string>;

const INSIDE = [
  ["Live sessions, twice a week", "A check-in circle to be heard, then a workshop to go deeper — guided coaching, shadow work and somatic practices on Zoom. Twenty-four sessions across three months, and every one is recorded, so if you miss a night the replay is waiting for you.", "inside_1"],
  ["Subconscious reprogramming", "Release old beliefs and patterns stored deep within, and create new ones rooted in self-trust and truth.", "inside_2"],
  ["Energetic exploration and chakra alignment", "Understand your energy body and return to balance through breathwork and gentle practices.", "inside_3"],
  ["Spiritual tools and intuitive activation", "Deepen your connection with intuition, inner knowing, and your spiritual path.", "inside_4"],
  ["Journaling and breakthrough exercises", "Process each layer of your transformation with clarity and intention, guided every step of the way.", "inside_5"],
  ["Private community", "You’re not doing this alone. You’ll be surrounded by like-hearted people walking this path with you.", "inside_6"],
  ["Your own online portal", "Your private home for the whole journey — the replays of every session, a library of guided meditations, workshops, practices and resources to support you throughout.", "inside_7"],
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

// Real, published client words (also shown on /testimony).
const WORDS: Word[] = [
  { q: "I came with the intention to release and remember, and that’s exactly what happened. I was able to let go of the trauma I’d been carrying and reconnect with who I truly am.", who: "Pepe Herrera", role: "Actor" },
  { q: "I came thinking I was okay. I left realizing I wasn’t. What I found was healing, hope, and a deeper understanding of myself. One of the greatest investments I’ve ever made.", who: "King Fortuna", role: "Businessman" },
  { q: "Essence created a space of deep connection, safety, and belonging. I discovered a new way of seeing myself and a new way of living.", who: "Nadia Montenegro", role: "Actress · Mother · Businesswoman" },
];

const INCLUDED = [
  "3-month group experience", "24 live sessions — twice a week", "Replays of every session", "A weekly check-in circle", "A weekly workshop", "Subconscious work", "Shadow work", "Somatic practices", "Breathwork",
  "Energetic exploration", "Guided meditations", "Private community", "Your own online portal", "Celebratory overnight retreat, in person",
];

type Word = { id?: string; q: string; who: string; role?: string; photo?: string };
type Video = LiberateVideo;
const DEFAULT_VIDEOS = DEFAULT_LIBERATE_VIDEOS;
const mmss = (n?: number) => (n ? `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}` : "");

// Faces cropped from the photos her students posted alongside their words (LIBer highlight).
const FACES: Record<string, string> = {
  tiff: "/photos/liberate/face-tiff.jpg", erika: "/photos/liberate/face-erika.jpg", danessa: "/photos/liberate/face-danessa.jpg",
  jill: "/photos/liberate/face-jill.jpg", mims: "/photos/liberate/face-mims.jpg", zy: "/photos/liberate/face-zy.jpg",
  nick: "/photos/liberate/face-nick.jpg", sam: "/photos/liberate/face-sam.jpg", lea: "/photos/liberate/face-lea.jpg", risha: "/photos/liberate/face-risha.jpg",
};
const FEATURE_PHOTO: Record<string, string> = { tiff: "/photos/liberate/feature-tiff.jpg" };

// Stock photos (Unsplash, free licence) stand in until Libni uploads her own to each “inside” slot.
const INSIDE_STOCK: Record<string, string> = {
  inside_1: "https://images.unsplash.com/photo-1612832164313-ac0d7e07b5ce?auto=format&fit=crop&w=1200&q=75",
  inside_2: "https://images.unsplash.com/photo-1518708909080-704599b19972?auto=format&fit=crop&w=1200&q=75",
  inside_3: "https://images.unsplash.com/photo-1561190401-ff2c4b95cd29?auto=format&fit=crop&w=1200&q=75",
  inside_4: "https://images.unsplash.com/photo-1585059896947-f99dd6c80101?auto=format&fit=crop&w=1200&q=75",
  inside_5: "https://images.unsplash.com/photo-1660324197196-69580168711e?auto=format&fit=crop&w=1200&q=75",
  inside_6: "https://images.unsplash.com/photo-1622352496174-9e1d969b1945?auto=format&fit=crop&w=1200&q=75",
  inside_7: "https://images.unsplash.com/photo-1758876201548-ade1eff8b169?auto=format&fit=crop&w=1200&q=75",
  inside_8: "https://images.unsplash.com/photo-1758599670008-f18f47042e46?auto=format&fit=crop&w=1200&q=75",
};
const SHOT_SLOTS = ["shots_1", "shots_2", "shots_3", "shots_4", "shots_5", "shots_6", "shots_7", "shots_8"];

// Real screenshots from the weekly Zoom sessions (from the LIBer highlight) — what a night inside looks like.
const SESSIONS: [string, string][] = [
  ["session_1", "The weekly circle"],
  ["session_2", "Wherever you are"],
  ["session_3", "Breathwork, together"],
  ["session_4", "The final call"],
];
const SESSION_FALLBACK = ["/photos/liberate/session-1.jpg", "/photos/liberate/session-2.jpg", "/photos/liberate/session-3.jpg", "/photos/liberate/session-4.jpg"];

// The in-person celebration & retreat gallery (real photos from the highlight).
const RETREAT_TILES: [string, string, string][] = [
  ["retreat_1", "The celebration", "/photos/liberate/retreat-1.jpg"],
  ["retreat_2", "The toast", "/photos/liberate/retreat-2.jpg"],
  ["retreat_3", "Still together", "/photos/liberate/retreat-3.jpg"],
  ["retreat_4", "From Zoom to real life", "/photos/liberate/retreat-4.jpg"],
  ["retreat_5", "The retreat", "/photos/liberate/retreat-5.jpg"],
  ["retreat_6", "Goodbyes, for now", "/photos/liberate/retreat-6.jpg"],
];
const RETREAT_HERO_FALLBACK = "/photos/liberate/retreat-hero.jpg";
// Real stories her students posted (reshared in her LIBer highlight) stand in until she uploads her own.
const SHOT_FALLBACK = Array.from({ length: 16 }, (_, i) => `/photos/liberate/words-${i + 1}.jpg`);

// What people want — each one grounded in something a student (or Libni, the night an intake closed) actually wrote.
const WINS: [string, string, string][] = [
  ["Knowing your worth", "“I am in my happiest, most healed, successful and healthiest version of myself.”", "Tiffany · Liberate 2"],
  ["Relationships that feel like home", "“Mended relationships.” “I didn’t just find a community. I found women who feel like home.”", "Libni · Erika Mai, Liberate 4"],
  ["Opportunities that find you", "“Many opportunities… having new car, having the courage to pursue the dream life.”", "Libni, the night intake 2 closed"],
  ["The courage to choose yourself", "“The moment I let go and was bold enough to prioritize myself — the flow was just easy.”", "A student, day four of Liberate 2"],
  ["A body that finally feels safe", "“Everything feels clearer, lighter and brighter.” “I am feeling grateful, abundant and powerful.”", "Mims · Danessa"],
  ["A sisterhood for life", "“A sisterhood who gets me and who grows with me — where conversations are expansive and make life more meaningful.”", "Libni"],
];

const MOMENT_SLOTS = [
  ["moments_1", "In session"], ["moments_2", "The circle"], ["moments_3", "The work"],
  ["moments_4", "Together"], ["moments_5", "The retreat"], ["moments_6", "After"],
] as const;

function Face({ src, name, size = 56 }: { src?: string; name: string; size?: number }) {
  if (src) return <img className="lb-face" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} loading="lazy" />;
  return <span className="lb-face lb-face-initial" style={{ width: size, height: size }}>{name.replace(/^@/, "").charAt(0).toUpperCase()}</span>;
}

function LbVideo({ video, n }: { video: Video; n: number }) {
  const [on, setOn] = useState(false);
  const v = resolveVideo(video.url);
  if (!v) return null;
  const ratio = video.w && video.h ? `${video.w} / ${video.h}` : "9 / 16";
  const wide = !!(video.w && video.h && video.w > video.h);
  const title = video.name ? `${video.name} on Liberate` : `A Liberate student, video ${n}`;
  const src = "embed" in v ? `${v.embed}${v.embed.includes("?") ? "&" : "?"}autoplay=1&title=0&byline=0&portrait=0&dnt=1` : v.file;
  return (
    <figure className={`lb-video${wide ? " lb-video-wide" : ""}`} style={{ aspectRatio: ratio }}>
      {on ? (
        "embed" in v
          ? <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
          : <video src={src} poster={video.poster} controls autoPlay playsInline />
      ) : (
        <button type="button" className="lb-video-play" onClick={() => setOn(true)} aria-label={`Play: ${title}`}>
          {video.poster ? <img src={video.poster} alt="" loading="lazy" /> : <span className="lb-video-blank" />}
          <span className="lb-video-btn"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
        </button>
      )}
      {(video.name || video.dur) && (
        <figcaption><strong>{video.name ?? "A Liberate student"}</strong>{video.role && <span>{video.role}</span>}{video.dur ? <em>{mmss(video.dur)}</em> : null}</figcaption>
      )}
    </figure>
  );
}

export default function LiberateClient({ photos = {}, words: incoming, videos: incomingVideos = [] }: { photos?: Photos; words?: Word[]; videos?: Video[] }) {
  const videos: Video[] = incomingVideos.length ? incomingVideos : DEFAULT_VIDEOS;
  const offer = OFFERS.liberate;
  // Client words come from the Studio (“Client stories”); the published quotes are the fallback.
  const WORDS_SHOWN: Word[] = (incoming && incoming.length ? incoming : WORDS).map((w) => ({ ...w, photo: w.photo || (w.id ? FACES[w.id] : undefined) }));
  const first = WORDS_SHOWN[0];
  const featurePhoto = photos.libw_feature || (first.id && FEATURE_PHOTO[first.id]) || first.photo;
  const momentPhotos = MOMENT_SLOTS.filter(([id]) => photos[id]);
  const uploadedShots = SHOT_SLOTS.map((id) => photos[id]).filter(Boolean);
  const shots = uploadedShots.length ? uploadedShots : SHOT_FALLBACK;
  const instalment = offer.allowInstalments && offer.instalmentCount ? Math.floor((offer.pricePHP ?? 0) / offer.instalmentCount) : 0;
  const perMonth = instalment ? `₱${instalment.toLocaleString("en-PH")}` : "";

  // The sticky bar appears once the hero has scrolled away.
  const heroRef = useRef<HTMLElement | null>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const price = offer.pricePHP ? `₱${offer.pricePHP.toLocaleString("en-PH")}` : "TBA";

  const heroImg = photos.hero_portrait || "/photos/libni-hero.jpg";
  const momentImg = photos.moment_portrait || "/photos/libni-portrait.jpg";
  const weightImg = photos.bath_portrait || "/photos/liberate-libni-thought.jpg";
  const storyImg = photos.story_portrait || "/photos/liberate-libni-warm.jpg";
  const uploadedRetreat = RETREAT_TILES.filter(([id]) => photos[id]);
  const retreatTiles = (uploadedRetreat.length ? uploadedRetreat.map(([id, label]) => [label, photos[id]] as const) : RETREAT_TILES.map(([, label, src]) => [label, src] as const));
  const retreatHero = photos.retreat_hero || RETREAT_HERO_FALLBACK;

  return (
    <div className={`lb${stuck ? " lb-stuck" : ""}`}>
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
        .lb-hero { position: relative; min-height: calc(100svh - var(--ed-bar-h, 0px)); display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); background: var(--lb-night); color: var(--lb-ivory); }
        .lb-hero-panel { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(84px, 10vh, 110px) clamp(20px, 5vw, 64px) clamp(24px, 3.5vh, 36px) clamp(20px, 6vw, 96px); background: radial-gradient(120% 80% at 0% 100%, rgba(91,68,112,.55) 0%, rgba(36,28,42,0) 60%), var(--lb-night); }
        .lb-hero-panel > * { animation: lbUp 1.1s cubic-bezier(.2,.7,.2,1) both; }
        .lb-hero-panel > :nth-child(2) { animation-delay: .12s; } .lb-hero-panel > :nth-child(3) { animation-delay: .24s; }
        .lb-hero-panel > :nth-child(4) { animation-delay: .36s; } .lb-hero-panel > :nth-child(5) { animation-delay: .48s; } .lb-hero-panel > :nth-child(6) { animation-delay: .6s; }
        @keyframes lbUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        .lb-hero-media { position: relative; overflow: hidden; min-height: calc(100svh - var(--ed-bar-h, 0px)); max-height: calc(100svh - var(--ed-bar-h, 0px)); }
        .lb-hero-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; animation: lbZoom 2.2s ease-out both; }
        @keyframes lbZoom { from { transform: scale(1.07); } to { transform: scale(1); } }
        .lb-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, var(--lb-night) 0%, rgba(36,28,42,.35) 22%, rgba(36,28,42,0) 48%), linear-gradient(180deg, rgba(36,28,42,.55) 0%, rgba(36,28,42,0) 30%, rgba(36,28,42,0) 70%, rgba(36,28,42,.55) 100%); }
        .lb-hero-who { color: rgba(251,249,246,.72); }
        .lb-hero-who strong { display: block; color: var(--lb-ivory); font-weight: 600; letter-spacing: .3em; margin-bottom: 6px; }
        .lb-hero-title { font-size: clamp(84px, 12.5vw, 172px); line-height: .9; letter-spacing: -0.03em; margin: 12px 0 14px; font-weight: 400; }
        .lb-hero-lede { font-family: var(--serif); font-size: clamp(24px, 2.4vw, 34px); line-height: 1.16; font-style: italic; max-width: 25ch; color: var(--lb-ivory); }
        .lb .lb-hero-sub { max-width: 54ch; color: rgba(251,249,246,.75); font-size: 15.5px; margin-top: 18px; }
        .lb .lb-hero-meta { display: flex; align-items: baseline; gap: 16px; margin: 18px 0 16px; padding-top: 14px; border-top: 1px solid var(--lb-line-light); font-family: var(--sans); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(251,249,246,.6); }
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

        /* 06b sessions */
        .lb-sessions { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: clamp(40px, 5vw, 64px); }
        .lb-sessions figure { margin: 0; position: relative; overflow: hidden; }
        .lb-sessions img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; display: block; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
        .lb-sessions figure:hover img { transform: scale(1.03); }
        .lb-sessions figcaption { position: absolute; left: 14px; bottom: 12px; font-family: var(--sans); font-size: 10px; letter-spacing: .24em; text-transform: uppercase; color: var(--lb-ivory); text-shadow: 0 1px 8px rgba(0,0,0,.55); }
        .lb-sessions figure::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(36,28,42,0) 55%, rgba(36,28,42,.5) 100%); pointer-events: none; }

        /* 07 retreat */
        .lb-retreat-head { max-width: 900px; }
        .lb-retreat-head h2 span { display: block; }
        .lb-ribbon { margin-top: clamp(48px, 6vw, 84px); padding: clamp(28px, 4vw, 40px) 0; border-top: 1px solid var(--lb-line-light); border-bottom: 1px solid var(--lb-line-light); display: flex; flex-wrap: wrap; gap: 10px 0; font-family: var(--serif); font-style: italic; font-size: clamp(22px, 2.6vw, 38px); line-height: 1.2; color: rgba(251,249,246,.9); }
        .lb-ribbon span + span::before { content: "·"; color: var(--lb-gold); margin: 0 .5em; font-style: normal; }
        .lb-retreat-hero { margin-top: clamp(48px, 6vw, 84px); }
        .lb-retreat-hero { position: relative; }
        .lb-retreat-hero img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
        .lb-retreat-hero figcaption { position: absolute; left: 18px; bottom: 16px; font-family: var(--serif); font-style: italic; font-size: clamp(16px, 1.8vw, 22px); color: var(--lb-ivory); text-shadow: 0 1px 10px rgba(0,0,0,.6); max-width: 24ch; }
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
        .lb-word { display: grid; gap: 18px; }
        .lb-word-img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; object-position: 50% 20%; }
        .lb-shots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .lb-shots figure { margin: 0; background: var(--lb-ivory); border: 1px solid var(--lb-line); padding: 8px; }
        .lb-shots img { width: 100%; aspect-ratio: 9 / 16; object-fit: cover; object-position: top; display: block; }

        .lb .lb-hero-proof { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--lb-line-light); display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; font-family: var(--serif); font-style: italic; font-size: 18px; line-height: 1.3; color: rgba(251,249,246,.82); }
        .lb-hero-proof span { font-family: var(--sans); font-style: normal; font-size: 10px; letter-spacing: .28em; text-transform: uppercase; color: var(--lb-gold-soft); }
        .lb-hero-proof em { font-style: normal; font-family: var(--sans); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(251,249,246,.5); }
        .lb-h3 { font-size: clamp(30px, 3.4vw, 48px); margin-top: 12px; line-height: 1.05; }
        .lb-face { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; object-fit: cover; object-position: 50% 25%; flex: 0 0 auto; background: var(--lb-sand); }
        .lb-face-initial { font-family: var(--serif); font-size: 22px; color: var(--lb-plum); }
        .lb-proof-feature { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(28px, 5vw, 80px); align-items: center; }
        .lb-proof-portrait { max-width: 420px; }
        .lb-proof-portrait img { aspect-ratio: 4 / 5; object-position: 50% 15%; }
        .lb-byline { display: flex; align-items: center; gap: 16px; margin-top: 26px; }
        .lb-byline .lb-who { margin-top: 0; }
        .lb-videos-wrap { margin-top: clamp(56px, 7vw, 96px); padding-top: clamp(40px, 5vw, 64px); border-top: 1px solid var(--lb-line); }
        .lb-videos { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 4px 4px 18px; margin: 0 -4px; scrollbar-width: thin; --lb-vh: clamp(360px, 40vw, 480px); }
        .lb-video { margin: 0; position: relative; flex: 0 0 auto; height: var(--lb-vh); background: var(--lb-night); overflow: hidden; scroll-snap-align: start; }
        .lb-video video, .lb-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; object-fit: cover; background: #000; }
        .lb-video-play { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; padding: 0; background: var(--lb-night); cursor: pointer; display: block; }
        .lb-video-play img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1.2s cubic-bezier(.2,.7,.2,1), opacity .4s; }
        .lb-video-play:hover img { transform: scale(1.03); opacity: .92; }
        .lb-video-play::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(36,28,42,0) 50%, rgba(36,28,42,.65) 100%); pointer-events: none; }
        .lb-video-btn { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; border-radius: 50%; background: rgba(251,249,246,.92); color: var(--lb-night); display: grid; place-items: center; box-shadow: 0 10px 30px rgba(0,0,0,.35); transition: transform .35s ease, background .35s ease; }
        .lb-video-btn svg { margin-left: 3px; }
        .lb-video-play:hover .lb-video-btn { transform: translate(-50%, -50%) scale(1.08); background: var(--lb-gold-soft); }
        .lb-video figcaption { position: absolute; left: 16px; right: 16px; bottom: 14px; z-index: 2; color: var(--lb-ivory); font-family: var(--sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; pointer-events: none; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; text-shadow: 0 1px 8px rgba(0,0,0,.6); }
        .lb-video figcaption strong { font-family: var(--serif); font-weight: 400; font-size: 22px; letter-spacing: 0; text-transform: none; }
        .lb-video figcaption span { color: rgba(251,249,246,.75); }
        .lb-video figcaption em { font-style: normal; color: rgba(251,249,246,.6); margin-left: auto; }
        .lb-video iframe + figcaption, .lb-video video + figcaption { display: none; }
        .lb-wall { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 clamp(28px, 4vw, 56px); margin-top: clamp(56px, 7vw, 96px); padding-top: clamp(8px, 1vw, 16px); border-top: 1px solid var(--lb-line); }
        .lb-wall .lb-word { display: block; padding: clamp(28px, 3vw, 40px) 0; border-bottom: 1px solid var(--lb-line); }
        .lb-wall .lb-quote { font-size: clamp(20px, 1.6vw, 24px); line-height: 1.3; }
        .lb-word-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .lb-word-head .lb-who { margin-top: 0; }
        .lb-cta-strip { background: var(--lb-night); color: var(--lb-ivory); padding: clamp(56px, 7vw, 96px) 0; }
        .lb-cta-in { display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; }
        .lb-cta-in h2 { font-size: clamp(34px, 4vw, 56px); font-style: italic; line-height: 1.05; margin: 10px 0 12px; }
        .lb-cta-in p:not(.lb-eyebrow) { color: rgba(251,249,246,.72); font-size: 16px; max-width: 46ch; }
        .lb-shots { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 4px 4px 18px; margin: 0 -4px; scrollbar-width: thin; }
        .lb-shots figure { flex: 0 0 clamp(200px, 19vw, 260px); scroll-snap-align: start; }
        .lb-wins { padding: clamp(72px, 9vw, 120px) 0; }
        .lb-wins .lb-wrap { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(32px, 5vw, 96px); align-items: start; }
        .lb-wins-head { display: grid; gap: 18px; }
        .lb-wins-head .lb-display { font-size: clamp(36px, 4.4vw, 64px); }
        .lb-wins-list { list-style: none; margin: 0; padding: 0; }
        .lb-wins-list li { display: flex; gap: 22px; align-items: baseline; padding: 22px 0; border-top: 1px solid var(--lb-line-light); }
        .lb-wins-list h3 { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: clamp(26px, 2.8vw, 40px); line-height: 1.12; }
        .lb-wins-list p { margin-top: 8px; font-size: 14.5px; line-height: 1.6; color: rgba(251,249,246,.7); max-width: 56ch; }
        .lb-wins-list small { font-family: var(--sans); font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: var(--lb-gold-soft); white-space: nowrap; }
        .lb-wins-list li:last-child { border-bottom: 1px solid var(--lb-line-light); }
        .lb-wins-list span { font-family: var(--sans); font-style: normal; font-size: 11px; letter-spacing: .24em; color: var(--lb-gold-soft); font-weight: 600; min-width: 26px; }
        .lb-paths { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 3vw, 40px); margin-top: 36px; }
        .lb-path { display: grid; gap: 14px; padding: 28px 0 0; border-top: 1px solid var(--lb-ink); align-content: start; }
        .lb-path h3 { font-size: clamp(28px, 2.6vw, 36px); line-height: 1.05; font-style: italic; }
        .lb-path p:not(.lb-eyebrow) { font-size: 15.5px; color: var(--lb-muted); max-width: 34ch; }
        .lb-path .lb-btn { justify-self: start; margin-top: 8px; }
        .lb-sticky { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; background: rgba(36,28,42,.94); backdrop-filter: blur(10px); color: var(--lb-ivory); border-top: 1px solid var(--lb-line-light); transform: translateY(110%); transition: transform .5s cubic-bezier(.2,.7,.2,1); }
        .lb-sticky.is-on { transform: none; }
        .lb-stuck { padding-bottom: 72px; }
        .lb-sticky-in { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-top: 12px; padding-bottom: 12px; }
        .lb-sticky p { display: flex; align-items: baseline; gap: 16px; min-width: 0; }
        .lb-sticky strong { font-family: var(--serif); font-weight: 400; font-size: 24px; letter-spacing: -0.01em; }
        .lb-sticky span { font-family: var(--sans); font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: rgba(251,249,246,.65); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lb-sticky .lb-ctas { flex-wrap: nowrap; gap: 10px; }
        .lb-sticky .lb-btn { min-height: 44px; padding: 0 22px; font-size: 11px; }

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
          .lb-head, .lb-index, .lb-road, .lb-finale, .lb-feature, .lb-words, .lb-invest, .lb-peace, .lb-wins .lb-wrap, .lb-paths { grid-template-columns: 1fr; }
          .lb-wall { grid-template-columns: 1fr; }
          .lb-proof-feature { grid-template-columns: 1fr; }
          .lb-proof-portrait { max-width: 320px; }
          .lb-videos { align-items: center; }
          .lb-video { height: auto; width: 62vw; }
          .lb-video-wide { width: 86vw; }
          .lb-cta-in .lb-ctas { width: 100%; }
          .lb-sticky span { display: none; }
          .lb-sticky-in { gap: 12px; }
          .lb-sticky .lb-ctas { flex-direction: row; } .lb-sticky .lb-ctas .lb-btn { width: auto; }
          .lb { padding-bottom: 0; }
          .lb-road { gap: 48px; }
          .lb-sessions { grid-template-columns: 1fr; }
          .lb-story-img { position: static; }
          .lb-mosaic { grid-template-columns: 1fr 1fr; }
          .lb-mosaic figure, .lb-mosaic figure:first-child { grid-column: span 2; grid-row: auto; }
          .lb-ctas { flex-direction: column; } .lb-ctas .lb-btn { width: 100%; }
        }
      `}</style>

      {/* 01 — HERO */}
      <section className="lb-hero" id="top" ref={heroRef}>
        <div className="lb-hero-panel">
          <p className="lb-eyebrow lb-hero-who"><strong>Libni Fortuna</strong>Life Strategist · Transformational mentor · Experience curator</p>
          <h1 className="lb-hero-title">Liberate</h1>
          <p className="lb-hero-lede">For the soul-led ones ready to let go of the weight and come home to their power.</p>
          <p className="lb-hero-sub">A 3-month transformational experience for people ready to break free from emotional patterns, people-pleasing, overthinking, and the quiet exhaustion of holding it all together. We meet twice a week — twenty-four live sessions, held together.</p>
          <p className="lb-hero-meta"><span>We begin</span><strong>October 12, 2026 · 7 pm</strong></p>
          <div className="lb-ctas">
            <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">I’m ready to Liberate</a>
            <a href="#lb-for-me" className="lb-btn lb-btn-light">Is this for me?</a>
          </div>
          <p className="lb-hero-proof"><span>Four intakes since 2024</span>“I found women who feel like home.” <em>Erika Mai · Liberate 4</em></p>
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
                <img src={photos[slot] || INSIDE_STOCK[slot]} alt={title} loading="lazy" />
                <div className="lb-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
          {momentPhotos.length > 0 && (
            <div className="lb-mosaic lb-reveal" style={{ marginTop: "clamp(48px, 6vw, 84px)" }}>
              <p className="lb-eyebrow" style={{ gridColumn: "1 / -1", marginBottom: 6 }}>Moments from Liberate</p>
              {momentPhotos.map(([id, label]) => (
                <figure key={id}><img src={photos[id]} alt={label} /><figcaption>{label}</figcaption></figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 06 — ROADMAP */}
      <section className="lb-sec lb-linen">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">The roadmap</p><h2 className="lb-display" style={{ marginTop: 14 }}>Your 12-week journey.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "30ch" }}>Twice a week: a check-in circle, then a workshop. Each week goes a little deeper than the last. You start by seeing the pattern. You end by living without it.</p>
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

      {/* 06b — SESSIONS */}
      <section className="lb-sec lb-ivory">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">What our sessions look like</p><h2 className="lb-display" style={{ marginTop: 14 }}>Come sit in the room.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "30ch" }}>Twice a week on Zoom, wherever you are. Cameras on, hearts open — real screens from our weekly circles, so you can feel what a night in Liberate is like before you ever join one.</p>
          </div>
          <div className="lb-sessions lb-reveal">
            {SESSIONS.map(([slot, label], i) => (
              <figure key={slot} style={{ transitionDelay: `${(i % 2) * 0.08}s` }}>
                <img src={photos[slot] || SESSION_FALLBACK[i]} alt={label} loading="lazy" />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
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
          <div className="lb-retreat-hero lb-reveal"><img src={retreatHero} alt="The Liberate retreat" /><figcaption>Out of the Zoom calls, into the present moment</figcaption></div>
          <div className="lb-mosaic lb-reveal">
            {retreatTiles.map(([label, src], i) => (
              <figure key={i}><img src={src} alt={label} loading="lazy" /><figcaption>{label}</figcaption></figure>
            ))}
          </div>
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
            <p className="lb-creds">Life Strategist · TEDx speaker · Founder, Essence Retreat Philippines · Certified hypnotherapist · NLP master practitioner · Breathwork &amp; somatic facilitator</p>
          </div>
        </div>
      </section>

      {/* 09 — PROOF */}
      <section className="lb-sec lb-linen" id="words">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">From the people of Liberate</p><h2 className="lb-display" style={{ marginTop: 14 }}>Four intakes. One circle.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "26ch" }}>Not reviews. Turning points — in their words, their faces, their own stories.</p>
          </div>

          <div className="lb-proof-feature lb-reveal">
            {featurePhoto && <div className="lb-figure lb-proof-portrait"><img src={featurePhoto} alt={first.who} loading="lazy" /></div>}
            <div>
              <p className="lb-quote">{first.q}</p>
              <div className="lb-byline"><Face src={first.photo} name={first.who} size={60} /><p className="lb-who">{first.who}{first.role && <span>{first.role}</span>}</p></div>
            </div>
          </div>

          {videos.length > 0 && (
            <div className="lb-videos-wrap lb-reveal">
              <div className="lb-head" style={{ marginBottom: 26 }}>
                <div><p className="lb-eyebrow">Hear it from them</p><h3 className="lb-h3">{videos.length} students, in their own voice.</h3></div>
                <p className="lb-muted" style={{ fontSize: 15, maxWidth: "36ch" }}>Unscripted, on camera, from four intakes. Tap any one to play — sound on. Swipe for more →</p>
              </div>
              <div className="lb-videos">{videos.map((v, i) => <LbVideo key={v.url + i} video={v} n={i + 1} />)}</div>
            </div>
          )}

          <div className="lb-wall">
            {WORDS_SHOWN.slice(1).map((w, i) => (
              <div key={(w.id ?? w.who) + i} className="lb-reveal lb-word" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                <div className="lb-word-head"><Face src={w.photo} name={w.who} /><p className="lb-who">{w.who}{w.role && <span>{w.role}</span>}</p></div>
                <p className="lb-quote">{w.q}</p>
              </div>
            ))}
          </div>

          {shots.length > 0 && (
            <div className="lb-reveal" style={{ marginTop: "clamp(56px, 7vw, 96px)" }}>
              <div className="lb-head" style={{ marginBottom: 26 }}>
                <div><p className="lb-eyebrow">Straight from their stories</p><h3 className="lb-h3">As they posted them.</h3></div>
                <p className="lb-muted" style={{ fontSize: 15, maxWidth: "40ch" }}>{shots.length} screenshots of what students shared on Instagram during and after their three months — untouched. Swipe →</p>
              </div>
              <div className="lb-shots">{shots.map((src, i) => <figure key={i}><img src={src} alt={`A message from a Liberate student, ${i + 1}`} loading="lazy" /></figure>)}</div>
            </div>
          )}
        </div>
      </section>

      {/* 09a — CTA */}
      <section className="lb-cta-strip">
        <div className="lb-wrap lb-cta-in lb-reveal">
          <div>
            <p className="lb-eyebrow" style={{ color: "var(--lb-gold-soft)" }}>The next circle</p>
            <h2>Begins October 12, 2026.</h2>
            <p>{price} in full, or {offer.instalmentCount} × {perMonth}. Pay and your place is held — or talk to me first.</p>
          </div>
          <div className="lb-ctas">
            <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">Join now</a>
            <Link href="/liberate/apply" className="lb-btn lb-btn-light">Talk to me first</Link>
          </div>
        </div>
      </section>

      {/* 09b — WINS */}
      <section className="lb-sec lb-plum lb-wins">
        <div className="lb-wrap">
          <div className="lb-wins-head lb-reveal">
            <p className="lb-eyebrow" style={{ color: "var(--lb-gold-soft)" }}>After three months</p>
            <h2 className="lb-display">What you walk away with.</h2>
            <p className="lb-muted" style={{ color: "rgba(251,249,246,.72)", maxWidth: "42ch", fontSize: 16 }}>Not promises — patterns. Every line here is something a student wrote after her twelve weeks, or something I wrote the night an intake closed.</p>
          </div>
          <ol className="lb-wins-list lb-reveal" style={{ transitionDelay: ".15s" }}>
            {WINS.map(([title, note, who], i) => (
              <li key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{note} <small>— {who}</small></p></div>
              </li>
            ))}
          </ol>
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
              <p className="lb-plan">In full, or {offer.instalmentCount} monthly payments of about {perMonth}. Other payment plans are always something we can talk about.</p>
            )}
            <div className="lb-paths">
              <div className="lb-path">
                <p className="lb-eyebrow">If it’s a yes</p>
                <h3>Join now.</h3>
                <p>Choose full or three monthly payments, leave your details, pay — and your place is held the moment it clears. No call needed. Opens in a new tab.</p>
                <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-ink">Join now</a>
              </div>
              <div className="lb-path">
                <p className="lb-eyebrow">If you have questions</p>
                <h3>Talk to me first.</h3>
                <p>If the investment is within reach and you want clarity before you say yes, answer a few honest questions and book a call with me.</p>
                <Link href="/liberate/apply" className="lb-btn lb-btn-ghost">Talk to me first</Link>
              </div>
            </div>
            <p className="lb-note">Nothing is charged until you choose to. GCash, Maya, cards and bank transfer all work.</p>
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
            <div className="lb-ctas"><a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-ink">I’m ready to be held</a></div>
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
            <p style={{ color: "var(--lb-ivory)" }}>We begin October 12, 2026, at 7 pm. Spots are limited and held with intention.</p>
          </div>
          <div className="lb-final-meta lb-reveal" style={{ transitionDelay: ".25s" }}>
            <div>Liberate<b>3 months · 24 live sessions</b></div>
            <div>We begin<b>October 12, 2026</b></div>
            <div>Investment<b>{price}</b></div>
          </div>
          <div className="lb-ctas lb-reveal" style={{ transitionDelay: ".35s" }}>
            <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">I’m ready to Liberate</a>
            <Link href="/liberate/apply" className="lb-btn lb-btn-light">Talk to me first</Link>
          </div>
        </div>
      </section>

      <div className={`lb-sticky${stuck ? " is-on" : ""}`} aria-hidden={!stuck}>
        <div className="lb-wrap lb-sticky-in">
          <p><strong>Liberate</strong><span>Begins October 12, 2026 · {price}{perMonth ? ` or ${offer.instalmentCount} × ${perMonth}` : ""}</span></p>
          <div className="lb-ctas">
            <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">Join</a>
            <Link href="/liberate/apply" className="lb-btn lb-btn-light">Talk first</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
