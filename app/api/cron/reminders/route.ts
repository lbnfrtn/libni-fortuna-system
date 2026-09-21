import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { dueReminders } from "@/lib/reminders";
import { generateInstalmentLink } from "@/lib/orders";
import { addTags, setCustomFields, notifyTeam } from "@/lib/ghl";
import { knownFields } from "@/config/ghl-map";
import { tag } from "@/lib/tags";
import { todayISO } from "@/lib/util";

export const runtime = "nodejs";

// Daily job (Vercel Cron -> see vercel.json). Finds instalments coming due /
// overdue and nudges via GHL tags + fields; overdue creates an EA task ONCE.
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
    const contactId = order.contact.ghlContactId;

    // Make sure a fresh link exists for the instalment coming due.
    if (!inst.invoiceUrl && a.kind !== "overdue") {
      try {
        await generateInstalmentLink(order.id, inst.n);
      } catch {
        /* link generation is best-effort */
      }
    }

    if (contactId) {
      await setCustomFields(contactId, knownFields({ nextInstalmentDue: inst.dueDate }));
      if (a.kind === "overdue") {
        // Tag + EA task, but only once per instalment.
        const already = order.events.some((e) => e.type === "overdue-tasked" && e.note.includes(`i${inst.n}`));
        await addTags(contactId, [tag.instalmentOverdue()]);
        if (!already) {
          await notifyTeam("Instalment overdue — please follow up (human, not a threat)", {
            order: order.id, client: a.name, offer: a.offerSlug, amount: a.amountPHP, due: a.dueDate,
          });
          order.events.push({ at: new Date().toISOString(), type: "overdue-tasked", note: `i${inst.n}` });
          await store().put(order);
        }
      } else {
        await addTags(contactId, [tag.instalmentDue()]);
      }
    }
    processed++;
  }

  return NextResponse.json({ ok: true, today, reminders: actions.length, processed });
}
