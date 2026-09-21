import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember } from "@/lib/portal-auth";
import { getContent } from "@/lib/content";
import { embedUrl } from "@/config/site-slots";
import PortalSignOut from "./PortalSignOut";
import EditorialFx from "@/app/components/EditorialFx";

export const dynamic = "force-dynamic";

const MONTHS = [["Month one", "See"], ["Month two", "Feel"], ["Month three", "Become"]];

function fmt(d?: string) {
  if (!d) return "";
  const t = new Date(d);
  return isNaN(t.getTime()) ? d : t.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });
}

export default async function PortalHome() {
  const me = await currentMember();
  if (!me) redirect("/portal?program=liberate");
  if (!me.admin && me.program !== "liberate") redirect("/portal/one-on-one");
  const { liberate } = await getContent();
  const now = Date.now();
  const dated = liberate.weeks.filter((w) => w.date && !isNaN(new Date(w.date).getTime()));
  const current = dated.filter((w) => new Date(w.date!).getTime() <= now + 86_400_000).slice(-1)[0] ?? dated[0] ?? liberate.weeks[0];
  const next = dated.find((w) => new Date(w.date!).getTime() > now);

  return (
    <main className="ed pt">
      <header className="pt-top">
        <Link href="/portal/liberate" className="pt-brand"><b>Liberate</b><span>{liberate.cohortLabel}</span></Link>
        <nav className="pt-nav">
          <a href="#roadmap">Roadmap</a>
          {liberate.communityUrl && <a href={liberate.communityUrl} target="_blank" rel="noreferrer">{liberate.communityLabel || "Community"}</a>}
          <a href="mailto:hello@libni.co">Reach Libni</a>
          <PortalSignOut admin={me.admin} />
        </nav>
      </header>

      <section className="pt-hero">
        <div className="ed-wrap">
          <p className="ed-eyebrow">Welcome home</p>
          <h1 className="ed-display" style={{ marginTop: 14, maxWidth: "16ch" }}>Where you are in the journey.</h1>
          <div className="ed-copy" style={{ marginTop: 22, color: "rgba(251,249,246,.8)" }}><p>{liberate.welcome}</p></div>
          <div className="pt-now">
            <div>
              <span className="ed-eyebrow">This week</span>
              <b>Week {String(current.n).padStart(2, "0")} · {current.title}</b>
              <em>{current.theme}</em>
              {current.date && <small>{fmt(current.date)}</small>}
            </div>
            <div className="ed-ctas">
              {(current.sessionUrl || liberate.sessionUrl) && <a className="ed-btn ed-btn-gold" href={current.sessionUrl || liberate.sessionUrl} target="_blank" rel="noreferrer">Join this week’s session</a>}
              {current.replayUrl && <a className="ed-btn ed-btn-light" href={current.replayUrl} target="_blank" rel="noreferrer">Watch the replay</a>}
              {next && <span className="pt-next">Next: Week {String(next.n).padStart(2, "0")} · {fmt(next.date)}</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="ed-sec ed-ivory" id="roadmap">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">The roadmap</p><h2 className="ed-display">Your twelve weeks.</h2></div>
            <p className="ed-lede ed-muted">Each week goes a little deeper than the last. You start by seeing the pattern. You end by living without it.</p>
          </div>
          {MONTHS.map(([month, theme], m) => (
            <div key={month} className="pt-month ed-reveal">
              <div className="pt-month-head"><p className="ed-eyebrow">{month}</p><h3>{theme}</h3></div>
              <div>
                {liberate.weeks.slice(m * 4, m * 4 + 4).map((w) => {
                  const replay = w.replayUrl ? embedUrl(w.replayUrl) : null;
                  const isNow = w.n === current.n;
                  return (
                    <details key={w.n} className={`pt-week${isNow ? " is-now" : ""}`} open={isNow}>
                      <summary>
                        <span className="pt-week-n">{String(w.n).padStart(2, "0")}</span>
                        <span className="pt-week-t"><b>{w.title}</b><em>{w.theme}</em></span>
                        <span className="pt-week-d">{w.date ? fmt(w.date) : ""}{isNow && <i>Now</i>}</span>
                      </summary>
                      <div className="pt-week-body">
                        {w.notes && <div className="ed-copy"><p>{w.notes}</p></div>}
                        {replay ? (
                          <div className="ed-video" style={{ maxWidth: 720 }}><iframe src={replay} title={`Week ${w.n} replay`} allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>
                        ) : w.replayUrl ? (
                          <a className="ed-link" href={w.replayUrl} target="_blank" rel="noreferrer">Watch the replay</a>
                        ) : null}
                        {w.sessionUrl && <p><a className="ed-link" href={w.sessionUrl} target="_blank" rel="noreferrer">Session link</a></p>}
                        {w.resources.length > 0 && (
                          <ul className="ed-list" style={{ maxWidth: 560 }}>
                            {w.resources.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>)}
                          </ul>
                        )}
                        {!w.notes && !w.replayUrl && !w.sessionUrl && w.resources.length === 0 && <p className="ed-muted" style={{ fontSize: 15 }}>Materials for this week appear here once we reach it.</p>}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ed-sec-sm ed-night">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c6 ed-reveal">
            <p className="ed-eyebrow">Between sessions</p>
            <h2 className="ed-display-md" style={{ marginTop: 12 }}>You’re not doing this alone.</h2>
          </div>
          <div className="ed-off1 ed-stack ed-reveal">
            {liberate.communityUrl && <a className="ed-btn ed-btn-gold" href={liberate.communityUrl} target="_blank" rel="noreferrer" style={{ justifySelf: "start" }}>{liberate.communityLabel || "Open the community"}</a>}
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.75)" }}><p>Questions, wobbles, wins — reply to any email from me, or write to <a href="mailto:hello@libni.co" style={{ borderBottom: "1px solid var(--ed-gold)" }}>hello@libni.co</a>. A real person (often me) reads it.</p></div>
          </div>
        </div>
      </section>
      <EditorialFx />
    </main>
  );
}
