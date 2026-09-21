// ============================================================================
// GHL id map. Pipelines, stages and custom-field ids are specific to Libni's
// GHL location and can't be known from code — the EA reads them off the GHL
// screens using docs/GHL-BUILD-SHEET.md and pastes them here (or as env vars).
//
// While these are blank, the system runs fine in safe mode: lib/ghl.ts logs
// what it WOULD send instead of calling GHL. Fill them in to go live.
// ============================================================================

export interface PipelineMap {
  pipelineId: string;
  stages: Record<string, string>; // our stage key -> GHL stage id
}

const env = (k: string, fallback = "") => process.env[k] || fallback;

export const PIPELINES: Record<"consumer" | "corporate" | "brand", PipelineMap> = {
  consumer: {
    pipelineId: env("GHL_PIPELINE_CONSUMER"),
    stages: {
      "new-lead": env("GHL_STAGE_CONSUMER_NEW_LEAD"),
      engaged: env("GHL_STAGE_CONSUMER_ENGAGED"),
      applied: env("GHL_STAGE_CONSUMER_APPLIED"),
      "call-booked": env("GHL_STAGE_CONSUMER_CALL_BOOKED"),
      "offer-made": env("GHL_STAGE_CONSUMER_OFFER_MADE"),
      "payment-pending": env("GHL_STAGE_CONSUMER_PAYMENT_PENDING"),
      "paid-won": env("GHL_STAGE_CONSUMER_PAID_WON"),
    },
  },
  corporate: {
    pipelineId: env("GHL_PIPELINE_CORPORATE"),
    stages: {
      "new-inquiry": env("GHL_STAGE_CORP_NEW_INQUIRY"),
      "discovery-booked": env("GHL_STAGE_CORP_DISCOVERY"),
      "proposal-sent": env("GHL_STAGE_CORP_PROPOSAL"),
      negotiating: env("GHL_STAGE_CORP_NEGOTIATING"),
      "contract-signed": env("GHL_STAGE_CORP_CONTRACT"),
      "invoice-sent": env("GHL_STAGE_CORP_INVOICE"),
      "paid-deposit": env("GHL_STAGE_CORP_PAID"),
    },
  },
  brand: {
    pipelineId: env("GHL_PIPELINE_BRAND"),
    stages: {
      "new-inquiry": env("GHL_STAGE_BRAND_NEW_INQUIRY"),
      "brief-received": env("GHL_STAGE_BRAND_BRIEF"),
      "proposal-sent": env("GHL_STAGE_BRAND_PROPOSAL"),
      "agreement-signed": env("GHL_STAGE_BRAND_AGREEMENT"),
      "invoice-sent": env("GHL_STAGE_BRAND_INVOICE"),
      "in-production": env("GHL_STAGE_BRAND_PRODUCTION"),
      "delivered-paid": env("GHL_STAGE_BRAND_DELIVERED"),
    },
  },
};

// Custom-field ids (from GHL Settings -> Custom Fields). Blank = logged, not set.
export const FIELDS: Record<string, string> = {
  orderId: env("GHL_FIELD_ORDER_ID"),
  amountDue: env("GHL_FIELD_AMOUNT_DUE"),
  amountPaid: env("GHL_FIELD_AMOUNT_PAID"),
  balance: env("GHL_FIELD_BALANCE"),
  paymentMethod: env("GHL_FIELD_PAYMENT_METHOD"),
  paymentDate: env("GHL_FIELD_PAYMENT_DATE"),
  paymentPlan: env("GHL_FIELD_PAYMENT_PLAN"),
  nextInstalmentDue: env("GHL_FIELD_NEXT_INSTALMENT_DUE"),
  offerOfInterest: env("GHL_FIELD_OFFER_OF_INTEREST"),
  leadSource: env("GHL_FIELD_LEAD_SOURCE"),
  sourceDetail: env("GHL_FIELD_SOURCE_DETAIL"),
};

/** Keep only the fields whose GHL id is actually configured. */
export function knownFields(values: Record<string, string | number | undefined>): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(values)) {
    const id = FIELDS[key];
    if (id && val != null && val !== "") out[id] = val;
  }
  return out;
}
