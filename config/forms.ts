import type { Track } from "@/lib/types";
import { getOffer } from "@/config/offers";

// ============================================================================
// Form question sets. Each offer's form is built from its journey + track.
// Answers are stored in GHL only (they can be emotional/health-sensitive).
// ============================================================================

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "email" | "tel" | "select" | "number";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

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

export function questionsFor(offerSlug: string): { track: Track; heading: string; sub: string; questions: Question[] } {
  const offer = getOffer(offerSlug);
  if (!offer) return { track: "consumer", heading: "Get in touch", sub: "", questions: TRACK_A };

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
