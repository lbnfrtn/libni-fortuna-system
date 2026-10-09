import type { Track } from "@/lib/types";
import { getOffer } from "@/config/offers";

// ============================================================================
// Form question sets. Each offer's form is built from its journey + track.
// Answers are kept in the lead log and shown only in the admin (they can be emotional/health-sensitive).
// ============================================================================

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "email" | "tel" | "select" | "number" | "multi";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  /** For a select: choosing this option shows `detour` instead of the rest of the form. */
  detourOn?: string;
  /** `hard`: the detour replaces the rest of the form — no application is sent. */
  detour?: { text: string; cta: string; href: string; hard?: boolean };
  /** For a select with several branches: each option that routes somewhere gets its own note + CTA. */
  routes?: { on: string; text: string; cta: string; href: string; hard?: boolean }[];
}

/** The answer that sends a Becoming applicant to the Power Hour first. */
export const POWER_HOUR_FIRST = "I'd like to start with a Power Hour first";

// The Becoming investment filter (mirrors Libni's Tally). Each answer routes to the right path.
export const BECOMING_INVEST = {
  mentorship: "Yes — I'm ready to invest in 1:1 mentorship (₱250,000, in full or a plan)",
  group: "I'm drawn to group coaching — Liberate (₱50,000–₱70,000)",
  retreat: "I'd love a retreat experience (₱50,000–₱70,000)",
  powerHour: "I'd like to start with a Power Hour first (₱5,555)",
  workshops: "I'm exploring the monthly Workshops (₱999/month)",
  moreInfo: "I'm committed, but I need more details first",
  notReady: "I'm not ready to invest right now",
} as const;

// What they'd most like to work on — Libni's own list from the Tally application.
export const BECOMING_FOCUS = [
  "Inner-child healing & trauma",
  "Self-confidence & self-love",
  "Love & relationships",
  "Business & career growth",
  "Emotional mastery & healing",
  "Spiritual growth & alignment",
  "Stepping into your highest self",
  "Breaking through limitation",
  "Building an abundance mindset",
  "A life of freedom & fulfilment",
  "Releasing old patterns & beliefs",
];

// How ready they are to do the work — Libni's own three options from the Tally application.
export const BECOMING_COMMITMENT = [
  "I'm 110% ready — I'm done being stuck, give me everything",
  "I want to be ready, but I'm not sure I have time for something intense",
  "I'm a little intimidated, but I really want this, so I'll do my best",
];

/** The honest "not right now" on the Liberate call application — it ends the form kindly instead of booking a call. */
export const LIBERATE_NOT_NOW = "Not right now";

/** How someone joins Liberate from the join page. The two paying answers create the order on the spot. */
export const LIBERATE_JOIN = {
  full: "Pay in full now",
  plan: "Three monthly payments",
  call: "I'd like to talk first",
} as const;

/** Which plan a self-pay application asks for; null when they want a call first (or the offer doesn't self-pay). */
export function selfPayPlan(offerSlug: string, answers?: Record<string, string>): "full" | "instalment" | null {
  if (offerSlug !== "liberate") return null;
  if (answers?.join === LIBERATE_JOIN.full) return "full";
  if (answers?.join === LIBERATE_JOIN.plan) return "instalment";
  return null;
}

// What people bring to the work. Ticked answers are stored as one comma-separated line.
export const FOCUS_AREAS = [
  "Trauma & the past",
  "Relationships",
  "Self-worth & confidence",
  "Anxiety & the nervous system",
  "Grief & loss",
  "Inner child",
  "Boundaries & people-pleasing",
  "Purpose & direction",
  "Career, business & leadership",
  "Body & health",
  "Something else",
];

// Shared "how did you find me" — always asked, feeds source tracking.
const SOURCE_Q: Question = {
  id: "how_found",
  label: "How did you find me?",
  type: "select",
  options: ["Instagram", "A friend / referral", "A podcast or talk", "Google", "A workshop or event", "Somewhere else"],
};

// Track A (Pay -> Book): light. We mostly just need who they are.
const TRACK_A: Question[] = [
  { id: "intention", label: "In a sentence — what's drawing you to this right now?", type: "textarea", placeholder: "However it comes out is fine." },
  SOURCE_Q,
];

// Track B (Apply -> Call): deeper. This is an application, not a checkout.
const TRACK_B: Question[] = [
  { id: "where_now", label: "Where are you right now — in your life, your work, yourself?", type: "textarea", required: true },
  { id: "what_shift", label: "What would you love to be different by the end of our work together?", type: "textarea", required: true },
  { id: "support_level", label: "How much support are you looking for?", type: "select", options: ["A focused reset", "Steady guidance over weeks", "Deep, ongoing 1:1 work"] },
  { id: "why_now", label: "Why now?", type: "textarea" },
  { id: "readiness", label: "Is there anything I should know about your capacity to invest — time or money — in this?", type: "textarea" },
  SOURCE_Q,
];

// The Becoming: Libni's own application. WhatsApp is required (she calls), and the
// investment question is the filter — the price is asked here and nowhere on the site.
const BECOMING_Q: Question[] = [
  { id: "instagram", label: "Your Instagram / Facebook", type: "text", placeholder: "@yourname", required: true },
  { id: "location", label: "Where are you based?", type: "text", placeholder: "City, country", required: true },
  { id: "about_you", label: "Tell me a little about you.", type: "textarea", placeholder: "What you do, your work and rhythms, what's full right now — family, study, career, relationships, your relationship with money.", required: true },
  { id: "where_now", label: "What's happening for you right now, and what support are you needing?", type: "textarea", required: true },
  { id: "focus", label: "What would you most like to work on? Tick everything that's true.", type: "multi", options: BECOMING_FOCUS, required: true },
  { id: "goals", label: "What are your biggest goals for the next 3–6 months?", type: "textarea", placeholder: "Dream big — this is your space.", required: true },
  { id: "hurdle", label: "What's the biggest hurdle or obstacle you're trying to overcome?", type: "textarea", required: true },
  { id: "prior_coaching", label: "Have you worked with a coach or mentor before?", type: "textarea", placeholder: "A little about what that was like, if so.", required: true },
  { id: "commitment", label: "How committed are you to putting in the work?", type: "select", required: true, options: BECOMING_COMMITMENT },
  {
    id: "investment",
    label: "Which best describes the investment you're ready to make right now?",
    type: "select",
    required: true,
    options: [
      BECOMING_INVEST.mentorship,
      BECOMING_INVEST.group,
      BECOMING_INVEST.retreat,
      BECOMING_INVEST.powerHour,
      BECOMING_INVEST.workshops,
      BECOMING_INVEST.moreInfo,
      BECOMING_INVEST.notReady,
    ],
    routes: [
      { on: BECOMING_INVEST.group, text: "Beautiful — that sounds like Liberate: the same depth, held in a small circle. Have a look, and still send this through if you'd like me to reach out.", cta: "Explore Liberate", href: "/liberate" },
      { on: BECOMING_INVEST.retreat, text: "Then a retreat may be your doorway — four days to come all the way home. Have a look, and still send this through if you'd like me to reach out.", cta: "Explore the retreat", href: "/programs/essence-retreat" },
      { on: BECOMING_INVEST.powerHour, text: "A beautiful place to start. The Power Hour is ninety minutes, just us — you'll leave clearer, and we'll both know whether The Becoming is next.", cta: "See the Power Hour", href: "/programs/ignite" },
      { on: BECOMING_INVEST.workshops, text: "Lovely — the monthly Workshops are ongoing support for ₱999 a month: live workshops, webinars and journaling prompts. Have a look, and still send this through if you'd like.", cta: "Explore the Workshops", href: "/workshops" },
      { on: BECOMING_INVEST.notReady, text: "Thank you for your honesty — that matters more than a yes. The door stays open. Let me send you my letters and a free guide in the meantime.", cta: "Join my newsletter", href: "/resources" },
    ],
  },
  { id: "call_time", label: "When is the best time for me to call you on WhatsApp?", type: "select", required: true, options: ["Morning (8–11 am)", "Midday (11 am–2 pm)", "Afternoon (2–5 pm)", "Evening (5–8 pm)"] },
  SOURCE_Q,
];

// Liberate's "talk to me first" application. Paying happens on /liberate/join; this
// form is for a call — and only if the investment is within reach (Libni's rule).
function liberateQuestions(): Question[] {
  const offer = getOffer("liberate");
  const price = offer?.pricePHP ?? 0;
  const count = offer?.instalmentCount ?? 3;
  const peso = (n: number) => `₱${Math.floor(n).toLocaleString("en-PH")}`;
  return [
    { id: "where_now", label: "Where are you right now — in your life, your work, yourself?", type: "textarea", required: true },
    { id: "what_shift", label: "What would you love to be different by the end of our three months together?", type: "textarea", required: true },
    {
      id: "investment",
      label: `Liberate is ${peso(price)} — in full, or ${count} monthly payments of about ${peso(price / count)}. Is this within reach for you right now?`,
      type: "select",
      required: true,
      options: ["Yes — I'm ready to invest", "Yes — with a payment plan", LIBERATE_NOT_NOW],
      detourOn: LIBERATE_NOT_NOW,
      detour: {
        hard: true,
        text: "Thank you for your honesty — that matters more than a yes. Liberate asks for a real investment, and I'd rather you come when it's within reach than stretch for it. The door stays open. If you'd like a smaller first step, the Power Hour is ninety minutes, just us.",
        cta: "See the Power Hour",
        href: "/programs/ignite",
      },
    },
    { id: "questions", label: "What would you like to talk through on the call?", type: "textarea", placeholder: "Anything you're unsure about — the pace, the payment plan, whether it's the right space for you." },
    { id: "call_time", label: "When is the best time for me to call you on WhatsApp?", type: "select", options: ["Morning (8–11 am)", "Midday (11 am–2 pm)", "Afternoon (2–5 pm)", "Evening (5–8 pm)"] },
    SOURCE_Q,
  ];
}

// Track C (Retreat): application + a gentle health/consent note.
const TRACK_C: Question[] = [
  { id: "where_now", label: "What's calling you to this retreat?", type: "textarea", required: true },
  { id: "experience", label: "Have you done retreat / breathwork / somatic work before?", type: "textarea" },
  { id: "health_note", label: "Anything about your health, body or emotional life I should be aware of to hold you well?", type: "textarea", placeholder: "This stays private. Only for your care." },
  { id: "dates_ok", label: "Do the dates work for you, or are you joining the waitlist for a future one?", type: "select", options: ["These dates work", "Waitlist me for a future retreat"] },
  SOURCE_Q,
];

// Track D — Corporate / Speaking.
const TRACK_D_CORP: Question[] = [
  { id: "organization", label: "Your organization", type: "text", required: true },
  { id: "objective", label: "What are you hoping this creates for your people?", type: "textarea", required: true },
  { id: "event_date", label: "Date(s) you have in mind", type: "text" },
  { id: "headcount", label: "Roughly how many people?", type: "number" },
  { id: "budget", label: "Do you have a budget range in mind?", type: "text" },
  { id: "format", label: "In person, online, or a retreat?", type: "select", options: ["In person", "Online", "Retreat / offsite", "Not sure yet"] },
  SOURCE_Q,
];

// Track D — Brands.
const TRACK_D_BRAND: Question[] = [
  { id: "brand", label: "Brand / company", type: "text", required: true },
  { id: "deliverables", label: "What are you looking for? (deliverables)", type: "textarea", required: true },
  { id: "timeline", label: "Timeline", type: "text" },
  { id: "usage_rights", label: "Usage rights you'd need", type: "textarea" },
  { id: "budget", label: "Budget range", type: "text" },
  SOURCE_Q,
];

export interface PhoneField { label: string; required: boolean }

export function questionsFor(offerSlug: string): { track: Track; heading: string; sub: string; questions: Question[]; phone?: PhoneField } {
  const offer = getOffer(offerSlug);
  if (!offer) return { track: "consumer", heading: "Get in touch", sub: "", questions: TRACK_A };

  if (offerSlug === "the-becoming")
    return {
      track: "consumer", heading: `Apply — ${offer.name}`,
      sub: "This is an application, not a checkout. Take your time — your answers shape our first conversation, and I will call you on WhatsApp.",
      questions: BECOMING_Q, phone: { label: "WhatsApp number", required: true },
    };

  if (offerSlug === "liberate")
    return {
      track: "consumer", heading: "Talk to me first — Liberate",
      sub: "A few honest questions, then we book a call. Liberate is a real investment; if it's within reach right now, I'd love to talk it through with you. Ready to join without a call? You can pay straight away on the join page.",
      questions: liberateQuestions(), phone: { label: "WhatsApp number", required: true },
    };

  if (offer.track === "corporate")
    return { track: "corporate", heading: `Enquire — ${offer.name}`, sub: "Tell me about your organization and what you're hoping to create. I reply within one business day.", questions: TRACK_D_CORP };
  if (offer.track === "brand")
    return { track: "brand", heading: `Collaborate — ${offer.name}`, sub: "A few details about the partnership and I'll be in touch within one business day.", questions: TRACK_D_BRAND };

  switch (offer.journey) {
    case "B":
      return { track: "consumer", heading: `Apply — ${offer.name}`, sub: "This is an application, not a checkout. Take your time — your answers shape our first conversation.", questions: TRACK_B };
    case "C":
      return { track: "consumer", heading: `${offer.name}`, sub: "Tell me a little about you. If a seat is open I'll send the next step; if not, I'll hold your place on the waitlist.", questions: TRACK_C };
    case "D":
      return { track: "consumer", heading: `${offer.name}`, sub: "Tell me what you have in mind and I'll design something with you.", questions: TRACK_D_CORP };
    default:
      return { track: "consumer", heading: `${offer.name}`, sub: "A couple of quick things and I'll get you what's next.", questions: TRACK_A };
  }
}
