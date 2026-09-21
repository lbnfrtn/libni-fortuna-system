import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validate";
import { createOrder, nextUnpaid } from "@/lib/orders";
import { store } from "@/lib/store";
import { isLoggedIn } from "@/lib/auth";

export const runtime = "nodejs";

// List open/all orders for the Desk.
export async function GET() {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const orders = await store().list();
  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      offer: o.offerName,
      client: o.contact.name,
      email: o.contact.email,
      status: o.status,
      total: o.totalPHP,
      paid: o.amountPaidPHP,
      balance: o.balancePHP,
      plan: o.planType,
      createdAt: o.createdAt,
      next: nextUnpaid(o),
      firstLink: o.instalments[0]?.invoiceUrl,
      manualRef: o.manual?.reference,
    })),
  });
}

// Create an order + first payment link.
export async function POST(req: Request) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the form." }, { status: 400 });
  }
  try {
    const order = await createOrder({ ...parsed.data, createdBy: session.email });
    const first = order.instalments[0];
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      link: first.invoiceUrl,
      amount: first.amountPHP,
      manualPayUrl: `${process.env.APP_BASE_URL || ""}/pay/${order.id}`,
      instalments: order.instalments.map((i) => ({ n: i.n, amount: i.amountPHP, dueDate: i.dueDate })),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 400 });
  }
}
