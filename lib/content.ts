import { promises as fs } from "node:fs";
import path from "node:path";

// ============================================================================
// Site content Libni edits herself in /admin/studio — photos for each slot,
// video links, podcast episodes and write-ups. Same shape as lib/store.ts:
// a file adapter for local/test, Firestore in production. Never holds
// anything sensitive, so it is safe to read from public pages.
// ============================================================================

export interface MediaLink {
  id: string;
  title: string;
  url: string;
  blurb?: string;
  date?: string;
}

/** One week inside the Liberate member portal. */
export interface PortalWeek {
  n: number;
  title: string;
  theme: string;
  date?: string;
  sessionUrl?: string;
  replayUrl?: string;
  notes?: string;
  resources: { label: string; url: string }[];
}

/** Everything the Liberate cohort sees in /portal — edited in Liberate HQ. */
export interface LiberateHQ {
  cohortLabel: string;
  startDate?: string;
  /** Shared privately in the welcome email; members sign in with email + this. */
  accessCode: string;
  welcome: string;
  sessionUrl?: string;
  communityUrl?: string;
  communityLabel?: string;
  weeks: PortalWeek[];
}

/** A client story: a real quote, optionally the before / the work / the after. Photo lives in photos[`story_${id}`]. */
export interface Story {
  id: string;
  name: string;
  role?: string;
  program?: string;
  quote: string;
  before?: string;
  during?: string;
  after?: string;
  featured?: boolean;
}

/** A stage: keynote, workshop, panel, TV, summit… Photo in photos[`talk_${id}`]. */
export interface Talk {
  id: string;
  title: string;
  org: string;
  date?: string; // YYYY-MM-DD or YYYY-MM or YYYY
  location?: string;
  url?: string;
  kind: "keynote" | "workshop" | "panel" | "summit" | "retreat" | "other";
  blurb?: string;
}

/** Libni featured elsewhere: a guest on a podcast, a TV segment, an article. Still/thumbnail in photos[`press_${id}`]. */
export interface PressItem {
  id: string;
  title: string;
  outlet: string;
  url?: string;
  date?: string;
  kind: "podcast" | "tv" | "article" | "video";
  blurb?: string;
}

/** An organisation, brand or outlet she has worked with. Logo upload in photos[`brand_${id}`]; `logo` is a shipped fallback. */
export interface Brand {
  id: string;
  name: string;
  url?: string;
  logo?: string;
}

/** A row on /links — the page behind the Instagram bio link. */
export interface BioLink {
  id: string;
  label: string;
  note?: string;
  href: string;
}

/** One of the signature keynote experiences. */
export interface Keynote {
  id: string;
  category: string;
  title: string;
  blurb: string;
}

export interface MediaKit {
  oneLiner: string;
  shortBio: string;
  longBio: string;
  topics: string[];
  pressEmail: string;
}

export interface SiteContent {
  /** slotId -> uploaded image URL */
  photos: Record<string, string>;
  /** slotId -> YouTube / Vimeo watch URL */
  videos: Record<string, string>;
  /** key -> profile URL (Spotify show, Substack, …) */
  links: Record<string, string>;
  podcast: MediaLink[];
  writings: MediaLink[];
  events: MediaLink[];
  liberate: LiberateHQ;
  stories: Story[];
  talks: Talk[];
  press: PressItem[];
  mediaKit: MediaKit;
  brands: Brand[];
  keynotes: Keynote[];
  /** Words from event organisers and audiences (speaking page). */
  speakingWords: Story[];
  bioLinks: BioLink[];
}

// Real, published client words (libni.co). Libni completes the before / after in the Studio.
export const DEFAULT_STORIES: Story[] = [
  { id: "king-fortuna", name: "King Fortuna", role: "Businessman", program: "Essence Retreat", quote: "I came thinking I was okay. I left realizing I wasn’t. What I found was healing, hope, and a deeper understanding of myself. One of the greatest investments I’ve ever made.", featured: true },
  { id: "pepe-herrera", name: "Pepe Herrera", role: "Actor", program: "Essence Retreat", quote: "I came with the intention to release and remember, and that’s exactly what happened. I let go of the trauma I’d been carrying and reconnected with who I truly am.", featured: true },
  { id: "nadia-montenegro", name: "Nadia Montenegro", role: "Actress · Mother · Businesswoman", program: "Essence Retreat", quote: "Essence created a space of deep connection, safety, and belonging. I discovered a new way of seeing myself and a new way of living.", featured: true },
];

// Libni's full engagement archive (her list, 2019–2026), with the links she gave.
export const DEFAULT_TALKS: Talk[] = [
  // 2026
  { id: "founders-societe-launch-2026", title: "Founders Societe Launch", org: "Founders Societe", date: "2026-07", kind: "other" },
  { id: "manulife-jsuc-2026", title: "Soundhealing × Breath and Meditation", org: "Manulife × Just Show Up Club", date: "2026-07-14", location: "Nada Concepts", kind: "workshop" },
  { id: "sunlife-grepa-2026", title: "Healing Our Inner Child", org: "Sun Life Grepa", date: "2026-07-11", kind: "keynote", url: "https://www.facebook.com/share/p/1CmSukMA91/" },
  { id: "own-the-stage-2026", title: "Own the Stage Workshop — facilitator", org: "Own the Stage", date: "2026-06", kind: "workshop" },
  { id: "womens-fitness-asia-2026", title: "Meditation teacher", org: "Women’s Fitness Asia", date: "2026-06", location: "Makati Shangri-La", kind: "workshop", url: "https://www.instagram.com/p/DZuOWhsGafN/", blurb: "Featured in PhilSTAR" },
  { id: "amare-global-2026", title: "Speaker", org: "Amare Global Philippines", date: "2026-04", kind: "keynote", url: "https://www.facebook.com/share/p/1ERPDg88nk/" },
  { id: "vida-yoga-longevity-labs-2026", title: "Breathwork, meditation and soundbath teacher", org: "Vida Yoga (Rockwell) & Longevity Labs", date: "2026", kind: "workshop" },
  { id: "dove-la-union-2026", title: "Brand activation with KOLs — lead facilitator", org: "Dove Philippines", date: "2026-03", location: "La Union", kind: "workshop", url: "https://www.instagram.com/p/DYURBBNEpaX/" },
  { id: "filipina-women-in-business-2026", title: "Leading them to a Transformational Experience — keynote", org: "Filipina Women in Business", date: "2026-03", kind: "keynote", url: "https://www.facebook.com/share/p/14amn65Se7o/" },
  { id: "filipina-in-business-summit-2026", title: "Speaker", org: "Filipina in Business Summit", date: "2026-03", kind: "summit", url: "https://www.instagram.com/p/DVYAsizEa3j/" },
  { id: "jsuc-wfa-womens-month-2026", title: "Women’s Month — guest speaker", org: "Just Show Up Club × Women’s Fitness Asia", date: "2026-03", kind: "keynote", url: "https://www.facebook.com/share/p/193Bx65ikb/" },
  { id: "floatation-hypnotherapy-2026", title: "One of the biggest floatation + hypnotherapy events in the Philippines — host", org: "Essence", date: "2026-02", kind: "other", url: "https://www.instagram.com/p/DUo6vq8E5QB/", blurb: "Featured by Bilyonaryo News" },
  { id: "vision-board-hypnotherapy-2026", title: "Vision Board and Hypnotherapy Workshop", org: "Bar Flora", date: "2026-01", location: "Makati", kind: "workshop", url: "https://www.instagram.com/p/DTo7NbBkY_1/" },
  { id: "iwts-proscenium-2026", title: "Breathwork + Soundbath", org: "I Want To Share Foundation", date: "2026-01", location: "Proscenium, Makati", kind: "workshop", url: "https://www.instagram.com/p/DT5DjqCFD4R/" },
  // 2025
  { id: "kmc-wellness-retreat-2025", title: "Wellness retreat for employees", org: "KMC Solutions", date: "2025-11-19", kind: "retreat", url: "https://www.instagram.com/p/DRec97dkXzJ/" },
  { id: "mikaya-bali-2025", title: "Bali retreat", org: "Mikaya Talent Agency", date: "2025-10", location: "Bali", kind: "retreat", url: "https://www.instagram.com/p/DQWcJSuj8Bt/" },
  { id: "new-lounge-pamper-reset-2025", title: "Soundbath, breathwork and meditation — Pamper and Reset", org: "New Lounge", date: "2025-09-30", kind: "workshop", url: "https://www.instagram.com/p/DPlLBYRkSJU/" },
  { id: "audacity-retreat-2025", title: "Company retreat", org: "Audacity Marketing Agency", date: "2025-09", kind: "retreat", url: "https://www.instagram.com/p/DO3NH3qkfAt/" },
  { id: "awaken-makati-2025", title: "Awaken — 1-day retreat", org: "Essence", date: "2025-09", location: "Makati", kind: "retreat", url: "https://www.instagram.com/p/DONQIOIkpva/" },
  { id: "urban-retreat-floatation-2025", title: "Urban Retreat — the first floatation soundbath in the Philippines", org: "Essence", date: "2025-08", kind: "other", url: "https://www.instagram.com/p/DM-GearxG3t/", blurb: "Featured by When in Manila" },
  { id: "job-clean-retreat-2025", title: "Company retreat", org: "Job Clean", date: "2025-07-19", kind: "retreat", url: "https://www.instagram.com/p/DMg3UqDRVR5/" },
  { id: "new-lounge-core-retreat-2025", title: "Retreat for core employees", org: "New Lounge", date: "2025-07", kind: "retreat", url: "https://www.instagram.com/p/DMFX_irvgnc/" },
  { id: "grwm-goal-getters-2025", title: "Own Your Why — Goal-Getters Academy Batch 1", org: "GRWM Cosmetics", date: "2025-06", kind: "keynote", url: "https://ph.genz-mag.com/lifestyle/grwm-cosmetics-launches-goal-getters-academy-batch-1-to-power-up-filipino-beauty-creators/", blurb: "Guided creators in anchoring their content journey to a clear purpose · featured in GenZ Magazine and Manila Standard" },
  { id: "awaken-davao-2025", title: "Awaken — 1-day retreat", org: "Essence", date: "2025-05", location: "Davao City", kind: "retreat" },
  { id: "australia-retreat-2025", title: "Men’s, Women’s & Couples’ Retreat", org: "Essence", date: "2025-03", location: "Australia", kind: "retreat" },
  { id: "own-the-stage-2025", title: "Own the Stage — public speaking facilitator", org: "Own the Stage", date: "2025-02", kind: "workshop", blurb: "Guided aspiring speakers through confidence-building, storytelling, and authentic voice techniques" },
  { id: "emerge-batstate-2025", title: "Balancing the Mind: Mental Health and Resilience in Leadership", org: "8th EMERGE · Batangas State University", date: "2025-01-17", kind: "keynote", blurb: "Plenary speaker", url: "https://www.facebook.com/share/p/1BNDjxg8g7/" },
  // 2024
  { id: "true-talks-gsm-blue-2024", title: "True Talks — panelist, Love & Friendship", org: "GSM Blue × Batangas State University", date: "2024-12-06", kind: "panel", blurb: "With Sue Ramirez & Christine Jacob-Sandejas", url: "https://www.facebook.com/100064336673421/posts/1013010594186820/" },
  { id: "lets-make-you-happen-2024", title: "Let’s Make You Happen — workshop speaker", org: "with Chinie Go", date: "2024-09-29", kind: "workshop", blurb: "A day of self-discovery, vulnerability, and healing" },
  { id: "tedx-lanang-2024", title: "Liberation in Safe Spaces", org: "TEDxLanang Ave", date: "2024-08-21", kind: "keynote", url: "https://www.youtube.com/watch?v=IOoemi9qO9g", blurb: "The Philippines’ largest TEDx event — on creating emotional freedom and safe spaces through inner liberation" },
  { id: "bez-events-2024", title: "Corporate talk — guest speaker", org: "BEZ Events", date: "2024-01-14", kind: "keynote", url: "https://www.facebook.com/share/p/1ANUZB1GCw/" },
  { id: "clinica-isaguirre-2024", title: "Mental Health Seminar", org: "Clinica Isaguirre", date: "2024-01-11", kind: "keynote", url: "https://www.facebook.com/share/1HdaRrXtUf/" },
  // 2020–2023
  { id: "jci-davao-2023", title: "Stress Management During High-Pressure Seasons", org: "JCI Davao · 6th General Membership Meeting", date: "2023-06-29", kind: "keynote", url: "https://www.facebook.com/photo?fbid=10223876725209766&set=a.10222500140876018" },
  { id: "new-rich-academy-2023", title: "Coached 300+ students — confidence and agency systems for aspiring entrepreneurs", org: "The New Rich Academy", date: "2021–2023", kind: "other" },
  { id: "quick-pro-academy-2023", title: "Host & speaker — social media visibility & confidence training for new freelancers", org: "Quick Pro Academy", date: "2021–2023", kind: "other" },
  { id: "masterclass-chinkee-tan-2022", title: "Masterclass with Chinkee Tan, The Present & Fibo Lim — collaborator", org: "Masterclass", date: "2022-06-24", kind: "other", url: "https://www.facebook.com/share/p/18Kt4etmcp/" },
  { id: "ellen-adarna-2021", title: "Podcast host — interviewed Ellen Adarna on self-discovery", org: "Anyway, Moving Forward", date: "2021", kind: "other" },
  { id: "libni-talks-kumu-2020", title: "Creator & host — Libni Talks", org: "KUMU Live", date: "2020", kind: "other" },
  { id: "rise-on-socials-2020", title: "Founder", org: "Rise On Socials Academy", date: "2020", kind: "other" },
];

// Where she has been featured — TV, podcasts, print. Links are the ones in her portfolio.
export const DEFAULT_PRESS: PressItem[] = [
  { id: "tedx-from-surviving-to-thriving", title: "From Surviving to Thriving: The Power of Belief, Courage, and Safe Spaces", outlet: "TEDx Talks", url: "https://www.youtube.com/watch?v=IOoemi9qO9g", date: "2024-08", kind: "video" },
  { id: "bilyonaryo-healing-from-within", title: "Healing from within: Libni Fortuna-Amatong on emotional wellness & self-expression", outlet: "Bilyonaryo News Channel · The Daily Dish", date: "2026-06", kind: "tv" },
  { id: "kada-umaga-aug-2026", title: "Dealing with Relationships", outlet: "Kada Umaga · NET25", date: "2026-08-04", kind: "tv" },
  { id: "kada-umaga-couple-fights", title: "Dealing with Relationships — The Hidden Reasons Behind Couple Fights", outlet: "Kada Umaga · NET25", date: "2026-07-15", kind: "tv", url: "https://www.youtube.com/watch?v=jStgyIMn4qo" },
  { id: "bilyonaryo-floatation-feature", title: "Hosting one of the biggest floatation + hypnotherapy events in the Philippines", outlet: "Bilyonaryo News", date: "2026-02", kind: "video", url: "https://www.facebook.com/reel/1986596568593060" },
  { id: "abante-negatron-2023", title: "Negatron No More! with Marc Logan", outlet: "Abante Tabloid", date: "2023-12-20", kind: "tv", url: "https://www.facebook.com/share/p/1CAz55VUvh/" },
  { id: "rise-and-shine-pilipinas", title: "Guest speaker", outlet: "Rise and Shine Pilipinas", date: "2026-05", kind: "tv", url: "https://www.facebook.com/share/p/1CvuJp4Xa3/" },
  { id: "rise-and-shine-mental-health", title: "Kahalagahan ng Mental Health sa mga Kabataan", outlet: "Rise and Shine Pilipinas", date: "2025-11", kind: "tv", url: "https://www.facebook.com/reel/1252468653308226" },
  { id: "teletabloid", title: "Guest", outlet: "Teletabloid", kind: "tv" },
  { id: "bare-it-all-live-2026", title: "Bare It All Live", outlet: "The Bare It All Podcast with Dani Barretto", date: "2026-06", kind: "podcast" },
  { id: "bare-it-all-ep83", title: "EP 83: There is Life Beyond Survival Mode", outlet: "The Bare It All Podcast with Dani Barretto", date: "2026-01", kind: "podcast", url: "https://open.spotify.com/episode/2hb4pXdXa9qyIoU8mjt9nb" },
  { id: "break-down-strong-one", title: "Are You The Strong One?", outlet: "The Break Down Podcast", date: "2026-06", kind: "podcast", url: "https://www.youtube.com/watch?v=yMbSktsN2_Q" },
  { id: "behind-the-scenes-ynna", title: "Healing, Identity, and the Work of Transformation", outlet: "Behind the Scenes with Ynna", date: "2026-01", kind: "podcast", url: "https://www.youtube.com/watch?v=F-vKgp3SpU4" },
  { id: "press-play-new-beginnings", title: "New Beginnings & Moving Forward", outlet: "Press Play Podcast", kind: "podcast" },
  { id: "life-over-whiskey-stop-saving", title: "Stop saving people… na nakaka drain", outlet: "Life Over Whiskey", date: "2024-10", kind: "podcast", url: "https://www.youtube.com/watch?v=8nM3EDqm2w8" },
  { id: "zac-alviz-childhood-traumas", title: "How can we heal our childhood traumas?", outlet: "Zac Alviz", kind: "video" },
  { id: "dxfe-patok-sa-negosyo", title: "Patok sa Negosyo — young entrepreneur and single mom", outlet: "DXFE", date: "2020-02-03", kind: "tv", url: "https://www.facebook.com/share/16KkEYuT6m/" },
  { id: "byaheng-du30-asenso", title: "Byaheng Asenso with Libni Fortuna", outlet: "Byaheng Du30", date: "2019-04-02", kind: "tv", url: "https://www.facebook.com/share/v/1XpJVevHJq/" },
  { id: "vogue-hypnotherapy-sound-bath", title: "How Hypnotherapy and Sound Bath Connect You With Your Inner Child", outlet: "Vogue Philippines", url: "https://vogue.ph/beauty/wellness/how-do-hypnotherapy-and-sound-bath-work/", kind: "article" },
  { id: "vogue-editor-sound-bath", title: "A Vogue editor’s sound bath session", outlet: "Vogue Philippines", url: "https://vogue.ph/beauty/wellness/vogue-editor-sound-bath-session-pet/", kind: "article" },
  { id: "mb-resisting-labels", title: "One mother’s story about resisting labels", outlet: "Manila Bulletin", url: "https://mb.com.ph/2026/07/07/one-mothers-story-about-resisting-labels-and-creating-a-home-where-questions-are-always-welcome", date: "2026-07-07", kind: "article" },
  { id: "mb-emotional-safety", title: "How parents nurture trust and emotional safety at home", outlet: "Manila Bulletin", url: "https://mb.com.ph/2025/09/06/how-parents-nurture-trust-and-emotional-safety-at-home", date: "2025-09-06", kind: "article" },
  { id: "bilyonaryo-face-their-shadows", title: "“Not everybody is ready to face their shadows”", outlet: "Bilyonaryo", url: "https://bnc.bilyonaryo.com/not-everybody-is-ready-to-face-their-shadows-fortuna-amatong-warns-that-true-healing-requires-confronting-inner-skeletons/lifestyle-entertainment/", date: "2026-06-23", kind: "article" },
  { id: "bilyonaryo-depression-expression", title: "“The opposite of depression is expression”", outlet: "Bilyonaryo", url: "https://bnc.bilyonaryo.com/the-opposite-of-depression-is-expression-wellness-advocate-libni-fortuna-amatong-urges-people-to-reconnect-with-themselves/lifestyle-entertainment/", kind: "article" },
  { id: "bilyonaryo-people-pleasing", title: "“People-pleasing is actually a normal thing” — why adults struggle to be themselves", outlet: "Bilyonaryo", url: "https://bnc.bilyonaryo.com/people-pleasing-is-actually-a-normal-thing-fortuna-amatong-explains-why-adults-struggle-to-be-themselves/lifestyle-entertainment/", date: "2026-06", kind: "article" },
  { id: "philstar-awr-asia-lotus", title: "Over 400 women join AWR Asia Lotus Wellness Retreat & Switchplay Yoga", outlet: "PhilSTAR", url: "https://www.philstar.com/lifestyle/on-the-radar/2026/06/19/2536363/over-400-women-join-awr-asia-lotus-wellness-retreat-switchplay-yoga", date: "2026-06-19", kind: "article" },
  { id: "preview-sound-baths-manila", title: "Feeling Overstimulated? Here’s Where You Can Experience Sound Baths in Manila", outlet: "Preview", url: "https://www.preview.ph/culture/sound-baths-explainer-a8071-20260302-dyn", date: "2026-03-02", kind: "article" },
  { id: "when-in-manila-floatation", title: "Urban retreat: the ultimate self-care reset — first floatation soundbath in the Philippines", outlet: "When in Manila", url: "https://www.wheninmanila.com/urban-retreat-ultimate-self-care-reset/", date: "2025-08", kind: "article" },
  { id: "genz-mag-goal-getters", title: "GRWM Cosmetics launches Goal-Getters Academy Batch 1 to power up Filipino beauty creators", outlet: "GenZ Magazine", url: "https://ph.genz-mag.com/lifestyle/grwm-cosmetics-launches-goal-getters-academy-batch-1-to-power-up-filipino-beauty-creators/", date: "2025-06", kind: "article" },
  { id: "manila-standard-influencers", title: "Training the next generations of Filipino influencers — “Own Your Why”", outlet: "Manila Standard", url: "https://manilastandard.net/community-spotlight/314595441/training-the-next-generations-of-filipino-influencers.html", date: "2025-06", kind: "article" },
];

// Organisations, brands and outlets from the portfolio. Logos already shipped in /public/logos.
const BRAND_LOGOS: [string, string][] = [
  ["tedx", "TEDx"], ["vogue", "Vogue Philippines"], ["preview", "Preview"], ["manila-bulletin", "Manila Bulletin"], ["bilyonaryo", "Bilyonaryo News Channel"], ["dove", "Dove Philippines"],
  ["sun-life", "Sun Life"], ["sun-life-grepa", "Sun Life Grepa"], ["manulife", "Manulife"], ["net25", "NET25"], ["kmc", "KMC Solutions"], ["jci", "JCI Philippines"], ["gsm-blue", "GSM Blue"],
  ["grwm", "GRWM Cosmetics"], ["rise-and-shine", "Rise & Shine Pilipinas"], ["when-in-manila", "When in Manila"], ["sunstar", "SunStar"], ["abante", "Abante"], ["awr-asia", "AWR Asia"], ["rptv", "RPTV"],
  ["bare-it-all", "The Bare It All Podcast"], ["life-over-whiskey", "Life Over Whiskey"], ["iwts", "IWTS Foundation"], ["batangas-state", "Batangas State University"], ["filipina-summit", "Filipina in Business Summit"], ["new-lounge", "New Lounge"],
];
export const DEFAULT_BRANDS: Brand[] = [
  ...BRAND_LOGOS.map(([id, name]) => ({ id, name, logo: `/logos/${id}.png` })),
  { id: "womens-fitness-asia", name: "Women’s Fitness Asia" }, { id: "amare-global", name: "Amare Global" }, { id: "philstar", name: "PhilSTAR" }, { id: "kada-umaga", name: "Kada Umaga" },
  { id: "vida-yoga", name: "Vida Yoga" }, { id: "longevity-labs", name: "Longevity Labs" }, { id: "teletabloid", name: "Teletabloid" }, { id: "mikaya", name: "Mikaya Talent Agency" }, { id: "audacity", name: "Audacity Marketing Agency" },
];

// The link-in-bio page, in the order Libni asked for.
export const DEFAULT_BIO_LINKS: BioLink[] = [
  { id: "mentorship", label: "Apply for 1:1 mentorship", note: "The Becoming · 12 weeks, just us", href: "/apply/the-becoming" },
  { id: "programs", label: "Join a program", note: "Liberate, retreats, workshops", href: "/work-with-me" },
  { id: "power-hour", label: "Book a Power Hour", note: "90 minutes to move what’s stuck", href: "/programs/ignite" },
  { id: "speaker", label: "Get me as your speaker", note: "Keynotes, workshops, retreats", href: "/speaking" },
  { id: "newsletter", label: "Subscribe to my newsletter", note: "Letters, practices, a free guide", href: "/resources" },
  { id: "brands", label: "Brand collabs & PR kit", note: "Partnerships, activations, the media kit", href: "/programs/brands" },
  { id: "substack", label: "Substack", note: "Longer write-ups", href: "https://libnifortuna.substack.com" },
  { id: "podcast", label: "The podcast", note: "Anyway, Moving Forward", href: "/podcast" },
];

// The nine signature keynote experiences, as written in the portfolio.
export const DEFAULT_KEYNOTES: Keynote[] = [
  { id: "safe-spaces", category: "Culture & psychological safety", title: "Safe Spaces", blurb: "Creating cultures where people feel safe enough to thrive. Explores psychological safety, trust, communication, and building cultures where people feel empowered to contribute and grow." },
  { id: "burnout-to-brilliance", category: "Sustainable high performance", title: "Burnout to Brilliance", blurb: "Sustainable high performance without sacrificing yourself. Helps leaders and teams understand stress, nervous system regulation, resilience, and boundaries." },
  { id: "endings-create-beginnings", category: "Change & transition", title: "Endings Create Beginnings", blurb: "Helping people navigate career transitions with humanity. Designed for organisations navigating restructuring, promotions, retirement, and leadership succession." },
  { id: "eq-for-modern-leaders", category: "Leadership", title: "Emotional Intelligence for Modern Leaders", blurb: "Leading people before leading performance. Practical leadership strategies built on trust, empathy, communication, and self-awareness." },
  { id: "power-of-the-subconscious-mind", category: "Behavioural change", title: "The Power of the Subconscious Mind", blurb: "Understanding why we keep repeating the same patterns. Explores how subconscious beliefs influence leadership, confidence, and decision-making." },
  { id: "opposite-of-depression", category: "Emotional wellbeing", title: "The Opposite of Depression is Expression", blurb: "Emotional awareness, connection & wellbeing. Helping people reconnect with themselves through emotional expression and authentic communication." },
  { id: "confidence-beyond-achievement", category: "Self-worth", title: "Confidence Beyond Achievement", blurb: "Building self-worth that doesn’t depend on performance. Helping professionals overcome perfectionism, imposter syndrome, and people-pleasing." },
  { id: "own-your-voice", category: "Communication", title: "Own Your Voice", blurb: "Communicating with confidence and authenticity. For professionals, leaders, founders, and teams who want greater clarity, influence, and confidence." },
  { id: "human-behind-the-business", category: "Founders & entrepreneurs", title: "The Human Behind the Business", blurb: "Leading with humanity in a high-performance world. Exploring how emotionally healthy people build sustainable organisations." },
];

// The speaker bio from Libni's portfolio, verbatim.
export const DEFAULT_MEDIA_KIT: MediaKit = {
  oneLiner: "TEDx Speaker · Transformational Keynote Speaker · Founder, Essence Retreat Philippines · Organisational Experience Designer",
  shortBio: "Libni Fortuna is a TEDx Speaker, entrepreneur, podcast host, transformational mentor, and founder of The Safe Space PH and the Essence Community, where she has guided over 1,000 individuals across the Philippines and internationally through transformational retreats, keynote experiences, corporate workshops, and private mentorships. Recognized as one of the Philippines’ emerging voices in subconscious transformation, nervous system regulation, and emotional resilience, Libni combines science-backed modalities with deeply human experiences to create lasting change. She is the creator and host of the Anyway, Moving Forward with Libni podcast.",
  longBio: "Libni Fortuna is a TEDx Speaker, entrepreneur, podcast host, transformational mentor, and founder of The Safe Space PH and the Essence Community, where she has guided over 1,000 individuals across the Philippines and internationally through transformational retreats, keynote experiences, corporate workshops, and private mentorships.\n\nRecognized as one of the Philippines’ emerging voices in subconscious transformation, nervous system regulation, and emotional resilience, Libni combines science-backed modalities with deeply human experiences to create lasting change.\n\nAs a U.S.-Certified Master Practitioner of Neuro-Linguistic Programming (NLP) and Certified Hypnotherapist, her work integrates neuroscience, psychology, subconscious reprogramming, breathwork, meditation, somatic practices, sound healing, and energy work to help individuals move beyond limiting beliefs and into authentic leadership.\n\nCommitted to lifelong learning, Libni continues to train with internationally respected facilitators and practitioners across Australia and the Philippines. Her studies span breathwork, meditation, nervous system regulation, trauma-informed facilitation, hypnotherapy, sound healing, quantum healing, Reiki, and transformational coaching, reflecting her belief that the most impactful facilitators are those who never stop learning themselves.\n\nHer work has been featured in Vogue Philippines, Manila Bulletin, Bilyonaryo, PhilSTAR, NET25, Rise & Shine Pilipinas, and other national media platforms. She has partnered with organizations including Sun Life Grepa, Dove Philippines, Manulife, Women’s Fitness Asia, Amare Global, KMC Solutions, Vida Yoga, Longevity Labs, and many more to deliver experiences that inspire deeper connection, stronger leadership, and lasting personal transformation.\n\nBeyond the stage, Libni is the creator and host of the Anyway, Moving Forward with Libni podcast, where she sits down with entrepreneurs, psychologists, founders, creatives, and thought leaders to explore healing, leadership, entrepreneurship, relationships, and the inner work that shapes meaningful success.\n\nWhether speaking to executives, founders, educators, students, or communities, Libni doesn’t simply deliver talks. She creates immersive experiences that invite people to reflect, reconnect, and transform. Her sessions combine compelling storytelling, practical psychology, experiential exercises, guided meditation, breathwork, and subconscious techniques that move audiences from insight into embodiment. Because lasting transformation doesn’t happen by changing what people do. It happens by changing who they believe they are.",
  topics: DEFAULT_KEYNOTES.map((k) => k.title),
  pressEmail: "hello@libni.co",
};

const ROADMAP: [string, string][] = [
  ["Awareness", "See your patterns."], ["The root", "Understand where they came from."], ["Identity", "Question the identities built around old beliefs."], ["The body", "Listen to what your body has been communicating."],
  ["Emotions", "Feel what you’ve learned to suppress."], ["Subconscious", "Work beneath conscious understanding."], ["Self-trust", "Reconnect with your own voice."], ["Boundaries", "Choose yourself without guilt."],
  ["Repatterning", "Practice a new way of being."], ["Nervous system", "Create more capacity for safety, receiving, and expression."], ["Integration", "Bring the work into real life."], ["Liberation", "Step into greater freedom and choice."],
];

export const DEFAULT_LIBERATE: LiberateHQ = {
  cohortLabel: "October 2026 cohort",
  accessCode: "",
  welcome: "Welcome home. Everything for our twelve weeks together lives here — the roadmap, each week’s session, the replays, and the practices in between. Take what you need, when you need it.",
  weeks: ROADMAP.map(([title, theme], i) => ({ n: i + 1, title, theme, resources: [] })),
};

export const EMPTY_CONTENT: SiteContent = {
  photos: {}, videos: {}, links: {}, podcast: [], writings: [], events: [], liberate: DEFAULT_LIBERATE,
  stories: DEFAULT_STORIES, talks: DEFAULT_TALKS, press: DEFAULT_PRESS, mediaKit: DEFAULT_MEDIA_KIT,
  brands: DEFAULT_BRANDS, keynotes: DEFAULT_KEYNOTES, speakingWords: [], bioLinks: DEFAULT_BIO_LINKS,
};

function normalise(raw: Partial<SiteContent> | null | undefined): SiteContent {
  const lib = { ...DEFAULT_LIBERATE, ...(raw?.liberate ?? {}) };
  if (!Array.isArray(lib.weeks) || lib.weeks.length !== 12) lib.weeks = DEFAULT_LIBERATE.weeks;
  const mk = { ...DEFAULT_MEDIA_KIT, ...(raw?.mediaKit ?? {}) };
  if (!Array.isArray(mk.topics)) mk.topics = DEFAULT_MEDIA_KIT.topics;
  return {
    photos: raw?.photos ?? {},
    videos: raw?.videos ?? {},
    links: raw?.links ?? {},
    podcast: raw?.podcast ?? [],
    writings: raw?.writings ?? [],
    events: raw?.events ?? [],
    liberate: lib,
    // Undefined = never edited → the real defaults. An empty array = she cleared it on purpose.
    stories: Array.isArray(raw?.stories) ? raw!.stories : DEFAULT_STORIES,
    talks: Array.isArray(raw?.talks) ? raw!.talks : DEFAULT_TALKS,
    press: Array.isArray(raw?.press) ? raw!.press : DEFAULT_PRESS,
    mediaKit: mk,
    brands: Array.isArray(raw?.brands) ? raw!.brands : DEFAULT_BRANDS,
    keynotes: Array.isArray(raw?.keynotes) ? raw!.keynotes : DEFAULT_KEYNOTES,
    speakingWords: Array.isArray(raw?.speakingWords) ? raw!.speakingWords : [],
    bioLinks: Array.isArray(raw?.bioLinks) ? raw!.bioLinks : DEFAULT_BIO_LINKS,
  };
}

/** A brand's logo: her upload, else the shipped file, else nothing (the name renders as a wordmark). */
export function brandLogo(photos: Record<string, string>, b: Brand): string | undefined {
  return photos[`brand_${b.id}`] || b.logo;
}

/** The photo for a story: her upload, else the older word_* slot, else nothing. */
export function storyPhoto(photos: Record<string, string>, id: string): string | undefined {
  return photos[`story_${id}`] || photos[`word_${id.replace(/-/g, "_")}`];
}

/** Sort talks/press newest first; items without a date go last. */
export function byDateDesc<T extends { date?: string }>(a: T, b: T): number {
  return (b.date ?? "").localeCompare(a.date ?? "");
}

/** "2024", "2026-10" or "2026-10-07" → something readable. Anything else ("2021–2023") shows as typed. */
export function fmtWhen(d?: string): string {
  if (!d) return "";
  if (!/^\d{4}(-\d{2}){0,2}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  if (!m) return y;
  const dt = new Date(Number(y), Number(m) - 1, Number(day ?? 1));
  return dt.toLocaleDateString("en-PH", day ? { month: "short", day: "numeric", year: "numeric" } : { month: "long", year: "numeric" });
}

/** A dated item is upcoming if its date (day, month or year granularity) hasn't fully passed. */
export function isUpcoming(d?: string): boolean {
  if (!d) return false;
  if (!/^\d{4}(-\d{2}){0,2}$/.test(d)) return Number(d.slice(0, 4)) > new Date().getFullYear();
  const [y, m, day] = d.split("-").map(Number);
  if (!m) return y > new Date().getFullYear(); // a bare year is "upcoming" only if it's a future year
  const end = day ? new Date(y, m - 1, day, 23, 59) : new Date(y, m, 0, 23, 59);
  return end.getTime() >= Date.now();
}

const FILE = path.join(process.cwd(), "data", "content.json");

async function fileReadRaw(): Promise<Partial<SiteContent>> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}
async function fileWrite(c: Partial<SiteContent>): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(c, null, 2), "utf8");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// firebase-admin is an OPTIONAL production dependency; the variable specifiers
// keep both the bundler and TypeScript from resolving it at build time.
async function firestoreDoc(): Promise<any> {
  const appPkg = "firebase-admin/app";
  const fsPkg = "firebase-admin/firestore";
  const appMod: any = await import(/* webpackIgnore: true */ appPkg);
  const fsMod: any = await import(/* webpackIgnore: true */ fsPkg);
  const { getApps, initializeApp, cert } = appMod;
  const { getFirestore } = fsMod;
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    const credential = raw ? cert(raw.trim().startsWith("{") ? JSON.parse(raw) : raw) : undefined;
    initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID });
    // Optional fields left blank in the Studio arrive as undefined, which Firestore rejects by default.
    getFirestore().settings({ ignoreUndefinedProperties: true });
  }
  return getFirestore().collection("lf_content").doc("site");
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const useFirestore = () => process.env.ORDER_STORE === "firestore";

/** What is actually stored — only the sections Libni has edited. Everything else follows the code defaults. */
async function getRaw(): Promise<Partial<SiteContent>> {
  if (!useFirestore()) return fileReadRaw();
  try {
    const snap = await (await firestoreDoc()).get();
    return snap.exists ? (snap.data() as Partial<SiteContent>) : {};
  } catch (err) {
    console.error("getContent:", err);
    return {};
  }
}

export async function getContent(): Promise<SiteContent> {
  return normalise(await getRaw());
}

/** Persist just the edited keys on top of what was stored, so untouched sections keep tracking the defaults in this file. */
export async function saveContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  const next = { ...(await getRaw()), ...patch };
  if (useFirestore()) await (await firestoreDoc()).set(next);
  else await fileWrite(next);
  return normalise(next);
}

/** Set (or clear, with null) one photo slot. */
export async function setPhoto(slotId: string, url: string | null): Promise<SiteContent> {
  const c = await getContent();
  if (url) c.photos[slotId] = url;
  else delete c.photos[slotId];
  return saveContent({ photos: c.photos });
}

/** Set (or clear) one video slot. */
export async function setVideo(slotId: string, url: string | null): Promise<SiteContent> {
  const c = await getContent();
  if (url) c.videos[slotId] = url;
  else delete c.videos[slotId];
  return saveContent({ videos: c.videos });
}

/** Set (or clear) one named link, e.g. the Spotify show or Substack. */
export async function setLink(key: string, url: string | null): Promise<SiteContent> {
  const c = await getContent();
  if (url) c.links[key] = url;
  else delete c.links[key];
  return saveContent({ links: c.links });
}
