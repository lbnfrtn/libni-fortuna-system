import Link from "next/link";
import EditorialFx from "./EditorialFx";
import { CHANNELS } from "@/config/channels";

type NavLink = { label: string; href: string; external?: boolean };
type NavItem = NavLink & { children?: NavLink[] };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Work with me", href: "/work-with-me", children: [
      { label: "1:1 mentorship", href: "/one-on-one" },
      { label: "Liberate · group coaching", href: "/liberate" },
      { label: "Essence Retreat", href: "/programs/essence-retreat" },
      { label: "Founders Circle", href: "/programs/founders-circle" },
      { label: "Workshops & trainings", href: "/programs/workshops" },
      { label: "Curate an experience", href: "/experiences" },
      { label: "For your company", href: "/programs/organizations" },
      { label: "Speaking & stages", href: "/speaking" },
      { label: "Project Me · the app", href: "https://projectme.libni.co", external: true },
      { label: "See all pathways", href: "/work-with-me" },
    ],
  },
  { label: "Client Stories", href: "/client-love" },
  {
    label: "About", href: "/about", children: [
      { label: "About me", href: "/about" },
      { label: "Media, press & features", href: "/features" },
      { label: "Letters & blog", href: "/writings" },
      { label: "The podcast", href: "/podcast" },
      { label: "Free guide & resources", href: "/resources" },
      { label: "Subscribe to my newsletter", href: "/resources#newsletter" },
    ],
  },
  { label: "Project Me", href: "https://projectme.libni.co", external: true },
  { label: "Contact", href: "/contact" },
];

function NavA({ item, className }: { item: NavLink; className?: string }) {
  return item.external
    ? <a href={item.href} className={className} target="_blank" rel="noreferrer">{item.label}</a>
    : <Link href={item.href} className={className}>{item.label}</Link>;
}

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
          {NAV.map((item) => item.children ? (
            <div key={item.href} className="navdrop">
              <Link href={item.href} aria-haspopup="true">{item.label}</Link>
              <div className="navdrop-menu">
                {item.children.map((c) => <NavA key={c.href + c.label} item={c} />)}
              </div>
            </div>
          ) : (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <details className="navmenu">
          <summary aria-label="Menu">Menu</summary>
          <div className="menu-panel">
            {NAV.map((item) => item.children ? (
              <div key={item.href} className="menu-group">
                <b>{item.label}</b>
                {item.children.map((c) => <NavA key={c.href + c.label} item={c} />)}
              </div>
            ) : (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
            <Link href="/portal">Member log in</Link>
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
              Life Strategist. Transformational mentoring, retreats and speaking — for the version of you beneath the roles.
            </p>
            <p style={{ marginTop: 22 }}><a href="mailto:hello@libni.co">hello@libni.co</a></p>
          </div>
          <div>
            <h4>Listen &amp; read</h4>
            <Link href="/podcast">Anyway, Moving Forward</Link>
            <Link href="/writings">Letters &amp; blog</Link>
          </div>
          <div className="foot-connect">
            <h4>Connect</h4>
            <a href={CHANNELS.instagram} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4C1.3 2.7.9 3.4.6 4.2.3 5 .1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.1.6 2.9.3.8.7 1.5 1.4 2.2.7.7 1.3 1.1 2.2 1.4.8.3 1.6.5 2.9.6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.1-.3 2.9-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.3 1.4-2.2.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.5-1.4-2.2C21.3 1.3 20.6.9 19.8.6 19 .3 18.2.1 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>
              Instagram
            </a>
            <a href={CHANNELS.tiktok} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8c-1-.7-1.7-1.8-1.9-3.1V2h-3.4v13.7c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V9.4c-.3 0-.6-.1-.9-.1-3.5 0-6.3 2.8-6.3 6.3S4.9 22 8.4 22s6.3-2.8 6.3-6.3V8.6c1.4 1 3 1.5 4.8 1.5V6.7c-1.1 0-2.1-.3-2.9-.9z"/></svg>
              TikTok
            </a>
            <a href={CHANNELS.youtube} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
              YouTube
            </a>
            <a href={CHANNELS.spotify} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3c-.2.4-.7.5-1 .3-2.8-1.7-6.4-2.1-10.6-1.2-.4.1-.8-.2-.9-.6-.1-.4.2-.8.6-.9 4.6-1 8.5-.6 11.7 1.3.3.3.4.8.2 1.1zm1.5-3.3c-.3.4-.8.6-1.3.3-3.2-2-8.2-2.6-12-1.4-.5.1-1-.1-1.2-.6-.1-.5.1-1 .6-1.2 4.4-1.3 9.8-.7 13.5 1.6.5.3.6.9.4 1.3zm.1-3.4C15.2 8.3 8.9 8.1 5.2 9.2c-.6.2-1.2-.2-1.4-.8-.2-.6.2-1.2.8-1.4 4.3-1.3 11.3-1 15.7 1.6.5.3.7 1 .4 1.5-.3.6-1 .8-1.6.5z"/></svg>
              Spotify
            </a>
            <a href={CHANNELS.substack} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 3H2v2.5h20V3zm0 5.2H2v2.5h20V8.2zM2 13.4V21l10-5.6L22 21v-7.6H2z"/></svg>
              Substack
            </a>
          </div>
          <div>
            <h4>Member access</h4>
            <Link href="/portal">Member log in</Link>
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
      <SiteFooter />
      <EditorialFx />
    </>
  );
}
