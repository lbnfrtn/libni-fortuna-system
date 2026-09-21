import type { LeadEntry } from "@/lib/types";
import { promises as fs } from "node:fs";
import path from "node:path";

// ============================================================================
// Lead log — a non-sensitive record of every inquiry so the admin can see
// who reached out, for what, from where. Application ANSWERS are never stored
// here (they go to GHL only). File adapter for dev, Firestore for production.
// ============================================================================

const FILE = path.join(process.cwd(), "data", "leads.json");

async function fileRead(): Promise<LeadEntry[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as LeadEntry[];
  } catch {
    return [];
  }
}
async function fileWrite(all: LeadEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function firestoreCol(): Promise<any> {
  const appPkg = "firebase-admin/app";
  const fsPkg = "firebase-admin/firestore";
  const appMod: any = await import(/* webpackIgnore: true */ appPkg);
  const fsMod: any = await import(/* webpackIgnore: true */ fsPkg);
  if (!appMod.getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    appMod.initializeApp({
      credential: raw ? appMod.cert(raw.trim().startsWith("{") ? JSON.parse(raw) : raw) : undefined,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  return fsMod.getFirestore().collection("lf_leads");
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const useFirestore = () => process.env.ORDER_STORE === "firestore";

export async function logLead(entry: LeadEntry): Promise<void> {
  if (useFirestore()) {
    await (await firestoreCol()).add(entry);
    return;
  }
  const all = await fileRead();
  all.unshift(entry);
  await fileWrite(all.slice(0, 5000));
}

export async function listLeads(limit = 500): Promise<LeadEntry[]> {
  if (useFirestore()) {
    const snap = await (await firestoreCol()).orderBy("at", "desc").limit(limit).get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snap.docs.map((d: any) => d.data() as LeadEntry);
  }
  return (await fileRead()).slice(0, limit);
}
