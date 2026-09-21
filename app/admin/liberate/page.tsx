import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { store } from "@/lib/store";
import { getContent } from "@/lib/content";
import { OFFERS } from "@/config/offers";
import { peso } from "@/lib/util";
import LiberateHQClient from "./LiberateHQClient";

export const dynamic = "force-dynamic";

export default async function LiberateHQ() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const [orders, content] = await Promise.all([store().list(), getContent()]);
  const lib = orders.filter((o) => o.offerSlug === "liberate" && o.status !== "cancelled");
  const members = lib.filter((o) => o.amountPaidPHP > 0);
  const pending = lib.filter((o) => o.amountPaidPHP === 0);
  const revenue = lib.reduce((s, o) => s + o.amountPaidPHP, 0);
  const owed = lib.reduce((s, o) => s + (o.status === "paid" ? 0 : o.balancePHP), 0);
  const offer = OFFERS.liberate;

  return (
    <>
      <AdminNav current="/admin/liberate" user={session} />
      <div className="wrap-wide">
        <p className="kicker">Liberate HQ</p>
        <h1 style={{ margin: "4px 0 6px" }}>{content.liberate.cohortLabel}</h1>
        <p className="muted" style={{ maxWidth: "70ch" }}>Your cohort in one place: who’s in, what they owe, and everything they see inside the member portal at <a href="/portal" target="_blank" rel="noreferrer">/portal</a>.</p>

        <div className="tiles" style={{ marginTop: 20 }}>
          <div className="tile"><div className="n">{members.length}</div><div className="l">Members (paid)</div></div>
          <div className="tile"><div className="n">{pending.length}</div><div className="l">Links out, unpaid</div></div>
          <div className="tile"><div className="n">{peso(revenue)}</div><div className="l">Collected</div></div>
          <div className="tile"><div className="n">{owed ? peso(owed) : "—"}</div><div className="l">Still owed</div></div>
        </div>

        <h2 style={{ marginTop: 36 }}>Members</h2>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead><tr><th>Member</th><th>Plan</th><th>Paid</th><th>Owed</th><th>Onboarding</th><th>Portal</th></tr></thead>
            <tbody>
              {lib.length === 0 && <tr><td colSpan={6} className="muted" style={{ padding: 20 }}>No Liberate orders yet. Create the first payment link from the <a href="/desk">Payment Desk</a> ({peso(offer.pricePHP ?? 0)} · {offer.instalmentCount} instalments available).</td></tr>}
              {lib.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.contact.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{o.contact.email}</span></td>
                  <td>{o.planType}</td>
                  <td>{peso(o.amountPaidPHP)}</td>
                  <td>{o.status === "paid" ? "—" : peso(o.balancePHP)}</td>
                  <td>{o.amountPaidPHP > 0 ? <span className={`pill ${o.onboarding?.complete ? "paid" : "pending"}`}>{o.onboarding?.complete ? "done" : "in progress"}</span> : <span className="muted">—</span>}</td>
                  <td>{o.amountPaidPHP > 0 ? <span className="pill paid">can sign in</span> : <span className="pill cancelled">after payment</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <LiberateHQClient initial={content.liberate} />
      </div>
    </>
  );
}
