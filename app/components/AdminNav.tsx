import Link from "next/link";
import type { ReactNode } from "react";

// Shared left sidebar for the internal admin (Libni + EA) — same calm, grouped
// language as the Studio. Every admin page renders <AdminNav current=… /> as the
// first element; globals.css offsets the page content (.wrap / .wrap-wide) to sit
// beside it, and collapses it to a top strip on phones.
type NavIcon = "home" | "chart" | "columns" | "inbox" | "person" | "check" | "people" | "card" | "mail" | "sun" | "image";
// [label, href, icon, tile colour] — each area gets its own colour, like System Settings.
const GROUPS: { title: string; items: [string, string, NavIcon, string][] }[] = [
  { title: "Overview", items: [["Today", "/admin", "home", "#5e5ce6"], ["Money", "/dashboard", "chart", "#34c759"]] },
  { title: "People", items: [["Pipeline", "/admin/pipeline", "columns", "#0a84ff"], ["Leads", "/admin/leads", "inbox", "#ff9f0a"], ["Clients", "/admin/clients", "person", "#bf5af2"], ["Onboarding", "/admin/onboarding", "check", "#30b0c7"], ["Audience", "/admin/audience", "people", "#ff375f"]] },
  { title: "Operations", items: [["Payment Desk", "/desk", "card", "#32ade6"], ["Email & funnel", "/admin/email", "mail", "#007aff"], ["Liberate HQ", "/admin/liberate", "sun", "#ff9500"]] },
  { title: "Website", items: [["Studio", "/admin/studio", "image", "#ff453a"]] },
];

export default function AdminNav({ current, user }: { current: string; user?: { email: string; role: string } }) {
  return (
    <aside className="adminnav">
      <Link href="/admin" className="an-brand">
        <b>Libni Fortuna</b>
        <span>Admin</span>
      </Link>
      {GROUPS.map((g) => (
        <nav key={g.title} className="an-group">
          <p>{g.title}</p>
          {g.items.map(([label, href, icon, colour]) => (
            <Link key={href} href={href} className={`an-item${href === current ? " on" : ""}`}>
              <span className="an-tile" style={{ background: colour, color: "#fff" }}><NavGlyph name={icon} /></span>
              <span className="an-label">{label}</span>
            </Link>
          ))}
        </nav>
      ))}
      <div className="an-foot">
        <Link href="/" className="an-view" target="_blank" rel="noreferrer">View site ↗</Link>
        {user && <span className="an-user">{user.email} · {user.role}</span>}
      </div>
    </aside>
  );
}

function NavGlyph({ name }: { name: NavIcon }) {
  const p: Record<NavIcon, ReactNode> = {
    home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
    chart: <path d="M4 20V4M4 20h16M8 20v-6M12 20v-9M16 20v-4" />,
    columns: <><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="11" rx="1" /><rect x="17" y="4" width="4" height="7" rx="1" /></>,
    inbox: <path d="M3 13h5l1.5 3h5L16 13h5M4 13 6 5h12l2 8v6H4v-6Z" />,
    person: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    check: <path d="M4 12.5 9 17.5 20 6.5" />,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 6a3 3 0 0 1 0 6M21 19c0-2.4-1.3-4-3.5-4.6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 18 5-5 4 3 3-2 4 4" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name]}
    </svg>
  );
}
