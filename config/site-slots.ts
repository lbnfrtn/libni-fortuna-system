import { LIBERATE_PHOTO_SLOTS } from "@/config/liberate-photos";

// ============================================================================
// Every image on the public site that Libni can replace from /admin/studio.
// `fallback` is a real photo already in /public — a slot with no fallback
// simply renders nothing until she uploads, so the page never shows a
// placeholder box to a visitor.
// ============================================================================

export interface Slot {
  id: string;
  label: string;
  hint: string;
  /** Guidance shown in the Studio, and the preview shape. */
  aspect: string;
  kind?: "photo" | "video";
  fallback?: string;
}

export interface SlotGroup {
  key: string;
  title: string;
  where: string;
  slots: Slot[];
}

export const SLOT_GROUPS: SlotGroup[] = [
  {
    key: "home",
    title: "Home page",
    where: "libni.co",
    slots: [
      { id: "home_hero", label: "Hero portrait", hint: "Full-height portrait beside “Come home to yourself”. Leave room on the left — the headline sits over it.", aspect: "3/4", fallback: "/photos/libni-hero.jpg" },
      { id: "home_seeyou", label: "“I see you” portrait", hint: "Quieter, still portrait.", aspect: "4/5", fallback: "/photos/liberate-libni-table.jpg" },
      { id: "home_experiences", label: "Experiences banner", hint: "Wide, atmospheric shot of a gathering, circle or room. Blank until you upload.", aspect: "16/9" },
      { id: "home_story", label: "“Hi, I’m Libni” portrait", hint: "Warm portrait for the story section.", aspect: "4/5", fallback: "/photos/liberate-libni-warm.jpg" },
      { id: "home_stage", label: "Stage photo", hint: "You speaking — used in the organisations & stages section.", aspect: "4/5", fallback: "/photos/libni-stage.jpg" },
      { id: "home_letters", label: "Letters / newsletter image", hint: "Something calm and tactile — journal, desk, hands, morning light.", aspect: "4/5" },
      { id: "home_podcast", label: "Podcast artwork", hint: "Square cover art for Anyway, Moving Forward. The section runs full-width until you add it.", aspect: "1/1" },
      { id: "offer_ignite", label: "Power Hour — card photo", hint: "Used on the home page and Work with me.", aspect: "1/1", fallback: "/photos/liberate-libni-thought.jpg" },
      { id: "offer_the_becoming", label: "The Becoming — card photo", hint: "Used on the home page and Work with me.", aspect: "1/1", fallback: "/photos/liberate-libni-dark.jpg" },
      { id: "offer_liberate", label: "Liberate — card photo", hint: "Used on the home page and Work with me.", aspect: "1/1", fallback: "/photos/libni-portrait.jpg" },
      { id: "offer_project_me", label: "Project Me — phone screen", hint: "A tall phone screenshot of the app (about 9:16). It renders inside a phone frame. Currently a capture of projectme.libni.co.", aspect: "9/16", fallback: "/photos/projectme-screen.jpg" },
    ],
  },
  {
    key: "videos",
    title: "Video testimonies",
    where: "Home page, /client-love and /stories",
    slots: [1, 2, 3, 4, 5, 6].map((n) => ({ id: `video_${n}`, label: `Video testimony ${n}`, hint: "Paste a YouTube or Vimeo link. Shown in the order you fill them.", aspect: "16/9", kind: "video" as const })),
  },
  {
    key: "screenshots",
    title: "Screenshots — messages & DMs",
    where: "/client-love",
    slots: [1, 2, 3, 4, 5, 6].map((n) => ({ id: `screenshot_${n}`, label: `Screenshot ${n}`, hint: "A message, DM or story a client sent you. Crop out anything private first.", aspect: "4/5" })),
  },
  {
    key: "oneonone",
    title: "1:1 support page",
    where: "/one-on-one",
    slots: [
      { id: "oneonone_hero", label: "Hero portrait", hint: "You, close and unhurried. Tall crop.", aspect: "4/5", fallback: "/photos/liberate-libni-thought.jpg" },
      { id: "oneonone_becoming", label: "The Becoming photo", hint: "A quiet, held moment — one to one.", aspect: "4/5", fallback: "/photos/liberate-libni-warm.jpg" },
      { id: "oneonone_powerhour", label: "Power Hour photo", hint: "You in conversation.", aspect: "4/5", fallback: "/photos/libni-portrait.jpg" },
    ],
  },
  {
    key: "about",
    title: "About page",
    where: "/about — the portrait, the sticky photo beside your story, the stage shot and the “beyond the work” photo",
    slots: [
      { id: "about_hero", label: "Hero portrait", hint: "Full-height portrait beside “Come home to yourself”. Leave room on the left.", aspect: "4/5", fallback: "/photos/liberate-libni-table.jpg" },
      { id: "about_portrait", label: "Story portrait", hint: "Sits beside “I’ve been a lot of people”. Quieter, candid.", aspect: "3/4", fallback: "/photos/liberate-libni-thought.jpg" },
      { id: "about_stage", label: "On stage", hint: "Beside “What I believe”.", aspect: "4/5", fallback: "/photos/stage-tedx.jpg" },
      { id: "about_life", label: "Beyond the work", hint: "Something personal — travel, the ocean, a table with people.", aspect: "4/5", fallback: "/photos/liberate-libni-warm.jpg" },
      { id: "about_now_family", label: "Life now · with my family", hint: "The “Life now” gallery appears once any of these four are uploaded. Real, candid, unposed.", aspect: "4/5" },
      { id: "about_now_beach", label: "Life now · the ocean", hint: "A beach day. Wide and calm works best.", aspect: "3/2" },
      { id: "about_now_freedom", label: "Life now · time freedom", hint: "A slow morning, travel, a long table, a weekday afternoon that’s yours.", aspect: "3/2" },
      { id: "about_now_peace", label: "Life now · peace of mind", hint: "Stillness. You, at ease.", aspect: "4/5" },
      { id: "about_study_abroad", label: "Student of life · studying abroad", hint: "The “student of life” gallery appears once any of these four are uploaded. A classroom, a training room, a certificate day.", aspect: "4/5" },
      { id: "about_study_australia", label: "Student of life · retreats in Australia", hint: "You holding a room or a circle there.", aspect: "3/2" },
      { id: "about_study_travel", label: "Student of life · on the road", hint: "A country, a teacher, a moment that taught you something.", aspect: "3/2" },
      { id: "about_study_room", label: "Student of life · in the room", hint: "An experience you curated — the room, the breath, the table.", aspect: "4/5" },
      { id: "about_who", label: "Who is Libni · portrait", hint: "Sits under the “many versions of myself” list. A candid, unposed you.", aspect: "3/4", fallback: "/photos/libni-portrait.jpg" },
      { id: "about_clients", label: "Who I work with · in session", hint: "You with a client or a circle — the work, not a headshot.", aspect: "4/5", fallback: "/photos/liberate-libni-dark.jpg" },
      { id: "about_why", label: "Why I do this work · portrait", hint: "Under the “tell the truth” list. Warm, close, present.", aspect: "3/4", fallback: "/photos/libni-hero.jpg" },
    ],
  },
  {
    key: "becoming",
    title: "The Becoming (/programs/the-becoming)",
    where: "The 1:1 mentorship landing page — hero, story portrait, the meditation-portal mock-up, and a gallery of moments from the work",
    slots: [
      { id: "becoming_hero", label: "Hero portrait", hint: "Full-height portrait beside “The Becoming”. Leave room on the left.", aspect: "4/5", fallback: "/photos/liberate-libni-warm.jpg" },
      { id: "becoming_portrait", label: "Story portrait", hint: "Beside the long story. Quieter, close.", aspect: "3/4", fallback: "/photos/liberate-libni-thought.jpg" },
      { id: "becoming_portal", label: "Meditation portal mock-up", hint: "A screenshot or mock-up of the online portal clients get. Replaces the stock photo on the “meditation portal” card once uploaded.", aspect: "4/3" },
      { id: "becoming_get_1", label: "What you get · Weekly 1:1 sessions", hint: "Stock photo until you replace it (Unsplash, free licence). Best: you on a call, or a client mid-session.", aspect: "4/3", fallback: "https://images.unsplash.com/photo-1664575196044-195f135295df?auto=format&fit=crop&w=1200&q=75" },
      { id: "becoming_get_2", label: "What you get · Meditation portal", hint: "Stock photo until you replace it. The portal mock-up above wins if uploaded.", aspect: "4/3", fallback: "https://images.unsplash.com/photo-1758876201548-ade1eff8b169?auto=format&fit=crop&w=1200&q=75" },
      { id: "becoming_get_3", label: "What you get · 24/7 support", hint: "Stock photo until you replace it. A screenshot of a real WhatsApp thread (names hidden) works beautifully.", aspect: "4/3", fallback: "https://images.unsplash.com/photo-1619089650120-58531fda7cc5?auto=format&fit=crop&w=1200&q=75" },
      { id: "becoming_get_4", label: "What you get · Client community", hint: "Stock photo until you replace it. Your clients together, in person or on a call.", aspect: "4/3", fallback: "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=1200&q=75" },
      { id: "becoming_get_5", label: "What you get · Free workshops", hint: "Stock photo until you replace it. One of your own workshop rooms.", aspect: "4/3", fallback: "https://images.unsplash.com/photo-1655337690778-694dda7f4454?auto=format&fit=crop&w=1200&q=75" },
      { id: "becoming_get_6", label: "What you get · Personalised path", hint: "Stock photo until you replace it. Your notes, a client’s journal, your desk.", aspect: "4/3", fallback: "https://images.unsplash.com/photo-1637689113621-73951984fcc1?auto=format&fit=crop&w=1200&q=75" },
      { id: "becoming_gallery_1", label: "Moments · 1", hint: "The gallery appears once any of these four are uploaded — sessions, notes, a client’s space, you at work.", aspect: "4/5" },
      { id: "becoming_gallery_2", label: "Moments · 2", hint: "", aspect: "4/5" },
      { id: "becoming_gallery_3", label: "Moments · 3", hint: "", aspect: "4/5" },
      { id: "becoming_gallery_4", label: "Moments · 4", hint: "", aspect: "4/5" },
    ],
  },
  {
    key: "links",
    title: "Link in bio (/links)",
    where: "/links — the page behind your Instagram bio link",
    slots: [
      { id: "links_hero", label: "Full-bleed portrait", hint: "Sits behind your name at the top. Landscape works best.", aspect: "3/2", fallback: "/photos/libni-hero.jpg" },
    ],
  },
  {
    key: "speaking",
    title: "Speaking — video proof & stage photos",
    where: "/speaking (the link you send to organisers)",
    slots: [
      { id: "speak_video_1", label: "Watch me speak — video 1", hint: "Your best clip. Until you add one, the TEDx talk plays here.", aspect: "16/9", kind: "video" },
      { id: "speak_video_2", label: "Watch me speak — video 2", hint: "A workshop or corporate room, ideally.", aspect: "16/9", kind: "video" },
      { id: "speak_video_3", label: "Watch me speak — video 3", hint: "A TV segment or a sizzle reel.", aspect: "16/9", kind: "video" },
      { id: "speak_video_4", label: "Watch me speak — video 4", hint: "Optional.", aspect: "16/9", kind: "video" },
      { id: "stage_1", label: "Stage photo 1", hint: "You on stage, the room visible.", aspect: "3/2", fallback: "/photos/stage-tedx.jpg" },
      { id: "stage_2", label: "Stage photo 2", hint: "A workshop or brand activation.", aspect: "3/2", fallback: "/photos/stage-goalgetters.jpg" },
      { id: "stage_3", label: "Stage photo 3", hint: "A corporate room.", aspect: "3/2", fallback: "/photos/stage-dove.jpg" },
      { id: "stage_4", label: "Stage photo 4", hint: "A retreat or circle.", aspect: "3/2", fallback: "/photos/stage-retreat.jpg" },
      { id: "stage_5", label: "Stage photo 5", hint: "Optional.", aspect: "3/2" },
      { id: "stage_6", label: "Stage photo 6", hint: "Optional.", aspect: "3/2" },
      { id: "stage_7", label: "Stage photo 7", hint: "Optional.", aspect: "3/2" },
      { id: "stage_8", label: "Stage photo 8", hint: "Optional.", aspect: "3/2" },
      { id: "speak_messages", label: "Messages after an event", hint: "A collage of what organisers and audiences send you afterwards. Currently the one from your portfolio.", aspect: "16/9", fallback: "/portfolio/19.jpg" },
    ],
  },
  {
    key: "mediakit",
    title: "Media kit — headshots",
    where: "/media-kit (press and event organisers download these)",
    slots: [
      { id: "headshot_1", label: "Headshot 1", hint: "Highest-resolution portrait you have.", aspect: "4/5", fallback: "/photos/libni-hero.jpg" },
      { id: "headshot_2", label: "Headshot 2", hint: "A second look — warmer, or seated.", aspect: "4/5", fallback: "/photos/libni-portrait.jpg" },
      { id: "headshot_3", label: "On stage", hint: "You speaking.", aspect: "4/5", fallback: "/photos/libni-stage.jpg" },
      { id: "headshot_4", label: "Headshot 4", hint: "Optional.", aspect: "4/5" },
    ],
  },
  {
    key: "liberate",
    title: "Liberate sales page",
    where: "/liberate",
    slots: LIBERATE_PHOTO_SLOTS.map((s) => ({
      id: s.id,
      label: s.label,
      hint: s.section,
      aspect: s.aspectRatio,
    })),
  },
];

export const ALL_SLOTS: Slot[] = SLOT_GROUPS.flatMap((g) => g.slots);

/** Fixed slots above, plus the per-row photos of stories, talks and press (story_<id> …). */
export function isValidSlot(id: string): boolean {
  return ALL_SLOTS.some((s) => s.id === id) || /^(story|talk|press|brand|speak)_[a-z0-9-]{1,60}$/.test(id);
}

/** The image to render for a slot: her upload, else the real photo already shipped, else nothing. */
export function photoFor(photos: Record<string, string>, id: string): string | undefined {
  return photos[id] || ALL_SLOTS.find((s) => s.id === id)?.fallback;
}

/** Named links Libni pastes in the Studio. */
export const LINK_FIELDS: { key: string; label: string; hint: string; placeholder: string }[] = [
  { key: "spotify", label: "Spotify show", hint: "Your podcast on Spotify. The home page then shows a live player with your latest episodes.", placeholder: "https://open.spotify.com/show/…" },
  { key: "applePodcasts", label: "Apple Podcasts", hint: "Optional second place to listen.", placeholder: "https://podcasts.apple.com/…" },
  { key: "substack", label: "Substack / blog", hint: "Your write-ups. Adds a “Read the blog” link on the home page.", placeholder: "https://yourname.substack.com" },
];

/** Spotify show/episode link -> its official embedded player. */
export function spotifyEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.replace(/^www\./, "").endsWith("spotify.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.findIndex((p) => p === "show" || p === "episode");
    if (i === -1 || !parts[i + 1]) return null;
    return `https://open.spotify.com/embed/${parts[i]}/${parts[i + 1]}`;
  } catch {
    return null;
  }
}

/** Turn a YouTube/Vimeo watch link into an embeddable one. */
export function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    if (h === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (h.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return `https://www.youtube.com${u.pathname}`;
      if (u.pathname === "/watch" && u.searchParams.get("v")) return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      if (u.pathname.startsWith("/shorts/")) return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    }
    if (h.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* not a URL we can embed */
  }
  return null;
}
