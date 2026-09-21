"use client";
import { useState } from "react";

type OfferLite = { slug: string; name: string; blurb: string; journey: string; externalUrl: string | null; waitlist: boolean };

// One honest sentence on why this is the fit.
const WHY: Record<string, string> = {
  ignite: "One focused session to move something that's stuck — the simplest way to begin.",
  "the-becoming": "When you're ready for deep, sustained 1:1 work, this is the room for it.",
  "private-studio": "For nervous-system reset through sound and breath, in person, with people you choose.",
  liberate: "Transformation held in a small group — you're not doing it alone.",
  "essence-retreat": "Four days away to come all the way home to yourself.",
  "project-me": "Daily practice, breathwork and a monthly circle — support you carry in your pocket.",
  "founders-circle": "A recurring table for founders who want depth, not just networking.",
  "private-experiences": "Something bespoke, designed around you.",
};

export default function StartClient({ offers }: { offers: OfferLite[] }) {
  const [who, setWho] = useState<"" | "me" | "company" | "brand">("");
  const [looking, setLooking] = useState("");
  const [depth, setDepth] = useState("");
  const [showAll, setShowAll] = useState(false);

  function recommend(): string {
    if (looking === "reset") return depth === "deep" ? "the-becoming" : "ignite";
    if (looking === "sound") return "private-studio";
    if (looking === "group") return "liberate";
    if (looking === "retreat") return "essence-retreat";
    if (looking === "daily") return "project-me";
    if (looking === "bespoke") return "private-experiences";
    return depth === "deep" ? "the-becoming" : "ignite";
  }

  const link = (o: OfferLite) => (o.externalUrl ? o.externalUrl : `/programs/${o.slug}`);

  return (
    <div>
      {/* Step 1 */}
      <div className="card">
        <label>Who is this for?</label>
        <div className="row">
          <Choice on={who === "me"} onClick={() => setWho("me")} label="Me" />
          <Choice on={who === "company"} onClick={() => setWho("company")} label="My company or event" />
          <Choice on={who === "brand"} onClick={() => setWho("brand")} label="My brand" />
        </div>

        {who === "company" && (
          <p style={{ marginTop: 18 }}>
            Beautiful. → <a className="btn small" href="/apply/organizations">Tell me about your organization</a>{" "}
            <a className="btn small ghost" href="/apply/speaking">Or book me to speak</a>
          </p>
        )}
        {who === "brand" && (
          <p style={{ marginTop: 18 }}>
            Let&rsquo;s talk. → <a className="btn small" href="/apply/brands">Start a collaboration</a>
          </p>
        )}

        {who === "me" && (
          <>
            <label style={{ marginTop: 20 }}>What are you looking for?</label>
            <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <Choice block on={looking === "reset"} onClick={() => setLooking("reset")} label="To work on myself — coaching / transformation" />
              <Choice block on={looking === "sound"} onClick={() => setLooking("sound")} label="Sound, breathwork, nervous-system reset" />
              <Choice block on={looking === "group"} onClick={() => setLooking("group")} label="To grow alongside others in a group" />
              <Choice block on={looking === "retreat"} onClick={() => setLooking("retreat")} label="To get away — a retreat" />
              <Choice block on={looking === "daily"} onClick={() => setLooking("daily")} label="Daily practice I can do on my own" />
              <Choice block on={looking === "bespoke"} onClick={() => setLooking("bespoke")} label="Something private and bespoke" />
            </div>

            {looking === "reset" && (
              <>
                <label style={{ marginTop: 20 }}>How much support do you want?</label>
                <div className="row">
                  <Choice on={depth === "single"} onClick={() => setDepth("single")} label="A single focused session" />
                  <Choice on={depth === "deep"} onClick={() => setDepth("deep")} label="Deep work over weeks" />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Recommendation */}
      {who === "me" && looking && (looking !== "reset" || depth) && (() => {
        const rec = offers.find((o) => o.slug === recommend());
        if (!rec) return null;
        return (
          <div className="card" style={{ marginTop: 16, background: "var(--cream)" }}>
            <p className="kicker">I&rsquo;d start you here</p>
            <h2 style={{ margin: "4px 0" }}>{rec.name}</h2>
            <p>{WHY[rec.slug] || rec.blurb}</p>
            <div className="row" style={{ marginTop: 8 }}>
              <a className="btn" href={link(rec)}>{rec.waitlist ? "Join the waitlist" : rec.externalUrl ? "Open it" : "Take the next step"}</a>
              <button className="btn ghost small" onClick={() => setShowAll((s) => !s)}>See all options</button>
            </div>
          </div>
        );
      })()}

      {(showAll || (who === "me" && !looking)) && (
        <div style={{ marginTop: 24 }}>
          <h3>All the ways to work with me</h3>
          {offers.map((o) => (
            <div key={o.slug} className="step">
              <div style={{ flex: 1 }}>
                <a href={link(o)} style={{ fontWeight: 700 }}>{o.name}</a>
                {o.waitlist && <span className="pill pending" style={{ marginLeft: 8 }}>waitlist</span>}
                <p className="muted" style={{ margin: "2px 0 0", fontSize: 14 }}>{o.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Choice({ on, onClick, label, block }: { on: boolean; onClick: () => void; label: string; block?: boolean }) {
  return (
    <button type="button" className={`btn small ${on ? "" : "ghost"}`} onClick={onClick} style={block ? { justifyContent: "flex-start", width: "100%", marginTop: 8 } : undefined}>
      {label}
    </button>
  );
}
