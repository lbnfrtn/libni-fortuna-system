import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { isLoggedIn } from "@/lib/auth";
import { notifyTeam } from "@/lib/ghl";

export const runtime = "nodejs";

// Cancel an order, or record that a refund was issued (SOP 4). This does NOT
// touch Xendit — refunds are Libni's decision and issued in the Xendit
// dashboard by the person with access. This only records the outcome so the
// Desk and reporting stay honest.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id } = await params;
  const order = await store().get(id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let reason = "";
  let refunded = false;
  try {
    const body = (await req.json()) as { reason?: string; refunded?: boolean };
    reason = body?.reason || "";
    refunded = !!body?.refunded;
  } catch {
    /* optional body */
  }

  order.status = "cancelled";
  order.events.push({
    at: new Date().toISOString(),
    type: refunded ? "refund-recorded" : "cancelled",
    note: `${session.email}${reason ? `: ${reason}` : ""}`,
  });
  await store().put(order);

  await notifyTeam(refunded ? "Refund recorded" : "Order cancelled", {
    order: order.id, client: order.contact.name, offer: order.offerName, by: session.email, reason,
  });
  return NextResponse.json({ ok: true, status: order.status });
}
