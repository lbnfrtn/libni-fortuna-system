import { NextResponse } from "next/server";
import { z } from "zod";
import { intakeLead, selfPayAfterApply } from "@/lib/lead";
import { LIBERATE_JOIN } from "@/config/forms";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Liberate's "join now" door: choose a plan, leave your details, get the payment link.
const schema = z.object({
  plan: z.enum(["full", "instalment"]),
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please tick the box so I'm allowed to contact you." }) }),
  source: z.string().max(120).optional(),
  company_website: z.string().optional(), // ignored (was a honeypot; autofill tripped real buyers)
});

export async function POST(req: Request) {
  if (!rateLimit(`liberate-join:${clientIp(req)}`, 6, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the form." }, { status: 400 });
  const d = parsed.data;
  const lead = {
    name: d.name, email: d.email, phone: d.phone, offerSlug: "liberate", track: "consumer" as const,
    answers: { join: d.plan === "full" ? LIBERATE_JOIN.full : LIBERATE_JOIN.plan },
    consent: true as const, source: d.source || "website",
  };
  let result;
  try {
    result = await intakeLead(lead);
  } catch (e) {
    console.error("[liberate/join] could not record lead", e);
    return NextResponse.json({ error: "Sorry — that didn't go through. Please try again in a moment." }, { status: 500 });
  }
  if (result.waitlisted) return NextResponse.json({ error: "Liberate isn't open for payment right now." }, { status: 400 });
  const pay = await selfPayAfterApply(lead);
  if (!pay) return NextResponse.json({ error: "I couldn't create your payment link just now — I'll send it to your email personally." }, { status: 500 });
  return NextResponse.json({ ok: true, pay });
}
