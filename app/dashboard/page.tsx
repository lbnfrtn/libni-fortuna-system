import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { store } from "@/lib/store";
import { buildDigest } from "@/lib/digest";
import { remainingSeats } from "@/lib/capacity";
import { getOffer } from "@/config/offers";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;

  const orders = await store().list();
  const d = buildDigest(orders);
  const essenceLeft = await remainingSeats("essence-retreat");

  const open = orders.filter((o) => o.status !== "paid" && o.status !== "cancelled");
  const submitted = open.filter((o) => o.status === "submitted");
  const recent = orders.slice(0, 8);

  return (
    <>
    <AdminNav current="/dashboard" user={session} />
    <div className="wrap-wide">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div><p className="kicker">Overview</p><h1 style={{ margin: "4px 0" }}>Your business, right now</h1></div>
      </div>

      <p className="muted" style={{ fontSize: 14 }}>This week ({d.from} → {d.to})</p>
      <div className="tiles">
        <div className="tile"><div className="n">{peso(d.cashCollectedPHP)}</div><div className="l">Cash collected</div></div>
        <div className="tile"><div className="n">{d.closes}</div><div className="l">Fully paid</div></div>
        <div className="tile"><div className="n">{d.newOrders}</div><div className="l">New orders</div></div>
        <div className="tile"><div className="n">{peso(d.balancesOutstandingPHP)}</div><div className="l">Outstanding</div></div>
      </div>

      <div className="tiles" style={{ marginTop: 14 }}>
        <div className="tile"><div className="n">{open.length}</div><div className="l">Open orders</div></div>
        <div className="tile"><div className="n">{submitted.length}</div><div className="l">Awaiting your verify</div></div>
        <div className="tile"><div className="n">{d.stuck.length}</div><div className="l">Stuck &gt;7 days</div></div>
        <div className="tile"><div className="n">{essenceLeft ?? "—"}</div><div className="l">Essence seats left</div></div>
      </div>

      <div className="row" style={{ marginTop: 20 }}>
        <Link href="/desk" className="btn">Open the Payment Desk</Link>
        <Link href="/desk/import" className="btn ghost">Import backlog</Link>
      </div>

      {submitted.length > 0 && (
        <>
          <h2 style={{ marginTop: 36 }}>Needs your verify now</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead><tr><th>Client</th><th>Offer</th><th>Reference</th></tr></thead>
              <tbody>
                {submitted.map((o) => (
                  <tr key={o.id}><td>{o.contact.name}</td><td>{o.offerName}</td><td>{o.manual?.reference}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {d.stuck.length > 0 && (
        <>
          <h2 style={{ marginTop: 36 }}>Worth a look (nothing paid, &gt;7 days)</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead><tr><th>Client</th><th>Offer</th><th>Age</th></tr></thead>
              <tbody>
                {d.stuck.map((s) => (
                  <tr key={s.id}><td>{s.client}</td><td>{s.offer}</td><td>{s.ageDays} days</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 style={{ marginTop: 36 }}>Recent activity</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>Client</th><th>Offer</th><th>Status</th><th>Amount</th><th>When</th></tr></thead>
          <tbody>
            {recent.length === 0 && <tr><td colSpan={5} className="muted" style={{ padding: 20 }}>No orders yet.</td></tr>}
            {recent.map((o) => (
              <tr key={o.id}>
                <td>{o.contact.name}</td>
                <td>{o.offerName}</td>
                <td><span className={`pill ${o.status}`}>{o.status}</span></td>
                <td>{peso(o.amountPaidPHP)} / {peso(o.totalPHP)}</td>
                <td className="muted" style={{ fontSize: 13 }}>{o.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>
        Lead volume by source is under <Link href="/admin/leads">Leads</Link>; pipeline stages live in GoHighLevel. This shows the money side, where this system is the source of truth.
      </p>
    </div>
    </>
  );
}
