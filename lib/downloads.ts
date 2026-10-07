import { createHmac, timingSafeEqual } from "node:crypto";
import type { Order } from "@/lib/types";
import { getOffer } from "@/config/offers";

// ============================================================================
// Digital products: signed links to a buyer's own welcome/download page.
// The files live under public/dl/<random folder> — the folder name is never
// shown until an order is paid, and the page itself only opens with a token
// signed from the order id, so an order id alone (or a guess) gets nothing.
// ============================================================================

const secret = () => process.env.PORTAL_SECRET || process.env.DESK_PASSCODE || "local-dev-downloads";

export function orderToken(orderId: string): string {
  return createHmac("sha256", secret()).update(`order:${orderId}`).digest("base64url").slice(0, 24);
}

export function orderTokenValid(orderId: string, token: string | null | undefined): boolean {
  const a = Buffer.from(orderToken(orderId));
  const b = Buffer.from(String(token || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

function baseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:4310").replace(/\/$/, "");
}

/** Where a buyer lands after paying — the offer's own page if it has one, else /welcome/<slug>. */
export function welcomeLink(order: Pick<Order, "id" | "offerSlug">): string {
  const offer = getOffer(order.offerSlug);
  const path = offer?.welcomePath ?? `/welcome/${order.offerSlug}`;
  return `${baseUrl()}${path}?o=${encodeURIComponent(order.id)}&t=${orderToken(order.id)}`;
}

/** The files a paid order unlocks. Paths are served statically from public/. */
export const DOWNLOADS: Record<string, { label: string; detail: string; href: string; kind: "pdf" | "audio" }[]> = {
  "come-home": [
    { label: "The workbook", detail: "PDF · 17 pages · print it, or open it on any device", href: "/dl/ch-342153b9fe2cb1b33007/Come-Home-to-Yourself-Workbook.pdf", kind: "pdf" },
    { label: "The guided meditation", detail: "MP3 · 15 minutes · listen anywhere", href: "/dl/ch-342153b9fe2cb1b33007/Come-Home-to-Yourself-Guided-Meditation.mp3", kind: "audio" },
  ],
};
