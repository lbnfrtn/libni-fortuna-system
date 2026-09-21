// ============================================================================
// Onboarding packs — what a client sees on the welcome page after paying, and
// what the matching GHL workflow (triggered by paid:<offer>) should send.
//
// The welcome-page copy here is DRAFTED IN LIBNI'S VOICE and is marked PENDING
// approval in docs/MESSAGES.md. Nothing here is final until Libni signs off.
// GHL workflow steps (emails/agreement/reminders) are specified in
// docs/GHL-BUILD-SHEET.md — this file is only what renders on the web page.
// ============================================================================

export interface WelcomeStep {
  title: string;
  body: string;
  /** Optional link. GHL booking/agreement/intake links get pasted in later. */
  ctaLabel?: string;
  ctaHref?: string;
}

export interface OnboardingPack {
  /** Warm one-liner under "You're in." */
  intro: string;
  steps: WelcomeStep[];
  /** Plain sign-off line. */
  closing: string;
}

const CONTACT = "If anything feels unclear, just reply to your welcome email — a real person (often me) reads it.";

export const ONBOARDING: Record<string, OnboardingPack> = {
  ignite: {
    intro:
      "You just made a decision toward yourself, and I don't take that lightly. Here's everything you need — no chasing, no wondering what happens next.",
    steps: [
      {
        title: "Book your session",
        body: "Pick the time that feels right. Ninety minutes, just the two of us — online or in person, however you chose.",
        ctaLabel: "Choose your time",
        ctaHref: "#booking", // GHL calendar embed / link pasted here at go-live
      },
      {
        title: "A short intake, so I can meet you where you are",
        body: "A few honest questions before we sit down. It takes five minutes and it makes our time together far deeper.",
        ctaLabel: "Fill in your intake",
        ctaHref: "#intake",
      },
      {
        title: "What to expect",
        body: "Come as you are. Somewhere quiet, headphones if you're online, water nearby. You don't need to prepare anything except your willingness to be honest.",
      },
    ],
    closing: CONTACT,
  },

  "the-becoming": {
    intro:
      "This is the deepest work I offer, and you've just said yes to twelve weeks of coming home to yourself. I'm honoured to walk it with you.",
    steps: [
      {
        title: "Sign your agreement",
        body: "A simple, human agreement so we both know what we're committing to. Please read and sign it — it's the first step.",
        ctaLabel: "Read & sign",
        ctaHref: "#agreement",
      },
      {
        title: "Your becoming intake",
        body: "A deeper set of questions than usual — where you are, what you're carrying, what you're ready to release. Take your time with it. It shapes our whole journey.",
        ctaLabel: "Begin your intake",
        ctaHref: "#intake",
      },
      {
        title: "Book our first session",
        body: "Let's begin. Choose a time for our first 1:1, and we'll set our rhythm from there.",
        ctaLabel: "Book session one",
        ctaHref: "#booking",
      },
      {
        title: "How we'll work",
        body: "Twelve weeks, 1:1. Between sessions you'll have space to reflect and, when you need it, a way to reach me. This isn't about becoming someone new — it's about remembering who you already are.",
      },
    ],
    closing: CONTACT,
  },

  "private-studio": {
    intro: "A soundbath and breathwork session is waiting for you. Here's what's next.",
    steps: [
      { title: "Confirm your date & guests", body: "Reply with your preferred date and how many are coming (minimum two). We'll lock it in.", ctaLabel: "Confirm details", ctaHref: "#booking" },
      { title: "Before you come", body: "Wear something soft you can lie down in. Eat lightly beforehand. Arrive a few minutes early so you can arrive fully." },
    ],
    closing: CONTACT,
  },

  "essence-retreat": {
    intro: "Your seat is held. Four days to come home to yourself. Here's how we get you there.",
    steps: [
      { title: "Sign your agreement & waiver", body: "A retreat needs a little paperwork — an agreement and a health/consent waiver. Please complete both to confirm your seat.", ctaLabel: "Read & sign", ctaHref: "#agreement" },
      { title: "Your balance", body: "Your deposit holds your place. The balance is due before the retreat — you'll get a clear link and a gentle reminder. Nothing to do right now." },
      { title: "Logistics", body: "Closer to the date I'll send your packing list, travel details, and a short dietary & emergency-contact form. For now: just breathe. You're in." },
    ],
    closing: CONTACT,
  },

  workshops: { intro: "You're registered. Here's what's next.", steps: [{ title: "Save the date", body: "Details and joining instructions are on their way to your inbox." }], closing: CONTACT },
  liberate: { intro: "Welcome to the circle. Here's how we begin.", steps: [{ title: "Your intake", body: "A few questions before we gather.", ctaLabel: "Begin intake", ctaHref: "#intake" }, { title: "Our schedule", body: "You'll receive the call schedule and how to join." }], closing: CONTACT },
  "founders-circle": { intro: "Your seat at the table is confirmed.", steps: [{ title: "Details", body: "Date, place and who else is coming will follow by email." }], closing: CONTACT },
  "project-me": { intro: "Welcome to Project Me.", steps: [{ title: "Set your password", body: "Check your email to set your password and open the app.", ctaLabel: "Open the app", ctaHref: "https://app.projectme.co" }], closing: CONTACT },
  custom: { intro: "Thank you — your experience is confirmed.", steps: [{ title: "We'll be in touch", body: "I'll personally reach out with the next steps for your bespoke experience." }], closing: CONTACT },
  corporate: { intro: "Thank you. Your engagement is confirmed.", steps: [{ title: "Planning", body: "Our team will send the planning checklist and confirm dates and logistics." }], closing: "For anything urgent, reply to your confirmation email and the team will respond within one business day." },
  brand: { intro: "Thank you — the collaboration is confirmed.", steps: [{ title: "Next steps", body: "We'll send the brief confirmation, timeline and deliverables schedule." }], closing: "Reply to your confirmation email for anything you need." },
};

export function getPack(slug: string): OnboardingPack {
  return ONBOARDING[slug] ?? ONBOARDING.custom;
}
