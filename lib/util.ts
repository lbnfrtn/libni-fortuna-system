// Small shared helpers: ids, money, dates. No external deps.

/** Random short token, url-safe. */
export function rand(len = 6): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

/**
 * Every order id (and Xendit external_id root) starts "LF-" so this system's
 * payments are never confused with Project Me's ("pm-") in the shared Xendit
 * account and in any joint report. Format: LF-<offer>-<time36>-<rand>.
 */
export function newOrderId(offerSlug: string, now = Date.now()): string {
  return `LF-${offerSlug}-${now.toString(36)}-${rand(4)}`;
}

/** external_id for one instalment invoice: <orderId>#i<n>. */
export function instalmentExternalId(orderId: string, n: number): string {
  return `${orderId}#i${n}`;
}

/** True for any id this system owns. Used by the webhook to ignore Project Me. */
export function isOurExternalId(externalId: string | undefined | null): boolean {
  return typeof externalId === "string" && externalId.startsWith("LF-");
}

/** Human reference a client writes on a manual bank transfer, e.g. "LF-7K3Q". */
export function manualReference(): string {
  return `LF-${rand(4)}`;
}

/** Peso formatting for display, e.g. 250000 -> "₱250,000". */
export function peso(amount: number): string {
  return "₱" + Math.round(amount).toLocaleString("en-PH");
}

/** Add whole months to an ISO date, returning ISO (date only). */
export function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function todayISO(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Split a total into `count` instalments; remainder goes on the first. */
export function splitInstalments(total: number, count: number): number[] {
  if (count < 1) throw new Error("instalment count must be >= 1");
  const base = Math.floor(total / count);
  const parts = new Array(count).fill(base);
  parts[0] += total - base * count; // remainder on the first payment
  return parts;
}
