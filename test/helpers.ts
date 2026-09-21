import type { Order } from "@/lib/types";
import type { OrderStore } from "@/lib/store";
import { setStore } from "@/lib/store";

// In-memory store so tests never touch disk, Firestore or the network.
export class MemStore implements OrderStore {
  map = new Map<string, Order>();
  async get(id: string) {
    return this.map.get(id) ?? null;
  }
  async put(order: Order) {
    this.map.set(order.id, order);
  }
  async findByExternalId(externalId: string) {
    return this.get(externalId.split("#")[0]);
  }
  async list() {
    return [...this.map.values()];
  }
}

export function useMemStore(): MemStore {
  const s = new MemStore();
  setStore(s);
  return s;
}
