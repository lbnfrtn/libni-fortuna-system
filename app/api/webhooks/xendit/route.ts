import { NextResponse } from "next/server";
import { verifyCallbackToken, parseInvoiceEvent, invoiceEventIsPaid } from "@/lib/xendit";
import { isOurExternalId } from "@/lib/util";
import { markPaid } from "@/lib/markPaid";
import { store } from "@/lib/store";
import { notifyTeam } from "@/lib/ghl";

export const runtime = "nodejs";

// ============================================================================
// Xendit invoice webhook (spec §7.4). Configure in Xendit under the "Invoices
// paid" webhook row -> {APP_BASE_URL}/api/webhooks/xendit
//
//  - verify the x-callback-token (shared account token)
//  - ignore anything that isn't ours ("LF-") — this protects Project Me
//  - idempotent: markPaid dedupes by event id
//  - always 200 on handled/ignored; 500 makes Xendit retry
// ============================================================================
export async function POST(req: Request) {
  const token = req.headers.get("x-callback-token");
  if (!verifyCallbackToken(token)) {
    return NextResponse.json({ error: "bad token" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  const ev = parseInvoiceEvent(body);
  if (!ev) return NextResponse.json({ ok: true, ignored: "no external_id" });

  // Not ours -> Project Me or something else. Do nothing, succeed.
  if (!isOurExternalId(ev.externalId)) {
    return NextResponse.json({ ok: true, ignored: "not-LF" });
  }
  const orderId = ev.externalId.split("#")[0];

  // A payment link expired without being paid -> let the team / a follow-up
  // sequence know. The order stays "pending"; we just record it once.
  if (ev.status === "EXPIRED") {
    const order = await store().get(orderId);
    if (order && order.status !== "paid") {
      order.events.push({ at: new Date().toISOString(), type: "link-expired", note: ev.externalId });
      await store().put(order);
      await notifyTeam("Payment link expired unpaid — consider a nudge", {
        order: order.id, client: order.contact.name, offer: order.offerName,
      });
    }
    return NextResponse.json({ ok: true, handled: "expired" });
  }

  if (!invoiceEventIsPaid(ev.status)) {
    return NextResponse.json({ ok: true, ignored: `status=${ev.status}` });
  }

  const n = Number(ev.externalId.split("#i")[1] || 1);

  try {
    const result = await markPaid(orderId, {
      instalmentN: n,
      amountPHP: ev.paidAmountPHP,
      method: ev.paymentMethod || "xendit",
      paidAt: ev.paidAt || new Date().toISOString(),
      eventId: ev.xenditInvoiceId || `${ev.externalId}-${ev.status}`,
      channel: "xendit",
    });
    return NextResponse.json({ ok: true, changed: result.changed, fullyPaid: result.fullyPaid });
  } catch (e) {
    // Let Xendit retry (up to 6x, backoff).
    // eslint-disable-next-line no-console
    console.error("[webhook] markPaid failed", String(e));
    return NextResponse.json({ error: "retry" }, { status: 500 });
  }
}
