import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { store } from "@/lib/store";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

interface ClientRow {
  name: string; email: string; phone?: string; offers: string[];
  paid: number; balance: number; orders: number; last: string; hasOpen: boolean; onboarding: string;
}

export default async function Clients() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const orders = await store().list();

  const map = new Map<string, ClientRow>();
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const k = o.contact.email.toLowerCase();
    const r = map.get(k) ?? { name: o.contact.name, email: o.contact.email, phone: o.contact.phone, offers: [], paid: 0, balance: 0, orders: 0, last: o.createdAt, hasOpen: false, onboarding: "" };
    if (!r.offers.includes(o.offerName)) r.offers.push(o.offerName);
    r.paid += o.amountPaidPHP;
    r.balance += o.status === "paid" ? 0 : o.balancePHP;
    r.orders += 1;
    if (o.createdAt > r.last) r.last = o.createdAt;
    if (o.status !== "paid") r.hasOpen = true;
    if (o.amountPaidPHP > 0 && !o.onboarding?.complete) r.onboarding = "in progress";
    else if (o.onboarding?.complete && !r.onboarding) r.onboarding = "done";
    map.set(k, r);
  }
  const rows = [...map.values()].sort((a, b) => b.last.localeCompare(a.last));

  return (
    <>
      <AdminNav current="/admin/clients" user={session} />
      <div className="wrap-wide">
        <p className="kicker">Clients</p>
        <h1 style={{ margin: "4px 0 6px" }}>{rows.length} {rows.length === 1 ? "person" : "people"}</h1>
        <p className="muted">Everyone with an order. Leads who haven&rsquo;t bought yet are under <a href="/admin/leads">Leads</a>.</p>
        <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
          <table>
            <thead><tr><th>Client</th><th>Programs</th><th>Paid</th><th>Owed</th><th>Onboarding</th><th>Last</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="muted" style={{ padding: 20 }}>No clients yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.email}>
                  <td><strong>{r.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{r.email}{r.phone ? ` · ${r.phone}` : ""}</span></td>
                  <td>{r.offers.join(", ")}<br /><span className="muted" style={{ fontSize: 12 }}>{r.orders} order{r.orders > 1 ? "s" : ""}</span></td>
                  <td>{peso(r.paid)}</td>
                  <td>{r.balance ? <span style={{ color: "var(--plum)" }}>{peso(r.balance)}</span> : "—"}</td>
                  <td>{r.onboarding ? <span className={`pill ${r.onboarding === "done" ? "paid" : "pending"}`}>{r.onboarding}</span> : "—"}</td>
                  <td className="muted" style={{ fontSize: 13 }}>{r.last.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
