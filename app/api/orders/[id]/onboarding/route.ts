import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { isLoggedIn } from "@/lib/auth";
import { addTags } from "@/lib/ghl";
import { tag } from "@/lib/tags";

export const runtime = "nodejs";

const KEYS = ["welcomeSent", "agreementSigned", "intakeDone", "sessionBooked"] as const;
type Key = (typeof KEYS)[number];

// EA ticks an onboarding step. When every step is done, the order is marked
// complete and the contact gets `onboarded:<offer>` in GHL.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id } = await params;
  const order = await store().get(id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: { key?: string; value?: boolean; notes?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ob = { ...(order.onboarding ?? {}) };
  if (body.key && (KEYS as readonly string[]).includes(body.key)) ob[body.key as Key] = !!body.value;
  if (typeof body.notes === "string") ob.notes = body.notes.slice(0, 2000);
  const wasComplete = !!ob.complete;
  ob.complete = KEYS.every((k) => !!ob[k]);
  ob.updatedAt = new Date().toISOString();
  order.onboarding = ob;
  order.events.push({ at: ob.updatedAt, type: "onboarding", note: `${body.key ?? "notes"}=${body.value ?? ""} by ${session.email}` });
  await store().put(order);

  if (ob.complete && !wasComplete && order.contact.ghlContactId) {
    try {
      await addTags(order.contact.ghlContactId, [tag.onboarded(order.offerSlug)]);
    } catch {
      /* GHL best-effort */
    }
  }
  return NextResponse.json({ ok: true, onboarding: ob });
}
