import { promises as fs } from "node:fs";
import path from "node:path";
import { sendMail, unsubscribeUrl, siteUrl } from "@/lib/mail";
import { getContent } from "@/lib/content";

// ============================================================================
// The email funnel. Sequences are lists of timed letters; people are enrolled
// by what they do on the site (sign up, apply, get a payment link, pay) and
// dropped out by what happens next (they pay, Libni books the call, they
// unsubscribe). Libni edits every word from /admin/email. Same storage shape
// as content: a file locally, one Firestore document in production.
// ============================================================================

export interface FunnelStep {
  id: string;
  /** Days after the previous letter (0 = straight away). */
  delayDays: number;
  /** Optional calendar date (YYYY-MM-DD, Manila). The letter waits for this date even if the delay has passed — for "tomorrow we begin" style letters. */
  sendOn?: string;
  subject: string;
  body: string;
}
export interface Sequence {
  id: string;
  name: string;
  description: string;
  /** Exact triggers ("paid:ignite") or a family ("paid:*"). Exact wins over family. */
  triggers: string[];
  active: boolean;
  /** Stops when the person pays (pre-sale sequences). */
  stopOnPaid?: boolean;
  /** Stops when Libni marks the call booked / proposal sent / not now. */
  stopOnStage?: boolean;
  /** Set once Libni saves it from /admin/email — from then on the saved words win over the code defaults. */
  edited?: boolean;
  steps: FunnelStep[];
}
export interface Enrolment {
  id: string;
  email: string;
  name: string;
  sequenceId: string;
  /** Index of the next letter to send. */
  step: number;
  nextAt: string;
  status: "active" | "done" | "stopped" | "unsubscribed";
  startedAt: string;
  vars: Record<string, string>;
  history: { stepId: string; at: string; mock?: boolean; error?: string }[];
  /** Optional dedupe key (e.g. one instalment reminder per instalment). */
  key?: string;
}
export interface SentLog { at: string; to: string; subject: string; kind: "sequence" | "letter" | "test"; ok: boolean; mock?: boolean; error?: string; sequenceId?: string }
export interface FunnelData {
  sequences: Sequence[];
  enrolments: Enrolment[];
  /** Lower-cased emails that asked not to hear from us. */
  suppressed: string[];
  log: SentLog[];
}

const SITE = () => siteUrl();
const DAY = 86_400_000;

// ---------------------------------------------------------------- defaults
// Written in Libni's voice; she edits them in /admin/email. {{first_name}},
// {{offer}}, {{payment_link}}, {{booking_link}}, {{welcome_link}}, {{portal_link}},
// {{access_code}}, {{start_link}}, {{amount}}, {{due}}, {{site}} are filled in at send time.
const S = (id: string, name: string, description: string, triggers: string[], steps: [number, string, string, string?][], extra: Partial<Sequence> = {}): Sequence => ({
  id, name, description, triggers, active: true, ...extra,
  steps: steps.map(([delayDays, subject, body, sendOn], i) => ({ id: `${id}-${i + 1}`, delayDays, subject, body, ...(sendOn ? { sendOn } : {}) })),
});

export const DEFAULT_SEQUENCES: Sequence[] = [
  S("letters-welcome", "Letters from Libni · welcome", "Someone signs up for the letters or the free guide.", ["newsletter", "free-guide"], [
    [0, "Welcome home, {{first_name}}", `{{first_name}},

I'm so glad you're here.

The letters I send are the ones I wish someone had sent me: honest, unhurried, and never about performing okay. Once in a while — never noise.

Your free guide, Come Home to Yourself: 5 Practices to Begin Your Return, lives here: {{guide_link}}

Start with the first practice tonight. Not all five. One.

— Libni`],
    [3, "The thing underneath", `{{first_name}},

A question, and you don't have to answer it to me — just to yourself:

What are you holding together right now that nobody knows the weight of?

Most of the people I work with are the strong ones. The ones who hold everyone else. Nothing about you is broken. You are a person to be remembered, not a problem to be solved.

If it helps to say it out loud, reply to this. I read every one.

— Libni`],
    [7, "Different ways in", `{{first_name}},

There are different ways to do this work — a single honest conversation, twelve weeks of going to the root, a small circle, a room full of people finally exhaling.

I made a short page that walks you through them: {{site}}/work-with-me

And if you'd rather I point: {{site}}/quiz — sixty seconds, five honest questions.

Whatever you choose, or don't, I'm glad you're reading.

— Libni`],
  ]),

  S("applied-becoming", "The Becoming · applied", "An application for The Becoming comes in. Libni calls them on WhatsApp; these letters hold the space until she does.", ["applied:the-becoming"], [
    [0, "I read your application, {{first_name}}", `{{first_name}},

Thank you for the honesty in your application. I don't take it lightly — it takes something to write those things down.

I'll call you on WhatsApp in the window you chose, so we can talk properly. If a better time comes up, just reply here.

Until then: you've already done the brave part.

— Libni`],
    [3, "Still holding a space for you", `{{first_name}},

If we haven't spoken yet, it's on me — not a sign. I'm still holding a space for you.

Reply with two or three times that work for you this week and I'll call you then.

— Libni`],
  ], { stopOnPaid: true, stopOnStage: true }),

  S("applied-liberate", "Liberate · wants to talk first", "A Liberate applicant chose to talk before paying (or their link couldn't be made). Libni reaches them on WhatsApp; these letters hold the space.", ["applied:liberate"], [
    [0, "I got your application, {{first_name}}", `{{first_name}},

Thank you for the honesty in your application — I read every word.

You asked to talk first. Book our call here whenever it suits you: {{booking_link}} — or reply with two or three times that work this week and I'll call you on WhatsApp.

And if you already know it's a yes, you can join straight away: {{site}}/liberate/join

— Libni`],
    [3, "Still holding a space for you", `{{first_name}},

If we haven't spoken yet, it's on me — not a sign. I'm still holding a space for you in the circle.

Pick a time here: {{booking_link}} — or reply with a couple of times that work and I'll call you then.

— Libni`],
    [10, "I'll stop nudging after this one", `{{first_name}},

If the timing isn't right, that's completely okay. Liberate will be here — {{site}}/liberate — and I'll be glad to hear from you whenever it changes.

— Libni`],
  ], { stopOnPaid: true, stopOnStage: true }),

  S("applied", "Applications · others", "Someone applies for a program that begins with a conversation.", ["applied:*"], [
    [0, "I got your application, {{first_name}}", `{{first_name}},

I saw your application come through — thank you for the honesty in it.

I'll reply personally within a day or two with the next step, and a way for us to talk.

— Libni`],
    [4, "A gentle nudge", `{{first_name}},

Still holding a space for you. No pressure — is there a question I can answer that would make the next step easier?

Reply here. I read every one.

— Libni`],
    [10, "I'll stop nudging after this one", `{{first_name}},

If the timing isn't right, that's completely okay. The door stays open — {{site}}/work-with-me — and I'll be glad to hear from you whenever it changes.

— Libni`],
  ], { stopOnPaid: true, stopOnStage: true }),

  S("payment-pending", "Payment link · not yet paid", "A payment link was created (Power Hour booking or the Desk) and hasn't been paid.", ["payment-pending"], [
    [0, "Your link for {{offer}}", `{{first_name}},

Here's your link for {{offer}} whenever you're ready: {{payment_link}}

GCash, Maya, cards and bank transfer all work. The moment it clears, you'll get everything you need for what's next.

— Libni`],
    [1, "Sometimes it's just the bank", `{{first_name}},

It looks like your payment didn't go through yet — sometimes it's just the bank. Here's the same link: {{payment_link}}

If something else is in the way, tell me. I'd rather you decide clearly than quickly.

— Libni`],
    [3, "The door stays open", `{{first_name}},

I'll leave this here and stop nudging: {{payment_link}}

Whenever the timing is right, it will still work. And if it isn't right, that's okay too.

— Libni`],
  ], { stopOnPaid: true }),

  S("paid-powerhour", "Power Hour · you're in", "A Power Hour is paid. First letter carries the booking link.", ["paid:ignite", "paid:ignite-in-person"], [
    [0, "You're in — let's find our time", `{{first_name}},

You just made a decision toward yourself, and I don't take that lightly.

Choose the time that feels right: {{booking_link}}

Ninety minutes, just the two of us. Come as you are. Somewhere quiet, headphones if we're online, water nearby. You don't need to prepare anything except your willingness to be honest.

Everything else is here: {{welcome_link}}

— Libni`],
    [1, "Before we meet", `{{first_name}},

One small thing before our time together.

Somewhere today, take five quiet minutes and finish this sentence, however it comes out: "The thing I keep circling is…"

Bring that. We'll start there.

— Libni`],
  ]),

  // Started checkout but didn't pay. First nudge waits a day, so someone paying
  // right now never gets a "your link" letter on top of their download.
  S("checkout-come-home", "Come Home to Yourself · not yet paid", "Someone started checkout for the workbook + meditation and didn't finish. Stops the moment they pay.", ["checkout:come-home"], [
    [1, "Your workbook is still waiting", `{{first_name}},

You started to get Come Home to Yourself, and I wanted to make sure the link didn't get lost: {{payment_link}}

The moment it clears, your workbook and guided meditation open — and the link comes straight to this inbox.

— Libni`],
    [3, "The door stays open", `{{first_name}},

I'll leave this here and stop nudging: {{payment_link}}

Whenever the timing is right, it will still be here. Coming home isn't one big moment. It's a choice you make again and again.

— Libni`],
  ], { stopOnPaid: true }),

  // The full Come Home journey (Libni's decision, 2026-10-08): the site sends all of it —
  // delivery, two practice nudges, Project Me, Power Hour, then The Becoming, then a day-30
  // note. (EmailOctopus still collects every buyer via the come-home-buyer tag for broadcasts;
  // its draft automations are kept OFF so nothing double-sends.) Days after purchase shown in [].
  S("paid-come-home", "Come Home to Yourself · the journey", "The workbook + meditation is bought: delivery, then practice nudges, then Project Me and 1:1 over ~30 days.", ["paid:come-home"], [
    [0, "Your workbook and meditation are here", `{{first_name}},

Welcome home.

Your workbook and guided meditation are waiting for you here: {{welcome_link}}

Keep this email. The link is yours, and it works whenever you need to come back — on the good days, and on the hard days, too.

Before you begin: find 15 to 20 quiet minutes. Phone on silent. Something warm to drink. Listen to the meditation first, then let the pen move. One practice at a time.

Go slow. Be gentle. Be honest.

— Libni`],
    [1, "Did you arrive?", `{{first_name}},

Yesterday you did something small that isn't small. You chose to come home to yourself.

If you do one thing this week, let it be this: find 15 quiet minutes, put your headphones in, and press play on the guided meditation. It walks you gently through all five practices — you don't have to figure anything out, you just let my voice carry you home.

Your meditation and workbook are right here whenever you're ready: {{welcome_link}}

Afterwards, if the pen wants to move, open the workbook and let it. Not all five practices. Just one.

Coming home doesn't start with figuring it all out. It starts with arriving.

— Libni`],
    [2, "The little you is still in there", `{{first_name}},

So many of the ways we abandon ourselves were learned when we were small.

The little one who learned to be good so they'd be loved. Who learned to be quiet so there'd be peace. Who learned they had to be okay so everyone else could be okay.

That little one isn't gone. They're in the way you over-explain, over-give, and wait to be chosen. And the person they've been waiting for is you.

Practice 2 is where you go back for them. Kneel down to their level and tell them: "I see you. You didn't do anything wrong. You don't have to earn my love. I'm here now." Then make them one small promise you can actually keep this week.

If heavy memories come up, you don't have to go there alone. Just reply to this — I read every one.

If you'd like to be guided through it, the meditation holds this practice too. It's here whenever you need it: {{welcome_link}}

— Libni`],
    [3, "What happens after day seven", `{{first_name}},

By now you might be near the end of your 7-day tracker. Or you might still be on Practice 1. Both are perfect.

Before the week ends, I want you to hear this: coming home isn't one big moment where everything suddenly feels better. Some days you'll feel so close to yourself. Other days the old stories will come back loud.

That doesn't mean you're back at the start. It means you're human. And now you know the way back.

What makes the difference isn't one perfect week. It's having somewhere to come back to, every day.

That's why I made Project Me. It's a pocket sanctuary. Tell it how you feel and it walks you through it: something to listen to, a way to breathe, something to understand, a place to write it out.

Inside: daily practices matched to how you feel, breathwork and guided audio, journaling prompts, and The Circle — a monthly live call. It's ₱1,499 for three months.

See Project Me: https://projectme.libni.co

— Libni`],
    [3, "You don't need a two-hour ritual", `{{first_name}},

You don't need a two-hour ritual to come home to yourself.

You need something you'll actually open at 11 p.m. when it's heavy.

Project Me is that: a daily practice built around how you feel right now, with breathwork, guided audio, reflection prompts and a monthly circle. Small, soft, consistent. The kind of support that stays.

If these five practices helped you feel even a little closer to yourself, this is how you keep that going on the ordinary days, not just the brave ones.

Start Project Me: https://projectme.libni.co

— Libni`],
    [5, "If something opened", `{{first_name}},

These practices are a doorway. If something opened in you and you'd like someone to walk through it with you, this is the work I love doing.

Not because there's something wrong with you. Because there is so much more of you waiting to be lived.

If you keep circling the same pattern, start with a Power Hour. Ninety minutes, just the two of us. Not a discovery call — this is the work. We go straight to what's really underneath, and you leave with clarity and a next step.

Online or in person. You pay, then choose a time that's yours.

Book your Power Hour: {{site}}/programs/ignite

— Libni`],
    [7, "The deepest work I offer", `{{first_name}},

You have language for your patterns now. You've named the part that's been running the show. You've rewritten the story.

But language isn't the same as freedom. You can name the thing and still be run by it.

The Becoming is my deepest private container. Twelve weeks of sustained 1:1 work with the subconscious, the nervous system and the body. Every week we sit down, you and me, and go to the root. We stop circling the pattern and meet what's underneath, together.

I only take a handful of people into it at a time, so it begins with an application, and then we talk, honestly, about whether it's right.

Read about The Becoming: {{site}}/programs/the-becoming

Not sure which one is right for you? Reply and tell me a little about where you are right now, and we'll figure it out together.

— Libni`],
    [9, "Come back to these pages", `{{first_name}},

It's been about a month since you started coming home to yourself.

Come back to these pages anytime you need them. On the good days. On the hard days, too: {{welcome_link}}

You can honor who you were and still choose to become someone new.

And whenever you want company on the way:

Every day — Project Me: https://projectme.libni.co
One focused conversation — Power Hour: {{site}}/programs/ignite
Twelve weeks, 1:1 — The Becoming: {{site}}/programs/the-becoming

See you on the other side,
Libni`],
  ]),

  S("paid-becoming", "The Becoming · you're in", "The Becoming is paid (or the first instalment is).", ["paid:the-becoming"], [
    [0, "Welcome to The Becoming, {{first_name}}", `{{first_name}},

This is the deepest work I offer, and you've just said yes to twelve weeks of coming home to yourself. I'm honoured to walk it with you.

Your next steps — the agreement, a short intake, and our first session — are here: {{welcome_link}}

Read the agreement slowly. It's simple and human, and it's the first step.

— Libni`],
    [2, "Before our first session", `{{first_name}},

Before we sit down for the first time, I'd love you to do one thing: nothing.

No preparing, no fixing, no arriving with a plan. Just come with the truth of where you are. That's the whole entry requirement.

If the intake isn't done yet, it's here: {{welcome_link}}

— Libni`],
  ]),

  S("paid-liberate", "Liberate · welcome to the circle", "Liberate is paid. Welcome, then the letters before we begin, through the first week, the holiday pause and after week twelve. Dated letters wait for their date.", ["paid:liberate"], [
    [0, "Welcome to Liberate, {{first_name}}", `{{first_name}},

Welcome to the circle.

Everything for our twelve weeks together lives in your portal — the roadmap, each week's session, the replays, and the practices in between: {{portal_link}}

Sign in with this email. Your access code: {{access_code}}

We begin Tuesday, November 3, at 7 pm (Manila). Tuesdays are the Circle, with me. Thursdays are the Lab, with the Liberate community. The link to join is in your portal.

Take what you need, when you need it. See you in week one.

— Libni`],
    [3, "Before we begin", `{{first_name}},

A few things before week one, so nothing is a surprise.

Your portal is open now: {{portal_link}} — the roadmap shows all twelve weeks, and Week 01, Awareness, is where we start.

We meet twice a week, live, on Zoom. Cameras on when you can. A quiet corner helps. If you miss a night, the replay is in your portal within the day.

The in-person retreat closes our twelve weeks — I'll share dates and the place inside the circle.

Nothing else to prepare. Just come as you are.

— Libni`],
    [1, "Tomorrow, 7 pm", `{{first_name}},

Tomorrow we begin.

Tuesday, 7 pm (Manila). The link is in your portal: {{portal_link}}. Come five minutes early if you can, so we can start together.

I'll be there before you are.

— Libni`, "2026-11-02"],
    [2, "After our first night", `{{first_name}},

Thank you for last night. The first Circle is always the one that asks the most of you.

The replay is in your portal: {{portal_link}}. On Thursday at 7 pm we meet again for the first Lab — the Liberate community will be there with us.

If anything came up for you, write it down before it fades. That's the work beginning.

— Libni`, "2026-11-04"],
    [1, "We rest for a while", `{{first_name}},

We pause for the holidays. No sessions on December 22, 24, 29 and 31 — we gather again on Tuesday, January 5, at 7 pm.

Rest is part of the work too. Your portal stays open: {{portal_link}}.

See you in January.

— Libni`, "2026-12-21"],
    [1, "After week twelve", `{{first_name}},

Twelve weeks. Look at where you started.

You don't just complete Liberate — the retreat is still ahead of us, and after that, the door stays open: Liberate alumni are welcome back into the Thursday Labs, with every intake that follows.

Your portal — the replays, the practices — stays with you: {{portal_link}}.

I'm proud of you. Thank you for trusting the room.

— Libni`, "2027-02-03"],
  ]),

  S("paid-general", "Paid · everything else", "Any other program is paid — studio sessions, workshops, retreats, bespoke experiences.", ["paid:*"], [
    [0, "You're in — {{offer}}", `{{first_name}},

Thank you. Your place in {{offer}} is confirmed.

What happens next is here: {{welcome_link}}

If anything feels unclear, reply to this — a real person (often me) reads it.

— Libni`],
  ]),

  S("waitlist", "Waitlist · you're on the list", "Someone joins a waitlist (dates or price not yet set).", ["waitlist:*"], [
    [0, "You're on the list for {{offer}}", `{{first_name}},

You're on the list for {{offer}}. When the next round opens, you'll hear it from me first — before it goes anywhere else.

Until then, if you'd like something to begin with: {{site}}/resources

— Libni`],
  ]),

  S("enquiry", "Organisations, speaking & brands · enquiry received", "A company, event or brand sends an enquiry.", ["enquiry:*"], [
    [0, "Got it — thank you", `{{first_name}},

Thank you for reaching out about {{offer}}. I reply personally within one business day, usually sooner.

In the meantime, this is the kind of room I hold: {{site}}/speaking

— Libni`],
  ]),

  S("instalment-due", "Instalment · coming due", "Sent by the daily reminder job three days before an instalment, on the day, and if it's overdue.", ["instalment-due"], [
    [0, "A gentle reminder — {{offer}}", `{{first_name}},

A gentle reminder that your next payment for {{offer}} — {{amount}} — is due {{due}}.

Here's the link: {{payment_link}}

If something's changed, just tell me. We'll work it out.

— Libni`],
  ]),

  // Words from docs/MESSAGES.md ("Backlog re-engagement"), still awaiting Libni's approval —
  // so it ships switched OFF. She turns it on in Email & funnel before importing old leads.
  S("backlog-reengage", "Old leads · one honest re-engagement", "Sent once to warm leads you import on the Desk (CSV). Off until you approve the words and switch it on — turn it on before importing.", ["nurture"], [
    [0, "{{first_name}}, a gentle hello", `Hi {{first_name}} — a while ago you reached out about working together and life (mine and maybe yours) got busy. No pressure at all, but if the timing's better now, here's the simplest way in: {{start_link}}

And if not, it's genuinely lovely to still have you here.

— Libni`],
  ], { active: false }),
];

export const EMPTY: FunnelData = { sequences: DEFAULT_SEQUENCES, enrolments: [], suppressed: [], log: [] };

// ---------------------------------------------------------------- storage
// Tests get their own scratch file so a test run never touches real enrolments.
const FILE = process.env.VITEST ? path.join(process.cwd(), "data", "funnel.test.json") : path.join(process.cwd(), "data", "funnel.json");
const useFirestore = () => process.env.ORDER_STORE === "firestore";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function firestoreDoc(): Promise<any> {
  const appPkg = "firebase-admin/app";
  const fsPkg = "firebase-admin/firestore";
  const appMod: any = await import(/* webpackIgnore: true */ appPkg);
  const fsMod: any = await import(/* webpackIgnore: true */ fsPkg);
  const { getApps, initializeApp, cert } = appMod;
  const { getFirestore } = fsMod;
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    const credential = raw ? cert(raw.trim().startsWith("{") ? JSON.parse(raw) : raw) : undefined;
    initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID });
    getFirestore().settings({ ignoreUndefinedProperties: true });
  }
  return getFirestore().collection("lf_funnel").doc("state");
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function normalise(raw: Partial<FunnelData> | null | undefined): FunnelData {
  // Sequences she has never touched follow the code defaults; edited ones are kept as saved. New defaults are added.
  const saved = Array.isArray(raw?.sequences) ? raw!.sequences : [];
  const sequences = saved.map((s) => {
    const d = DEFAULT_SEQUENCES.find((x) => x.id === s.id);
    return d && !s.edited ? { ...d, active: s.active ?? d.active } : s;
  });
  for (const d of DEFAULT_SEQUENCES) if (!sequences.some((s) => s.id === d.id)) sequences.push(d);
  return {
    sequences,
    enrolments: Array.isArray(raw?.enrolments) ? raw!.enrolments : [],
    suppressed: Array.isArray(raw?.suppressed) ? raw!.suppressed : [],
    log: Array.isArray(raw?.log) ? raw!.log : [],
  };
}

export async function getFunnel(): Promise<FunnelData> {
  if (!useFirestore()) {
    try { return normalise(JSON.parse(await fs.readFile(FILE, "utf8"))); } catch { return normalise(null); }
  }
  try {
    const snap = await (await firestoreDoc()).get();
    return normalise(snap.exists ? (snap.data() as Partial<FunnelData>) : null);
  } catch (err) {
    console.error("getFunnel:", err);
    return normalise(null);
  }
}

async function saveFunnel(d: FunnelData): Promise<void> {
  d.log = d.log.slice(-300);
  if (!useFirestore()) {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(d, null, 2), "utf8");
    return;
  }
  await (await firestoreDoc()).set(d);
}

// ---------------------------------------------------------------- helpers
const norm = (e: string) => e.trim().toLowerCase();
const firstName = (name: string) => (name || "").trim().split(/\s+/)[0] || "there";

function matches(seq: Sequence, trigger: string): "exact" | "family" | null {
  if (seq.triggers.includes(trigger)) return "exact";
  const fam = trigger.split(":")[0] + ":*";
  return seq.triggers.includes(fam) ? "family" : null;
}

/** Fill {{vars}}; anything unknown becomes empty rather than leaking braces. */
export function render(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_, k: string) => vars[k] ?? "");
}

/** Values every letter can use, plus whatever the trigger supplied. */
async function baseVars(name: string, extra: Record<string, string>): Promise<Record<string, string>> {
  const content = await getContent();
  const site = SITE();
  return {
    site, first_name: firstName(name), name: name || "there",
    guide_link: `${site}/resources`, start_link: `${site}/start`, portal_link: `${site}/portal`, access_code: content.liberate.accessCode || "(ask me for it)",
    booking_link: content.links.calendlyPowerHour || `${site}/contact — or just reply to this and I'll send you times`,
    ...extra,
  };
}

async function deliver(d: FunnelData, e: Enrolment, seq: Sequence, step: FunnelStep, now: number): Promise<void> {
  const vars = await baseVars(e.name, e.vars);
  const r = await sendMail({ to: e.email, subject: render(step.subject, vars), text: render(step.body, vars), unsubscribeUrl: unsubscribeUrl(e.email) });
  e.history.push({ stepId: step.id, at: new Date(now).toISOString(), mock: r.mock, error: r.ok ? undefined : r.error });
  d.log.push({ at: new Date(now).toISOString(), to: e.email, subject: render(step.subject, vars), kind: "sequence", ok: r.ok, mock: r.mock, error: r.error, sequenceId: seq.id });
  if (r.ok) {
    e.step += 1;
    const next = seq.steps[e.step];
    if (!next) e.status = "done";
    else e.nextAt = new Date(dueAt(now, next)).toISOString();
  } else {
    // Try again next run.
    e.nextAt = new Date(now + 60 * 60 * 1000).toISOString();
  }
}

// ---------------------------------------------------------------- public API
export interface EnrolInput { email: string; name: string; trigger: string; vars?: Record<string, string>; key?: string; now?: number }

/** Put someone into every active sequence that listens for this trigger, and send the first letter if it's immediate. */
export async function enrol(input: EnrolInput): Promise<{ enrolled: string[] }> {
  const email = norm(input.email);
  if (!email) return { enrolled: [] };
  const d = await getFunnel();
  if (d.suppressed.includes(email)) return { enrolled: [] };
  const now = input.now ?? Date.now();
  const exact = d.sequences.filter((s) => s.active && matches(s, input.trigger) === "exact");
  const chosen = exact.length ? exact : d.sequences.filter((s) => s.active && matches(s, input.trigger) === "family");
  const enrolled: string[] = [];
  for (const seq of chosen) {
    if (!seq.steps.length) continue;
    if (input.key && d.enrolments.some((e) => e.key === input.key)) continue;
    const dup = d.enrolments.find((e) => e.email === email && e.sequenceId === seq.id && (e.status === "active" || now - new Date(e.startedAt).getTime() < 30 * DAY));
    if (dup) continue;
    const e: Enrolment = {
      id: `${seq.id}-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      email, name: input.name, sequenceId: seq.id, step: 0,
      nextAt: new Date(dueAt(now, seq.steps[0])).toISOString(),
      status: "active", startedAt: new Date(now).toISOString(), vars: input.vars ?? {}, history: [], key: input.key,
    };
    d.enrolments.push(e);
    if (dueAt(now, seq.steps[0]) <= now) await deliver(d, e, seq, seq.steps[0], now);
    enrolled.push(seq.id);
  }
  if (enrolled.length) await saveFunnel(d);
  return { enrolled };
}

/** Someone paid: pre-sale sequences stop for them. */
export async function stopOnPaid(email: string): Promise<void> {
  await stopWhere(email, (s) => Boolean(s.stopOnPaid));
}
/** Libni moved them by hand (call booked, proposal sent, not now): the application nudges stop. */
export async function stopOnStage(email: string): Promise<void> {
  await stopWhere(email, (s) => Boolean(s.stopOnStage));
}
async function stopWhere(rawEmail: string, pick: (s: Sequence) => boolean): Promise<void> {
  const email = norm(rawEmail);
  const d = await getFunnel();
  let changed = false;
  for (const e of d.enrolments) {
    if (e.email !== email || e.status !== "active") continue;
    const seq = d.sequences.find((s) => s.id === e.sequenceId);
    if (seq && pick(seq)) { e.status = "stopped"; changed = true; }
  }
  if (changed) await saveFunnel(d);
}

export async function stopEnrolment(id: string): Promise<void> {
  const d = await getFunnel();
  const e = d.enrolments.find((x) => x.id === id);
  if (e && e.status === "active") { e.status = "stopped"; await saveFunnel(d); }
}

export async function unsubscribe(rawEmail: string): Promise<void> {
  const email = norm(rawEmail);
  const d = await getFunnel();
  if (!d.suppressed.includes(email)) d.suppressed.push(email);
  for (const e of d.enrolments) if (e.email === email && e.status === "active") e.status = "unsubscribed";
  await saveFunnel(d);
}
export async function resubscribe(rawEmail: string): Promise<void> {
  const email = norm(rawEmail);
  const d = await getFunnel();
  d.suppressed = d.suppressed.filter((x) => x !== email);
  await saveFunnel(d);
}

/** Send every letter that is due. Called by the hourly cron; safe to call any time. */
/** When a letter is due: the delay, but never before its calendar date (9 am Manila). */
function dueAt(now: number, step: FunnelStep): number {
  const byDelay = now + step.delayDays * DAY;
  if (!step.sendOn) return byDelay;
  const onDate = Date.parse(`${step.sendOn}T09:00:00+08:00`);
  return Number.isFinite(onDate) ? Math.max(byDelay, onDate) : byDelay;
}

export async function runDue(now = Date.now(), max = 60): Promise<{ sent: number; failed: number }> {
  const d = await getFunnel();
  let sent = 0, failed = 0, changed = false;
  const due = d.enrolments.filter((e) => e.status === "active" && new Date(e.nextAt).getTime() <= now).slice(0, max);
  for (const e of due) {
    const seq = d.sequences.find((s) => s.id === e.sequenceId);
    if (!seq) { e.status = "stopped"; changed = true; continue; }
    if (!seq.active) continue; // paused sequences hold their place
    if (d.suppressed.includes(e.email)) { e.status = "unsubscribed"; changed = true; continue; }
    const step = seq.steps[e.step];
    if (!step) { e.status = "done"; changed = true; continue; }
    await deliver(d, e, seq, step, now);
    changed = true;
    if (e.history[e.history.length - 1]?.error) failed++; else sent++;
  }
  if (changed) await saveFunnel(d);
  return { sent, failed };
}

export async function saveSequence(seq: Sequence): Promise<FunnelData> {
  const d = await getFunnel();
  const clean: Sequence = {
    id: seq.id, name: seq.name.trim().slice(0, 120), description: seq.description.trim().slice(0, 300),
    triggers: seq.triggers.map((t) => t.trim()).filter(Boolean).slice(0, 12), active: Boolean(seq.active),
    stopOnPaid: seq.stopOnPaid, stopOnStage: seq.stopOnStage, edited: true,
    steps: seq.steps.slice(0, 12).map((s, i) => ({ id: s.id || `${seq.id}-${i + 1}`, delayDays: Math.max(0, Math.min(90, Number(s.delayDays) || 0)), sendOn: /^\d{4}-\d{2}-\d{2}$/.test(s.sendOn || "") ? s.sendOn : undefined, subject: s.subject.trim().slice(0, 200), body: s.body.slice(0, 8000) })).filter((s) => s.subject && s.body),
  };
  const i = d.sequences.findIndex((s) => s.id === clean.id);
  if (i === -1) d.sequences.push(clean); else d.sequences[i] = clean;
  await saveFunnel(d);
  return d;
}

/** Preview one letter with sample values — for “send me a test”. */
export async function sendTest(to: string, subject: string, body: string, name = "Libni"): Promise<{ ok: boolean; mock?: boolean; error?: string }> {
  // Sample values for the "send me a test" preview only. Real letters use each buyer's own links.
  const vars = await baseVars(name, { offer: "Come Home to Yourself", payment_link: `${SITE()}/pay/LF-example`, welcome_link: `${SITE()}/come-home/welcome?o=LF-example&t=sample`, amount: "₱299", due: "Friday" });
  const r = await sendMail({ to, subject: render(subject, vars), text: render(body, vars), unsubscribeUrl: unsubscribeUrl(to) });
  const d = await getFunnel();
  d.log.push({ at: new Date().toISOString(), to, subject: render(subject, vars), kind: "test", ok: r.ok, mock: r.mock, error: r.error });
  await saveFunnel(d);
  return r;
}

/** One letter to many people (the “Letters from Libni” broadcast). Skips anyone unsubscribed. */
export async function broadcast(recipients: { email: string; name: string }[], subject: string, body: string): Promise<{ sent: number; skipped: number; failed: number; mock: boolean }> {
  const d = await getFunnel();
  const seen = new Set<string>();
  let sent = 0, skipped = 0, failed = 0, mock = false;
  for (const r of recipients) {
    const email = norm(r.email);
    if (!email || seen.has(email) || d.suppressed.includes(email)) { skipped++; continue; }
    seen.add(email);
    const vars = await baseVars(r.name, {});
    const res = await sendMail({ to: email, subject: render(subject, vars), text: render(body, vars), unsubscribeUrl: unsubscribeUrl(email) });
    d.log.push({ at: new Date().toISOString(), to: email, subject: render(subject, vars), kind: "letter", ok: res.ok, mock: res.mock, error: res.error });
    if (res.mock) mock = true;
    if (res.ok) sent++; else failed++;
  }
  await saveFunnel(d);
  return { sent, skipped, failed, mock };
}
