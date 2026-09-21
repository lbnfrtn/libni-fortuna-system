import type { Order } from "@/lib/types";
import { peso } from "@/lib/util";

// Weekly digest to Libni (spec §5 Phase 5). Computed from orders (the money
// side). Lead-volume-by-source metrics live in GHL's own reporting; this
// covers what this system is the source of truth for: cash and pipeline value.

export interface Digest {
  from: string;
  to: string;
  newOrders: number;
  newOrderValuePHP: number;
  closes: number; // orders fully paid this week
  cashCollectedPHP: number; // actual money in, this week (incl. instalments)
  balancesOutstandingPHP: number; // across all open orders
  openOrders: number;
  stuck: Array<{ id: string; client: string; offer: string; ageDays: number }>;
  byOffer: Array<{ offer: string; newOrders: number; cashPHP: number }>;
}

function daysAgo(iso: string, now: number): number {
  return Math.floor((now - new Date(iso).getTime()) / 86_400_000);
}

export function buildDigest(orders: Order[], now = Date.now(), windowDays = 7): Digest {
  const windowStart = now - windowDays * 86_400_000;
  const inWindow = (iso?: string) => !!iso && new Date(iso).getTime() >= windowStart;

  let newOrders = 0,
    newOrderValuePHP = 0,
    closes = 0,
    cashCollectedPHP = 0,
    balancesOutstandingPHP = 0,
    openOrders = 0;
  const stuck: Digest["stuck"] = [];
  const byOfferMap = new Map<string, { newOrders: number; cashPHP: number }>();

  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const bucket = byOfferMap.get(o.offerName) || { newOrders: 0, cashPHP: 0 };

    if (inWindow(o.createdAt)) {
      newOrders++;
      newOrderValuePHP += o.totalPHP;
      bucket.newOrders++;
    }
    if (o.status === "paid" && inWindow(o.paidAt)) closes++;

    // Cash actually collected this week = paid instalments whose paidAt is in window.
    for (const inst of o.instalments) {
      if (inst.status === "paid" && inWindow(inst.paidAt)) {
        const amt = inst.paidAmountPHP ?? inst.amountPHP;
        cashCollectedPHP += amt;
        bucket.cashPHP += amt;
      }
    }

    if (o.status !== "paid") {
      balancesOutstandingPHP += o.balancePHP;
      openOrders++;
      // Stuck = created >7 days ago, nothing paid yet.
      if (o.amountPaidPHP === 0 && daysAgo(o.createdAt, now) > 7) {
        stuck.push({ id: o.id, client: o.contact.name, offer: o.offerName, ageDays: daysAgo(o.createdAt, now) });
      }
    }
    byOfferMap.set(o.offerName, bucket);
  }

  return {
    from: new Date(windowStart).toISOString().slice(0, 10),
    to: new Date(now).toISOString().slice(0, 10),
    newOrders,
    newOrderValuePHP,
    closes,
    cashCollectedPHP,
    balancesOutstandingPHP,
    openOrders,
    stuck: stuck.sort((a, b) => b.ageDays - a.ageDays),
    byOffer: [...byOfferMap.entries()]
      .filter(([, v]) => v.newOrders || v.cashPHP)
      .map(([offer, v]) => ({ offer, ...v })),
  };
}

/** Plain-text digest in Libni's inbox voice. */
export function renderDigest(d: Digest): string {
  const lines = [
    `Your week, ${d.from} → ${d.to}`,
    ``,
    `💰 Cash collected: ${peso(d.cashCollectedPHP)}`,
    `✅ Fully paid: ${d.closes}`,
    `🆕 New orders: ${d.newOrders} (${peso(d.newOrderValuePHP)} of value created)`,
    `⏳ Open orders: ${d.openOrders} · balances outstanding: ${peso(d.balancesOutstandingPHP)}`,
  ];
  if (d.byOffer.length) {
    lines.push(``, `By offer:`);
    for (const b of d.byOffer) lines.push(`  • ${b.offer}: ${b.newOrders} new, ${peso(b.cashPHP)} in`);
  }
  if (d.stuck.length) {
    lines.push(``, `Needs a look (open >7 days, nothing paid):`);
    for (const s of d.stuck) lines.push(`  • ${s.client} — ${s.offer} (${s.ageDays} days)`);
  } else {
    lines.push(``, `Nothing stuck. Clean week.`);
  }
  lines.push(``, `(Lead volume by source is in GHL's dashboard.)`);
  return lines.join("\n");
}
