import type { PaymentMethod } from "@/lib/types";

// ============================================================================
// XENDIT — the ONLY file that talks to Xendit. Isolated on purpose (spec §3):
// if we ever switch to a GHL Marketplace payment app, we replace this file and
// nothing else.
//
// We use the Invoice API (POST /v2/invoices). Invoices are a DIFFERENT webhook
// channel from Project Me's subscription ("recurring") events, so the two
// systems in the shared Xendit account never collide.
//
// MOCK MODE: if XENDIT_SECRET_KEY is empty, we don't call Xendit at all. We
// return a fake hosted-checkout link that points at this app's own /mock-pay
// page, so the entire pay -> webhook -> markPaid -> welcome flow can be tested
// locally with no keys and no real money.
// ============================================================================

const XENDIT_API = "https://api.xendit.co";

export interface CreateInvoiceInput {
  externalId: string; // our LF-... id (per-instalment: LF-...#iN)
  amountPHP: number;
  payerEmail: string;
  description: string;
  methods: PaymentMethod[];
  successRedirectUrl: string;
  /** Seconds the invoice stays payable. Default 7 days. */
  durationSec?: number;
}

export interface CreateInvoiceResult {
  xenditInvoiceId: string;
  invoiceUrl: string;
  mock: boolean;
}

function baseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:4310").replace(/\/$/, "");
}

function isMock(): boolean {
  return !process.env.XENDIT_SECRET_KEY;
}

/** Map our method names to Xendit's payment_methods channel codes. */
function xenditMethods(methods: PaymentMethod[]): string[] {
  const map: Record<PaymentMethod, string | null> = {
    GCASH: "GCASH",
    PAYMAYA: "PAYMAYA",
    QRPH: "QRPH",
    CREDIT_CARD: "CREDIT_CARD",
    DIRECT_DEBIT: "DIRECT_DEBIT",
    BANK_TRANSFER: null, // handled by OUR manual path, not by Xendit
  };
  return methods.map((m) => map[m]).filter((x): x is string => !!x);
}

export async function createInvoice(input: CreateInvoiceInput): Promise<CreateInvoiceResult> {
  if (input.amountPHP <= 0) throw new Error("invoice amount must be positive");

  if (isMock()) {
    // Fake hosted checkout: a local page that can fire our own webhook.
    const url = `${baseUrl()}/mock-pay/${encodeURIComponent(input.externalId)}`;
    return { xenditInvoiceId: `mock_${input.externalId}`, invoiceUrl: url, mock: true };
  }

  const body = {
    external_id: input.externalId,
    amount: Math.round(input.amountPHP),
    currency: "PHP",
    payer_email: input.payerEmail,
    description: input.description,
    success_redirect_url: input.successRedirectUrl,
    failure_redirect_url: input.successRedirectUrl,
    payment_methods: xenditMethods(input.methods),
    invoice_duration: input.durationSec ?? 7 * 24 * 3600,
  };

  const auth = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString("base64");
  const res = await fetch(`${XENDIT_API}/v2/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { id?: string; invoice_url?: string; message?: string };
  if (!res.ok || !json.invoice_url || !json.id) {
    throw new Error(`Xendit invoice failed (${res.status}): ${json.message || JSON.stringify(json)}`);
  }
  return { xenditInvoiceId: json.id, invoiceUrl: json.invoice_url, mock: false };
}

// ------------------------------------------------------------------- webhook
export interface XenditInvoiceEvent {
  externalId: string;
  status: string; // "PAID" | "SETTLED" | "EXPIRED" | ...
  paidAmountPHP: number;
  paymentMethod?: string;
  paidAt?: string;
  xenditInvoiceId?: string;
}

/**
 * Verify Xendit's callback token (constant-time-ish). The token is sent in the
 * `x-callback-token` header and is the SAME account token Project Me uses; the
 * webhook additionally checks the external_id is ours ("LF-").
 */
export function verifyCallbackToken(headerToken: string | null | undefined): boolean {
  const expected = String(process.env.XENDIT_WEBHOOK_TOKEN || "").trim();
  const got = String(headerToken || "").trim();
  // In mock mode (no token configured) accept, so local testing works.
  if (!expected) return true;
  if (!got || got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/** Normalise a raw Xendit invoice webhook body into our shape. */
export function parseInvoiceEvent(body: Record<string, unknown>): XenditInvoiceEvent | null {
  // Xendit invoice webhooks put fields at the top level (id, external_id,
  // status, paid_amount, payment_method, paid_at).
  const externalId = (body.external_id as string) || "";
  if (!externalId) return null;
  return {
    externalId,
    status: String(body.status || "").toUpperCase(),
    paidAmountPHP: Number(body.paid_amount ?? body.amount ?? 0),
    paymentMethod: (body.payment_method as string) || (body.payment_channel as string) || undefined,
    paidAt: (body.paid_at as string) || new Date().toISOString(),
    xenditInvoiceId: (body.id as string) || undefined,
  };
}

export function invoiceEventIsPaid(status: string): boolean {
  return status === "PAID" || status === "SETTLED";
}
