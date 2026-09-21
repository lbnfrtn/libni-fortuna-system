import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdFinal, EdCtas, EdCircle } from "@/app/components/Editorial";
import { getContent, byDateDesc, isUpcoming, brandLogo, storyPhoto } from "@/lib/content";
import { photoFor, embedUrl } from "@/config/site-slots";
import { CHANNELS } from "@/config/channels";
import { LOGOS } from "@/config/logos";
import { previewMap } from "@/lib/preview";
import { TalkRow, PressCard, PressRow } from "@/app/components/Features";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Libni Fortuna to speak — TEDx speaker · keynotes, workshops & retreats",
  description: "This is not just a talk. It’s an experience. Transformational keynotes, workshops and organisational experiences by TEDx speaker Libni Fortuna.",
};

const LOGO_H = Object.fromEntries(LOGOS.map(([f, , h]) => [f, h]));

const LEVELS = [
  ["The Mind", "Evidence-informed frameworks. Behavioural psychology. Practical strategies."],
  ["The Heart", "Authentic storytelling. Reflection. Human connection."],
  ["Behaviour", "Integration. Action planning. Meaningful behavioural change."],
];
const SCIENCE = ["Neuro-Linguistic Programming (NLP)", "Therapeutic Hypnotherapy", "Behavioural Psychology", "Emotional Intelligence", "Energy Work", "Inner Child Work", "Nervous System Regulation", "Somatic Practices", "Trauma-Informed Facilitation"];
const FORMATS: [string, string, string][] = [
  ["Keynote", "40–90 min", "Ideal for conferences, summits, company events, and leadership gatherings."],
  ["Interactive Workshop", "2–3 hours", "Designed for practical learning, participation, and deeper engagement."],
  ["Half-Day Transformational Experience", "~5 hours", "Keynote teaching, experiential exercises, reflection, group activities, nervous system regulation, and practical integration."],
  ["Full-Day Organisational Experience", "6–8 hours", "Designed for leadership teams, organisational transformation, and culture-building."],
  ["Retreat Facilitation", "Custom", "Custom-designed experiences for executive teams, founders, organisations, and communities."],
];
const EXPECT: [string, string[]][] = [
  ["Before the event", ["Discovery call", "Audience & objective alignment", "Tailored keynote design"]],
  ["During the event", ["High-impact keynote or workshop", "Interactive audience engagement", "Practical tools and reflection", "A memorable experience"]],
  ["After the event", ["Lasting takeaways", "Reflection resources (optional)", "Opportunities for continued organisational development"]],
];


export default async function Speaking() {
  const content = await getContent();
  const photo = (id: string) => photoFor(content.photos, id);
  const talks = [...content.talks].sort(byDateDesc);
  const upcoming = talks.filter((t) => isUpcoming(t.date)).sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  const past = talks.filter((t) => !isUpcoming(t.date));
  const years = [...new Set(past.map((t) => (t.date ?? "").slice(0, 4) || "Earlier"))];

  const videos = ["speak_video_1", "speak_video_2", "speak_video_3", "speak_video_4"].map((id, i) => embedUrl(content.videos[id] || (i === 0 ? CHANNELS.tedx : ""))).filter((v): v is string => Boolean(v));
  const stages = ["stage_1", "stage_2", "stage_3", "stage_4", "stage_5", "stage_6", "stage_7", "stage_8"].map(photo).filter((u): u is string => Boolean(u));
  const withLogo = content.brands.map((b) => ({ b, logo: brandLogo(content.photos, b) })).filter((x) => x.logo);
  const wordmarks = content.brands.filter((b) => !brandLogo(content.photos, b));
  const television = [...content.press].filter((p) => p.kind === "tv" || p.kind === "video").sort(byDateDesc);
  const podcasts = [...content.press].filter((p) => p.kind === "podcast").sort(byDateDesc);
  const print = [...content.press].filter((p) => p.kind === "article").sort(byDateDesc);
  const messages = photo("speak_messages");
  const book = { label: "Book Libni to speak", href: "/apply/speaking", variant: "gold" as const };
  // Link previews for every talk and feature (YouTube/Spotify/TikTok/news; cached a day).
  const prev = await previewMap([...talks.map((t) => t.url), ...content.press.map((p) => p.url)]);

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Speaking"
        eyebrow="TEDx Speaker · Transformational Keynote Speaker · Founder, Essence Retreat Philippines · Organisational Experience Designer"
        title={<>This is not just a talk. <span className="ed-gold">It’s an experience.</span></>}
        lede="Information inspires. Experience transforms."
        sub="People don’t need another presentation, another keynote filled with ideas they’ll forget by Monday. They need experiences that help them pause, reconnect, and move forward differently."
        ctas={[book, { label: "Watch the TEDx talk", href: CHANNELS.tedx, variant: "light", external: true }]}
        image={photo("home_stage")!}
        alt="Libni Fortuna on stage"
        objectPosition="50% 40%"
        credentials={[
          { num: "100+", label: "Engagements facilitated" }, { num: "1,000+", label: "Lives impacted" }, { num: "TEDx", label: "Lanang Ave · 2024" },
          { num: "PH · AU · Bali", label: "International reach" }, { num: String(content.keynotes.length || 9), label: "Signature keynotes" },
        ]}
      />

      {/* TRUSTED BY */}
      <section className="ed-sec-sm ed-ivory">
        <div className="ed-wrap ed-reveal" style={{ marginBottom: 28, textAlign: "center" }}>
          <p className="ed-eyebrow">Organisations &amp; events</p>
          <h2 className="ed-display-md" style={{ marginTop: 12 }}>Trusted across corporate, government and academic stages.</h2>
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {[...withLogo, ...withLogo].map(({ b, logo }, i) => (
              <span key={b.id + i} className="marquee-item"><img className="ed-logo" src={logo} alt={b.name} style={{ "--h": `${LOGO_H[b.id] ?? 34}px` } as React.CSSProperties} /></span>
            ))}
          </div>
        </div>
        {wordmarks.length > 0 && (
          <div className="ed-wrap ed-reveal" style={{ marginTop: 26, textAlign: "center" }}>
            <p className="ed-eyebrow" style={{ color: "var(--ed-muted)" }}>Also · {wordmarks.map((b) => b.name).join(" · ")}</p>
          </div>
        )}
      </section>

      {/* WELCOME */}
      <section className="ed-sec ed-ivory" style={{ paddingTop: "clamp(24px, 4vw, 56px)" }}>
        <div className="ed-wrap ed-split">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-34"><img src={stages[0] ?? photo("home_stage")} alt="Libni Fortuna speaking" /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Welcome</p>
            <h2 className="ed-display">They need experiences that help them pause, reconnect, and move forward differently.</h2>
            <div className="ed-copy">
              <p>There is no shortage of information today. People don’t need another presentation. Another motivational speech. Another keynote filled with ideas they’ll forget by Monday.</p>
              <p>Every keynote I deliver is intentionally designed to engage both the mind and the heart — through storytelling, behavioural science, reflection, and experiential learning. Because people rarely change because they heard something. They change because they experienced something.</p>
            </div>
            <p className="ed-pull">My goal isn’t simply to inspire your audience. It’s to create meaningful moments they’ll remember long after the event ends.</p>
            <EdCtas ctas={[{ ...book, variant: "ink" }]} />
          </div>
        </div>
      </section>

      {/* WATCH */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Watch me speak</p><h2 className="ed-display">See the room change.</h2></div>
            <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>From the TEDx stage to boardrooms, ballrooms and retreats.</p>
          </div>
          {videos.length === 1 ? (
            <div className="ed-video-hero ed-reveal"><div className="ed-video"><iframe src={videos[0]} title="Libni Fortuna speaking" allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div></div>
          ) : (
            <div className="ed-videos ed-reveal" style={{ marginTop: 0, gridTemplateColumns: videos.length === 2 ? "1fr 1fr" : undefined }}>
              {videos.map((v, i) => <div key={v}><div className="ed-video"><iframe src={v} title={`Libni Fortuna speaking ${i + 1}`} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div></div>)}
            </div>
          )}
          {stages.length > 0 && (
            <div className="ed-gallery ed-reveal">
              {stages.map((u, i) => <img key={u} src={u} alt={`Libni Fortuna — stage ${i + 1}`} loading="lazy" />)}
            </div>
          )}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="ed-sec ed-plum">
        <div className="ed-wrap ed-statement">
          <p className="ed-eyebrow ed-reveal">My speaking philosophy</p>
          <h2 className="ed-reveal" style={{ marginTop: 18 }}>Information inspires.<br /><span className="ed-gold">Experience transforms.</span></h2>
          <div className="ed-intro ed-reveal" style={{ transitionDelay: ".2s" }}>
            <p className="ed-lede">Most keynote speakers deliver knowledge. I design experiences — helping participants reflect, feel, reconnect, challenge limiting beliefs, strengthen emotional resilience, and take meaningful action.</p>
          </div>
        </div>
      </section>

      {/* THREE LEVELS */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Why my speaking is different</p><h2 className="ed-display">Every keynote is designed around three levels of change.</h2></div>
            <p className="ed-lede ed-muted">Because sustainable change doesn’t happen through information alone. It happens when people experience something meaningful enough to change how they think, lead, and live.</p>
          </div>
          <div className="ed-levels ed-reveal">
            {LEVELS.map(([t, d], i) => <div key={t} className="ed-level"><i>{String(i + 1).padStart(2, "0")}</i><h3>{t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      {/* SCIENCE */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-stack ed-reveal">
            <p className="ed-eyebrow">The science behind every experience</p>
            <h2 className="ed-display">Evidence-informed. Deeply human.</h2>
            <div className="ed-copy">
              <p>My work integrates multiple evidence-informed disciplines that support behavioural change and human performance.</p>
              <p>These approaches help participants move beyond awareness and into lasting transformation — addressing the beliefs, emotional patterns, and behaviours that influence performance, leadership, communication, and wellbeing.</p>
            </div>
          </div>
          <div className="ed-off1 ed-reveal" style={{ transitionDelay: ".15s" }}>
            {stages[1] && <img src={stages[1]} alt="Libni Fortuna facilitating" style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", marginBottom: 28 }} />}
            <div className="ed-tags">{SCIENCE.map((s) => <span key={s} className="ed-tag">{s}</span>)}</div>
          </div>
        </div>
      </section>

      {/* KEYNOTES */}
      <section className="ed-sec ed-linen" id="keynotes">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Signature keynote experiences</p><h2 className="ed-display">{content.keynotes.length || "Nine"} experiences. One purpose: lasting change.</h2></div>
            <p className="ed-lede ed-muted">Every keynote is thoughtfully tailored to your audience, your goals, and the transformation you want to create.</p>
          </div>
          <div className="ed-keys">
            {content.keynotes.map((k, i) => (
              <div key={k.id} className="ed-key ed-reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <b>{k.category}</b><h3>{k.title}</h3><p>{k.blurb}</p>
              </div>
            ))}
          </div>
          <div className="ed-reveal" style={{ marginTop: 48 }}><EdCtas ctas={[{ ...book, variant: "ink" }, { label: "Not sure which? Let’s talk", href: "/contact", variant: "ghost" }]} /></div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Speaking formats</p><h2 className="ed-display">Flexible formats for every stage.</h2></div>
            <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>Forty minutes or a full day. In person, in the Philippines, Australia, Bali — or wherever the room is.</p>
          </div>
          <div className="ed-formats ed-reveal">
            {FORMATS.map(([n, t, d]) => <div key={n} className="ed-format"><h4>{n}</h4><span>{t}</span><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      {/* EVENTS & STAGES — the archive, by year */}
      <section className="ed-sec ed-linen" id="events">
        <div className="ed-wrap">
          {upcoming.length > 0 && (
            <div className="ed-upcoming ed-reveal" style={{ marginBottom: 56, background: "var(--ed-ivory)" }}>
              <p className="ed-eyebrow">Coming up</p>
              <div>{upcoming.map((t) => <TalkRow key={t.id} t={t} photos={content.photos} prev={prev} />)}</div>
            </div>
          )}
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">01 · Events &amp; stages</p><h2 className="ed-display">Where the work has travelled.</h2></div>
            <p className="ed-lede ed-muted">Keynotes, workshops, panels, retreats and facilitations — {past.length} and counting, by year.</p>
          </div>
          <div className="ed-reveal">
            {years.map((y) => (
              <div key={y}>
                <p className="ed-year">{y}</p>
                {past.filter((t) => ((t.date ?? "").slice(0, 4) || "Earlier") === y).map((t) => <TalkRow key={t.id} t={t} photos={content.photos} prev={prev} />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TELEVISION & VIDEO */}
      {television.length > 0 && (
        <section className="ed-sec ed-ivory" id="television">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">02 · Television &amp; video</p><h2 className="ed-display">On air.</h2></div>
              <p className="ed-lede ed-muted">NET25, Bilyonaryo News Channel, Rise &amp; Shine Pilipinas, Abante and more.</p>
            </div>
            <div className="ed-press ed-reveal">{television.map((p) => <PressCard key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
          </div>
        </section>
      )}

      {/* PODCAST FEATURES */}
      {podcasts.length > 0 && (
        <section className="ed-sec ed-night" id="podcasts">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">03 · Podcast features</p><h2 className="ed-display">As a guest.</h2></div>
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.75)" }}>The conversations other hosts invited her into. Her own show is <Link href="/podcast" style={{ borderBottom: "1px solid var(--ed-gold)" }}>Anyway, Moving Forward</Link>.</p>
            </div>
            <div className="ed-press ed-reveal">{podcasts.map((p) => <PressCard key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
          </div>
        </section>
      )}

      {/* WRITE-UPS & PRESS */}
      {print.length > 0 && (
        <section className="ed-sec ed-ivory" id="writeups">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">04 · Write-ups &amp; press</p><h2 className="ed-display">In print.</h2></div>
              <p className="ed-lede ed-muted">Vogue Philippines, Manila Bulletin, PhilSTAR, Bilyonaryo, Preview, Manila Standard, When in Manila.</p>
            </div>
            <div className="ed-reveal">{print.map((p) => <PressRow key={p.id} p={p} photos={content.photos} prev={prev} />)}</div>
            <p style={{ marginTop: 36 }}><Link href="/features" className="ed-link">Every feature in one place</Link></p>
          </div>
        </section>
      )}

      {/* EXPECT */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">What clients can expect</p><h2 className="ed-display">A tailored process, start to finish.</h2></div>
            <p className="ed-lede ed-muted">One discovery call, and the rest is designed around your room.</p>
          </div>
          <div className="ed-expect ed-reveal">
            {EXPECT.map(([t, items]) => <div key={t}><h3>{t}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}
          </div>
        </div>
      </section>

      {/* WORDS */}
      {(messages || content.speakingWords.length > 0) && (
        <section className="ed-sec ed-ivory">
          <div className="ed-wrap">
            <div className="ed-head ed-reveal">
              <div><p className="ed-eyebrow">How it’s like working with me</p><h2 className="ed-display">What arrives after the room empties.</h2></div>
              <p className="ed-lede ed-muted">Organisers, participants, and the messages they send the morning after.</p>
            </div>
            {content.speakingWords.length > 0 && (
              <div className="ed-words ed-reveal" style={{ paddingTop: 0, marginBottom: 48 }}>
                {content.speakingWords.map((w) => (
                  <div key={w.id} className="ed-word">
                    <EdCircle src={storyPhoto(content.photos, w.id) || content.photos[`speak_${w.id}`]} name={w.name} />
                    <div><p className="ed-quote">{w.quote}</p><p className="ed-who">{w.name}{w.role && <span>{w.role}</span>}</p></div>
                  </div>
                ))}
              </div>
            )}
            {messages && <img className="ed-messages ed-reveal" src={messages} alt="Messages from participants and organisers" loading="lazy" />}
          </div>
        </section>
      )}

      {/* QUOTE */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-statement">
          <h2 className="ed-reveal" style={{ fontSize: "clamp(28px, 3.6vw, 52px)" }}>“Transformation isn’t created by giving people more information. It’s created by helping them <span className="ed-gold">change the subconscious beliefs</span> that shape how they live, lead, and connect.”</h2>
          <p className="ed-eyebrow ed-reveal" style={{ marginTop: 28 }}>Libni Fortuna</p>
        </div>
      </section>

      <EdFinal
        title="Let’s create an experience your audience won’t simply remember —"
        gold="they’ll carry it with them."
        copy={["Every audience is different. Every organisation has unique challenges. Tell me about yours."]}
        meta={[["Email", "hello@libni.co"], ["Instagram", "@libnifortuna"], ["Based", "PH · AU · Bali"]]}
        ctas={[book, { label: "Download the media kit", href: "/media-kit", variant: "light" }]}
      />
      <p className="ed-noprint" style={{ display: "none" }}><Link href="/media-kit">Media kit</Link></p>
    </SitePage>
  );
}

