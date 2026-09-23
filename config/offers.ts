import type { Offer } from "@/lib/types";

// ============================================================================
// THE OFFER CATALOGUE — the single source of truth for prices and journeys.
//
// To change a price: edit `pricePHP` here. Nothing else.
// To open a TBD offer: set its `pricePHP` and remove `waitlistOnly: true`.
// A price of `null` OR `waitlistOnly: true` means the offer collects a
// waitlist instead of taking money.
//
// `refundNote` = the client-facing refund/cancellation line shown at checkout.
// Approved by Libni 2026-09-17 (see docs/REFUNDS.md).
//
// Journey patterns (see lib/types.ts and spec Section 5):
//   A Pay -> Book        B Apply -> Call -> Link
//   C Retreat            D Inquiry -> Proposal -> Invoice
//   E Subscription (Project Me — link out only)
// ============================================================================

export const OFFERS: Record<string, Offer> = {
  ignite: {
    // Slug stays `ignite` so existing GHL tags, orders and links keep working.
    slug: "ignite",
    name: "Power Hour",
    blurb: "A 90-minute session to get unstuck — online or in person.",
    track: "consumer",
    journey: "A",
    pricePHP: 7777,
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: false,
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD"],
    onboardingPack: "ignite",
    refundNote:
      "Life happens — you can reschedule once with at least 48 hours' notice. Sessions cancelled with less notice, or missed, aren't refundable, but let's talk if something serious came up.",
    pipeline: "consumer",
  },

  "private-studio": {
    slug: "private-studio",
    name: "Private Studio Sessions",
    blurb: "A 2-hour soundbath or breathwork session, in person, for two or more.",
    track: "consumer",
    journey: "A",
    pricePHP: 7999,
    priceUnit: "per person",
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: false,
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD"],
    onboardingPack: "private-studio",
    refundNote:
      "Because your space and time are reserved just for your group, payment is non-refundable within 7 days of the session. Before that, you can reschedule or transfer your spot to someone else.",
    pipeline: "consumer",
  },

  workshops: {
    slug: "workshops",
    name: "Workshops & Trainings",
    blurb: "Live group workshops and trainings, dated as they're announced.",
    track: "consumer",
    journey: "A",
    pricePHP: null, // per-event, set when dated
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: false,
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD"],
    onboardingPack: "workshops",
    refundNote:
      "Your spot is transferable to someone else any time. Refunds are available up to 14 days before the event; after that it's non-refundable but still transferable.",
    waitlistOnly: true, // until a dated event with a price exists
    pipeline: "consumer",
  },

  "the-becoming": {
    slug: "the-becoming",
    name: "The Becoming",
    blurb: "A 12-week 1:1 mentorship — the deepest work I offer.",
    track: "consumer",
    journey: "B",
    pricePHP: 250000,
    priceUnit: "3 months · by application",
    allowPayInFull: true,
    allowInstalments: true,
    instalmentCount: 3, // default per Section 12.1; first due at signing
    allowDeposit: false,
    // ₱250k is over e-wallet caps -> card, direct debit, or manual transfer only.
    methods: ["CREDIT_CARD", "DIRECT_DEBIT"],
    onboardingPack: "the-becoming",
    refundNote:
      "This is a mutual 12-week commitment. There's a 3-day window after signing to change your mind for a full refund. Once we've begun, the fee is non-refundable — but if life makes continuing impossible, we can pause for up to 8 weeks and resume. On a payment plan, completed payments aren't refunded and the remaining balance is still due unless we agree together to close early.",
    pipeline: "consumer",
  },

  liberate: {
    slug: "liberate",
    name: "Liberate",
    blurb: "Group coaching — transformation in a small, held circle.",
    track: "consumer",
    journey: "B",
    pricePHP: 70000,
    allowPayInFull: true,
    allowInstalments: true,
    instalmentCount: 3, // ₱23,333 down, then ₱23,333 + ₱23,334 before Oct 7
    allowDeposit: false,
    callOptional: true,
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD"],
    onboardingPack: "liberate",
    refundNote:
      "Liberate does not offer refunds. This space is built on alignment, not urgency — if you're unsure, take your time, ask your questions, and say yes only when it's a full yes.",
    pipeline: "consumer",
  },

  "essence-retreat": {
    slug: "essence-retreat",
    name: "Essence Retreat",
    blurb: "A 4-day quarterly retreat. Max 20 people. Come home to yourself.",
    track: "consumer",
    journey: "C",
    pricePHP: null, // TBD
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: true,
    depositFraction: 0.3, // 30% non-refundable to hold a seat (Section 12.2)
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD", "DIRECT_DEBIT"],
    onboardingPack: "essence-retreat",
    refundNote:
      "A 30% deposit holds your seat and is non-refundable. The balance is due 30 days before the retreat. Cancel more than 30 days out and your balance is refunded; within 30 days it's non-refundable, but your full payment can transfer to the next retreat once. Waivers and health forms must be completed to attend.",
    waitlistOnly: true,
    capacity: 20, // max 20 people; flips to waitlist when full
    pipeline: "consumer",
  },

  "founders-circle": {
    slug: "founders-circle",
    name: "Founders Circle",
    blurb: "A recurring dinner gathering for a small circle of founders.",
    track: "consumer",
    journey: "A",
    pricePHP: null, // per-seat, TBD
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: false,
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD"],
    onboardingPack: "founders-circle",
    refundNote:
      "Seats are limited, so payment is non-refundable — but fully transferable to a guest if you can't make it.",
    waitlistOnly: true,
    pipeline: "consumer",
  },

  "project-me": {
    slug: "project-me",
    name: "Project Me",
    blurb: "The membership app — daily practice, breathwork and The Circle.",
    track: "consumer",
    journey: "E",
    pricePHP: 1299,
    priceUnit: "per 3 months",
    allowPayInFull: false,
    allowInstalments: false,
    allowDeposit: false,
    methods: [],
    onboardingPack: "project-me",
    externalUrl: "https://projectme.libni.co", // existing system; link out only
    pipeline: "consumer",
  },

  "private-experiences": {
    slug: "private-experiences",
    name: "Private Experiences & Retreats",
    blurb: "Custom private transformational experiences, designed with you.",
    track: "consumer",
    journey: "D",
    pricePHP: null, // custom, quoted per engagement
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: true,
    depositFraction: 0.5, // 50% deposit option for custom work
    methods: ["GCASH", "PAYMAYA", "QRPH", "CREDIT_CARD", "DIRECT_DEBIT"],
    onboardingPack: "custom",
    refundNote:
      "Terms are set in your agreement. A 50% deposit confirms and is non-refundable; the balance follows the schedule in your agreement.",
    pipeline: "consumer",
  },

  organizations: {
    slug: "organizations",
    name: "For Organizations",
    blurb: "Corporate workshops and retreats, including The Reset.",
    track: "corporate",
    journey: "D",
    pricePHP: null, // proposal
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: true,
    depositFraction: 0.5,
    methods: ["CREDIT_CARD", "DIRECT_DEBIT"],
    onboardingPack: "corporate",
    refundNote:
      "Governed by the signed agreement. A 50% deposit confirms the date and is non-refundable. Cancellation within 30 days of the date forfeits the deposit; the balance is due per the agreement.",
    pipeline: "corporate",
  },

  speaking: {
    slug: "speaking",
    name: "Speaking",
    blurb: "Keynotes and talks for events and organizations.",
    track: "corporate",
    journey: "D",
    pricePHP: null, // proposal
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: true,
    depositFraction: 0.5,
    methods: ["CREDIT_CARD", "DIRECT_DEBIT"],
    onboardingPack: "corporate",
    refundNote:
      "Governed by the signed agreement. A 50% deposit confirms the date and is non-refundable. Cancellation within 30 days of the date forfeits the deposit; the balance is due per the agreement.",
    pipeline: "corporate",
  },

  brands: {
    slug: "brands",
    name: "For Brands",
    blurb: "KOL partnerships and brand collaborations.",
    track: "brand",
    journey: "D",
    pricePHP: null, // proposal
    allowPayInFull: true,
    allowInstalments: false,
    allowDeposit: true,
    depositFraction: 0.5,
    methods: ["CREDIT_CARD", "DIRECT_DEBIT"],
    onboardingPack: "brand",
    refundNote:
      "Governed by the signed agreement. A 50% deposit confirms the date and is non-refundable. Cancellation within 30 days of the date forfeits the deposit; the balance is due per the agreement.",
    pipeline: "brand",
  },
};

export function getOffer(slug: string): Offer | undefined {
  return OFFERS[slug];
}

export function listOffers(): Offer[] {
  return Object.values(OFFERS);
}

/** An offer takes money now only if it has a price and isn't waitlist-only. */
export function isSellable(offer: Offer): boolean {
  return offer.pricePHP != null && !offer.waitlistOnly && offer.journey !== "E";
}

/** Offers the Payment Desk can create an order for (track D allows custom amount). */
export function deskOffers(): Offer[] {
  return listOffers().filter((o) => o.journey !== "E");
}
