import type { Order } from "@/lib/types";
import { promises as fs } from "node:fs";
import path from "node:path";

// ============================================================================
// Order store. One tiny interface, two adapters:
//   - "file"      : JSON files under /data. For local dev + tests. No cloud.
//   - "firestore" : production (Firebase). Server-side only.
// The rest of the code never knows which one it's talking to.
// ============================================================================

export interface OrderStore {
  get(id: string): Promise<Order | null>;
  put(order: Order): Promise<void>;
  /** Find the order that owns a given Xendit external_id (handles "#iN"). */
  findByExternalId(externalId: string): Promise<Order | null>;
  list(): Promise<Order[]>;
}

// ---------------------------------------------------------------- file adapter
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "orders.json");

class FileStore implements OrderStore {
  private async readAll(): Promise<Record<string, Order>> {
    try {
      const raw = await fs.readFile(FILE, "utf8");
      return JSON.parse(raw) as Record<string, Order>;
    } catch (e: unknown) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return {};
      throw e;
    }
  }
  private async writeAll(all: Record<string, Order>): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
  }
  async get(id: string): Promise<Order | null> {
    return (await this.readAll())[id] ?? null;
  }
  async put(order: Order): Promise<void> {
    const all = await this.readAll();
    all[order.id] = order;
    await this.writeAll(all);
  }
  async findByExternalId(externalId: string): Promise<Order | null> {
    const orderId = externalId.split("#")[0]; // strip "#iN"
    return this.get(orderId);
  }
  async list(): Promise<Order[]> {
    return Object.values(await this.readAll()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }
}

// ------------------------------------------------------------ firestore adapter
// Lazy-loaded so local/test mode never needs firebase-admin installed or creds.
// Typed loosely on purpose: firebase-admin is an OPTIONAL production dependency
// (`npm i firebase-admin`) and is not present during local dev/test, so we
// don't import its types. See HANDOFF.md "Going to production".
/* eslint-disable @typescript-eslint/no-explicit-any */
class FirestoreStore implements OrderStore {
  private col: any = null;
  private async collection(): Promise<any> {
    if (this.col) return this.col;
    // Variable specifiers keep BOTH the bundler and TypeScript from resolving
    // firebase-admin at build time; it's an optional dep only needed at runtime
    // when ORDER_STORE=firestore in production (`npm i firebase-admin`).
    const appPkg = "firebase-admin/app";
    const fsPkg = "firebase-admin/firestore";
    const appMod: any = await import(/* webpackIgnore: true */ appPkg);
    const fsMod: any = await import(/* webpackIgnore: true */ fsPkg);
    const { getApps, initializeApp, cert } = appMod;
    const { getFirestore } = fsMod;
    if (!getApps().length) {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
      const credential = raw
        ? cert(raw.trim().startsWith("{") ? JSON.parse(raw) : raw)
        : undefined;
      initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID });
    }
    this.col = getFirestore().collection("lf_orders");
    return this.col;
  }
  async get(id: string): Promise<Order | null> {
    const doc = await (await this.collection()).doc(id).get();
    return doc.exists ? (doc.data() as Order) : null;
  }
  async put(order: Order): Promise<void> {
    await (await this.collection()).doc(order.id).set(order);
  }
  async findByExternalId(externalId: string): Promise<Order | null> {
    return this.get(externalId.split("#")[0]);
  }
  async list(): Promise<Order[]> {
    const snap = await (await this.collection())
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();
    return snap.docs.map((d: any) => d.data() as Order);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

let _store: OrderStore | null = null;
export function store(): OrderStore {
  if (_store) return _store;
  _store = process.env.ORDER_STORE === "firestore" ? new FirestoreStore() : new FileStore();
  return _store;
}

/** For tests: inject a store (usually an in-memory one). */
export function setStore(s: OrderStore): void {
  _store = s;
}
