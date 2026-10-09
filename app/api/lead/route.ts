import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validate";
import { intakeLead, selfPayAfterApply } from "@/lib/lead";
import { getContent } from "@/lib/content";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientIp(req)}`, 8, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot or validation: respond 200-ish to bots but don't process.
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the form." }, { status: 400 });
  }
  let result;
  try {
    result = await intakeLead(parsed.data);
  } catch (e) {
    console.error("[lead] could not record lead", e);
    return NextResponse.json({ error: "Sorry — that didn't go through. Please try again in a moment." }, { status: 500 });
  }
  const pay = result.waitlisted ? null : await selfPayAfterApply(parsed.data);
  // Hand over a booking link when they qualify and Libni has set one.
  // Liberate: any call applicant. The Becoming: only those ready to invest (the ₱250k filter) —
  // the "start with a Power Hour" / "more details" answers are followed up on WhatsApp instead.
  const content = !result.waitlisted && !pay ? await getContent() : null;
  const becomingReady = parsed.data.offerSlug === "the-becoming" && /^Yes/i.test(parsed.data.answers?.investment || "");
  const book = !content ? null
    : parsed.data.offerSlug === "liberate" ? (content.links.calendlyLiberate || null)
      : becomingReady ? (content.links.calendlyBecoming || null)
        : null;
  const callApplication = parsed.data.offerSlug === "liberate" || parsed.data.offerSlug === "the-becoming";
  return NextResponse.json({
    ok: true,
    waitlisted: result.waitlisted,
    pay,
    book,
    message: result.waitlisted
      ? "You're on the list. I'll be in touch when the next round opens."
      : pay
        ? "Your place is held the moment your payment clears. Pay below, or from the link in your inbox."
        : book
          ? "Thank you. Pick a time for our call below — I'm looking forward to it."
          : callApplication
            ? "Thank you. I'll call you on WhatsApp in the window you chose — and there's a note in your inbox."
            : "Got it — thank you. Check your email shortly.",
  });
}
