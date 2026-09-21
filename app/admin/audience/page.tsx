import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { listLeads } from "@/lib/leadlog";
import { getOffer } from "@/config/offers";

export const dynamic = "force-dynamic";

// The email-marketing side. Sending lives in GoHighLevel (deliverability,
// unsubscribe law, sequences); this page shows who is on the list, where they
// came from, and which automated sequences exist — with one-click export.
const SEQUENCES: [string, string, string][] = [
  ["Letters from Libni", "newsletter · free-guide", "Nurture: the free guide, then soft letters. Broadcasts go out from GHL."],
  ["Applied, didn’t book a call", "apply", "3 gentle nudges over 7 days to book the discovery call."],
  ["Booked, no-show", "call", "Reschedule invitation, then a check-in."],
  ["Call done, no payment", "proposal", "Two follow-ups: what’s in the way, then a warm door left open."],
  ["Payment link opened, not completed", "link", "Reminder at 24h and 72h; link expires cleanly."],
  ["Instalment due", "instalment-due", "Reminder 3 days before, on the day, and 2 days after."],
  ["Waitlist — a spot opened", "waitlist", "First-come note with a 48h hold."],
  ["Paid: welcome + onboarding", "paid:<offer>", "Welcome, agreement, intake, first-session booking — per offer."],
];

export default async function Audience() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const leads = await listLeads(5000);
  const uniq = new Map<string, (typeof leads)[number]>();
  for (const l of leads.slice().reverse()) uniq.set(l.email.toLowerCase(), l);
  const list = [...uniq.values()].reverse();
  const day = 86_400_000;
  const grew = (days: number) => list.filter((l) => Date.now() - new Date(l.at).getTime() < days * day).length;
  const bySource = new Map<string, number>();
  for (const l of list) bySource.set(l.source || "unknown", (bySource.get(l.source || "unknown") || 0) + 1);
  const byOffer = new Map<string, number>();
  for (const l of list) { const n = getOffer(l.offerSlug)?.name ?? l.offerSlug; byOffer.set(n, (byOffer.get(n) || 0) + 1); }
  const ghl = process.env.GHL_LOCATION_ID ? `https://app.gohighlevel.com/v2/location/${process.env.GHL_LOCATION_ID}/marketing/emails` : "https://app.gohighlevel.com";

  return (
    <>
      <AdminNav current="/admin/audience" user={session} />
      <div className="wrap-wide">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p className="kicker">Audience &amp; email</p>
            <h1 style={{ margin: "4px 0 6px" }}>{list.length} people on your list</h1>
            <p className="muted" style={{ maxWidth: "64ch" }}>Everyone who has opted in through the site. Write to them from GoHighLevel — that’s where sending, unsubscribes and the automated sequences live.</p>
          </div>
          <div className="row">
            <a className="btn" href={ghl} target="_blank" rel="noreferrer">Write a letter in GHL</a>
            <a className="btn ghost" href="/api/audience">Export CSV</a>
          </div>
        </div>

        <div className="tiles" style={{ marginTop: 20 }}>
          <div className="tile"><div className="n">{grew(7)}</div><div className="l">New this week</div></div>
          <div className="tile"><div className="n">{grew(30)}</div><div className="l">New in 30 days</div></div>
          <div className="tile"><div className="n">{bySource.get("newsletter") ?? 0}</div><div className="l">Letters signups</div></div>
          <div className="tile"><div className="n">{bySource.get("free-guide") ?? 0}</div><div className="l">Free-guide signups</div></div>
        </div>

        <div className="grid2" style={{ marginTop: 18, gap: 18 }}>
          <div className="card">
            <p className="kicker">Where they came from</p>
            <table style={{ marginTop: 8 }}><tbody>
              {[...bySource.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => <tr key={s}><td>{s}</td><td style={{ textAlign: "right" }}>{n}</td></tr>)}
              {bySource.size === 0 && <tr><td className="muted">Nothing yet — signups appear here as they happen.</td></tr>}
            </tbody></table>
          </div>
          <div className="card">
            <p className="kicker">What they asked about</p>
            <table style={{ marginTop: 8 }}><tbody>
              {[...byOffer.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => <tr key={s}><td>{s}</td><td style={{ textAlign: "right" }}>{n}</td></tr>)}
              {byOffer.size === 0 && <tr><td className="muted">—</td></tr>}
            </tbody></table>
          </div>
        </div>

        <h2 style={{ marginTop: 40 }}>Automated sequences</h2>
        <p className="muted" style={{ maxWidth: "70ch" }}>These fire from tags this site sets in GoHighLevel. The wording for each is drafted in <code>docs/MESSAGES.md</code> and waits for your approval before it goes live.</p>
        <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 12 }}>
          <table>
            <thead><tr><th>Sequence</th><th>Trigger tag</th><th>What it does</th></tr></thead>
            <tbody>{SEQUENCES.map(([n, t, d]) => <tr key={n}><td><strong>{n}</strong></td><td><code style={{ fontSize: 12 }}>{t}</code></td><td className="muted" style={{ fontSize: 14 }}>{d}</td></tr>)}</tbody>
          </table>
        </div>

        <h2 style={{ marginTop: 40 }}>Most recent</h2>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead><tr><th>When</th><th>Who</th><th>Source</th><th>Asked about</th></tr></thead>
            <tbody>
              {list.slice(0, 50).map((l) => (
                <tr key={l.email}><td className="muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{l.at.slice(0, 10)}</td><td><strong>{l.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{l.email}</span></td><td>{l.source}</td><td>{getOffer(l.offerSlug)?.name ?? l.offerSlug}</td></tr>
              ))}
              {list.length === 0 && <tr><td colSpan={4} className="muted" style={{ padding: 20 }}>No signups yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
