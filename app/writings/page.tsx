import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple, EdCtas, EdGuideCover } from "@/app/components/Editorial";
import NewsletterForm from "@/app/components/NewsletterForm";
import GuideForm from "@/app/resources/GuideForm";
import { getContent } from "@/lib/content";
import { getWritings } from "@/lib/feeds";
import { CHANNELS } from "@/config/channels";
import WritingsList from "./WritingsList";

export const dynamic = "force-dynamic";

export const metadata = { title: "Write-ups & letters · Libni Fortuna" };

export default async function Writings() {
  const [content, feed] = await Promise.all([getContent(), getWritings()]);
  const substack = content.links.substack || CHANNELS.substack;
  const posts = feed.items.length
    ? feed.items.map((w) => ({ title: w.title, url: w.url, date: w.date, blurb: w.blurb }))
    : content.writings.map((w) => ({ title: w.title, url: w.url, date: w.date ?? "", blurb: w.blurb }));

  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Write-ups & letters"
        title="Words for the road home."
        lede="Essays and reflections, published as they’re written — for when you’re longing for slower, deeper, truer."
        ctas={[{ label: "Subscribe on Substack", href: substack, variant: "ink", external: true }]}
      />

      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap">
          <div className="ed-reveal">
            <WritingsList items={posts} />
            <p style={{ marginTop: 36 }}><a className="ed-link" href={`${substack.replace(/\/$/, "")}/archive`} target="_blank" rel="noreferrer">The full archive on Substack</a></p>
          </div>
        </div>
      </section>

      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split">
          <div className="ed-c4 ed-reveal"><EdGuideCover /></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Start here · free</p>
            <h2 className="ed-display-md">Come Home to Yourself: 5 Practices to Begin Your Return.</h2>
            <div className="ed-copy"><p>The same practices I use inside my private work — breathwork, reflection and nervous-system tools you can start tonight. No cost. No catch. Just a beginning.</p></div>
            <div className="ed-form"><GuideForm /></div>
          </div>
        </div>
      </section>

      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-split">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Letters from Libni</p>
            <h2 className="ed-display-md">Soft reminders. Honest reflections. A gentle nudge home.</h2>
            <p className="ed-copy" style={{ color: "rgba(251,249,246,.75)" }}>Once in a while, a letter that meets you where you are. No noise. Unsubscribe anytime.</p>
            <EdCtas ctas={[{ label: "Listen instead — the podcast", href: "/podcast", variant: "light" }]} />
          </div>
          <div className="ed-off1 ed-form ed-reveal" style={{ transitionDelay: ".15s" }}><NewsletterForm dark /></div>
        </div>
      </section>
    </SitePage>
  );
}
