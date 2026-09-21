// Shared types for the whole system. Kept in one place so the offer config,
// the store, the payment code and the API routes all speak the same language.

/** The five journey patterns from the spec (Section 5). */
export type JourneyPattern =
  | "A" // Pay -> Book (low price, no call)
  | "B" // Apply -> Call -> Payment link (high-touch)
  | "C" // Retreat: apply/waitlist -> deposit -> balance -> logistics
  | "D" // Inquiry -> Proposal -> Invoice (corporate / brand / custom)
  | "E"; // Subscription (Project Me) — link out only

export type Track = "consumer" | "corporate" | "brand";

/** Which Xendit payment methods to offer. Large amounts drop e-wallets. */
export type PaymentMethod =
  | "GCASH"
  | "PAYMAYA"
  | "QRPH"
  | "CREDIT_CARD"
  | "DIRECT_DEBIT"
  | "BANK_TRANSFER"; // = our manual-transfer fallback, always available

export interface Offer {
  /** Stable machine id, used in tags, refs and URLs. kebab-case. */
  slug: string;
  /** Human name as a client sees it. */
  name: string;
  /** One honest sentence for the /start recommender and the Desk. */
  blurb: string;
  track: Track;
  journey: JourneyPattern;
  /**
   * Price in PHP (whole pesos). null = TBD -> the offer is waitlist-only until
   * a price is set. Changing a price means editing ONLY this file.
   */
  pricePHP: number | null;
  /** For "per person" or "per seat" offers, the unit label. */
  priceUnit?: string;
  /**
   * Never show the price on the public site — it's shared after the
   * questionnaire/call instead. The Payment Desk still charges `pricePHP`.
   */
  hidePrice?: boolean;
  /** Payment options this offer allows on the Payment Desk. */
  allowPayInFull: boolean;
  allowInstalments: boolean;
  /** Default number of instalments offered (first due now). */
  instalmentCount?: number;
  /** Deposit + balance offers (retreats / corporate). */
  allowDeposit: boolean;
  /** Deposit as a fraction of the total, e.g. 0.3 = 30%. */
  depositFraction?: number;
  /** Payment methods to show. Manual BANK_TRANSFER is always added on top. */
  methods: PaymentMethod[];
  /** Some track-B offers can skip the discovery call (config flag per spec). */
  callOptional?: boolean;
  /** Which onboarding pack fires on `paid:<slug>` (defined in config/onboarding). */
  onboardingPack: string;
  /**
   * If true, this offer never sells directly — the front door and Desk treat
   * it as waitlist-only regardless of price (e.g. undated workshops).
   */
  waitlistOnly?: boolean;
  /** External link for offers we don't process here (Project Me). */
  externalUrl?: string;
  /** GHL pipeline this offer's opportunities belong in. */
  pipeline: "consumer" | "corporate" | "brand";
  /**
   * Hard capacity (e.g. Essence retreat = 20). When paid seats reach this, the
   * offer flips to waitlist automatically. Undefined = no cap.
   */
  capacity?: number;
  /**
   * The client-facing refund/cancellation line shown on the checkout page.
   * Left blank until Libni approves the drafts in docs/REFUNDS.md; then paste
   * the approved one-liner here and it appears automatically.
   */
  refundNote?: string;
}

export type OrderStatus =
  | "pending" // link created, not paid
  | "submitted" // manual transfer: proof uploaded, awaiting EA
  | "verified" // manual transfer: EA confirmed bank receipt
  | "paid" // money confirmed (Xendit or verified manual)
  | "cancelled";

export type PaymentPlanType = "full" | "instalment" | "deposit";

export interface Instalment {
  /** 1-based sequence. */
  n: number;
  amountPHP: number;
  /** ISO date the instalment is due. First one is due immediately. */
  dueDate: string;
  /** Xendit external_id for this specific instalment's invoice. */
  externalId: string;
  /** Hosted payment link for this instalment. */
  invoiceUrl?: string;
  xenditInvoiceId?: string;
  status: OrderStatus;
  paidAt?: string;
  paidAmountPHP?: number;
  method?: string;
}

export interface Order {
  /** Our order id and Xendit external_id root. Always starts "LF-". */
  id: string;
  offerSlug: string;
  offerName: string;
  planType: PaymentPlanType;
  /** Full contract value in PHP. */
  totalPHP: number;
  /** Free-text description (needed for custom track-D amounts). */
  description: string;

  // --- who ---
  contact: {
    ghlContactId?: string;
    name: string;
    email: string;
    phone?: string;
  };

  // --- money movement ---
  instalments: Instalment[];
  amountPaidPHP: number;
  balancePHP: number;

  // --- state ---
  status: OrderStatus;
  createdAt: string;
  createdBy: string; // desk user email
  paidAt?: string;

  // --- manual transfer path ---
  manual?: {
    reference: string; // short human code the client writes on the transfer
    proofUrl?: string;
    submittedAt?: string;
    verifiedBy?: string;
    verifiedAt?: string;
  };

  /** Everything we've heard from Xendit, for audit + idempotency. */
  events: Array<{ at: string; type: string; note: string }>;

  /**
   * Onboarding checklist the EA ticks off in /admin/onboarding. GHL sends the
   * emails; this is the human-visible status so nothing slips.
   */
  onboarding?: {
    welcomeSent?: boolean;
    agreementSigned?: boolean;
    intakeDone?: boolean;
    sessionBooked?: boolean;
    complete?: boolean;
    notes?: string;
    updatedAt?: string;
  };
}

/** A lightweight record of a lead/inquiry (no sensitive answers). */
export interface LeadEntry {
  at: string;
  name: string;
  email: string;
  offerSlug: string;
  track: string;
  source: string;
  sourceDetail?: string;
  waitlisted: boolean;
  ghlContactId?: string;
  parked?: boolean;
}
