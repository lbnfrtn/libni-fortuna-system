import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { generateInstalmentLink } from "@/lib/orders";
import { isLoggedIn } from "@/lib/auth";

export const runtime = "nodejs";

// Regenerate a link for an instalment (Desk "resend"). Returns the link so the
// Desk can copy it or trigger the GHL "send by email" workflow.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id } = await params;
  const order = await store().get(id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let n = 1;
  try {
    const body = (await req.json()) as { instalmentN?: number };
    const next = order.instalments.find((i) => i.status !== "paid");
    n = body?.instalmentN ?? next?.n ?? 1;
  } catch {
    const next = order.instalments.find((i) => i.status !== "paid");
    n = next?.n ?? 1;
  }
  try {
    const inst = await generateInstalmentLink(id, n);
    return NextResponse.json({ ok: true, instalmentN: inst.n, link: inst.invoiceUrl, amount: inst.amountPHP });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 400 });
  }
}
