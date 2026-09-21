import { promises as fs } from "node:fs";
import path from "node:path";
import { store } from "@/lib/store";
import { listLeads } from "@/lib/leadlog";
import { getOffer } from "@/config/offers";
import type { Order, LeadEntry } from "@/lib/types";

// ============================================================================
// The Dubsado-style view: every lead and every order merged into one person
// with one pipeline stage. Stages are DERIVED from what actually happened
// (form, link, payment, onboarding) so they can never drift; Libni can only
// override the human steps in between (call booked, proposal sent, lost).
// GoHighLevel stays the system of record for contacts + every message sent.
// ============================================================================

export const STAGES = [
  "inquiry", "applied", "call", "proposal", "link", "awaiting", "paid", "onboarded", "lost",
] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  inquiry: "New inquiry",
  applied: "Applied",
  call: "Call booked",
  proposal: "Proposal sent",
  link: "Payment link sent",
  awaiting: "Awaiting payment",
  paid: "Paid",
  onboarded: "Client · onboarded",
  lost: "Not now",
};

/** Stages Libni may set by hand; the rest come from the system. */
export const MANUAL_STAGES: Stage[] = ["call", "proposal", "lost"];

export interface CrmNote {
  stage?: Stage;
  note?: string;
  nextAction?: string;
  updatedAt: string;
}

export interface Person {
  email: string;
  name: string;
  phone?: string;
  ghlContactId?: string;
  stage: Stage;
  /** True when the stage came from the system, not a manual override. */
  derived: boolean;
  offers: string[];
  interestedIn: string[];
  sources: string[];
  firstSeen: string;
  lastActivity: string;
  paidPHP: number;
  balancePHP: number;
  orders: Order[];
  leads: LeadEntry[];
  note?: string;
  nextAction?: string;
}

// ---------------------------------------------------------------- notes store
const FILE = path.join(process.cwd(), "data", "crm.json");
type NotesMap = Record<string, CrmNote>;

async function fileRead(): Promise<NotesMap> {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")) as NotesMap; } catch { return {}; }
}
async function fileWrite(m: NotesMap): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(m, null, 2), "utf8");
}
/* eslint-disable @typescript-eslint/no-explicit-any */
async function firestoreDoc(): Promise<any> {
  const appPkg = "firebase-admin/app";
  const fsPkg = "firebase-admin/firestore";
  const appMod: any = await import(/* webpackIgnore: true */ appPkg);
  const fsMod: any = await import(/* webpackIgnore: true */ fsPkg);
  const { getApps, initializeApp, cert } = appMod;
  const { getFirestore } = fsMod;
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    const credential = raw ? cert(raw.trim().startsWith("{") ? JSON.parse(raw) : raw) : undefined;
    initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID });
  }
  return getFirestore().collection("lf_crm").doc("notes");
}
/* eslint-enable @typescript-eslint/no-explicit-any */
const useFirestore = () => process.env.ORDER_STORE === "firestore";

export async function getNotes(): Promise<NotesMap> {
  if (!useFirestore()) return fileRead();
  try { const s = await (await firestoreDoc()).get(); return s.exists ? (s.data() as NotesMap) : {}; } catch { return {}; }
}
export async function setNote(email: string, patch: Partial<CrmNote>): Promise<CrmNote> {
  const key = email.toLowerCase().trim();
  const all = await getNotes();
  const next: CrmNote = { ...(all[key] ?? { updatedAt: "" }), ...patch, updatedAt: new Date().toISOString() };
  if (patch.stage === undefined && "stage" in patch) delete next.stage;
  all[key] = next;
  if (useFirestore()) await (await firestoreDoc()).set(all);
  else await fileWrite(all);
  return next;
}

// ---------------------------------------------------------------- derivation
function systemStage(orders: Order[], leads: LeadEntry[]): Stage {
  const live = orders.filter((o) => o.status !== "cancelled");
  if (live.some((o) => o.amountPaidPHP > 0 && o.onboarding?.complete)) return "onboarded";
  if (live.some((o) => o.amountPaidPHP > 0)) return "paid";
  if (live.some((o) => o.status === "submitted" || o.status === "verified")) return "awaiting";
  if (live.some((o) => o.status === "pending")) return "link";
  if (leads.some((l) => l.source.startsWith("apply") || l.source === "application")) return "applied";
  return "inquiry";
}

/** Everyone who has ever reached out or paid, newest activity first. */
export async function people(): Promise<Person[]> {
  const [orders, leads, notes] = await Promise.all([store().list(), listLeads(2000), getNotes()]);
  const map = new Map<string, Person>();
  const key = (e: string) => e.toLowerCase().trim();

  for (const l of leads) {
    const k = key(l.email);
    const p = map.get(k) ?? { email: l.email, name: l.name, ghlContactId: l.ghlContactId, stage: "inquiry", derived: true, offers: [], interestedIn: [], sources: [], firstSeen: l.at, lastActivity: l.at, paidPHP: 0, balancePHP: 0, orders: [], leads: [] };
    p.leads.push(l);
    const offer = getOffer(l.offerSlug)?.name ?? l.offerSlug;
    if (offer && !p.interestedIn.includes(offer)) p.interestedIn.push(offer);
    if (!p.sources.includes(l.source)) p.sources.push(l.source);
    if (l.at < p.firstSeen) p.firstSeen = l.at;
    if (l.at > p.lastActivity) p.lastActivity = l.at;
    p.ghlContactId ??= l.ghlContactId;
    map.set(k, p);
  }
  for (const o of orders) {
    const k = key(o.contact.email);
    const p = map.get(k) ?? { email: o.contact.email, name: o.contact.name, phone: o.contact.phone, ghlContactId: o.contact.ghlContactId, stage: "inquiry", derived: true, offers: [], interestedIn: [], sources: [], firstSeen: o.createdAt, lastActivity: o.createdAt, paidPHP: 0, balancePHP: 0, orders: [], leads: [] };
    p.orders.push(o);
    p.phone ??= o.contact.phone;
    p.ghlContactId ??= o.contact.ghlContactId;
    if (o.status !== "cancelled") {
      if (!p.offers.includes(o.offerName)) p.offers.push(o.offerName);
      p.paidPHP += o.amountPaidPHP;
      p.balancePHP += o.status === "paid" ? 0 : o.balancePHP;
    }
    const last = o.paidAt ?? o.createdAt;
    if (last > p.lastActivity) p.lastActivity = last;
    if (o.createdAt < p.firstSeen) p.firstSeen = o.createdAt;
    map.set(k, p);
  }

  for (const [k, p] of map) {
    const sys = systemStage(p.orders, p.leads);
    const n = notes[k];
    // A manual stage only holds while the system hasn't moved them further.
    const order = STAGES.indexOf(sys);
    const manual = n?.stage && (n.stage === "lost" || STAGES.indexOf(n.stage) > order) ? n.stage : undefined;
    p.stage = manual ?? sys;
    p.derived = !manual;
    p.note = n?.note;
    p.nextAction = n?.nextAction;
    if (n?.updatedAt && n.updatedAt > p.lastActivity) p.lastActivity = n.updatedAt;
  }
  return [...map.values()].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
}
