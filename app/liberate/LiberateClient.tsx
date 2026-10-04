"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OFFERS } from "@/config/offers";
import { resolveVideo } from "@/config/site-slots";
import { DEFAULT_LIBERATE_VIDEOS, type LiberateVideo } from "@/config/liberate-videos";
import { LIBERATE_FAQ } from "@/config/liberate-faq";

type Photos = Record<string, string>;

// What you'll practice — four threads (Studio photo slots inside_5 / inside_4 / inside_2 / inside_6).
const PRACTICE = [
  ["Seeing the pattern — and its root", "Where it came from, what it protects, and the identity you built around it.", "inside_5"],
  ["Feeling, and moving emotion through the body", "Breathwork and somatic practice, so a feeling can move instead of being managed.", "inside_4"],
  ["Repatterning beneath the surface", "Working with the subconscious stories under the behaviour, not just the behaviour.", "inside_2"],
  ["Self-trust, voice and boundaries", "Choosing yourself without guilt. Saying the true thing. Taking up space.", "inside_6"],
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
  "12 weeks, live", "12 Tuesday Circles with Libni", "12 Thursday Labs with the Liberate community", "Every replay",
  "Your own portal — roadmap, guided meditations, practices, resources", "A private community",
  "Alumni access to Thursday Labs after your intake", "The closing in-person retreat — stay and meals covered",
];

type Word = { id?: string; q: string; who: string; role?: string; photo?: string };
type Video = LiberateVideo;
const DEFAULT_VIDEOS = DEFAULT_LIBERATE_VIDEOS;
const mmss = (n?: number) => (n ? `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}` : "");

// Faces cropped from the photos her students posted alongside their words (LIBer highlight).
const FACES: Record<string, string> = {
  tiff: "/photos/liberate/face-tiff.jpg", erika: "/photos/liberate/face-erika.jpg", danessa: "/photos/liberate/face2-danessa.jpg",
  jill: "/photos/liberate/face-jill.jpg", mims: "/photos/liberate/face-mims.jpg", zy: "/photos/liberate/face-zy.jpg",
  nick: "/photos/liberate/face-nick.jpg", sam: "/photos/liberate/face-sam.jpg", lea: "/photos/liberate/face-lea.jpg", risha: "/photos/liberate/face-risha.jpg",
  tonet: "/photos/liberate/face2-tonet.jpg", bam: "/photos/liberate/face2-bam.jpg", mitch: "/photos/liberate/face2-mitch.jpg",
  joyce: "/photos/liberate/face2-joyce.jpg", precious: "/photos/liberate/face2-precious.jpg", kimi: "/photos/liberate/face2-kimi.jpg", ikay: "/photos/liberate/face2-ikay.jpg", tiff2: "/photos/liberate/face-tiff.jpg",
};
const FEATURE_PHOTO: Record<string, string> = {
  tiff: "/photos/liberate/feature-tiff.jpg", tonet: "/photos/liberate/feature-tonet.jpg", precious: "/photos/liberate/feature-precious.jpg",
  mitch: "/photos/liberate/feature-mitch.jpg", joyce: "/photos/liberate/feature-joyce.jpg", kimi: "/photos/liberate/feature-kimi.jpg",
  ikay: "/photos/liberate/feature-ikay.jpg", bam: "/photos/liberate/feature-bam.jpg", danessa: "/photos/liberate/feature-danessa.jpg",
};
// The spotlight rotates through the students we have a real portrait for — order is the order shown.
const YOU_VIDEO = "1232731301"; // the clip beside “They’ve called you intuitive…” (Libni’s pick)
const SPOTLIGHT = ["tonet", "bam", "mitch", "precious", "kimi", "ikay", "joyce", "danessa", "tiff"];

// Real photos from her retreats and sessions stand in until she uploads her own to each “inside” slot.
const INSIDE_STOCK: Record<string, string> = {
  inside_1: "/photos/liberate/session-2.jpg",
  inside_2: "/photos/liberate/inside-2.jpg",
  inside_3: "/photos/liberate/inside-3.jpg",
  inside_4: "/photos/liberate/inside-4.jpg",
  inside_5: "/photos/liberate/inside-5.jpg",
  inside_6: "/photos/liberate/inside-6.jpg",
  inside_7: "/photos/liberate/inside-7.jpg",
  inside_8: "/photos/liberate/inside-8.jpg",
};

type Clip = { src: string; poster?: string; label?: string };
const SHOT_SLOTS = ["shots_1", "shots_2", "shots_3", "shots_4", "shots_5", "shots_6", "shots_7", "shots_8"];
const SHOT_FALLBACK = Array.from({ length: 16 }, (_, i) => `/photos/liberate/words-${i + 1}.jpg`);
const DEFAULT_CLIPS: Clip[] = [
  { src: "/videos/liberate/session-29.mp4", poster: "/photos/liberate/session-3.jpg", label: "Breathwork, together" },
  { src: "/videos/liberate/session-32.mp4", poster: "/photos/liberate/session-1.jpg", label: "Favourite night of the week" },
  { src: "/videos/liberate/session-05.mp4", poster: "/photos/liberate/session-4.jpg", label: "A guest in the circle" },
];

// The in-person celebration & retreat gallery (real photos from the highlight).
type JourneyWeek = { n: number; phase: "See" | "Feel" | "Become" | "Arrival"; title: string; desc: string };
const WEEKS: JourneyWeek[] = [
  ...ROADMAP.flatMap((m) => m.weeks.map(([n, title, desc]) => ({ n: Number(n), phase: m.theme as JourneyWeek["phase"], title, desc }))),
  { n: 12, phase: "Arrival", title: "Liberation", desc: "Step into greater freedom and choice. Not a new you — the one who was here all along. Then the final week: the in-person retreat." },
];

// Tuesday circle dates for the November 2026 cohort. Thursdays follow two days later.
// We rest on Dec 22 and 29 and continue January 5.
const WEEK_DATES = ["Nov 3", "Nov 10", "Nov 17", "Nov 24", "Dec 1", "Dec 8", "Dec 15", "Jan 5", "Jan 12", "Jan 19", "Jan 26", "Feb 2"];

const RETREAT_TILES: [string, string, string][] = [
  ["retreat_1", "Floating — a sound bath on the water", "/photos/liberate/retreat-1.jpg"],
  ["retreat_2", "The candlelit room", "/photos/liberate/retreat-2.jpg"],
  ["retreat_3", "Morning movement, mountains behind", "/photos/liberate/retreat-3.jpg"],
  ["retreat_4", "All of us, at the table", "/photos/liberate/retreat-4.jpg"],
  ["retreat_5", "Held", "/photos/liberate/retreat-5.jpg"],
  ["retreat_6", "The ice bath", "/photos/liberate/retreat-6.jpg"],
];
const RETREAT_HERO_FALLBACK = "/photos/liberate/retreat-hero.jpg";
// Real stories her students posted (reshared in her LIBer highlight) stand in until she uploads her own.

// What people want — each one grounded in something a student (or Libni, the night an intake closed) actually wrote.
const WINS: [string, string, string][] = [
  ["You’ll recognise your patterns without becoming them.", "“Everything feels clearer, lighter and brighter.”", "Mims · Liberate 1"],
  ["You’ll set boundaries without drowning in guilt.", "“The moment I let go and was bold enough to prioritize myself — the flow was just easy.”", "A student · Liberate 2"],
  ["You’ll trust yourself instead of outsourcing every decision.", "“I just became so confident in myself that I trust myself, and I know I can do anything.”", "Tonet · Liberate 3"],
  ["You’ll feel your emotions without being consumed by them.", "“Ang sarap huminga ng malaya, ng wala kang iniisip na kahit ano.”", "Precious · Liberate 4"],
  ["You’ll take up space without apologising for existing.", "“It taught me to be more authentic and more accepting of who I am.”", "Mitch · Liberate 4"],
  ["You’ll create from self-trust instead of survival.", "“I quit the grind, and the wins rolled in.”", "Zy · Liberate 2"],
];

const METHOD: { stage: string; weeks: string; happens: string; explore: string; matters: string; changes: string }[] = [
  { stage: "See", weeks: "Weeks 1–4", happens: "We slow down enough to look.", explore: "The patterns, beliefs and conditioning that have been running your life — and the identities you built around them.", matters: "You can’t change what you can’t see.", changes: "You catch the pattern while it’s happening, instead of after." },
  { stage: "Feel", weeks: "Weeks 5–8", happens: "We go beneath understanding.", explore: "The emotions you learned to suppress, the subconscious stories under them, your own voice, your boundaries.", matters: "A pattern isn’t only a thought. It’s often a feeling, a reflex, a response you’ve learned to repeat.", changes: "You can feel something fully and stay with yourself." },
  { stage: "Become", weeks: "Weeks 9–11", happens: "Practice, in real life.", explore: "New ways of choosing, speaking, relating and showing up; a nervous system with more room for safety and receiving.", matters: "Insight fades; practice stays.", changes: "The new way starts to feel like you." },
  { stage: "Arrival", weeks: "Week 12 + the retreat", happens: "Integration, in person.", explore: "How it all lands in your actual life.", matters: "Transformation needs to be lived, not just understood.", changes: "You leave more self-trusting, grounded, expressed — and free." },
];

const THEMES = ["Self-trust", "Community", "Emotional freedom", "Boundaries", "Self-expression", "Confidence"] as const;
type Theme = (typeof THEMES)[number];
const THEME_OF: Record<string, Theme> = {
  tonet: "Self-trust", mitch: "Self-trust", joyce: "Self-trust",
  erika: "Community", danessa: "Community", zy: "Community", vivs: "Community", risha: "Community",
  precious: "Emotional freedom", ikay: "Emotional freedom", mims: "Emotional freedom", bam: "Emotional freedom",
  jilla: "Boundaries",
  nick: "Self-expression", petalio: "Self-expression", tiff2: "Self-expression", dayone: "Self-expression",
  tiff: "Confidence", jill: "Confidence", sam: "Confidence", kimi: "Confidence", lea: "Confidence",
};

type Pattern = "pleasing" | "overthinking" | "overwhelm" | "doubt";
// Five quick taps. Every line is drawn from the page's own language — it's a mirror, not a diagnosis.
const QUIZ: { q: string; a: [Pattern, string][] }[] = [
  { q: "Someone asks for something you don’t have the capacity for. You…", a: [
    ["pleasing", "Say yes — and feel the resentment later."],
    ["overthinking", "Think it over for days before you answer."],
    ["overwhelm", "Feel it in your chest before you’ve said a word."],
    ["doubt", "Wonder if you’re even allowed to say no."],
  ] },
  { q: "You’ve had a hard day. What usually happens next?", a: [
    ["pleasing", "You make sure everyone else is okay first."],
    ["overthinking", "You replay every conversation in your head."],
    ["overwhelm", "It spills — tears, snapping, or shutting down."],
    ["doubt", "You decide it was probably your fault."],
  ] },
  { q: "What do the people close to you say about you?", a: [
    ["pleasing", "“You’re always there for everyone.”"],
    ["overthinking", "“You think too much.”"],
    ["overwhelm", "“You feel everything so deeply.”"],
    ["doubt", "“You don’t see how capable you are.”"],
  ] },
  { q: "You know what you want. What stops you?", a: [
    ["pleasing", "What it might cost the people around you."],
    ["overthinking", "Needing to be sure before you move."],
    ["overwhelm", "The fear of what it will bring up."],
    ["doubt", "The voice that says: who are you to want that?"],
  ] },
  { q: "When it’s quiet and you’re alone, you feel…", a: [
    ["pleasing", "Like you’ve disappeared somewhere along the way."],
    ["overthinking", "Still busy — the mind doesn’t switch off."],
    ["overwhelm", "Everything you’ve been holding all week."],
    ["doubt", "Not enough, no matter what you did today."],
  ] },
];
const QUIZ_RESULT: Record<Pattern, { name: string; mirror: string; stage: string; work: string; changes: string }> = {
  pleasing: { name: "People-pleasing", mirror: "You keep everything else together by abandoning yourself. Being needed has felt safer than being honest.", stage: "See · Become", work: "Seeing the pattern — and its root. Then self-trust, voice and boundaries: choosing yourself without guilt, saying the true thing, taking up space.", changes: "You’ll set boundaries without drowning in guilt." },
  overthinking: { name: "Overthinking", mirror: "You already know better — you can name the pattern while you’re inside it. Knowing hasn’t been the same as living differently.", stage: "Feel", work: "A pattern isn’t only a thought. It’s often a feeling, a reflex, a response you’ve learned to repeat — so we go beneath understanding and move it through the body.", changes: "You’ll recognise your patterns without becoming them." },
  overwhelm: { name: "Emotional overwhelm", mirror: "You feel everything — and you’ve learned to hold it alone, or manage it instead of letting it move.", stage: "Feel", work: "Feeling, and moving emotion through the body: breathwork and somatic practice, so a feeling can move instead of being managed.", changes: "You’ll feel your emotions without being consumed by them." },
  doubt: { name: "Self-doubt", mirror: "They’ve called you intuitive, grounded, even strong — and deep down you still question your worth.", stage: "See · Become", work: "Repatterning beneath the surface: the subconscious stories under the behaviour, not just the behaviour. Then practising the new way until it feels like you.", changes: "You’ll trust yourself instead of outsourcing every decision." },
};

const FOR_YOU = [
  "You’re tired of repeating the same patterns — and you can finally admit it.",
  "You’re ready to look at yourself honestly, with kindness.",
  "You want to feel, not just understand.",
  "You want to build self-trust, not borrow someone else’s certainty.",
  "You’re ready to stop abandoning yourself.",
  "You want company while you do deep work.",
  "You’re willing to take responsibility for your own transformation.",
];
const NOT_FOR_YOU = [
  "You’d like someone else to fix you.",
  "You want content to watch, not work to do.",
  "You’re looking for a quick mindset hack.",
  "You’d rather not look at your own patterns right now.",
  "You want things to change without practising anything differently.",
];



function LbClip({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className="lb-clip">
      <video ref={ref} src={clip.src} poster={clip.poster} muted loop playsInline preload="none" aria-label={clip.label} />
      {clip.label && <figcaption>{clip.label}</figcaption>}
    </figure>
  );
}

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
        <figcaption>
          {video.quote && !wide && <q>{video.quote}</q>}
          <strong>{video.name ?? "A Liberate student"}</strong>{video.role && <span>{video.role}</span>}{video.dur ? <em>{mmss(video.dur)}</em> : null}
        </figcaption>
      )}
    </figure>
  );
}

export default function LiberateClient({ photos = {}, words: incoming, videos: incomingVideos = [], clips: incomingClips = [] }: { photos?: Photos; words?: Word[]; videos?: Video[]; clips?: Clip[] }) {
  const clips: Clip[] = incomingClips.length ? incomingClips : DEFAULT_CLIPS;
  const [week, setWeek] = useState(1);
  const [plan, setPlan] = useState<"full" | "instalment">("full");
  const [theme, setTheme] = useState<Theme | "All">("All");
  const [quiz, setQuiz] = useState<Pattern[]>([]);
  const quizResult: Pattern | null = quiz.length === QUIZ.length
    ? (["pleasing", "overthinking", "overwhelm", "doubt"] as Pattern[]).reduce((best, k) => (quiz.filter((x) => x === k).length > quiz.filter((x) => x === best).length ? k : best), quiz[0])
    : null;
  const videos: Video[] = incomingVideos.length ? incomingVideos : DEFAULT_VIDEOS;
  const offer = OFFERS.liberate;
  // Client words come from the Studio (“Client stories”); the published quotes are the fallback.
  const WORDS_SHOWN: Word[] = (incoming && incoming.length ? incoming : WORDS).map((w) => ({ ...w, photo: w.photo || (w.id ? FACES[w.id] : undefined) }));
  const spotlight = SPOTLIGHT.map((id) => WORDS_SHOWN.find((w) => w.id === id)).filter((w): w is Word => !!w);
  const [feat, setFeat] = useState(0);
  const [featAuto, setFeatAuto] = useState(true);
  useEffect(() => {
    if (!featAuto || spotlight.length < 2) return;
    const t = setInterval(() => setFeat((f) => (f + 1) % spotlight.length), 8000);
    return () => clearInterval(t);
  }, [featAuto, spotlight.length]);
  const [playFeat, setPlayFeat] = useState(false);
  const goFeat = (i: number) => { setFeatAuto(false); setPlayFeat(false); setFeat((i + spotlight.length) % spotlight.length); };
  const first = spotlight[feat] ?? WORDS_SHOWN[0];
  const firstName = first.who.replace(/^@/, "").split(/\s|·/)[0];
  const featVideo = videos.find((v) => v.name && v.name.toLowerCase() === firstName.toLowerCase());
  const featEmbed = featVideo ? resolveVideo(featVideo.url) : null;
  const featurePhoto = (feat === 0 && photos.libw_feature) || (first.id && FEATURE_PHOTO[first.id]) || first.photo;
  const uploadedShots = SHOT_SLOTS.map((id) => photos[id]).filter(Boolean);
  const shots = uploadedShots.length ? uploadedShots : SHOT_FALLBACK;
  const instalment = offer.allowInstalments && offer.instalmentCount ? Math.floor((offer.pricePHP ?? 0) / offer.instalmentCount) : 0;
  const perMonth = instalment ? `₱${instalment.toLocaleString("en-PH")}` : "";
  const firstPay = offer.pricePHP && offer.instalmentCount ? offer.pricePHP - instalment * (offer.instalmentCount - 1) : 0;
  const firstPayLabel = firstPay ? `₱${firstPay.toLocaleString("en-PH")}` : "";
  const cur = WEEKS[week - 1];

  // The sticky bar appears once the hero has scrolled away.
  const heroRef = useRef<HTMLElement | null>(null);
  const [stuck, setStuck] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => { raf = 0; const el = progressRef.current; if (!el) return; const max = document.documentElement.scrollHeight - innerHeight; el.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("scroll", onScroll, { passive: true }); tick();
    return () => { removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const price = offer.pricePHP ? `₱${offer.pricePHP.toLocaleString("en-PH")}` : "TBA";

  const heroImg = photos.hero_portrait || "/photos/libni-hero.jpg";
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
        .lb .lb-hero-sub { max-width: 54ch; color: rgba(251,249,246,.78); font-size: 15.5px; margin-top: 16px; }
        .lb .lb-hero-sub2 { margin-top: 14px; color: var(--lb-ivory); font-family: var(--serif); font-size: 19px; line-height: 1.45; font-style: italic; }
        .lb .lb-hero-facts { list-style: none; display: flex; flex-wrap: wrap; gap: 8px 18px; margin: 22px 0 0; padding: 0; font-family: var(--sans); font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: var(--lb-gold-soft); }
        .lb .lb-hero-facts li { white-space: nowrap; }
        .lb .lb-hero-facts li + li::before { content: "·"; margin-right: 18px; color: rgba(251,249,246,.35); }
        .lb .lb-hero-meta { display: flex; align-items: baseline; gap: 16px; margin: 18px 0 16px; padding-top: 14px; border-top: 1px solid var(--lb-line-light); font-family: var(--sans); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(251,249,246,.6); }
        .lb-hero-meta strong { font-family: var(--serif); font-size: 22px; letter-spacing: 0; text-transform: none; color: var(--lb-gold-soft); font-weight: 400; font-style: italic; }
        .lb-hero-meta { flex-wrap: wrap; row-gap: 6px; }
        .lb-hero-meta small { font-family: var(--sans); font-size: 11px; letter-spacing: .18em; color: rgba(251,249,246,.6); }

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
        .lb-stack { display: grid; gap: clamp(22px, 2.6vw, 34px); }

        /* 04 statement */
        .lb-statement { text-align: center; max-width: 1000px; margin: 0 auto; }
        .lb-statement h2 { font-size: clamp(42px, 6.4vw, 92px); line-height: 1; }
        .lb-statement .lb-intro { max-width: 62ch; margin: 0 auto; display: grid; gap: 1.1em; color: rgba(251,249,246,.86); }
        .lb-logo { width: min(100%, 380px); margin: 0 auto; opacity: .95; }
        .lb-devices { margin: clamp(16px, 2vw, 28px) auto clamp(8px, 1vw, 16px); max-width: 980px; text-align: center; }
        .lb-mockup { width: 100%; display: block; filter: drop-shadow(0 40px 60px rgba(0,0,0,.45)); animation: lbFloat 7s ease-in-out infinite; }
        @keyframes lbFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (prefers-reduced-motion: reduce) { .lb-mockup { animation: none; } }
        .lb-devices-note { margin-top: 18px; font-family: var(--serif); font-style: italic; font-size: clamp(17px, 1.6vw, 21px); color: rgba(251,249,246,.75); }
        .lb-video figcaption q { quotes: "“" "”"; display: block; width: 100%; font-family: var(--serif); font-style: italic; font-size: 17px; line-height: 1.3; letter-spacing: 0; text-transform: none; margin-bottom: 8px; }

        /* 05 inside */
        .lb-head { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end; margin-bottom: clamp(48px, 6vw, 84px); }
        .lb-index { display: grid; grid-template-columns: 1fr 1fr; column-gap: clamp(40px, 6vw, 96px); }
        .lb-item { padding: 34px 0 36px; border-top: 1px solid var(--lb-line); display: grid; grid-template-columns: 64px 1fr; gap: 18px; }
        .lb-item-n { font-family: var(--serif); font-size: 30px; color: var(--lb-gold); line-height: 1; padding-top: 6px; }
        .lb-item h3 { font-size: clamp(24px, 2.1vw, 30px); line-height: 1.15; margin-bottom: 10px; }
        .lb-item p { font-size: 15.5px; color: var(--lb-muted); max-width: 40ch; }
        .lb-item img { grid-column: 1 / -1; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; margin-bottom: 8px; }

        /* 06 roadmap */
        .lb-journey { margin-top: clamp(40px, 5vw, 64px); display: grid; grid-template-columns: 1fr; gap: clamp(28px, 3vw, 44px); }
        .lb-journey-track { display: grid; grid-template-columns: 4fr 4fr 3fr 1fr; gap: 0; position: relative; }
        .lb-journey-track::before { content: ""; position: absolute; left: 0; right: 0; top: 46px; height: 1px; background: var(--lb-line); }
        .lb-jphase { position: relative; padding-right: 18px; }
        .lb-jphase-label { display: block; font-family: var(--serif); font-style: italic; font-size: clamp(22px, 2.2vw, 30px); color: var(--lb-plum); margin-bottom: 18px; line-height: 1; }
        .lb-jdots { display: flex; gap: 8px; }
        .lb-dot { position: relative; z-index: 1; display: grid; justify-items: center; gap: 8px; flex: 1 1 0; min-width: 0; padding: 0; border: 0; background: none; cursor: pointer; font-family: var(--sans); color: var(--lb-muted); }
        .lb-dot span { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; letter-spacing: .08em; font-weight: 600; background: var(--lb-linen); border: 1px solid var(--lb-line); color: var(--lb-ink); transition: background .3s, color .3s, border-color .3s, transform .3s; }
        .lb-dot em { font-style: normal; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; }
        .lb-dot:hover span { border-color: var(--lb-plum); transform: translateY(-2px); }
        .lb-dot.done span { background: var(--lb-sand); border-color: var(--lb-sand); }
        .lb-dot.on span { background: var(--lb-plum); border-color: var(--lb-plum); color: var(--lb-ivory); transform: scale(1.15); box-shadow: 0 0 0 5px rgba(91,68,112,.15); }
        .lb-dot.on em { color: var(--lb-plum); font-weight: 600; }
        .lb-dot-end span { background: var(--lb-gold-soft); border-color: var(--lb-gold-soft); }
        .lb-dot-end.on span { background: var(--lb-gold); border-color: var(--lb-gold); color: var(--lb-night); box-shadow: 0 0 0 5px rgba(184,149,90,.2); }
        .lb-jpanel { background: var(--lb-ivory); border: 1px solid var(--lb-line); padding: clamp(28px, 3.5vw, 48px); display: grid; gap: 14px; animation: lbPanel .45s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes lbPanel { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .lb-jpanel h3 { font-size: clamp(36px, 4.6vw, 64px); line-height: 1; font-style: italic; color: var(--lb-plum); }
        .lb-jdesc { font-family: var(--serif); font-size: clamp(20px, 2vw, 26px); line-height: 1.35; max-width: 34ch; }
        .lb-jmeta { font-size: 14px; color: var(--lb-muted); display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: baseline; }
        .lb-jmeta span { font-family: var(--sans); font-size: 10px; letter-spacing: .24em; text-transform: uppercase; color: var(--lb-gold); font-weight: 600; }
        .lb-jrest { font-size: 14px; color: var(--lb-muted); padding: 10px 14px; border-left: 1px solid var(--lb-gold); background: rgba(184,149,90,.08); }
        .lb-jnav { display: flex; gap: 10px; margin-top: 6px; }
        .lb-jbtn { background: none; border: 1px solid var(--lb-line); padding: 10px 18px; font-family: var(--sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; cursor: pointer; color: var(--lb-ink); transition: border-color .3s, background .3s; }
        .lb-jbtn:hover:not(:disabled) { border-color: var(--lb-ink); background: var(--lb-ivory); }
        .lb-jbtn:disabled { opacity: .35; cursor: default; }

        .lb-quiet { display: inline-block; margin-top: 6px; font-family: var(--sans); font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: var(--lb-gold-soft); text-decoration: none; border-bottom: 1px solid rgba(216,195,154,.5); padding-bottom: 4px; }
        .lb-method { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: clamp(40px, 5vw, 64px); }
        .lb-stage { background: var(--lb-ivory); border: 1px solid var(--lb-line); padding: clamp(22px, 2.4vw, 32px); display: grid; gap: 12px; align-content: start; }
        .lb-stage h3 { font-size: clamp(40px, 4vw, 56px); line-height: 1; font-style: italic; color: var(--lb-plum); }
        .lb-stage dl { display: grid; gap: 10px; margin-top: 6px; }
        .lb-stage dt { font-family: var(--sans); font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: var(--lb-gold); font-weight: 600; }
        .lb-stage dd { margin: 0 0 4px; font-size: 14.5px; line-height: 1.55; color: var(--lb-muted); }
        .lb-stage dd:last-child { color: var(--lb-ink); font-family: var(--serif); font-size: 18px; line-height: 1.35; }
        .lb-nights { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 3vw, 44px); margin-top: clamp(40px, 5vw, 64px); }
        .lb-night { display: grid; gap: 12px; align-content: start; }
        .lb-night img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; margin-bottom: 10px; }
        .lb-night-portal { object-fit: contain !important; background: var(--lb-linen); }
        .lb-night h3 { font-size: clamp(26px, 2.4vw, 34px); line-height: 1.1; }
        .lb-night p:not(.lb-eyebrow) { font-size: 16px; line-height: 1.65; color: var(--lb-muted); max-width: 48ch; }
        .lb-themes { display: flex; flex-wrap: wrap; gap: 8px; margin-top: clamp(56px, 7vw, 96px); }
        .lb-chip { border: 1px solid var(--lb-line); background: none; padding: 9px 16px; border-radius: 999px; font-family: var(--sans); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--lb-ink); cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
        .lb-chip:hover { border-color: var(--lb-plum); }
        .lb-chip.on { background: var(--lb-plum); border-color: var(--lb-plum); color: var(--lb-ivory); }
        .lb-tag { font-family: var(--sans); font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: var(--lb-gold); font-weight: 600; }
        .lb-quiz { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(32px, 6vw, 96px); align-items: start; }
        .lb-quiz-head .lb-display { margin-top: 14px; font-size: clamp(36px, 4.4vw, 62px); }
        .lb-quiz-head .lb-lede { margin-top: 18px; }
        .lb-quiz-card { background: var(--lb-ivory); color: var(--lb-ink); padding: clamp(28px, 3.6vw, 52px); border-radius: 22px; box-shadow: 0 30px 80px rgba(0,0,0,.35); min-height: 420px; }
        @keyframes lbQuiz { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .lb-quiz-step, .lb-quiz-result { animation: lbQuiz .5s cubic-bezier(.2,.7,.2,1) both; }
        .lb-quiz-progress { display: flex; gap: 6px; }
        .lb-quiz-progress span { flex: 1; height: 3px; background: var(--lb-line); border-radius: 2px; }
        .lb-quiz-progress span.done { background: var(--lb-plum); } .lb-quiz-progress span.now { background: var(--lb-gold); }
        .lb-quiz-n { margin-top: 22px; font-family: var(--sans); font-size: 11px; letter-spacing: .26em; text-transform: uppercase; color: var(--lb-muted); }
        .lb-quiz-step h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(24px, 2.4vw, 34px); line-height: 1.2; margin-top: 10px; }
        .lb-quiz-opts { display: grid; gap: 10px; margin-top: 26px; }
        .lb-qopt { text-align: left; background: #fff; border: 1px solid var(--lb-line); border-radius: 12px; padding: 16px 18px; font-family: var(--sans); font-size: 15px; line-height: 1.4; color: var(--lb-ink); cursor: pointer; transition: border-color .25s, transform .25s, background .25s; }
        .lb-qopt:hover { border-color: var(--lb-plum); background: var(--lb-linen); transform: translateX(4px); }
        .lb-quiz-again { margin-top: 22px; background: none; border: 0; padding: 0; font-family: var(--sans); font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--lb-muted); cursor: pointer; }
        .lb-quiz-again:hover { color: var(--lb-ink); }
        .lb-quiz-result h3 { font-family: var(--serif); font-weight: 400; font-style: italic; font-size: clamp(38px, 4vw, 56px); line-height: 1; color: var(--lb-plum); margin-top: 12px; }
        .lb-quiz-mirror { margin-top: 18px; font-family: var(--serif); font-size: clamp(19px, 1.6vw, 23px); line-height: 1.4; }
        .lb-quiz-result dl { margin: 26px 0 0; padding-top: 22px; border-top: 1px solid var(--lb-line); display: grid; gap: 16px; }
        .lb-quiz-result dt { font-family: var(--sans); font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: var(--lb-gold); font-weight: 600; }
        .lb-quiz-result dd { margin: 6px 0 0; font-size: 15px; line-height: 1.6; color: var(--lb-muted); }
        .lb-quiz-result dd em { color: var(--lb-plum); font-style: italic; font-family: var(--serif); font-size: 17px; }
        .lb-quiz-result .lb-ctas { margin-top: 28px; }
        .lb-fit { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 4vw, 64px); margin-top: clamp(32px, 4vw, 48px); }
        .lb-fit-col h3 { font-size: clamp(26px, 2.4vw, 34px); font-style: italic; color: var(--lb-plum); margin-bottom: 18px; }
        .lb-fit-col ul { list-style: none; margin: 0; padding: 0; }
        .lb-fit-col li { padding: 14px 0 14px 28px; border-top: 1px solid var(--lb-line); font-size: 17px; line-height: 1.5; position: relative; }
        .lb-fit-col li::before { content: "—"; position: absolute; left: 0; color: var(--lb-gold); }
        .lb-fit-col li:last-child { border-bottom: 1px solid var(--lb-line); }
        .lb-fit-not h3 { color: var(--lb-muted); }
        .lb-fit-note { margin-top: 20px; font-family: var(--serif); font-style: italic; font-size: 20px; color: var(--lb-muted); }
        .lb-refund { margin-top: 16px; font-size: 13px; line-height: 1.6; color: var(--lb-muted); max-width: 52ch; }

        /* 07 retreat */
        .lb-retreat-head { max-width: 900px; }
        .lb-retreat-head h2 span { display: block; }
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
        .lb-you-col { display: flex; justify-content: center; align-items: center; }
        .lb-you-video { margin: 0; width: min(100%, 380px); aspect-ratio: 9 / 16; border-radius: 28px; overflow: hidden; background: #000; border: 7px solid #15111a; box-shadow: 0 30px 70px rgba(0,0,0,.3); }
        .lb-you-video iframe { width: 100%; height: 100%; border: 0; display: block; }
        /* motion */
        .lb-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; pointer-events: none; }
        .lb-progress > div { height: 100%; background: linear-gradient(90deg, var(--lb-gold), var(--lb-plum)); transform-origin: left; transform: scaleX(0); will-change: transform; }
        .lb-stage { cursor: pointer; position: relative; transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s, opacity 1s ease; }
        .lb-stage::before { content: ""; position: absolute; left: 0; right: 0; top: -1px; height: 2px; background: var(--lb-gold); transform: scaleX(0); transform-origin: left; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
        .lb-stage:hover, .lb-stage:focus-visible { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(43,37,40,.12); outline: none; }
        .lb-stage:hover::before, .lb-stage:focus-visible::before { transform: scaleX(1); }
        .lb-stage-go { display: inline-block; margin-top: 18px; font-family: var(--sans); font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: var(--lb-gold); opacity: .55; transition: opacity .4s, transform .4s; }
        .lb-stage:hover .lb-stage-go { opacity: 1; transform: translateX(4px); }
        .lb-wins-list li, .lb-fit li { opacity: 0; transform: translateY(14px); transition: opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1); transition-delay: calc(var(--i, 0) * 90ms + .15s); }
        .lb-reveal.is-in .lb-wins-list li, .lb-wins-list.is-in li, .lb-reveal.is-in .lb-fit li, .lb-fit.is-in li { opacity: 1; transform: none; }
        .lb-night, .lb-index figure, .lb-index > div, .lb-retreat-tile { overflow: hidden; }
        .lb-night img, .lb-index img, .lb-retreat-tile img, .lb-word { transition: transform 1.1s cubic-bezier(.2,.7,.2,1), box-shadow .5s; }
        .lb-night:hover img, .lb-index figure:hover img, .lb-index > div:hover img, .lb-retreat-tile:hover img { transform: scale(1.035); }
        .lb-word:hover { transform: translateY(-4px); box-shadow: 0 24px 50px rgba(43,37,40,.08); }
        @keyframes lbPop { 0% { transform: scale(.92); } 60% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .lb-chip.on { animation: lbPop .4s cubic-bezier(.2,.7,.2,1); }
        .lb-spot-play { position: absolute; left: 18px; right: 18px; bottom: 18px; z-index: 2; display: flex; align-items: center; gap: 12px; padding: 10px 16px 10px 10px; border: 0; border-radius: 999px; background: rgba(21,17,26,.72); color: var(--lb-ivory); font-family: var(--sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(8px); transition: background .3s, transform .3s; }
        .lb-spot-play:hover { background: rgba(21,17,26,.9); transform: translateY(-2px); }
        .lb-spot-play-ring { width: 38px; height: 38px; border-radius: 50%; background: var(--lb-gold-soft); color: var(--lb-night); display: grid; place-items: center; flex: none; }
        .lb-proof-player { position: relative; background: #000; width: 100%; max-width: 420px; }
        .lb-proof-player iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        @media (prefers-reduced-motion: reduce) { .lb-stage, .lb-night img, .lb-index img, .lb-word, .lb-chip.on { transition: none; animation: none; } .lb-wins-list li, .lb-fit li { opacity: 1; transform: none; transition: none; } }
        .lb-pull { font-family: var(--serif); font-style: italic; font-size: clamp(28px, 3vw, 42px); line-height: 1.2; color: var(--lb-plum); padding: 10px 0 10px 26px; border-left: 1px solid var(--lb-gold); margin: 10px 0; }
        .lb-sign { font-family: var(--font-signature), cursive; font-size: 46px; color: var(--lb-plum); line-height: 1; margin-top: 8px; }
        .lb-creds { margin-top: 34px; padding-top: 22px; border-top: 1px solid var(--lb-line); font-family: var(--sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--lb-muted); line-height: 2; }

        /* 09 words */
        .lb-quote { font-family: var(--serif); font-style: italic; font-size: clamp(28px, 3.3vw, 46px); line-height: 1.2; text-indent: -.4em; }
        .lb-quote::before { content: "“"; color: var(--lb-gold); }
        .lb-who { font-family: var(--sans); font-size: 11px; letter-spacing: .26em; text-transform: uppercase; font-weight: 600; margin-top: 22px; }
        .lb-who span { display: block; color: var(--lb-muted); font-weight: 500; margin-top: 4px; }
        .lb-word { display: grid; gap: 18px; }

        .lb .lb-hero-proof { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--lb-line-light); display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; font-family: var(--serif); font-style: italic; font-size: 18px; line-height: 1.3; color: rgba(251,249,246,.82); }
        .lb-hero-proof span { font-family: var(--sans); font-style: normal; font-size: 10px; letter-spacing: .28em; text-transform: uppercase; color: var(--lb-gold-soft); }
        .lb-hero-proof em { font-style: normal; font-family: var(--sans); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(251,249,246,.5); }
        .lb-h3 { font-size: clamp(30px, 3.4vw, 48px); margin-top: 12px; line-height: 1.05; }
        .lb-face { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; object-fit: cover; object-position: 50% 25%; flex: 0 0 auto; background: var(--lb-sand); }
        .lb-face-initial { font-family: var(--serif); font-size: 22px; color: var(--lb-plum); }
        .lb-proof-feature { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(28px, 5vw, 80px); align-items: center; }
        .lb-proof-portrait { max-width: 420px; }
        .lb-proof-portrait img { aspect-ratio: 4 / 5; object-position: 50% 15%; }
        @keyframes lbSpot { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .lb-spot-fade { animation: lbSpot .6s cubic-bezier(.2,.7,.2,1) both; }
        .lb-spot-nav { display: flex; align-items: center; gap: 14px; margin-top: 34px; padding-top: 26px; border-top: 1px solid var(--lb-line); }
        .lb-spot-nav .lb-jbtn { padding: 8px 12px; letter-spacing: 0; font-size: 14px; }
        .lb-spot-faces { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
        .lb-spot-face { padding: 0; border: 0; background: none; cursor: pointer; border-radius: 999px; opacity: .45; transition: opacity .3s, transform .3s, box-shadow .3s; }
        .lb-spot-face .lb-face { display: block; }
        .lb-spot-face:hover { opacity: .85; }
        .lb-spot-face.on { opacity: 1; transform: scale(1.12); box-shadow: 0 0 0 2px var(--lb-gold); }
        .lb-byline { display: flex; align-items: center; gap: 16px; margin-top: 26px; }
        .lb-byline .lb-who { margin-top: 0; }
        .lb-clips { display: flex; justify-content: center; gap: clamp(12px, 2vw, 22px); margin-top: clamp(36px, 5vw, 60px); }
        .lb-clip { margin: 0; position: relative; width: clamp(132px, 14vw, 190px); aspect-ratio: 9 / 16; border-radius: 24px; border: 6px solid #15111a; background: #000; overflow: hidden; box-shadow: 0 24px 54px rgba(0,0,0,.26); }
        .lb-clip:nth-child(2) { transform: translateY(-16px); }
        .lb-clip video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .lb-clip figcaption { position: absolute; left: 12px; right: 12px; bottom: 12px; font-family: var(--sans); font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: var(--lb-ivory); text-shadow: 0 1px 8px rgba(0,0,0,.7); }
        .lb-shots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .lb-shots figure { margin: 0; background: var(--lb-ivory); border: 1px solid var(--lb-line); padding: 8px; }
        .lb-shots img { width: 100%; aspect-ratio: 9 / 16; object-fit: cover; object-position: top; display: block; }
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
        .lb-wall { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: clamp(56px, 7vw, 96px); }
        .lb-wall .lb-word { display: flex; flex-direction: column; gap: 18px; padding: clamp(24px, 2.6vw, 34px); background: var(--lb-ivory); border: 1px solid var(--lb-line); border-radius: 18px; position: relative; transition: transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s; }
        .lb-wall .lb-word:hover { transform: translateY(-4px); box-shadow: 0 24px 50px rgba(43,37,40,.08); }
        .lb-wall .lb-word::before { content: "“"; position: absolute; right: 24px; top: 10px; font-family: var(--serif); font-size: 72px; line-height: 1; color: var(--lb-gold-soft); opacity: .6; }
        .lb-wall .lb-quote { font-size: clamp(19px, 1.5vw, 22px); line-height: 1.38; text-indent: 0; }
        .lb-wall .lb-quote::before { content: none; }
        .lb-wall .lb-word-head { margin-bottom: 0; order: 2; padding-top: 14px; border-top: 1px solid var(--lb-line); }
        .lb-word-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .lb-word-head .lb-who { margin-top: 0; }
        .lb-wins { padding: clamp(72px, 9vw, 120px) 0; }
        .lb-wins .lb-wrap { display: grid; grid-template-columns: 4fr 3fr 5fr; gap: clamp(28px, 4vw, 64px); align-items: start; }
        .lb-wins-photo { position: relative; margin: 0; }
        .lb-wins-photo img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: 50% 30%; border: 1px solid rgba(251,249,246,.14); }
        .lb-wins-photo figcaption { position: absolute; left: 14px; bottom: 12px; font-family: var(--sans); font-size: 10px; letter-spacing: .24em; text-transform: uppercase; color: rgba(251,249,246,.85); text-shadow: 0 1px 8px rgba(0,0,0,.6); }
        .lb-wins-head { display: grid; gap: 18px; }
        .lb-wins-head .lb-display { font-size: clamp(36px, 4.4vw, 64px); }
        .lb-wins-list { list-style: none; margin: 0; padding: 0; }
        .lb-wins-list li { display: flex; gap: 22px; align-items: baseline; padding: 22px 0; border-top: 1px solid var(--lb-line-light); }
        .lb-wins-list h3 { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: clamp(26px, 2.8vw, 40px); line-height: 1.12; }
        .lb-wins-list p { margin-top: 8px; font-size: 14.5px; line-height: 1.6; color: rgba(251,249,246,.7); max-width: 56ch; }
        .lb-wins-list small { font-family: var(--sans); font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: var(--lb-gold-soft); white-space: nowrap; }
        .lb-wins-list li:last-child { border-bottom: 1px solid var(--lb-line-light); }
        .lb-wins-list span { font-family: var(--sans); font-style: normal; font-size: 11px; letter-spacing: .24em; color: var(--lb-gold-soft); font-weight: 600; min-width: 26px; }
        .lb-invest { display: grid; grid-template-columns: 6fr 5fr; gap: clamp(40px, 6vw, 110px); align-items: start; }
        .lb-checkout { background: var(--lb-ivory); border: 1px solid var(--lb-line); border-radius: 22px; padding: clamp(24px, 3vw, 36px); box-shadow: 0 30px 70px rgba(43,37,40,.10); position: sticky; top: 110px; }
        .lb-checkout-head { display: flex; justify-content: space-between; align-items: baseline; font-family: var(--sans); font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: var(--lb-muted); padding-bottom: 16px; border-bottom: 1px solid var(--lb-line); }
        .lb-checkout-head span:first-child { font-family: var(--serif); font-size: 24px; letter-spacing: 0; text-transform: none; color: var(--lb-ink); }
        .lb-checkout-k { margin: 22px 0 12px; font-family: var(--sans); font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: var(--lb-gold); font-weight: 600; }
        .lb-plans { display: grid; gap: 10px; }
        .lb-plan-opt { display: grid; grid-template-columns: 22px 1fr auto; gap: 14px; align-items: center; width: 100%; text-align: left; padding: 16px 18px; border: 1.5px solid var(--lb-line); border-radius: 14px; background: #fff; cursor: pointer; font-family: var(--sans); transition: border-color .25s, box-shadow .25s, background .25s; }
        .lb-plan-opt:hover { border-color: var(--lb-plum); }
        .lb-plan-opt.on { border-color: var(--lb-plum); background: rgba(91,68,112,.04); box-shadow: 0 0 0 3px rgba(91,68,112,.12); }
        .lb-plan-radio { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--lb-line); position: relative; transition: border-color .25s; }
        .lb-plan-opt.on .lb-plan-radio { border-color: var(--lb-plum); }
        .lb-plan-opt.on .lb-plan-radio::after { content: ""; position: absolute; inset: 4px; border-radius: 50%; background: var(--lb-plum); }
        .lb-plan-main { display: grid; gap: 3px; min-width: 0; }
        .lb-plan-main b { font-weight: 600; font-size: 15px; color: var(--lb-ink); }
        .lb-plan-main small { font-size: 12.5px; color: var(--lb-muted); }
        .lb-plan-amt { font-family: var(--serif); font-size: 24px; color: var(--lb-ink); white-space: nowrap; }
        .lb-plan-amt i { font-style: normal; font-family: var(--sans); font-size: 11px; color: var(--lb-muted); margin-left: 2px; }
        .lb-checkout-rows { margin-top: 20px; display: grid; gap: 10px; font-size: 14px; color: var(--lb-muted); }
        .lb-checkout-rows > div { display: flex; justify-content: space-between; gap: 16px; }
        .lb-checkout-due { padding-top: 14px; border-top: 1px solid var(--lb-line); align-items: baseline; color: var(--lb-ink); }
        .lb-checkout-due strong { font-family: var(--serif); font-weight: 400; font-size: clamp(32px, 3vw, 40px); color: var(--lb-plum); line-height: 1; }
        .lb-checkout-cta { width: 100%; margin-top: 20px; min-height: 60px; }
        .lb-checkout-fine { margin-top: 12px; text-align: center; font-size: 12px; color: var(--lb-muted); letter-spacing: .02em; }
        .lb-list { list-style: none; margin: 0; padding: 0; }
        .lb-list li { padding: 14px 0; border-top: 1px solid var(--lb-line); font-family: var(--serif); font-size: 21px; display: flex; gap: 16px; align-items: baseline; }
        .lb-list li::before { content: counter(lb) ; counter-increment: lb; font-family: var(--sans); font-size: 10px; letter-spacing: .2em; color: var(--lb-gold); font-weight: 600; min-width: 20px; }
        .lb-list { counter-reset: lb; }
        .lb-list li:last-child { border-bottom: 1px solid var(--lb-line); }

        /* 10b faq */
        .lb-faq-wrap { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(32px, 5vw, 96px); align-items: start; }
        .lb-faq details { border-top: 1px solid var(--lb-line); }
        .lb-faq details:last-child { border-bottom: 1px solid var(--lb-line); }
        .lb-faq summary { cursor: pointer; list-style: none; padding: 22px 44px 22px 0; font-family: var(--serif); font-size: clamp(20px, 1.8vw, 25px); line-height: 1.25; position: relative; }
        .lb-faq summary::-webkit-details-marker { display: none; }
        .lb-faq summary::after { content: "+"; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); font-family: var(--sans); font-size: 22px; color: var(--lb-gold); transition: transform .3s ease; }
        .lb-faq details[open] summary::after { transform: translateY(-50%) rotate(45deg); }
        .lb-faq p { padding: 0 44px 24px 0; font-size: 16px; line-height: 1.7; color: var(--lb-muted); max-width: 60ch; }

        /* 11 peace */

        /* 12 final */
        .lb-final { position: relative; color: var(--lb-ivory); text-align: center; padding: clamp(110px, 16vw, 200px) 0; background: radial-gradient(70% 60% at 50% 100%, rgba(91,68,112,.7) 0%, rgba(36,28,42,0) 70%), var(--lb-night); }
        .lb-final h2 { font-size: clamp(44px, 7vw, 108px); line-height: .98; max-width: 14ch; margin: 0 auto; }
        .lb-final .lb-copy { margin: 36px auto 0; text-align: center; color: rgba(251,249,246,.8); max-width: 52ch; }
        .lb-final-meta { display: flex; justify-content: center; flex-wrap: wrap; gap: 24px clamp(32px, 5vw, 72px); margin: 48px auto 40px; padding: 26px 0; border-top: 1px solid var(--lb-line-light); border-bottom: 1px solid var(--lb-line-light); max-width: 980px; text-align: center; font-family: var(--sans); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(251,249,246,.6); }
        .lb-final-meta b { display: block; font-family: var(--serif); font-size: 26px; font-weight: 400; letter-spacing: 0; text-transform: none; color: var(--lb-ivory); margin-top: 4px; }
        .lb-final .lb-ctas { justify-content: center; }

        @media (max-width: 960px) {
          .lb-hero { grid-template-columns: 1fr; min-height: auto; }
          .lb-hero-media { order: -1; min-height: 62svh; max-height: 640px; }
          .lb-hero-media::after { background: linear-gradient(180deg, rgba(36,28,42,.5) 0%, rgba(36,28,42,0) 30%, rgba(36,28,42,0) 62%, var(--lb-night) 100%); }
          .lb-hero-panel { padding: 8px 20px 48px; margin-top: -60px; background: none; }
          .lb-hero-title { font-size: clamp(76px, 24vw, 130px); margin: 16px 0 18px; }
          .lb-split { grid-template-columns: 1fr; gap: 36px; }
          .lb-c5, .lb-c6, .lb-off1 { grid-column: auto; }
          .lb-split > .lb-figure { order: -1; }
          .lb-head, .lb-index, .lb-invest, .lb-wins .lb-wrap, .lb-faq-wrap { grid-template-columns: 1fr; }
          .lb-journey-track { grid-template-columns: 1fr; gap: 22px; }
          .lb-journey-track::before { display: none; }
          .lb-jphase { padding-right: 0; }
          .lb-jdots { flex-wrap: wrap; gap: 10px; }
          .lb-dot { flex: 0 0 auto; }
          .lb-checkout { position: static; }
          .lb-wins-photo { max-width: 360px; }
          .lb-wall { grid-template-columns: 1fr; }
          .lb-method, .lb-nights, .lb-fit, .lb-quiz { grid-template-columns: 1fr; }
          .lb-shots { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 4px 4px 18px; margin: 0 -4px; scrollbar-width: thin; }
          .lb-shots figure { flex: 0 0 46vw; scroll-snap-align: start; }
          .lb-proof-feature { grid-template-columns: 1fr; }
          .lb-proof-portrait { max-width: 320px; }
          .lb-sec { overflow-x: clip; }
          .lb-figure::before { transform: translate(10px, 10px); }
          .lb-videos { align-items: center; }
          .lb-video { height: auto; width: 62vw; }
          .lb-video-wide { width: 86vw; }
          .lb-sticky span { display: none; }
          .lb-sticky-in { gap: 12px; }
          .lb-sticky .lb-ctas { flex-direction: row; } .lb-sticky .lb-ctas .lb-btn { width: auto; }
          .lb { padding-bottom: 0; }
          .lb-clips { overflow-x: auto; justify-content: flex-start; padding: 20px 4px 12px; margin-left: -4px; margin-right: -4px; scroll-snap-type: x mandatory; }
          .lb-clip { flex: 0 0 44vw; scroll-snap-align: start; }
          .lb-clip:nth-child(2) { transform: none; }
          .lb-devices-note { margin-top: 14px; }
          .lb-story-img { position: static; }
          .lb-mosaic { grid-template-columns: 1fr 1fr; }
          .lb-mosaic figure, .lb-mosaic figure:first-child { grid-column: span 2; grid-row: auto; }
          .lb-ctas { flex-direction: column; } .lb-ctas .lb-btn { width: 100%; }
        }
      `}</style>

      {/* 01 — HERO */}
      <section className="lb-hero" id="top" ref={heroRef}>
        <div className="lb-progress" aria-hidden="true"><div ref={progressRef} /></div>
        <div className="lb-hero-panel">
          <p className="lb-eyebrow lb-hero-who"><strong>Libni Fortuna</strong>A 12-week transformational group experience</p>
          <h1 className="lb-hero-title">Liberate</h1>
          <p className="lb-hero-lede">Stop abandoning yourself to keep everything else together.</p>
          <p className="lb-hero-sub">A 12-week transformational group experience for people ready to break the patterns of people-pleasing, overthinking, emotional overwhelm and self-doubt — and learn to trust themselves again.</p>
          <p className="lb-hero-sub lb-hero-sub2">Live twice a week. A private community. Your own portal. An in-person retreat to close.</p>
          <ul className="lb-hero-facts"><li>12 weeks</li><li>Live Tue &amp; Thu</li><li>Private circle</li><li>Online portal</li><li>Closing retreat</li></ul>
          <p className="lb-hero-meta"><span>We begin</span><strong>November 3, 2026 · 7 pm</strong></p>
          <div className="lb-ctas">
            <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">I’m ready to Liberate</a>
            <a href="#for-you" className="lb-btn lb-btn-light">Is this for me?</a>
          </div>
          <p className="lb-hero-proof"><span>Four intakes since 2024</span>“I found women who feel like home.” <em>Erika Mai · Liberate 4</em></p>
        </div>
        <div className="lb-hero-media"><img src={heroImg} alt="Libni Fortuna" /></div>
      </section>

            {/* 02 — THIS IS YOU */}
      <section className="lb-sec lb-linen" id="lb-for-me">
        <div className="lb-wrap lb-split">
          <div className="lb-c6 lb-stack lb-reveal">
            <h2 className="lb-display">They’ve called you intuitive. Grounded. <span className="lb-em" style={{ color: "var(--lb-plum)" }}>Even strong.</span></h2>
            <p className="lb-lede">But what they don’t see is the quiet weight you carry.</p>
            <div className="lb-copy">
              <p>The overthinking. The people-pleasing. The constant shapeshifting just to feel safe or seen. You’ve built a life, maybe even a business — and deep down you still question your worth, still feel the pull of old stories and emotional loops.</p>
              <p>Here’s the part nobody says out loud: <strong>you already know better.</strong> You’ve read the books. You’ve done the affirmations, the journaling, the mindset work. You can name the pattern while you’re inside it.</p>
            </div>
            <p className="lb-pull">Knowing better isn’t the same as living differently.</p>
            <div className="lb-copy">
              <p>The pattern isn’t always changed by knowing. It can live in your body, your nervous system, your reflexes — in the places a good idea can’t reach on its own. That’s where Liberate works.</p>
              <p className="lb-lede" style={{ color: "var(--lb-plum)" }}>To feel safe in your body. Clear in your boundaries. Free in your energy. To lead your life from your center, not from your wounds.</p>
            </div>
          </div>
          <div className="lb-c6 lb-reveal lb-you-col" style={{ transitionDelay: ".15s" }}>
            <figure className="lb-you-video">
              <iframe src={`https://player.vimeo.com/video/${YOU_VIDEO}?background=1&autoplay=1&loop=1&muted=1&autopause=0&title=0&byline=0&portrait=0&dnt=1`} title="Inside Liberate" allow="autoplay; fullscreen; picture-in-picture" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>

{/* 03 — WHAT CHANGES */}
      <section className="lb-sec lb-plum lb-wins" id="changes">
        <div className="lb-wrap">
          <div className="lb-wins-head lb-reveal">
            <p className="lb-eyebrow" style={{ color: "var(--lb-gold-soft)" }}>After twelve weeks</p>
            <h2 className="lb-display">What will actually be different.</h2>
            <p className="lb-muted" style={{ color: "rgba(251,249,246,.72)", maxWidth: "42ch", fontSize: 16 }}>Not promises. Patterns. Each of these is something a student wrote after her twelve weeks.</p>
            <a href="#method" className="lb-quiet">See how the twelve weeks work ↓</a>
          </div>
          <figure className="lb-wins-photo lb-reveal" style={{ transitionDelay: ".1s" }}><img src="/photos/liberate/wins.jpg" alt="The Liberate 4 circle together at the retreat" loading="lazy" /><figcaption>The circle · Liberate 4</figcaption></figure>
          <ol className="lb-wins-list lb-reveal" style={{ transitionDelay: ".15s" }}>
            {WINS.map(([title, note, who], i) => (
              <li key={title} style={{ "--i": i } as React.CSSProperties}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{note} <small>— {who}</small></p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 — STATEMENT + INTRODUCING */}
      <section className="lb-sec lb-plum">
        <div className="lb-wrap lb-statement lb-stack">
          <h2 className="lb-reveal">This isn’t about becoming someone else.<br /><span className="lb-gold">It’s about coming home to yourself.</span></h2>
          <div className="lb-reveal" style={{ transitionDelay: ".2s", display: "grid", gap: 26, justifyItems: "center", paddingTop: 30 }}>
            <p className="lb-eyebrow" style={{ color: "rgba(251,249,246,.7)" }}>Introducing</p>
            <img className="lb-logo" src="/liberate-logo-white.png" alt="Liberate with Libni" />
          <div className="lb-devices">
            <img className="lb-mockup" src={photos.zoom_screenshot || "/photos/liberate/zoom-mockup.png"} alt="A Liberate session on Zoom — the weekly circle on a laptop and a tablet" />
            <p className="lb-devices-note">Twice a week, from wherever you are. This is the room.</p>
          </div>
            <div className="lb-intro">
              <p className="lb-lede">Twelve weeks to release what no longer serves you, reconnect with your truth, and rise fully into the person you’re becoming.</p>
              <p>Deep inner work meets grounded, everyday change. You won’t just talk about it. You’ll practice it in your body, your boundaries, your relationships and your life.</p>
            </div>
          </div>

        </div>
      </section>

            {/* 05 — THE METHOD */}
      <section className="lb-sec lb-linen" id="method">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">The Liberate Method</p><h2 className="lb-display" style={{ marginTop: 14 }}>See → Feel → Become → Arrival.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "30ch" }}>Twelve weeks. Four movements. One shift: from knowing yourself to living as yourself.</p>
          </div>
          <div className="lb-method lb-reveal">
            {METHOD.map((m, i) => (
              <article className="lb-stage" key={m.stage} style={{ transitionDelay: `${i * 0.08}s` }} role="button" tabIndex={0}
                onClick={() => { setWeek([1, 5, 9, 12][i]); document.querySelector(".lb-journey")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setWeek([1, 5, 9, 12][i]); document.querySelector(".lb-journey")?.scrollIntoView({ behavior: "smooth", block: "start" }); } }}
                aria-label={`${m.stage} — jump to week ${[1, 5, 9, 12][i]}`}>
                <p className="lb-eyebrow">{m.weeks}</p>
                <h3>{m.stage}</h3>
                <dl>
                  <dt>What happens</dt><dd>{m.happens}</dd>
                  <dt>What you explore</dt><dd>{m.explore}</dd>
                  <dt>Why it matters</dt><dd>{m.matters}</dd>
                  <dt>What changes</dt><dd>{m.changes}</dd>
                </dl>
                <span className="lb-stage-go">Week {[1, 5, 9, 12][i]} ↓</span>
              </article>
            ))}
          </div>
          <div className="lb-head lb-reveal" style={{ marginTop: "clamp(56px, 7vw, 96px)", marginBottom: 0 }}>
            <div><p className="lb-eyebrow">Week by week</p><h3 className="lb-h3">Your twelve weeks, dated.</h3></div>
            <p className="lb-muted" style={{ fontSize: 15, maxWidth: "40ch" }}>Tap a week. Tuesdays are the Circle, Thursdays the Lab. We begin November 3 and rest over Christmas and New Year.</p>
          </div>
          <div className="lb-journey lb-reveal">
            <div className="lb-journey-track" role="tablist" aria-label="The twelve weeks">
              {(["See", "Feel", "Become", "Arrival"] as const).map((phase) => (
                <div className={`lb-jphase lb-jphase-${phase.toLowerCase()}`} key={phase}>
                  <span className="lb-jphase-label">{phase}</span>
                  <div className="lb-jdots">
                    {WEEKS.filter((w) => w.phase === phase).map((w) => (
                      <button key={w.n} type="button" role="tab" aria-selected={week === w.n} className={`lb-dot${week === w.n ? " on" : ""}${w.n < week ? " done" : ""}${w.n === 12 ? " lb-dot-end" : ""}`} onClick={() => setWeek(w.n)}>
                        <span>{String(w.n).padStart(2, "0")}</span>
                        <em>{WEEK_DATES[w.n - 1]}</em>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="lb-jpanel" key={week}>
              <p className="lb-eyebrow">{cur.phase === "Arrival" ? "The arrival" : `Month ${cur.phase === "See" ? "one" : cur.phase === "Feel" ? "two" : "three"} · ${cur.phase}`} · Week {String(cur.n).padStart(2, "0")} · {WEEK_DATES[cur.n - 1]}</p>
              <h3>{cur.title}</h3>
              <p className="lb-jdesc">{cur.desc}</p>
              {cur.n < 12 ? (
                <p className="lb-jmeta"><span>Tue 7 pm</span> the circle, with Libni <span>Thu 7 pm</span> the workshop, with the alumni</p>
              ) : (
                <p className="lb-jmeta"><span>In person</span> most likely Batangas · dates announced inside the circle · stay and meals covered, transport your own</p>
              )}
              {cur.n === 7 && <p className="lb-jrest">After this week we rest for Christmas and New Year (Dec 22 &amp; 29) and continue January 5.</p>}
              <div className="lb-jnav">
                <button type="button" className="lb-jbtn" onClick={() => setWeek((w) => Math.max(1, w - 1))} disabled={week === 1}>← Previous</button>
                <button type="button" className="lb-jbtn" onClick={() => setWeek((w) => Math.min(12, w + 1))} disabled={week === 12}>Next week →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — THE EXPERIENCE */}
      <section className="lb-sec lb-ivory" id="experience">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">The experience</p><h2 className="lb-display" style={{ marginTop: 14 }}>Two live sessions a week. One living community.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "28ch" }}>Online, from wherever you are — 7 pm Manila, Tuesdays and Thursdays.</p>
          </div>
          <div className="lb-nights lb-reveal">
            <article className="lb-night">
              <img src={photos.inside_1 || INSIDE_STOCK.inside_1} alt="A Tuesday Circle on Zoom" loading="lazy" />
              <p className="lb-eyebrow">Tuesday · The Circle</p>
              <h3>7 pm, with Libni</h3>
              <p>The coaching space. A check-in to be heard, then the week’s work: guided coaching, reflection, processing, breakthroughs — and support when something cracks open. This is where the method happens.</p>
            </article>
            <article className="lb-night">
              <img src="/photos/liberate/moments-1.jpg" alt="The Liberate community together, one member joining from a laptop" loading="lazy" />
              <p className="lb-eyebrow">Thursday · The Lab</p>
              <h3>7 pm, with Libni + the Liberate community</h3>
              <p>The workshop space, where this intake learns alongside previous Liberate students. You’re not joining a program — you’re entering a community that’s already walking this road, and will still be here when your twelve weeks end.</p>
            </article>
            <article className="lb-night">
              <img className="lb-night-portal" src={photos.inside_7 || INSIDE_STOCK.inside_7} alt="The Liberate member portal" loading="lazy" />
              <p className="lb-eyebrow">Your portal</p>
              <h3>Everything, in one place.</h3>
              <p>Every replay, the roadmap, guided meditations, practices and resources — for the whole journey.</p>
            </article>
            <article className="lb-night">
              <img src={photos.inside_8 || INSIDE_STOCK.inside_8} alt="Liberate students together at golden hour" loading="lazy" />
              <p className="lb-eyebrow">After the twelve weeks</p>
              <h3>It doesn’t end.</h3>
              <p>Liberate alumni are invited back into Thursday Labs, so the circle you build keeps growing with you — intake after intake.</p>
            </article>
          </div>

          <div className="lb-head lb-reveal" style={{ marginTop: "clamp(56px, 7vw, 96px)" }}>
            <div><p className="lb-eyebrow">What you’ll practice</p><h3 className="lb-h3">Nothing you have to perform. Everything you get to feel.</h3></div>
          </div>
          <div className="lb-index">
            {PRACTICE.map(([title, body, slot], i) => (
              <div className="lb-item lb-reveal" key={slot} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <img src={photos[slot] || INSIDE_STOCK[slot]} alt={title} loading="lazy" />
                <div className="lb-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* 06b — SESSIONS */}
      <section className="lb-sec lb-ivory">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">What our sessions look like</p><h2 className="lb-display" style={{ marginTop: 14 }}>Come sit in the room.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "30ch" }}>Twice a week on Zoom, wherever you are. Cameras on, hearts open — real moments from our weekly circles — tap any one — so you can feel what a night in Liberate is like before you ever join one.</p>
          </div>
          {clips.length > 0 && (
            <div className="lb-clips lb-reveal">
              {clips.map((c, i) => <LbClip key={c.src + i} clip={c} />)}
            </div>
          )}
        </div>
      </section>

{/* 07 — WHY LIBNI */}
      <section className="lb-sec lb-ivory">
        <div className="lb-wrap lb-split" style={{ alignItems: "start" }}>
          <div className="lb-c5 lb-reveal"><div className="lb-story-img lb-figure"><img src={storyImg} alt="Libni Fortuna" /></div></div>
          <div className="lb-off1 lb-stack lb-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="lb-eyebrow">Why Libni</p>
            <h2 className="lb-display">I didn’t learn this from a book. I built it from the inside.</h2>
            <div className="lb-copy">
              <p>If you’re reading this, I want you to know I see you. I know that feeling.</p>
              <p>For years, I carried so much that wasn’t mine: the weight of expectations, emotional baggage I didn’t even realize I was holding, and patterns that kept me stuck in cycles I desperately wanted to break.</p>
              <p>I did all the things. The self-help books. The affirmations. The journaling. And while they helped, I still felt like something was missing. Like there was something deeper blocking me from fully stepping into who I was meant to be.</p>
            </div>
            <p className="lb-pull">It wasn’t until I went beyond mindset work and into deep subconscious and energetic healing that everything changed.</p>
            <div className="lb-copy">
              <p>I started working with my chakras, rewiring my subconscious mind, releasing stored trauma, and integrating the spiritual side of healing. And for the first time, I felt free.</p>
              <p>Liberate is that process — the one that finally worked for me — shaped over years of guiding others through subconscious work, hypnotherapy and NLP, breathwork and somatic practice, retreats and one-to-one coaching. I’m not here to give you information. I’m here to walk you through it.</p>
              <p>If you’re ready for that, welcome home. This is your space.</p>
            </div>
            <p className="lb-sign">Libni</p>
            <p className="lb-creds">Life Strategist · TEDx speaker · Founder, Essence Retreat Philippines · Certified hypnotherapist · NLP master practitioner · Breathwork &amp; somatic facilitator</p>
          </div>
        </div>
      </section>

      {/* 08 — PROOF */}
      <section className="lb-sec lb-linen" id="words">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">From the people of Liberate</p><h2 className="lb-display" style={{ marginTop: 14 }}>Four intakes since 2024. One growing circle.</h2></div>
            <p className="lb-lede lb-muted" style={{ maxWidth: "26ch" }}>Not reviews — turning points. Liberate has been lived by four intakes. These are their words, faces and voices.</p>
          </div>

          {videos.length > 0 && (
            <div className="lb-videos-wrap lb-videos-first lb-reveal">
              <div className="lb-head" style={{ marginBottom: 26 }}>
                <div><p className="lb-eyebrow">Hear it from them</p><h3 className="lb-h3">{videos.length} students, in their own voice.</h3></div>
                <p className="lb-muted" style={{ fontSize: 15, maxWidth: "36ch" }}>Unscripted, on camera, from four intakes. Tap any one to play — sound on. Swipe for more →</p>
              </div>
              <div className="lb-videos">{videos.map((v, i) => <LbVideo key={v.url + i} video={v} n={i + 1} />)}</div>
            </div>
          )}

          <div className="lb-proof-feature lb-reveal">
            <div className="lb-spot-fade" key={`p-${first.id}`}>
              {playFeat && featEmbed && "embed" in featEmbed ? (
                <div className="lb-proof-portrait lb-proof-player" style={{ aspectRatio: featVideo?.w && featVideo?.h ? `${featVideo.w} / ${featVideo.h}` : "4 / 5" }}>
                  <iframe src={`${featEmbed.embed}${featEmbed.embed.includes("?") ? "&" : "?"}autoplay=1&title=0&byline=0&portrait=0&dnt=1`} title={`${first.who} — her Liberate story`} allow="autoplay; fullscreen; picture-in-picture" />
                </div>
              ) : featurePhoto ? (
                <div className="lb-figure lb-proof-portrait">
                  <img src={featurePhoto} alt={first.who} loading="lazy" />
                  {featEmbed && "embed" in featEmbed && (
                    <button type="button" className="lb-spot-play" onClick={() => { setFeatAuto(false); setPlayFeat(true); }} aria-label={`Watch ${firstName}’s story`}>
                      <span className="lb-spot-play-ring"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
                      <span>Watch {firstName}’s story{featVideo?.dur ? ` · ${mmss(featVideo.dur)}` : ""}</span>
                    </button>
                  )}
                </div>
              ) : null}
            </div>
            <div>
              <div className="lb-spot-fade" key={`q-${first.id}`}>
                <p className="lb-quote">{first.q}</p>
                <div className="lb-byline"><Face src={first.photo} name={first.who} size={60} /><p className="lb-who">{first.who}{first.role && <span>{first.role}</span>}</p></div>
              </div>
              {spotlight.length > 1 && (
                <div className="lb-spot-nav" aria-label="More voices">
                  <button type="button" className="lb-jbtn" onClick={() => goFeat(feat - 1)} aria-label="Previous voice">←</button>
                  <div className="lb-spot-faces" role="tablist">
                    {spotlight.map((w, i) => (
                      <button key={w.id} type="button" role="tab" aria-selected={i === feat} className={`lb-spot-face${i === feat ? " on" : ""}`} onClick={() => goFeat(i)} title={w.who}>
                        <Face src={w.photo} name={w.who} size={40} />
                      </button>
                    ))}
                  </div>
                  <button type="button" className="lb-jbtn" onClick={() => goFeat(feat + 1)} aria-label="Next voice">→</button>
                </div>
              )}
            </div>
          </div>

          <div className="lb-themes lb-reveal" role="tablist" aria-label="Filter by theme">
            {(["All", ...THEMES] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={theme === t} className={`lb-chip${theme === t ? " on" : ""}`} onClick={() => setTheme(t)}>{t}</button>
            ))}
          </div>
          <div className="lb-wall">
            {WORDS_SHOWN.filter((w) => w.id !== "tiff").filter((w) => theme === "All" || (w.id && THEME_OF[w.id] === theme)).map((w, i) => (
              <div key={(w.id ?? w.who) + i} className="lb-reveal is-in lb-word">
                {w.id && THEME_OF[w.id] && <span className="lb-tag">{THEME_OF[w.id]}</span>}
                <p className="lb-quote">{w.q}</p>
                <div className="lb-word-head"><Face src={w.photo} name={w.who} /><p className="lb-who">{w.who}{w.role && <span>{w.role}</span>}</p></div>
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

      {/* 09 — THE RETREAT */}
      <section className="lb-sec lb-night">
        <div className="lb-wrap">
          <div className="lb-retreat-head lb-stack lb-reveal">
            <p className="lb-eyebrow">The retreat · The arrival</p>
            <h2 className="lb-display"><span>You don’t just complete Liberate.</span><span className="lb-gold">You arrive.</span></h2>
            <div className="lb-copy" style={{ color: "rgba(251,249,246,.82)" }}>
              <p>After twelve weeks of inner work, we come together in person — to integrate, celebrate, connect, and feel the transformation outside the screen. It’s not a bonus. It’s where everything lands.</p>
              <p>Because sometimes transformation needs more than another Zoom call.</p>
              <p className="lb-lede" style={{ color: "var(--lb-ivory)" }}>It needs to be lived.</p>
            </div>
            <div className="lb-ctas"><a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">I’m ready to Liberate</a></div>
          </div>
          <div className="lb-retreat-hero lb-reveal"><img src={retreatHero} alt="The Liberate retreat" /><figcaption>Out of the Zoom calls, into each other’s arms</figcaption></div>
          <div className="lb-mosaic lb-reveal">
            {retreatTiles.map(([label, src], i) => (
              <figure key={i}><img src={src} alt={label} loading="lazy" /><figcaption>{label}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

            {/* 09b — THE MIRROR (quiz) */}
      <section className="lb-sec lb-night" id="quiz">
        <div className="lb-wrap lb-quiz">
          <div className="lb-quiz-head lb-reveal">
            <p className="lb-eyebrow">A mirror, not a diagnosis</p>
            <h2 className="lb-display">Which pattern is running your life?</h2>
            <p className="lb-lede" style={{ color: "rgba(251,249,246,.78)" }}>Five quick taps. Answer with your reflex, not your best self.</p>
          </div>
          <div className="lb-quiz-card lb-reveal" style={{ transitionDelay: ".12s" }}>
            {quizResult ? (
              <div className="lb-quiz-result" key="result">
                <p className="lb-eyebrow">The pattern most present right now</p>
                <h3>{QUIZ_RESULT[quizResult].name}</h3>
                <p className="lb-quiz-mirror">{QUIZ_RESULT[quizResult].mirror}</p>
                <dl>
                  <div><dt>Where Liberate works on it</dt><dd><em>{QUIZ_RESULT[quizResult].stage}</em> — {QUIZ_RESULT[quizResult].work}</dd></div>
                  <div><dt>What changes</dt><dd>{QUIZ_RESULT[quizResult].changes}</dd></div>
                </dl>
                <div className="lb-ctas">
                  <a href="#for-you" className="lb-btn lb-btn-gold">Is this for me?</a>
                  <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-ghost">I’m ready to Liberate</a>
                </div>
                <button type="button" className="lb-quiz-again" onClick={() => setQuiz([])}>Start again</button>
              </div>
            ) : (
              <div className="lb-quiz-step" key={quiz.length}>
                <div className="lb-quiz-progress" aria-hidden="true">{QUIZ.map((_, i) => <span key={i} className={i < quiz.length ? "done" : i === quiz.length ? "now" : ""} />)}</div>
                <p className="lb-quiz-n">{quiz.length + 1} of {QUIZ.length}</p>
                <h3>{QUIZ[quiz.length].q}</h3>
                <div className="lb-quiz-opts">
                  {QUIZ[quiz.length].a.map(([k, label]) => (
                    <button key={k} type="button" className="lb-qopt" onClick={() => setQuiz((q) => [...q, k])}>{label}</button>
                  ))}
                </div>
                {quiz.length > 0 && <button type="button" className="lb-quiz-again" onClick={() => setQuiz((q) => q.slice(0, -1))}>← Back</button>}
              </div>
            )}
          </div>
        </div>
      </section>

            {/* 10 — IS IT FOR YOU */}
      <section className="lb-sec lb-ivory" id="for-you">
        <div className="lb-wrap">
          <div className="lb-head lb-reveal">
            <div><p className="lb-eyebrow">Before you decide</p><h2 className="lb-display" style={{ marginTop: 14 }}>Is Liberate for you?</h2></div>
          </div>
          <div className="lb-fit lb-reveal">
            <div className="lb-fit-col">
              <h3>Liberate is for you if…</h3>
              <ul>{FOR_YOU.map((x, i) => <li key={x} style={{ "--i": i } as React.CSSProperties}>{x}</li>)}</ul>
            </div>
            <div className="lb-fit-col lb-fit-not">
              <h3>Liberate isn’t for you — yet — if…</h3>
              <ul>{NOT_FOR_YOU.map((x, i) => <li key={x} style={{ "--i": i } as React.CSSProperties}>{x}</li>)}</ul>
              <p className="lb-fit-note">None of that makes you wrong. It simply means this may not be your season yet.</p>
            </div>
          </div>
        </div>
      </section>

{/* 11 — THE INVESTMENT */}
      <section className="lb-sec lb-ivory" id="investment">
        <div className="lb-wrap lb-invest">
          <div className="lb-reveal">
            <p className="lb-eyebrow">The investment</p>
            <h2 className="lb-display" style={{ marginTop: 14, maxWidth: "12ch" }}>One payment, or three.</h2>
            <p className="lb-lede lb-muted" style={{ marginTop: 18, maxWidth: "26ch" }}>Your place is held the moment it clears.</p>
            <p className="lb-note" style={{ marginTop: 18, maxWidth: "46ch" }}>Nothing is charged until you choose to. GCash, Maya, cards and bank transfer all work. Need a different arrangement? <Link href="/liberate/apply" style={{ textDecoration: "underline" }}>Talk to me first</Link>.</p>
            <p className="lb-lede" style={{ marginTop: 30, maxWidth: "30ch", fontSize: "clamp(20px, 1.9vw, 25px)" }}>This isn’t an investment in more information. It’s an investment in having the space, structure and community to actually live what you already know.</p>
            <div style={{ marginTop: 34 }}>
              <p className="lb-eyebrow" style={{ marginBottom: 14 }}>What you receive</p>
              <ul className="lb-list">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <div className="lb-reveal" style={{ transitionDelay: ".12s" }}>
            <div className="lb-checkout">
              <div className="lb-checkout-head"><span>Liberate</span><span>November 2026 circle</span></div>
              <p className="lb-checkout-k">Choose how you’d like to pay</p>
              <div className="lb-plans" role="radiogroup" aria-label="Payment plan">
                <button type="button" role="radio" aria-checked={plan === "full"} className={`lb-plan-opt${plan === "full" ? " on" : ""}`} onClick={() => setPlan("full")}>
                  <span className="lb-plan-radio" aria-hidden />
                  <span className="lb-plan-main"><b>Pay in full</b><small>One payment. Done.</small></span>
                  <span className="lb-plan-amt">{price}</span>
                </button>
                <button type="button" role="radio" aria-checked={plan === "instalment"} className={`lb-plan-opt${plan === "instalment" ? " on" : ""}`} onClick={() => setPlan("instalment")}>
                  <span className="lb-plan-radio" aria-hidden />
                  <span className="lb-plan-main"><b>{offer.instalmentCount} monthly payments</b><small>{firstPayLabel} today, then {perMonth} a month</small></span>
                  <span className="lb-plan-amt">{perMonth}<i>/mo</i></span>
                </button>
              </div>
              <div className="lb-checkout-rows">
                <div><span>Program</span><span>12 weeks · 24 live nights · retreat</span></div>
                <div><span>Total</span><span>{price}</span></div>
                <div className="lb-checkout-due"><span>Due today</span><strong>{plan === "full" ? price : firstPayLabel}</strong></div>
              </div>
              <a href={`/liberate/join${plan === "instalment" ? "?plan=monthly" : ""}`} target="_blank" rel="noreferrer" className="lb-btn lb-btn-ink lb-checkout-cta">Join Liberate →</a>
              <p className="lb-checkout-fine">Opens in a new tab · GCash · Maya · Cards · Bank transfer</p>
              <p className="lb-checkout-fine" style={{ marginTop: 6 }}>Not sure yet? <Link href="/liberate/apply" style={{ textDecoration: "underline", color: "var(--lb-ink)" }}>Talk to me first</Link></p>
            </div>
            <p className="lb-refund">Liberate does not offer refunds — this space is built on alignment, not urgency. If you’re unsure, take your time and say yes only when it’s a full yes. Retreat stay and meals are covered; transport is your own.</p>
          </div>
        </div>
      </section>

      {/* 12 — FAQ */}
      <section className="lb-sec lb-ivory" id="faq">
        <div className="lb-wrap lb-faq-wrap">
          <div className="lb-reveal">
            <p className="lb-eyebrow">Before you decide</p>
            <h2 className="lb-display" style={{ marginTop: 14 }}>Questions, answered.</h2>
            <p className="lb-muted" style={{ marginTop: 18, maxWidth: "34ch", fontSize: 16 }}>If yours isn’t here, choose “Talk to me first” — I’d rather you decide clearly than quickly.</p>
          </div>
          <div className="lb-faq lb-reveal" style={{ transitionDelay: ".12s" }}>
            {LIBERATE_FAQ.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* 13 — FINAL */}
      <section className="lb-final">
        <div className="lb-wrap">
          <h2 className="lb-reveal">You don’t need to become someone else. <span className="lb-gold">You need the freedom to be yourself.</span></h2>
          <div className="lb-copy lb-reveal" style={{ transitionDelay: ".15s" }}>
            <p>Break free from the emotional weight you’ve been carrying. From the people-pleasing, the patterns, the quiet exhaustion that’s become your normal.</p>
            <p>Liberate is your space to unravel, rebuild, and rise. This is your next chapter, and it doesn’t have to be written in pain.</p>
            <p style={{ color: "var(--lb-ivory)" }}>We begin November 3, 2026, at 7 pm. Spots are limited and held with intention.</p>
          </div>
          <div className="lb-final-meta lb-reveal" style={{ transitionDelay: ".25s" }}>
            <div>Liberate<b>12 weeks · Tuesdays &amp; Thursdays, 7 pm</b></div>
            <div>We begin<b>November 3, 2026</b></div>
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
          <p><strong>Liberate</strong><span>Begins November 3, 2026 · {price}{perMonth ? ` or ${offer.instalmentCount} × ${perMonth}` : ""}</span></p>
          <div className="lb-ctas">
            <a href="/liberate/join" target="_blank" rel="noreferrer" className="lb-btn lb-btn-gold">Join</a>
            <Link href="/liberate/apply" className="lb-btn lb-btn-light">Talk first</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
