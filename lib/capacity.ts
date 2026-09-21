import { getOffer } from "@/config/offers";
import { store } from "@/lib/store";

// Capacity for capped offers (e.g. Essence retreat, max 20). A "seat" = one
// order for that offer that has at least a deposit paid (status paid, or a
// paid first instalment). When seats reach capacity, the offer flips to
// waitlist automatically.
export async function paidSeats(offerSlug: string): Promise<number> {
  const orders = await store().list();
  return orders.filter(
    (o) => o.offerSlug === offerSlug && (o.status === "paid" || o.instalments.some((i) => i.status === "paid"))
  ).length;
}

export async function remainingSeats(offerSlug: string): Promise<number | null> {
  const offer = getOffer(offerSlug);
  if (!offer?.capacity) return null;
  return Math.max(0, offer.capacity - (await paidSeats(offerSlug)));
}

export async function isFull(offerSlug: string): Promise<boolean> {
  const remaining = await remainingSeats(offerSlug);
  return remaining !== null && remaining <= 0;
}
