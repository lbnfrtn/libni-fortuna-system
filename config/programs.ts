import { PHOTOS } from "@/config/media";

// Rich landing-page content per program. Price/journey/refund come from
// config/offers.ts; this is the story. All copy is in Libni's voice and fully
// editable. Testimonials: only REAL client words go in `testimonial`; leave it
// undefined and the page shows a clearly-marked slot to fill.

export interface Program {
  tagline: string;
  intro: string;
  photo: string;
  /** Long-form, emotional, converting copy — one string per paragraph. */
  longCopy?: string[];
  testimonial?: { q: string; who: string; role?: string };
  forYou?: string[];
  includes?: string[];
  how?: { t: string; d: string }[];
  details?: { label: string; value: string }[];
  faq?: { q: string; a: string }[];
}

export const PROGRAMS: Record<string, Program> = {
  ignite: {
    tagline: "One focused conversation to move what&rsquo;s been stuck.",
    intro:
      "Ninety minutes, just the two of us. Not a discovery call — this is the work. We go straight to what&rsquo;s really underneath, and you leave with clarity and a next step.",
    photo: PHOTOS.ignite,
    longCopy: [
      "You know the feeling. You&rsquo;ve talked it through with friends. You&rsquo;ve journaled about it. You&rsquo;ve read the book, listened to the podcast, done the affirmations in the mirror. And still, the same thing keeps circling back — the same relationship pattern, the same hesitation before the leap, the same heaviness on Sunday night that you can&rsquo;t quite explain.",
      "It isn&rsquo;t that you haven&rsquo;t tried. It&rsquo;s that you&rsquo;ve been trying at the level of the mind, and this lives deeper than that. It lives in the body, in the nervous system, in the beliefs you picked up before you were old enough to choose them.",
      "The Power Hour is ninety minutes of going there — gently, directly, together. I&rsquo;ll ask the question no one has asked you. We&rsquo;ll find the pattern, feel where it lives, and loosen its grip. You won&rsquo;t leave with a to-do list. You&rsquo;ll leave lighter, clearer, and knowing exactly what your next honest step is.",
      "Some people come once and that&rsquo;s enough — one conversation that changes a decision, a relationship, a season. Others discover they want to go deeper. Either way, this is where it begins: with you, finally being met.",
    ],
    forYou: [
      "You&rsquo;re circling the same pattern and want to see it clearly.",
      "You need one honest, spacious conversation — not a long program yet.",
      "You want to feel what&rsquo;s underneath, gently and safely.",
    ],
    includes: [
      "A 90-minute private session, online or in person",
      "A short intake so I can meet you where you are",
      "Practices to take with you afterward",
    ],
    how: [
      { t: "Pay & book", d: "Secure your session, then choose a time that&rsquo;s yours." },
      { t: "Fill your intake", d: "A few honest questions — five minutes." },
      { t: "We meet", d: "Ninety minutes of real, held work." },
    ],
    details: [
      { label: "Format", value: "1:1 · online or in person" },
      { label: "Length", value: "60–90 minutes" },
    ],
    faq: [
      { q: "Is this a discovery call?", a: "No. It&rsquo;s the actual work — a full session. If deeper work feels right afterward, we can talk about it." },
      { q: "Online or in person?", a: "Either. You choose what feels safe and easy for you." },
    ],
  },

  "the-becoming": {
    tagline: "My deepest private container. Twelve weeks, 1:1.",
    intro:
      "This is where we stop circling the patterns and meet what&rsquo;s underneath them — together, week by week. Twelve weeks of sustained, held 1:1 work with the subconscious, the nervous system and the body.",
    photo: PHOTOS.becoming,
    longCopy: [
      "From the outside, your life works. The career, the family, the things you built with your own two hands. People come to you. You&rsquo;re the strong one, the capable one, the one who holds it together. And somewhere in the quiet — in the car after the meeting, in the shower, at 2 a.m. — there&rsquo;s a version of you that&rsquo;s exhausted from performing okay.",
      "You&rsquo;ve done the work, or at least the version of it that&rsquo;s available in books and weekend workshops. You have language for your patterns now. But language isn&rsquo;t the same as freedom. You can name the thing and still be run by it.",
      "The Becoming is twelve weeks of not doing this alone. Every week we sit down — you and me — and we go to the root. Not the story about the story; the actual place in your body and your subconscious where the pattern lives. We work with your nervous system so it can finally feel safe enough to let go. We work with the beliefs underneath the beliefs. And between sessions, you&rsquo;re not left to figure it out; you have me, and practices that hold you.",
      "By week twelve, the shift isn&rsquo;t something you have to remember to do. It&rsquo;s who you are. You make decisions from a different place. You stop abandoning yourself to keep everyone else comfortable. You feel, for maybe the first time in years, like you&rsquo;re home in your own life.",
      "This isn&rsquo;t about becoming someone new. It&rsquo;s about remembering who you&rsquo;ve always been — and building a life that can hold her. It&rsquo;s the deepest work I offer, and I only take a handful of people into it at a time. If you&rsquo;re reading this and something in you is saying <em>yes, this</em> — apply. We&rsquo;ll talk, honestly, about whether it&rsquo;s right.",
    ],
    forYou: [
      "You&rsquo;ve done the books and the workshops, and something deeper still aches.",
      "You&rsquo;re ready for depth and real accountability, not another quick fix.",
      "You want a space that can hold all of you for a full season.",
    ],
    includes: [
      "Weekly 1:1 sessions with Libni across 12 weeks",
      "Your own online meditation portal — practices to hold you between sessions",
      "24/7 personal support with real-time replies, so you&rsquo;re never carrying it alone",
      "Free access to Libni&rsquo;s workshops while you&rsquo;re in the container",
      "Work with subconscious patterns, the nervous system and the body",
      "A personalised path — no two journeys are the same",
    ],
    how: [
      { t: "Apply", d: "Share where you are. Your answers shape our first conversation." },
      { t: "We talk", d: "A discovery call to feel if this is right — honestly, both ways." },
      { t: "Begin", d: "Once it&rsquo;s a yes, you&rsquo;ll have your agreement, intake and first session within minutes." },
    ],
    details: [
      { label: "Format", value: "1:1 mentorship" },
      { label: "Length", value: "12 weeks" },
      { label: "Payment", value: "In full, or 3 monthly payments" },
    ],
    faq: [
      { q: "How do we begin?", a: "You apply, we have a discovery call, and if it&rsquo;s a mutual yes I&rsquo;ll send everything you need to start." },
      { q: "Can I pay over time?", a: "Yes — in full, or three monthly payments, the first at signing." },
    ],
  },

  "essence-retreat": {
    tagline: "Four days in Siargao to come all the way home.",
    intro:
      "Step away from the noise of your life and meet yourself on the other side of it. A small, held container — maximum twenty people — of breathwork, somatic work, rest and remembering. 200+ lives transformed since 2023.",
    photo: PHOTOS.essence,
    longCopy: [
      "There&rsquo;s a particular kind of tired that sleep doesn&rsquo;t fix. It&rsquo;s the tiredness of carrying yourself through a life that looks right and feels far away. You don&rsquo;t need a holiday. You need to be somewhere your nervous system can finally stop bracing.",
      "Essence is four days on an island where nobody needs you to be anything. We breathe — properly, deeply, until what&rsquo;s been stuck in your chest for years starts to move. We work with the body, because the body keeps what the mind has filed away. We sit in circle with twenty people who are also done pretending, and something happens in that room that doesn&rsquo;t happen anywhere else: you feel safe enough to be seen.",
      "People cry on the second day. They laugh on the third. On the fourth, they say things like <em>I forgot I could feel like this.</em> They go home and end the relationship, start the business, call their mother, sleep through the night. Not because I told them to — because they remembered who they are, and that person doesn&rsquo;t live the old way anymore.",
      "Twenty seats. That&rsquo;s it. Not because it&rsquo;s exclusive — because I refuse to hold a room I can&rsquo;t actually hold. If you&rsquo;ve been waiting for a sign to finally do something for yourself, this is it. Apply, or put your name on the list. When the next dates open, you&rsquo;ll be the first to know.",
    ],
    testimonial: {
      q: "Essence created a space of deep connection, safety, and belonging. I discovered a new way of seeing myself and a new way of living.",
      who: "Nadia Montenegro",
      role: "Actress · Mother · Businesswoman",
    },
    forYou: [
      "You&rsquo;re longing to fully step away and go deep.",
      "You want to be held in community, not do this alone.",
      "You&rsquo;re ready for a turning point, not just a getaway.",
    ],
    includes: [
      "Four days of guided transformational work",
      "Breathwork, somatic and nervous-system practices",
      "A small group — never more than twenty",
      "Space to rest, feel and reconnect",
    ],
    how: [
      { t: "Apply or join the waitlist", d: "Tell me a little about you; seats are limited to twenty." },
      { t: "Hold your seat", d: "A deposit confirms your place; the balance is due before the retreat." },
      { t: "Come home", d: "Packing list, travel and logistics arrive as the dates near." },
    ],
    details: [
      { label: "Where", value: "Siargao" },
      { label: "Length", value: "4 days" },
      { label: "Capacity", value: "Maximum 20" },
    ],
    faq: [
      { q: "What if it&rsquo;s full?", a: "You&rsquo;ll join the waitlist and get first word when a seat or the next retreat opens." },
      { q: "How do payments work?", a: "A 30% deposit holds your seat; the balance is due 30 days before the retreat." },
    ],
  },

  "project-me": {
    tagline: "A pocket sanctuary. Daily practice, in your hands.",
    intro:
      "For the version of you that&rsquo;s tired of performing okay. Tell Project Me how you feel and it walks you through it — something to listen to, a way to breathe, something to understand, a place to write it out.",
    photo: PHOTOS.studio,
    longCopy: [
      "You don&rsquo;t need a two-hour ritual to come home to yourself. You need something you&rsquo;ll actually open at 11 p.m. when it&rsquo;s heavy. Project Me is that — a daily practice built around how you feel right now, with breathwork, guided audio, reflection prompts and a monthly circle. Small, soft, consistent. The kind of support that stays."
    ],
    includes: ["Daily practices matched to how you feel", "Breathwork &amp; guided audio", "Journaling prompts", "The Circle — a monthly live call"],
    details: [
      { label: "Format", value: "Membership app" },
      { label: "Billing", value: "Every 3 months" },
    ],
  },

  "private-studio": {
    tagline: "A soundbath &amp; breathwork ritual, in person.",
    intro:
      "Two hours of sound and breath to settle your nervous system — for you and the people you choose to bring. A private studio session, held just for your group.",
    photo: PHOTOS.studio,
    longCopy: [
      "Some things can&rsquo;t be talked through. They have to be breathed through. This is two hours in a room made quiet on purpose — sound washing over you, breath moving what words can&rsquo;t reach, and the people you love beside you, going through it too.",
      "Bring your sister. Your best friends. Your team. The people you&rsquo;ve been meaning to slow down with. You&rsquo;ll walk out with a nervous system that remembers what calm feels like — and a shared experience you&rsquo;ll talk about for months.",
    ],
    forYou: ["You want an in-person reset with people you love.", "You&rsquo;re drawn to sound, breath and stillness."],
    includes: ["A 2-hour private soundbath / breathwork session", "Held in person for your group (minimum two)"],
    details: [
      { label: "Format", value: "In person · private group" },
      { label: "Length", value: "2 hours" },
      { label: "Group", value: "Minimum 2 people" },
    ],
  },

  liberate: {
    tagline: "Transformation held in a small circle.",
    intro: "Group coaching for those who want to grow alongside others — you&rsquo;re not doing this alone.",
    photo: PHOTOS.ambient,
    longCopy: [
      "There&rsquo;s a lie we tell ourselves: that healing is something you do alone, quietly, so no one sees the mess. Liberate is the opposite of that. It&rsquo;s a small circle of people who are also ready — witnessing each other, being witnessed, and discovering that the thing you were most ashamed of is the thing that makes everyone in the room exhale.",
      "Held, guided, and real. If you&rsquo;ve wanted the depth of this work with the strength of not being alone in it, this is your circle.",
    ],
    forYou: ["You want depth with the support of a group.", "You&rsquo;re ready to be witnessed and to witness others."],
    includes: ["Group coaching sessions", "A held, intimate circle", "Practices between gatherings"],
  },

  workshops: {
    tagline: "Live workshops &amp; trainings.",
    intro: "Gatherings for emotional mastery and remembering, dated as they&rsquo;re announced.",
    photo: PHOTOS.ambient,
    longCopy: [
      "A few hours that shift something for years. My workshops are experiences, not lectures — you&rsquo;ll breathe, feel, write and leave with practices your body remembers. Dates are announced to the list first.",
    ],
    includes: ["Live, guided group experiences", "Practices you can keep"],
  },

  "founders-circle": {
    tagline: "A table for founders who want depth, not networking.",
    intro: "A recurring dinner gathering — a small circle of founders, real conversation, and space to be a person, not a title.",
    photo: PHOTOS.hero,
    longCopy: [
      "You&rsquo;ve sat through enough dinners where everyone performs success. This is the other kind of table. A handful of founders, a real conversation, and permission to say the thing you can&rsquo;t say to your team or your board. No pitching. No posturing. Just people who carry a lot, putting some of it down together.",
    ],
    forYou: ["You&rsquo;re a founder craving realness over networking.", "You want a table where you can exhale."],
  },

  "private-experiences": {
    tagline: "Something bespoke, designed around you.",
    intro: "A custom private experience or retreat, shaped entirely around you and the people you gather.",
    photo: PHOTOS.essence,
    longCopy: [
      "A milestone birthday. A team that needs to become a team again. A family, a partnership, a circle of friends who want more than a weekend away. Tell me what you imagine and I&rsquo;ll design an experience around it — the place, the practices, the pace — so that the people you gather leave changed, not just entertained.",
    ],
    how: [
      { t: "Tell me what you imagine", d: "Share the vision and who it&rsquo;s for." },
      { t: "We design it together", d: "I&rsquo;ll craft a proposal built around you." },
      { t: "We bring it to life", d: "Agreement, deposit, and we begin." },
    ],
  },

  organizations: {
    tagline: "Wellbeing your people actually feel — including The Reset.",
    intro: "Corporate workshops and retreats that go beyond a talk — real nervous-system tools your people can use on Monday, held with care.",
    photo: PHOTOS.studio,
    longCopy: [
      "Your people are tired in a way a wellness webinar won&rsquo;t touch. Burnout isn&rsquo;t a mindset problem; it&rsquo;s a nervous system that hasn&rsquo;t felt safe in months. I don&rsquo;t come in to inspire your team for an hour and leave. I come in to give them an experience — breath, reflection, tools that work in the body — that they&rsquo;ll actually use when the pressure returns.",
      "The Reset is my signature corporate experience: a half-day or full-day where your team stops performing, starts breathing, and leaves with a shared language for stress and a real way through it. Retreats and custom programs available for leadership teams.",
    ],
    how: [
      { t: "Enquire", d: "Tell me about your team and what you hope to create." },
      { t: "Discovery call", d: "We shape the right experience for your people." },
      { t: "Proposal & agreement", d: "A clear proposal, then we plan and deliver." },
    ],
  },

  speaking: {
    tagline: "This is not just a talk. It&rsquo;s an experience.",
    intro:
      "People don&rsquo;t need another keynote they&rsquo;ll forget by Monday. They need experiences that help them pause, reconnect, and move forward differently. Every keynote I deliver is designed to engage both the mind and the heart — because people rarely change from what they heard, only from what they experienced.",
    photo: PHOTOS.stage,
    longCopy: [
      "I&rsquo;ve stood on a TEDx stage and in a boardroom of ten. I&rsquo;ve spoken to thousands and to a single room that needed exactly one thing said out loud. What I&rsquo;ve learned is this: your audience doesn&rsquo;t need more information. They need a moment they&rsquo;ll still feel a year from now.",
      "My talks blend storytelling, behavioural science, reflection and experiential practice. People breathe. People write. People turn to the person next to them and say something true. And then they go back to their lives and do something differently — because they didn&rsquo;t just hear it, they felt it.",
    ],
    forYou: [
      "You&rsquo;re curating a conference, summit or offsite that should land, not just fill a slot.",
      "You want your people to leave changed — not just entertained.",
      "You value soul and science in the same room.",
    ],
    includes: [
      "A tailored keynote or experiential session",
      "Storytelling, behavioural science, reflection & experiential learning",
      "A moment your audience remembers long after the event",
    ],
    how: [
      { t: "Enquire", d: "Tell me about your event, audience and the shift you want." },
      { t: "We design it", d: "I craft a keynote or experience for your exact room." },
      { t: "I take the stage", d: "TEDx, summits, TV, or an intimate room of ten." },
    ],
    details: [
      { label: "Reach", value: "PH · AU · Bali" },
      { label: "Stages", value: "TEDx · corporate · universities" },
      { label: "Impact", value: "1000+ lives" },
    ],
  },

  brands: {
    tagline: "Collaborations rooted in realness.",
    intro: "Partnerships and KOL collaborations that stay true to the work — soulful, honest, aligned.",
    photo: PHOTOS.ambient,
    longCopy: [
      "I say no to most of them. Not because I&rsquo;m precious — because my audience trusts me, and that trust is the whole point. When a brand genuinely fits the work of coming home to yourself, the collaboration doesn&rsquo;t feel like an ad. It feels like a recommendation from a friend. If that&rsquo;s the kind of partnership you&rsquo;re building, let&rsquo;s talk.",
    ],
  },
};

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS[slug];
}
