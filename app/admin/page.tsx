import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { people, STAGE_LABEL } from "@/lib/crm";
import { store } from "@/lib/store";
import { buildDigest } from "@/lib/digest";
import { getContent } from "@/lib/content";
import { peso } from "@/lib/util";

export const dynamic = "force-dynamic";

// The command centre: what needs Libni today, then the week, then the doors
// into each part of the business. Everything else is one click away.
export default async function AdminHub() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const [all, orders, content] = await Promise.all([people(), store().list(), getContent()]);
  const d = buildDigest(orders);
  const day = 86_400_000;

  const newInquiries = all.filter((p) => (p.stage === "inquiry" || p.stage === "applied") && Date.now() - new Date(p.lastActivity).getTime() < 7 * day);
  const toVerify = orders.filter((o) => o.status === "submitted");
  const awaitingCall = all.filter((p) => p.stage === "applied");
  const proposals = all.filter((p) => p.stage === "proposal" || p.stage === "call");
  const unpaidLinks = all.filter((p) => p.stage === "link" || p.stage === "awaiting");
  const onboarding = orders.filter((o) => o.amountPaidPHP > 0 && o.status !== "cancelled" && !o.onboarding?.complete);
  const nextActions = all.filter((p) => p.nextAction).slice(0, 6);
  const liberateMembers = orders.filter((o) => o.offerSlug === "liberate" && o.amountPaidPHP > 0 && o.status !== "cancelled").length;
  const stageCounts = all.reduce((m, p) => ((m[p.stage] = (m[p.stage] || 0) + 1), m), {} as Record<string, number>);

  const todo: { n: number; label: string; href: string; tone: string }[] = [
    { n: toVerify.length, label: "transfers to verify", href: "/desk", tone: "plum" },
    { n: newInquiries.length, label: "new inquiries this week", href: "/admin/pipeline", tone: "" },
    { n: awaitingCall.length, label: "applied · book their call", href: "/admin/pipeline", tone: "" },
    { n: proposals.length, label: "calls done · send / chase proposal", href: "/admin/pipeline", tone: "" },
    { n: unpaidLinks.length, label: "payment links out, unpaid", href: "/desk", tone: "" },
    { n: onboarding.length, label: "paid · onboarding unfinished", href: "/admin/onboarding", tone: "" },
  ];

  return (
    <>
      <AdminNav current="/admin" user={session} />
      <div className="wrap-wide">
        <p className="kicker">Today</p>
        <h1 style={{ margin: "4px 0 6px" }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, Libni.</h1>
        <p className="muted">Here’s what needs you, then the week in money, then the rest.</p>

        <div className="tiles" style={{ marginTop: 20, gridTemplateColumns: "repeat(3, 1fr)" }}>
          {todo.map((t) => (
            <Link key={t.label} href={t.href} className="tile" style={{ textDecoration: "none", color: "inherit", borderColor: t.n && t.tone ? "var(--plum)" : undefined }}>
              <div className="n" style={{ color: t.n ? "var(--ink)" : "var(--mist)" }}>{t.n}</div>
              <div className="l">{t.label}</div>
            </Link>
          ))}
        </div>

        {nextActions.length > 0 && (
          <>
            <h2 style={{ marginTop: 36 }}>Your next actions</h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <tbody>
                  {nextActions.map((p) => (
                    <tr key={p.email}><td><strong>{p.name || p.email}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{STAGE_LABEL[p.stage]}</span></td><td>{p.nextAction}</td><td style={{ textAlign: "right" }}><Link href="/admin/pipeline" className="btn small ghost">Open</Link></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <h2 style={{ marginTop: 36 }}>This week in money</h2>
        <div className="tiles">
          <div className="tile"><div className="n">{peso(d.cashCollectedPHP)}</div><div className="l">Cash collected</div></div>
          <div className="tile"><div className="n">{d.closes}</div><div className="l">Fully paid</div></div>
          <div className="tile"><div className="n">{peso(d.balancesOutstandingPHP)}</div><div className="l">Outstanding</div></div>
          <div className="tile"><div className="n">{liberateMembers}</div><div className="l">Liberate members</div></div>
        </div>

        <h2 style={{ marginTop: 36 }}>The pipeline right now</h2>
        <div className="card" style={{ padding: 16 }}>
          <div className="row" style={{ gap: 8 }}>
            {(Object.keys(STAGE_LABEL) as (keyof typeof STAGE_LABEL)[]).filter((s) => s !== "lost").map((s) => (
              <Link key={s} href="/admin/pipeline" className="chip" style={{ textDecoration: "none" }}><strong>{stageCounts[s] || 0}</strong>&nbsp;{STAGE_LABEL[s]}</Link>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, margin: "12px 0 0" }}>Stages move on their own as people apply, get links, pay and finish onboarding. Open the pipeline to set call, proposal or not-now by hand and keep notes.</p>
        </div>

        <h2 style={{ marginTop: 36 }}>Everything else</h2>
        <div className="grid3">
          {[
            ["/admin/pipeline", "Pipeline", "Every person in the stage they’re really in. Notes and next actions."],
            ["/admin/leads", "Leads", "Every form, waitlist and signup, with source."],
            ["/admin/clients", "Clients", "Everyone who has paid — programs, paid, owed."],
            ["/admin/onboarding", "Onboarding", "Welcome, agreement, intake, first session — ticked off."],
            ["/desk", "Payment Desk", "Create links, verify transfers, resend, refund."],
            ["/admin/audience", "Audience & email", "Your list, where it came from, the sequences. Export to GHL."],
            ["/admin/liberate", `Liberate HQ · ${content.liberate.cohortLabel}`, "Members, seats, and everything inside the member portal."],
            ["/admin/studio", "Studio", "Every photo, video, link and event on the public site."],
            ["/dashboard", "Money", "Cash, closes, balances, stuck orders, weekly digest."],
          ].map(([href, t, dsc]) => (
            <Link key={href} href={href} className="card hover" style={{ textDecoration: "none", color: "inherit" }}>
              <h3 style={{ margin: 0, fontSize: 19 }}>{t}</h3>
              <p className="muted" style={{ fontSize: 14, margin: "6px 0 0" }}>{dsc}</p>
            </Link>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 24 }}>
          Client emails, agreements, reminders and broadcasts are sent by GoHighLevel from the tags this system sets. Payments are Xendit + manual transfer through the Desk. This admin is where you see it all and steer.
        </p>
      </div>
    </>
  );
}
