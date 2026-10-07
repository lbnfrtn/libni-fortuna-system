import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { dueReminders } from "@/lib/reminders";
import { generateInstalmentLink } from "@/lib/orders";
import { notifyTeam } from "@/lib/notify";
import { todayISO, peso } from "@/lib/util";
import { enrol, runDue } from "@/lib/funnel";

export const runtime = "nodejs";

// Daily job (Vercel Cron -> see vercel.json). Finds instalments coming due /
// overdue, sends the reminder letter, and alerts Libni / the EA ONCE per
// overdue instalment.
// Protected by CRON_SECRET so only the scheduler can trigger it.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = todayISO();
  const orders = await store().list();
  const actions = dueReminders(orders, today);
  let processed = 0;

  for (const a of actions) {
    const order = await store().get(a.orderId);
    if (!order) continue;
    const inst = order.instalments.find((i) => i.n === a.instalmentN);
    if (!inst) continue;

    // Make sure a fresh link exists for the instalment coming due.
    if (!inst.invoiceUrl && a.kind !== "overdue") {
      try {
        await generateInstalmentLink(order.id, inst.n);
      } catch {
        /* link generation is best-effort */
      }
    }

    if (a.kind === "overdue") {
      // Alert the team, but only once per instalment.
      const already = order.events.some((e) => e.type === "overdue-tasked" && e.note.includes(`i${inst.n}`));
      if (!already) {
        await notifyTeam("Instalment overdue — please follow up (human, not a threat)", {
          order: order.id, client: a.name, offer: a.offerSlug, amount: a.amountPHP, due: a.dueDate,
        });
        order.events.push({ at: new Date().toISOString(), type: "overdue-tasked", note: `i${inst.n}` });
        await store().put(order);
      }
    }
    // The reminder letter itself — one per instalment per kind, never twice.
    const base = (process.env.APP_BASE_URL || "").replace(/\/$/, "");
    await enrol({
      email: order.contact.email, name: order.contact.name, trigger: "instalment-due", key: `inst:${order.id}:${inst.n}:${a.kind}`,
      vars: { offer: order.offerName, amount: peso(inst.amountPHP), due: a.kind === "overdue" ? `${inst.dueDate} (now overdue)` : inst.dueDate, payment_link: inst.invoiceUrl || `${base}/pay/${order.id}` },
    }).catch(() => {});
    processed++;
  }

  // Any sequence letters that came due since the last hourly run.
  const mail = await runDue().catch(() => ({ sent: 0, failed: 0 }));

  return NextResponse.json({ ok: true, today, reminders: actions.length, processed, mail });
}
