import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { submitProofSchema } from "@/lib/validate";
import { notifyTeam } from "@/lib/ghl";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Client submits proof of a manual bank transfer (public — no login).
// Status -> "submitted", the EA is notified, the client gets the instant
// "we've received your proof" message (spec §7.5).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!rateLimit(`proof:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const { id } = await params;
  const order = await store().get(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, message: "This order is already paid. Thank you!" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = submitProofSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please attach a valid proof link." }, { status: 400 });
  }

  order.status = "submitted";
  order.manual = {
    ...(order.manual ?? { reference: "" }),
    proofUrl: parsed.data.proofUrl,
    submittedAt: new Date().toISOString(),
  };
  order.events.push({ at: new Date().toISOString(), type: "proof-submitted", note: order.manual.reference });
  await store().put(order);

  await notifyTeam("Manual payment proof submitted — please verify", {
    order: order.id,
    offer: order.offerName,
    client: order.contact.name,
    reference: order.manual.reference,
  });

  return NextResponse.json({
    ok: true,
    message:
      "We've received your proof of payment. We'll confirm within one business day and email you the next steps.",
  });
}
