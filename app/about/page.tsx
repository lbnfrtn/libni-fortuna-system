import { SitePage } from "@/app/components/Chrome";
import { EdHero, EdFinal } from "@/app/components/Editorial";
import { getContent } from "@/lib/content";
import { photoFor } from "@/config/site-slots";
import { PHOTOS } from "@/config/media";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Libni — Life Strategist · Transformational Mentor · TEDx Speaker",
  description: "I’m Libni. And honestly, I’ve been a lot of people. A real introduction — who I am, what shaped the way I work, what I believe, and who I work with.",
};

const VERSIONS = [
  "The girl who learned early how to figure things out.",
  "The woman who became a mother and learned that love can completely rearrange your definition of yourself.",
  "The single mom who had to become resourceful very quickly.",
  "The corporate woman who knew how to lead, deliver, achieve, and keep going even when she was running on empty.",
  "The entrepreneur who eventually looked at the life she had built and thought, “Surely there’s another way.”",
];

const SELVES = ["A daughter.", "A mother.", "A single mom.", "A corporate leader.", "An entrepreneur.", "A woman who has had to start again.", "A woman who has built things, lost things, questioned things, and rebuilt."];

const CHANGED = ["Becoming a mother changed me.", "Being a single mother changed me.", "Leaving corporate changed me.", "Moving cities changed me.", "Building a business changed me."];

const QUESTIONS = ["Who am I becoming?", "Does this life actually belong to me?", "What am I doing because I want it, and what am I doing because I’ve been conditioned to?", "What would happen if I stopped proving?"];

const ADDING = ["More knowledge.", "More achievements.", "More certifications.", "More goals.", "More things to fix."];
const SUBTRACTING = ["What identity can I release?", "What belief isn’t mine anymore?", "What relationship no longer fits?", "What version of success am I ready to question?", "What happens when I stop performing?", "What do I actually want when nobody is watching?"];

const LIFE = ["Your work.", "Your relationships.", "Your choices.", "Your identity.", "Your definition of success.", "Your relationship with money.", "Your relationship with time.", "Your capacity to receive.", "Your nervous system.", "Your sense of self."];

const BELIEFS = [
  "You are not a problem to be solved. You are a person to be remembered.",
  "Safety in the body comes before insight in the mind.",
  "Depth, not hustle. Presence, not performance.",
  "You don’t need to become more worthy. You need to become more honest.",
  "Sometimes the most courageous thing you can do is admit that the life you built no longer fits.",
  "Transformation is tender work. It deserves to be held, not rushed.",
  "Your life doesn’t have to make sense to everyone else to make sense to you.",
  "You are allowed to change your mind about the life you thought you wanted.",
];

const TRUTHS = ["About what they want.", "What they don’t want.", "What hurts.", "What they’re tired of.", "What they’ve outgrown.", "What they secretly want their life to look like."];

const BRING: [string, string][] = [
  ["Perspective", "Seeing the bigger picture when you’re too close to it."],
  ["Depth", "Being willing to go beneath the obvious answer."],
  ["Honesty", "Naming what needs to be named, with care."],
  ["Presence", "Creating space where you don’t have to perform."],
  ["Curiosity", "Asking better questions."],
  ["Strategy", "Turning awareness into choices and choices into a life."],
  ["Energy", "Because sometimes the room changes before the conversation does."],
];

const NOW_SLOTS: [string, string][] = [
  ["about_now_family", "With my family"],
  ["about_now_beach", "The ocean, often"],
  ["about_now_freedom", "Time that’s mine"],
  ["about_now_peace", "Peace of mind"],
];

/** Photos of the life itself — shown only once Libni has uploaded them in the Studio. */
function LifeGallery({ photos }: { photos: Record<string, string> }) {
  const shots = NOW_SLOTS.map(([id, caption]) => ({ id, caption, src: photos[id] })).filter((s) => s.src);
  if (!shots.length) return null;
  return (
    <div className={`ab-gallery ab-gallery-${shots.length} ed-reveal`}>
      {shots.map((s) => <figure key={s.id}><img src={s.src} alt={s.caption} loading="lazy" /><figcaption>{s.caption}</figcaption></figure>)}
    </div>
  );
}

export default async function About() {
  const content = await getContent();
  const photo = (id: string, fallback: string) => photoFor(content.photos, id) || fallback;

  return (
    <SitePage navOverlay>
      <EdHero
        eyebrowStrong="Libni Fortuna"
        eyebrow="Life Strategist · Transformational Mentor · TEDx Speaker · Experience Curator"
        title="Come home to yourself."
        lede="I’m Libni. And honestly, I’ve been a lot of people."
        sub="Today I live a life I once thought belonged to other people — time that’s mine, a family I actually get to be with, work I’d choose again tomorrow, the ocean often. I got here the long way. And I learned that arriving is where the real conversation starts."
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Say hello", href: "/contact", variant: "light" }]}
        image={photo("about_hero", "/photos/liberate-libni-table.jpg")}
        alt="Libni Fortuna"
        objectPosition="50% 20%"
      />

      {/* A LOT OF PEOPLE */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-sticky ed-figure-34"><img src={photo("about_portrait", "/photos/liberate-libni-thought.jpg")} alt="Libni Fortuna" /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">I’ve been a lot of people</p>
            <ul className="ab-lines">
              {VERSIONS.map((v) => <li key={v}>{v}</li>)}
            </ul>
            <p className="ed-pull">There was.<br />And I’m still discovering it.</p>
            <div className="ed-copy">
              <p>That’s probably one of the most honest things I can tell you about me.</p>
              <p>I don’t do this work because I have life figured out. I do it because I’ve lived enough versions of myself to know what happens when we keep forcing ourselves to fit into a life we’ve already outgrown.</p>
              <p>And I’ve become deeply curious about what happens when we stop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS LIBNI */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-stack ed-reveal">
            <p className="ed-eyebrow">Who is Libni?</p>
            <h2 className="ed-display">I’ve been many versions of myself.</h2>
            <ul className="ab-lines ab-lines-serif">
              {SELVES.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <div className="ed-copy">
              <p>I’m also a professional overthinker who has asked “but why?” approximately 7,000 times.</p>
              <p>I love conversations that actually go somewhere. The kind where we move past “What do you want?” and eventually arrive at: <em>“What is actually true for you now?”</em></p>
              <p>Because sometimes the life we say we want is simply the life we’ve learned we’re supposed to want.</p>
              <p>And sometimes the most important thing isn’t figuring out what comes next. It’s becoming honest enough to admit that what used to work doesn’t anymore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REBUILT */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">I’ve had to rebuild myself too</p>
            <div className="ed-copy">
              <p>There have been seasons where I had to figure things out as I went.</p>
            </div>
            <ul className="ab-lines">
              {CHANGED.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <div className="ed-copy">
              <p>And somewhere along the way, I realized I didn’t want to spend the rest of my life being exceptionally good at holding everything together.</p>
              <p>I wanted to actually feel the life I was building.</p>
            </div>
            <p className="ed-pull">That distinction changed everything.</p>
          </div>
          <div className="ed-off-right5 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <div className="ed-copy">
              <p>I started asking different questions. Not just <em>“What should I do?”</em> But:</p>
            </div>
            <ul className="ab-questions">
              {QUESTIONS.map((q) => <li key={q}>“{q}”</li>)}
            </ul>
            <div className="ed-copy">
              <p>Those questions became the beginning of a very different kind of work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIFE NOW */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">Life now</p><h2 className="ed-display">I’m writing this from the other side of the rebuild.</h2></div>
            <div className="ed-stack-sm">
              <p className="ed-lede" style={{ color: "rgba(251,249,246,.85)" }}>Not from a stage I climbed once. From a life I get to live every day — and am still learning how to live fully.</p>
            </div>
          </div>
          <div className="ed-split ed-split-top ed-reveal">
            <div className="ed-c6 ed-stack">
              <div className="ed-copy" style={{ color: "rgba(251,249,246,.82)" }}>
                <p>My life today is abundant in the ways that actually count. Mornings that belong to me. A business built around my life instead of the other way round. Time with my family that isn’t squeezed in between everything else. Beaches, often. Peace of mind — not as a mood, as a baseline.</p>
                <p>I didn’t inherit this. I built it, after building the other kind first — the impressive life that looked right and felt far away. So I know both from the inside. What it costs to keep the first one running. What it takes to trust the second one.</p>
              </div>
              <p className="ed-pull" style={{ color: "var(--ed-gold-soft)" }}>Which is exactly why I’m good with people who look like they have it figured out. I know that life. I know what it’s like to have everything and still quietly wonder whether it’s yours.</p>
            </div>
            <div className="ed-off-right5">
              <ul className="ab-now">
                <li><b>Time</b>that doesn’t have to be earned back.</li>
                <li><b>Family</b>as the centre, not the reward.</li>
                <li><b>Work</b>I would choose again tomorrow.</li>
                <li><b>Peace of mind</b>as the baseline, not the holiday.</li>
              </ul>
            </div>
          </div>
          <LifeGallery photos={content.photos} />
        </div>
      </section>

      {/* SUBTRACTION */}
      <section className="ed-sec ed-plum">
        <div className="ed-wrap ed-statement">
          <p className="ed-eyebrow ed-reveal">Less, not more</p>
          <h2 className="ed-reveal" style={{ marginTop: 18 }}>I became less interested<br /><span className="ed-gold">in becoming more.</span></h2>
        </div>
      </section>
      <section className="ed-sec ed-linen" style={{ paddingTop: "clamp(56px, 7vw, 96px)" }}>
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-stack ed-reveal">
            <p className="ed-eyebrow">For a long time, growth meant adding</p>
            <ul className="ab-lines ab-lines-serif ab-muted">
              {ADDING.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">Eventually, I became more interested in subtraction</p>
            <ul className="ab-questions">
              {SUBTRACTING.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="ed-pull">For me, transformation has become less about becoming someone new and more about coming home to what was already there.</p>
          </div>
        </div>
      </section>

      {/* LIFE STRATEGIST */}
      <section className="ed-sec ed-ivory" id="life-strategist">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">What does “Life Strategist” actually mean?</p><h2 className="ed-display">It isn’t just about setting goals. It’s about looking at the life you’re actually building.</h2></div>
            <p className="ed-lede ed-muted">Because strategy without self-awareness can build a very impressive life you don’t actually want. And transformation without direction can leave you thinking: “Okay… now what?”</p>
          </div>
          <ul className="ab-grid ed-reveal">
            {LIFE.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <div className="ed-split ed-split-top ed-reveal" style={{ marginTop: "clamp(48px, 6vw, 84px)" }}>
            <div className="ed-c5"><p className="ed-pull">That’s where the work becomes interesting. I care about both. The inner world and the outer life.</p></div>
            <div className="ed-off1 ed-copy">
              <p>Who are you becoming?</p>
              <p>And what kind of life does that person actually want to live?</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEEPER THAN MINDSET */}
      <section className="ed-sec ed-night">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">The work goes deeper than mindset</p>
            <h2 className="ed-display">Life. Mind. Body. <span className="ed-gold">Energy. Self.</span></h2>
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.8)" }}>
              <p>I work across the places where change actually happens.</p>
              <p>Depending on what you need, our work may include NLP, hypnotherapy, subconscious work, somatic and nervous-system practices, breathwork, meditation, energy work, reflection, conversation, or immersive transformational experiences.</p>
            </div>
          </div>
          <div className="ed-off-right5 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-pull" style={{ color: "var(--ed-gold-soft)" }}>The modality is never the point.<br />You are.</p>
            <div className="ed-copy" style={{ color: "rgba(251,249,246,.75)" }}>
              <p>The tools simply help us access the places conversation alone sometimes can’t reach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO I WORK WITH */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-stack ed-reveal">
            <p className="ed-eyebrow">Who do I work with?</p>
            <h2 className="ed-display">People standing at some kind of threshold.</h2>
            <div className="ed-copy">
              <p>Founders, leaders, creatives, entrepreneurs, parents, professionals — of any gender, in any season — people who are changing.</p>
              <p>Many of them have already built extraordinary lives. Success isn’t the problem. Honesty is the next level.</p>
            </div>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <div className="ed-copy">
              <p>People who have achieved a lot and are quietly asking: <em>“Is this really it?”</em></p>
              <p>People who are tired of performing a version of themselves that no longer fits.</p>
              <p>People who know something needs to change, even if they don’t know exactly what.</p>
              <p>People who need someone who can see the bigger picture. Someone who can ask the question underneath the question. Someone who can hold a deeper conversation without immediately trying to fix them. Someone who can say: <em>“Okay. Let’s look at what’s really going on here.”</em></p>
            </div>
            <p className="ed-pull">You don’t need to arrive with a five-year plan. You just need to be willing to tell the truth.</p>
          </div>
        </div>
      </section>

      {/* WHAT I BELIEVE */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-reveal"><div className="ed-figure ed-figure-sticky"><img src={photo("about_stage", PHOTOS.stage)} alt="Libni on stage" style={{ objectPosition: "50% 40%" }} /></div></div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <p className="ed-eyebrow">What I believe</p>
            <ul className="ab-beliefs">
              {BELIEFS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* BEYOND THE WORK */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c6 ed-stack ed-reveal">
            <p className="ed-eyebrow">Beyond the work</p>
            <h2 className="ed-display">I’m a mother.</h2>
            <div className="ed-copy">
              <p>I love beautiful spaces, good food, meaningful conversations, travel, the ocean, writing, music, dancing, and experiences that make people feel more alive.</p>
              <p>I can have a very deep conversation about consciousness and then immediately become extremely invested in what we’re having for dinner.</p>
              <p>I’m curious about people. I’m curious about life. I’m curious about why we do what we do.</p>
              <p>And I’m still learning how to live everything I teach. I think that’s important.</p>
            </div>
            <p className="ed-pull">I don’t want to sit above the people I work with.<br />I want to sit across from them.</p>
          </div>
          <div className="ed-off-right5 ed-reveal" style={{ transitionDelay: ".15s" }}><div className="ed-figure"><img src={photo("about_life", "/photos/liberate-libni-warm.jpg")} alt="Libni Fortuna" /></div></div>
        </div>
      </section>

      {/* WHY */}
      <section className="ed-sec ed-ivory">
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c5 ed-stack ed-reveal">
            <p className="ed-eyebrow">Why I do this work</p>
            <h2 className="ed-display">Because I want people to have a space where they can finally tell the truth.</h2>
            <ul className="ab-lines ab-lines-serif ab-muted">
              {TRUTHS.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div className="ed-off1 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <div className="ed-copy">
              <p>I don’t believe people need to be fixed. I believe sometimes they need enough safety, honesty, perspective, and space to hear themselves again.</p>
              <p>And from there, something becomes possible. A different choice. A different relationship. A different direction. A different way of living.</p>
              <p>Not because someone told them who to become. Because they finally remembered themselves.</p>
              <p>This is the work I want to be known for. Not making people into someone else’s definition of successful. Not teaching people how to perform wellness. Not giving people another checklist of things they need to fix about themselves.</p>
            </div>
            <p className="ed-pull">I want to help people become deeply acquainted with themselves. To understand themselves. To trust themselves. To make choices from that place. And ultimately, to build a life they actually want to wake up inside.</p>
          </div>
        </div>
      </section>

      {/* IN THE ROOM */}
      <section className="ed-sec ed-linen">
        <div className="ed-wrap">
          <div className="ed-head ed-reveal">
            <div><p className="ed-eyebrow">In the room</p><h2 className="ed-display">A few things I bring.</h2></div>
            <p className="ed-lede ed-muted">What it feels like to sit across from me.</p>
          </div>
          <div className="ed-index">
            {BRING.map(([t, d], i) => (
              <div className="ed-item ed-reveal" key={t} style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <div className="ed-item-n">{String(i + 1).padStart(2, "0")}</div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EdFinal
        title="You don’t need to become someone else."
        gold="You may just need the space to remember who you already are."
        copy={[
          "And if you’ve made it this far… maybe you weren’t looking for another coach. Maybe you were looking for someone who could help you see the life you’re living from a different angle.",
          "Maybe you’re in a season of becoming. Maybe you’re exhausted from holding everything together. Maybe you’ve already achieved a lot and still feel like something is missing. Maybe you simply know: there has to be another way.",
        ]}
        ctas={[{ label: "Find your path", href: "/start", variant: "gold" }, { label: "Say hello", href: "/contact", variant: "light" }]}
      />
    </SitePage>
  );
}
