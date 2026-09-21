import Link from "next/link";
import EditorialFx from "./EditorialFx";
import InstagramStrip from "./InstagramStrip";

const NAV: [string, string][] = [
  ["Home", "/"],
  ["Work with me", "/work-with-me"],
  ["1:1", "/one-on-one"],
  ["Experiences", "/experiences"],
  ["Speaking", "/speaking"],
  ["About", "/about"],
  ["Client Love", "/client-love"],
];

// Site-wide announcement. It sits in normal flow above the nav and scrolls
// away, so the nav can pin to the top on its own.
export function AnnouncementBar() {
  return (
    <div className="ed-topbar">
      <Link href="/liberate">
        <b>Now open</b>
        <span>Liberate — a 3-month group coaching experience. Next intake October 2026.</span>
        <u className="ed-topbar-cta">Read more</u>
      </Link>
    </div>
  );
}

// Shared header + footer for the PUBLIC marketing pages.
// `overlay` floats the nav transparently over a dark hero (white text);
// EditorialFx turns it ivory once the visitor scrolls past the hero.
export function SiteNav({ overlay }: { overlay?: boolean }) {
  return (
    <header className={`sitenav${overlay ? " overlay" : ""}`}>
      <div className="sitenav-inner">
        <Link href="/" className="brand">
          <b>Libni Fortuna</b>
          <span>Come home to yourself</span>
        </Link>

        <nav className="navlinks navlinks-desktop">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link href="/portal" className="nav-login">Log in</Link>
          <Link href="/start" className="btn small">Find your path</Link>
        </nav>

        <details className="navmenu">
          <summary aria-label="Menu">Menu</summary>
          <div className="menu-panel">
            {NAV.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/contact">Contact</Link>
            <Link href="/portal">Member log in</Link>
            <Link href="/start" className="btn small">Find your path</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="sitefooter">
      <div className="sitefooter-inner">
        <div className="footcols">
          <div>
            <p className="big" style={{ color: "#fff", margin: 0 }}>Come home to yourself.</p>
            <p className="muted" style={{ marginTop: 14, maxWidth: "34ch" }}>
              Transformational mentoring, retreats and speaking — for the version of you beneath the roles.
            </p>
            <p style={{ marginTop: 22 }}><a href="mailto:hello@libni.co">hello@libni.co</a></p>
          </div>
          <div>
            <h4>Work with me</h4>
            <Link href="/one-on-one">1:1 support</Link>
            <Link href="/programs/the-becoming">The Becoming</Link>
            <Link href="/programs/ignite">Power Hour</Link>
            <Link href="/liberate">Liberate</Link>
            <Link href="/programs/essence-retreat">Essence Retreat</Link>
            <Link href="/programs/brands">For brands</Link>
            <Link href="/work-with-me">All offers</Link>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/start">Find your path</Link>
            <Link href="/experiences">Experiences</Link>
            <Link href="/client-love">Client Love</Link>
            <Link href="/stories">Client stories</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/portal">Member log in</Link>
          </div>
          <div>
            <h4>Listen &amp; read</h4>
            <Link href="/podcast">Podcast</Link>
            <Link href="/writings">Write-ups</Link>
            <Link href="/speaking">Speaking &amp; stages</Link>
            <Link href="/features">Features &amp; press</Link>
            <Link href="/media-kit">Media kit</Link>
            <Link href="/resources">Free guide</Link>
            <a href="https://instagram.com/libnifortuna" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://projectme.libni.co" target="_blank" rel="noreferrer">Project Me</a>
          </div>
        </div>
        <p className="ed-footnote">
          <span>© {new Date().getFullYear()} Libni Fortuna</span>
          <span>Come home to yourself.</span>
        </p>
      </div>
    </footer>
  );
}

export function SitePage({ children, navOverlay }: { children: React.ReactNode; navOverlay?: boolean }) {
  return (
    <>
      <AnnouncementBar />
      <SiteNav overlay={navOverlay} />
      <main className="ed">{children}</main>
      <InstagramStrip />
      <SiteFooter />
      <EditorialFx />
    </>
  );
}
