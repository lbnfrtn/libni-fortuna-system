import Link from "next/link";

// Shared navigation for the internal admin (Libni + EA).
const ITEMS: [string, string][] = [
  ["Today", "/admin"],
  ["Pipeline", "/admin/pipeline"],
  ["Leads", "/admin/leads"],
  ["Clients", "/admin/clients"],
  ["Onboarding", "/admin/onboarding"],
  ["Payment Desk", "/desk"],
  ["Audience", "/admin/audience"],
  ["Liberate HQ", "/admin/liberate"],
  ["Studio", "/admin/studio"],
  ["Money", "/dashboard"],
];

export default function AdminNav({ current, user }: { current: string; user?: { email: string; role: string } }) {
  return (
    <div className="adminnav">
      <div className="adminnav-inner">
        <Link href="/dashboard" className="brand" style={{ flexDirection: "row", gap: 8, alignItems: "baseline" }}>
          <b style={{ fontSize: 18 }}>Libni Fortuna</b>
          <span style={{ fontSize: 10 }}>Admin</span>
        </Link>
        <nav className="adminlinks">
          {ITEMS.map(([label, href]) => (
            <Link key={href} href={href} className={href === current ? "on" : ""}>{label}</Link>
          ))}
          <Link href="/" className="muted" style={{ fontSize: 13 }}>View site ↗</Link>
        </nav>
        {user && <span className="muted" style={{ fontSize: 12 }}>{user.email} · {user.role}</span>}
      </div>
    </div>
  );
}
