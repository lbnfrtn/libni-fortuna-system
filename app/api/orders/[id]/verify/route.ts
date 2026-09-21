import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { store } from "@/lib/store";
import { markPaid } from "@/lib/markPaid";

export const dynamic = "force-dynamic";

// The EA's manual "Verify" on the Payment Desk: a bank transfer landed, so
// settle the next unpaid instalment. Goes through markPaid like every other
// payment, and the stable eventId keeps a double-click idempotent.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const order = await store().get(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const inst = order.instalments.find((i) => i.status !== "paid") ?? order.instalments[0];
    const result = await markPaid(id, {
      instalmentN: inst.n,
      amountPHP: inst.amountPHP,
      method: "manual transfer",
      paidAt: new Date().toISOString(),
      eventId: `manual_${id}_i${inst.n}`,
      channel: "manual",
    });

    return NextResponse.json({ ok: true, changed: result.changed, fullyPaid: result.fullyPaid });
  } catch (err) {
    console.error("POST /api/orders/[id]/verify:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
