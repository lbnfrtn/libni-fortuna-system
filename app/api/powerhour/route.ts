import { NextResponse } from "next/server";
import { z } from "zod";
import { getOffer } from "@/config/offers";
import { intakeLead } from "@/lib/lead";
import { createOrder } from "@/lib/orders";
import { enrol } from "@/lib/funnel";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// The Power Hour books itself: choose a format, leave your details, pay, then
// pick a time. This creates the lead and the order in one go and hands back
// the payment link (Xendit) plus the bank-transfer page.
const schema = z.object({
  format: z.enum(["online", "in-person"]),
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  intention: z.string().max(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please tick the box so I'm allowed to contact you." }) }),
  source: z.string().max(120).optional(),
  company_website: z.string().optional(), // ignored (was a honeypot; autofill tripped real buyers)
});

export async function POST(req: Request) {
  if (!rateLimit(`powerhour:${clientIp(req)}`, 6, 60_000)) {
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
  const slug = d.format === "online" ? "ignite" : "ignite-in-person";
  const offer = getOffer(slug);
  if (!offer || offer.pricePHP == null) return NextResponse.json({ error: "This session isn't open right now." }, { status: 400 });

  const lead = await intakeLead({
    name: d.name, email: d.email, phone: d.phone, offerSlug: slug, track: "consumer",
    answers: { format: d.format, intention: d.intention ?? "" }, consent: true, source: d.source || "website",
  });
  const order = await createOrder({
    offerSlug: slug, planType: "full",
    contact: { name: d.name, email: d.email, phone: d.phone, ghlContactId: lead.contactId },
    createdBy: "website",
  });
  const first = order.instalments[0];
  const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
  const manualPayUrl = `${base}/pay/${order.id}`;
  await enrol({
    email: d.email, name: d.name, trigger: "payment-pending",
    vars: { offer: offer.name, payment_link: first.invoiceUrl || manualPayUrl, amount: String(first.amountPHP) },
  }).catch(() => {});

  return NextResponse.json({ ok: true, orderId: order.id, link: first.invoiceUrl, manualPayUrl, amount: first.amountPHP, offer: offer.name });
}
