import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember, PROGRAM_HOME } from "@/lib/portal-auth";
import { getContent } from "@/lib/content";
import PortalLogin from "./PortalLogin";

export const dynamic = "force-dynamic";

const PROGRAMS = [
  { key: "liberate", name: "Liberate", note: "The 3-month group experience", href: "/portal?program=liberate" },
  { key: "one-on-one", name: "1:1 with Libni", note: "The Becoming · Power Hour", href: "/portal?program=one-on-one" },
  { key: "project-me", name: "Project Me", note: "The daily-practice app", href: "https://projectme.libni.co", external: true },
] as const;

export default async function PortalPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const me = await currentMember();
  if (me && !me.admin) redirect(PROGRAM_HOME[me.program]);
  const { program } = await searchParams;
  const picked = program === "liberate" || program === "one-on-one" ? program : null;
  const { liberate } = await getContent();

  return (
    <main className="ed pt">
      <div className="pt-shell">
        <div className="pt-side">
          <Link href="/" className="pt-brand"><b>Libni Fortuna</b><span>Member portal</span></Link>
          {picked === "liberate"
            ? <img src="/liberate-logo-ink.png" alt="Liberate" style={{ width: "min(100%, 300px)", marginTop: 40 }} />
            : <p className="ed-display-md" style={{ marginTop: 40, maxWidth: "14ch" }}>{picked === "one-on-one" ? "Just you and me." : "Welcome home."}</p>}
          <p className="ed-lede" style={{ marginTop: 28, maxWidth: "24ch" }}>
            {picked === "liberate" ? "Your twelve weeks live here." : picked === "one-on-one" ? "Your sessions, your next steps, and a way to reach me." : "Sign in to the program you’re in."}
          </p>
          {picked === "liberate" && <p className="ed-muted" style={{ marginTop: 18, fontSize: 15, maxWidth: "36ch" }}>{liberate.cohortLabel}. Sign in with the email you joined with and the access code from your welcome email.</p>}
          {picked === "one-on-one" && <p className="ed-muted" style={{ marginTop: 18, fontSize: 15, maxWidth: "36ch" }}>Sign in with the email you booked with.</p>}
        </div>
        <div className="pt-main">
          {picked ? (
            <>
              <p className="ed-eyebrow"><Link href="/portal" className="ed-link" style={{ marginRight: 14 }}>← All programs</Link>{picked === "liberate" ? "Liberate" : "1:1 with Libni"}</p>
              <h1 className="ed-display-md" style={{ marginTop: 12, marginBottom: 8 }}>Come on in.</h1>
              <PortalLogin program={picked} />
              <p className="ed-muted" style={{ fontSize: 14, marginTop: 36 }}>
                {picked === "liberate"
                  ? <>Not in Liberate yet? <Link href="/liberate" className="ed-link">See the next intake</Link></>
                  : <>Not working with me 1:1 yet? <Link href="/one-on-one" className="ed-link">See the two doors</Link></>}
              </p>
            </>
          ) : (
            <>
              <p className="ed-eyebrow">Sign in</p>
              <h1 className="ed-display-md" style={{ marginTop: 12, marginBottom: 28 }}>Which program are you in?</h1>
              <div className="pt-pick">
                {PROGRAMS.map((p) =>
                  "external" in p
                    ? <a key={p.key} href={p.href} target="_blank" rel="noreferrer"><b>{p.name}</b><span>{p.note}</span><i>Opens the app ↗</i></a>
                    : <Link key={p.key} href={p.href}><b>{p.name}</b><span>{p.note}</span><i>Sign in →</i></Link>
                )}
              </div>
              <p className="ed-muted" style={{ fontSize: 14, marginTop: 36 }}>Not in a program yet? <Link href="/start" className="ed-link">Find your path</Link></p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
