import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { listLeads } from "@/lib/leadlog";
import { getOffer } from "@/config/offers";

export const dynamic = "force-dynamic";

export default async function Leads() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const leads = await listLeads(500);
  const weekAgo = Date.now() - 7 * 86_400_000;
  const week = leads.filter((l) => new Date(l.at).getTime() > weekAgo);

  // by source, this week
  const bySource = new Map<string, number>();
  for (const l of week) bySource.set(l.source || "unknown", (bySource.get(l.source || "unknown") || 0) + 1);

  return (
    <>
      <AdminNav current="/admin/leads" user={session} />
      <div className="wrap-wide">
        <p className="kicker">Leads</p>
        <h1 style={{ margin: "4px 0 6px" }}>{week.length} this week · {leads.length} total</h1>
        <p className="muted">
          Every form, application, waitlist and newsletter signup — with where they came from. Application answers live in GoHighLevel only (they can be sensitive).
        </p>

        {bySource.size > 0 && (
          <div className="tiles" style={{ marginTop: 16, gridTemplateColumns: `repeat(${Math.min(4, bySource.size)}, 1fr)` }}>
            {[...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s, n]) => (
              <div key={s} className="tile"><div className="n">{n}</div><div className="l">{s}</div></div>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
          <table>
            <thead><tr><th>When</th><th>Who</th><th>Interested in</th><th>Source</th><th>Status</th></tr></thead>
            <tbody>
              {leads.length === 0 && <tr><td colSpan={5} className="muted" style={{ padding: 20 }}>No leads logged yet. They&rsquo;ll appear here as forms come in.</td></tr>}
              {leads.map((l, i) => (
                <tr key={i}>
                  <td className="muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{l.at.slice(0, 10)}</td>
                  <td><strong>{l.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{l.email}</span></td>
                  <td>{getOffer(l.offerSlug)?.name ?? l.offerSlug}<br /><span className="muted" style={{ fontSize: 12 }}>{l.track}</span></td>
                  <td>{l.source}{l.sourceDetail ? <><br /><span className="muted" style={{ fontSize: 12 }}>{l.sourceDetail}</span></> : null}</td>
                  <td>
                    {l.waitlisted && <span className="pill pending">waitlist</span>}
                    {l.parked && <span className="pill submitted" style={{ marginLeft: 4 }}>parked (GHL down)</span>}
                    {!l.waitlisted && !l.parked && <span className="pill paid">in GHL</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
