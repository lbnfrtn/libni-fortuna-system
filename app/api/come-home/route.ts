import { NextResponse, after } from "next/server";
import { z } from "zod";
import { getOffer } from "@/config/offers";
import { intakeLead } from "@/lib/lead";
import { createOrder } from "@/lib/orders";
import { enrol } from "@/lib/funnel";
import { upsertContact } from "@/lib/emailoctopus";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Come Home to Yourself checkout: record the lead, make the order, put them
// on Libni's EmailOctopus list (tagged as having started checkout), and hand
// back the Xendit link. Paying is what unlocks the download (markPaid).
const schema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(120),
  email: z.string().trim().email("Please check your email address.").max(200),
  consent: z.literal(true, { errorMap: () => ({ message: "Please tick the box so I can send you your download and letters." }) }),
  source: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(`come-home:${clientIp(req)}`, 6, 60_000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a moment and try again." }, { status: 429 });
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
  const offer = getOffer("come-home");
  if (!offer || offer.pricePHP == null) return NextResponse.json({ error: "This isn't available right now." }, { status: 400 });

  try {
    await intakeLead({ name: d.name, email: d.email, offerSlug: offer.slug, track: "consumer", consent: true, source: d.source || "website" });
  } catch (e) {
    console.error("[come-home] could not record lead", e);
    return NextResponse.json({ error: "Sorry — that didn't go through. Please try again in a moment." }, { status: 500 });
  }

  let order;
  try {
    order = await createOrder({ offerSlug: offer.slug, planType: "full", contact: { name: d.name, email: d.email }, createdBy: "website" });
  } catch (e) {
    console.error("[come-home] could not create order", e);
    return NextResponse.json({ error: "Checkout is having a moment. Please try again, or email hello@libni.co." }, { status: 502 });
  }
  const first = order.instalments[0];
  const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
  const manualPayUrl = `${base}/pay/${order.id}`;

  // After the response: the not-yet-paid nudges (first one a day later; they stop the moment they pay) and the list.
  after(async () => {
    await enrol({ email: d.email, name: d.name, trigger: "checkout:come-home", vars: { offer: offer.name, payment_link: first.invoiceUrl || manualPayUrl, amount: String(first.amountPHP) } }).catch(() => {});
    if (offer.emailOctopus) {
      const r = await upsertContact({ email: d.email, name: d.name, tags: { [offer.emailOctopus.started]: true } });
      if (!r.ok) console.error("[come-home] EmailOctopus:", r.error);
    }
  });

  return NextResponse.json({ ok: true, orderId: order.id, link: first.invoiceUrl, manualPayUrl, amount: first.amountPHP });
}
