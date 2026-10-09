import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdFinal, EdCtas } from "@/app/components/Editorial";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Monthly Workshops — ₱999/month with Libni Fortuna",
  description: "Ongoing support for your growth — live monthly workshops, webinars and journaling prompts, for ₱999 a month.",
};

// What's inside the membership (Libni's own words from the application form).
const INSIDE: [string, string][] = [
  ["Live monthly workshops", "A guided session each month — breath, reflection and practice you can feel, not just hear."],
  ["Webinars", "Teachings on the themes that keep us stuck — and the ways through them."],
  ["Journaling prompts", "Questions to take into your week, so the work keeps moving between sessions."],
  ["Ongoing support", "A soft, steady place to keep growing — month after month, at your own pace."],
];

export default async function Workshops() {
  const content = await getContent();
  const photo = (id: string, fallback: string) => photoFor(content.photos, id) || fallback;
  const join = { label: "I'm interested — keep me posted", href: "/resources", variant: "gold" as const };

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="Monthly Workshops · ₱999 / month"
        title="Keep growing, every month."
        lede="A soft, steady place to keep coming home to yourself — without a big leap."
        sub="For ₱999 a month: live monthly workshops, webinars and journaling prompts. Ongoing support for the version of you that wants to keep growing, gently and consistently."
        meta={{ label: "Investment", value: "₱999 / month" }}
        ctas={[join, { label: "Ask me anything", href: "/contact", variant: "light" }]}
        image={photo("workshops_hero", "/photos/stage-goalgetters.jpg")}
        alt="Libni Fortuna leading a workshop"
      />

      {/* WHAT'S INSIDE */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">What's inside</p><h2 className="ed-display">Small, soft, consistent.</h2></div>
            <p className="ed-lede ed-muted">The kind of support that stays — so the growth isn't a weekend high, but a rhythm.</p>
          </div>
          <div className="ed-index">
            {INSIDE.map(([t, d], i) => (
              <div className="ed-item ed-reveal" key={t} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal">
            <p className="ed-eyebrow">Who it's for</p>
            <h2 className="ed-display-md">For when you're not ready for the big container — but you don't want to stop growing.</h2>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <div className="ed-copy">
              <p>Maybe the deeper work — a retreat, the 1:1 mentorship — isn't your season yet. That's okay. This is a way to stay close to the practice, keep learning, and keep choosing yourself a little every month.</p>
              <p>It's gentle on purpose. Come as you are, take what you need, and let it build.</p>
            </div>
            <EdCtas ctas={[{ ...join, variant: "ink" }]} />
          </div>
        </div>
      </section>

      <EdFinal
        title="Keep growing."
        gold="One month at a time."
        copy={["Live workshops, webinars and journaling prompts — ₱999 a month. Leave your details and I'll let you know the moment the doors open."]}
        meta={[["Investment", "₱999 / month"], ["Format", "Online"], ["Rhythm", "Monthly"]]}
        ctas={[join, { label: "Say hello first", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
