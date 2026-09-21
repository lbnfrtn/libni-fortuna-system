import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { markPaid } from "@/lib/markPaid";

export const runtime = "nodejs";

// ============================================================================
// TEST MODE ONLY. Simulates a real Xendit "invoice paid" event so the full
// flow (link -> pay -> webhook -> markPaid -> welcome) can be exercised with no
// keys and no money. Disabled the moment a real XENDIT_SECRET_KEY exists.
// ============================================================================
export async function POST(req: Request) {
  if (process.env.XENDIT_SECRET_KEY) {
    return NextResponse.json({ error: "Mock pay is disabled in live/keyed mode." }, { status: 403 });
  }
  let externalId = "";
  try {
    ({ externalId } = (await req.json()) as { externalId: string });
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const orderId = externalId.split("#")[0];
  const n = Number(externalId.split("#i")[1] || 1);
  const order = await store().get(orderId);
  if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });
  const inst = order.instalments.find((i) => i.n === n) ?? order.instalments[0];

  const result = await markPaid(orderId, {
    instalmentN: inst.n,
    amountPHP: inst.amountPHP,
    method: "gcash (mock)",
    paidAt: new Date().toISOString(),
    eventId: `mock_${externalId}`,
    channel: "xendit",
  });
  return NextResponse.json({
    ok: true,
    fullyPaid: result.fullyPaid,
    redirect: `/welcome/${order.offerSlug}?o=${encodeURIComponent(order.id)}`,
  });
}
