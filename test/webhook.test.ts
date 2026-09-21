import { describe, it, expect, afterEach } from "vitest";
import { verifyCallbackToken, parseInvoiceEvent, invoiceEventIsPaid } from "@/lib/xendit";
import { isOurExternalId } from "@/lib/util";

const orig = process.env.XENDIT_WEBHOOK_TOKEN;
afterEach(() => {
  if (orig === undefined) delete process.env.XENDIT_WEBHOOK_TOKEN;
  else process.env.XENDIT_WEBHOOK_TOKEN = orig;
});

describe("webhook token verification", () => {
  it("accepts the correct token", () => {
    process.env.XENDIT_WEBHOOK_TOKEN = "secret-token-123";
    expect(verifyCallbackToken("secret-token-123")).toBe(true);
  });
  it("rejects a wrong token", () => {
    process.env.XENDIT_WEBHOOK_TOKEN = "secret-token-123";
    expect(verifyCallbackToken("nope")).toBe(false);
    expect(verifyCallbackToken(null)).toBe(false);
  });
  it("accepts anything in mock mode (no token configured)", () => {
    delete process.env.XENDIT_WEBHOOK_TOKEN;
    expect(verifyCallbackToken("whatever")).toBe(true);
  });
});

describe("ownership guard (protects Project Me)", () => {
  it("recognises our ids and rejects Project Me's", () => {
    expect(isOurExternalId("LF-ignite-abc-9931")).toBe(true);
    expect(isOurExternalId("LF-the-becoming-xyz#i2")).toBe(true);
    expect(isOurExternalId("pm-quarter-123-ab")).toBe(false);
    expect(isOurExternalId(undefined)).toBe(false);
  });
});

describe("parseInvoiceEvent", () => {
  it("normalises a Xendit invoice.paid body", () => {
    const ev = parseInvoiceEvent({
      id: "inv_123",
      external_id: "LF-ignite-abc-9931",
      status: "PAID",
      paid_amount: 7777,
      payment_method: "GCASH",
      paid_at: "2026-09-17T10:00:00Z",
    });
    expect(ev).toMatchObject({ externalId: "LF-ignite-abc-9931", status: "PAID", paidAmountPHP: 7777, paymentMethod: "GCASH" });
    expect(invoiceEventIsPaid(ev!.status)).toBe(true);
  });
  it("returns null when there is no external_id", () => {
    expect(parseInvoiceEvent({ status: "PAID" })).toBeNull();
  });
  it("does not treat EXPIRED as paid", () => {
    expect(invoiceEventIsPaid("EXPIRED")).toBe(false);
  });
});
