import Link from "next/link";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";
import { CHANNELS } from "@/config/channels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Libni Fortuna · Links",
  description: "Everything from Libni's Instagram bio in one place — 1:1 mentorship, programs, the Power Hour, speaking, newsletter, brand collabs, Substack and the podcast.",
};

// The page behind the Instagram bio link. Deliberately standalone — no site
// nav — so it opens fast inside the Instagram browser and gets to the list.
export default async function Links() {
  const content = await getContent();
  const hero = photoFor(content.photos, "links_hero")!;
  const rows = content.bioLinks;
  const social: [string, string][] = [
    ["Instagram", content.links.instagram || CHANNELS.instagram],
    ["TikTok", content.links.tiktok || CHANNELS.tiktok],
    ["YouTube", content.links.youtube || CHANNELS.youtube],
    ["Spotify", content.links.spotify || CHANNELS.spotify],
  ];

  return (
    <main className="ed ed-bio">
      <section className="ed-bio-hero">
        <img src={hero} alt="" />
        <h1>Libni<br />Fortuna</h1>
        <a className="ed-bio-explore" href="#explore">Explore<br />↓</a>
      </section>

      <section className="ed-bio-list" id="explore">
        {rows.map((r, i) => {
          const inner = (
            <>
              <i>{String(i + 1).padStart(2, "0")} /</i>
              <div><h3>{r.label}</h3>{r.note && <p>{r.note}</p>}</div>
              <span>→</span>
            </>
          );
          return r.href.startsWith("http")
            ? <a key={r.id} className="ed-bio-row" href={r.href} target="_blank" rel="noreferrer">{inner}</a>
            : <Link key={r.id} className="ed-bio-row" href={r.href}>{inner}</Link>;
        })}
      </section>

      <footer className="ed-bio-foot">
        <p>{social.map(([l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer">{l}</a>)}</p>
        <p style={{ marginTop: 22 }}>All enquiries · <a href={`mailto:${content.mediaKit.pressEmail}`}>{content.mediaKit.pressEmail}</a></p>
        <p style={{ marginTop: 22 }}><Link href="/">libni.co</Link></p>
      </footer>
    </main>
  );
}
