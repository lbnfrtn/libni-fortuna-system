# Messages

Every client-facing message, drafted in Libni's voice. **Nothing here is live until Libni approves it.** Status is marked per message. Edit freely — then change the status to ✅ Approved and I'll (or the EA will) put it into the matching GHL workflow.

Voice reminder: personal, warm, grounded, honest, speaks to "you". Never generic coaching-marketing. Core line: *Come home to yourself.*

Merge fields use GHL's `{{contact.first_name}}` style.

---

## Ignite — "You're in" (Workflow A, email 1)  ⏳ PENDING

**Subject:** You're in, {{contact.first_name}} 🤍

> {{contact.first_name}},
>
> You just made a decision toward yourself, and I don't take that lightly.
>
> Here's everything you need — no chasing, no wondering what happens next:
>
> **1. Book your session** → [choose your time]({{booking_link}})
> Ninety minutes, just the two of us.
>
> **2. A short intake** → [fill it in]({{intake_link}})
> Five minutes. It lets me meet you where you actually are.
>
> **3. What to expect**
> Come as you are. Somewhere quiet, headphones if we're online, water nearby. You don't need to prepare anything except your willingness to be honest.
>
> If anything's unclear, just reply to this email — I read it.
>
> Libni

---

## Ignite — gentle nudge (Workflow A, 48h, intake not done)  ⏳ PENDING

**Subject:** No rush — just leaving this here

> {{contact.first_name}}, I noticed your intake isn't in yet. No pressure at all — but it really does make our time together deeper. Whenever you're ready: [fill it in]({{intake_link}}). — Libni

---

## The Becoming — "You're in" (Workflow B, email 1)  ⏳ PENDING

**Subject:** You said yes. Let's begin, {{contact.first_name}}.

> {{contact.first_name}},
>
> This is the deepest work I offer, and you've just said yes to twelve weeks of coming home to yourself. I'm honoured to walk it with you.
>
> Three things to begin:
>
> **1. Sign your agreement** → [read & sign]({{agreement_link}})
> Simple and human, so we both know what we're committing to.
>
> **2. Your becoming intake** → [begin here]({{intake_link}})
> Deeper questions than usual — where you are, what you're carrying, what you're ready to release. Take your time. It shapes our whole journey.
>
> **3. Book our first session** → [choose a time]({{booking_link}})
>
> This isn't about becoming someone new. It's about remembering who you already are.
>
> With you,
> Libni

---

## The Becoming — nudge (Workflow B, 48h, agreement unsigned)  ⏳ PENDING

**Subject:** Whenever you're ready

> {{contact.first_name}}, just a soft reminder to sign your agreement so we can begin: [read & sign]({{agreement_link}}). If anything's holding you back, tell me — reply here. — Libni

---

## Manual transfer — "we've got your proof" (shown on the page + optional email)  ⏳ PENDING

*(The web page already says this instantly; use the same words if you also email.)*

> We've received your proof of payment. We'll confirm within one business day and email you the next steps. Nothing more to do right now. 🤍

---

## Payment link message — for DM / Viber / WhatsApp (you paste this yourself)  ⏳ PENDING

> {{first_name}}, here's your link to secure your spot — GCash, card, or bank, whatever's easiest: {{link}}. Once it's done, everything you need lands in your inbox. Any questions, just message me. 🤍

---

## Waitlist acknowledgement (for TBD offers, Phase 2 forms)  ⏳ PENDING

**Subject:** You're on the list

> Thank you for your interest in {{offer_name}}, {{contact.first_name}}. It's not open right now, but you're on the list — I'll be in touch the moment the next round opens. In the meantime, I'm glad you're here. — Libni

---

## Instalment reminder (Phase 3, tag `instalment-due`)  ⏳ PENDING

**Subject:** A gentle reminder 🤍

> Hi {{contact.first_name}}, just a soft heads-up that your next payment of {{LF Amount Due}} is coming up. Here's the link whenever you're ready: {{payment_link}}. Anything at all, just reply. — Libni

*(The system also tags `instalment-overdue` if it's more than 3 days late — that goes to your EA as a task to reach out personally, not as an automated message.)*

---

## Instagram DM saved replies (Phase 2)  ⏳ PENDING

Set these up in GHL Conversations → Snippets. All of them point to `/start`. No auto-reply bot — the EA sends these by hand.

- **"How do we work together?"**
  > So glad you reached out 🤍 The easiest way is here — it'll point you to the right thing in a couple of questions: {{start_link}}
- **"How much is [offer]?"**
  > I'll send you everything, including pricing — start here and it'll guide you: {{start_link}}. Any questions after, just message me.
- **"I want to book a session"**
  > Beautiful. Here's the link to choose a time and secure it: {{start_link}} — and I'm here if anything comes up.
- **"Corporate / speaking enquiry"**
  > Thank you — I'd love to hear more. Tell me about it here and I'll reply within a day: {{link_to_/apply/organizations}}
- **"Not ready yet / just following"**
  > No rush at all. I'm glad you're here. Whenever you're ready, this is where to start: {{start_link}} 🤍

---

## Follow-up sequences (Phase 4)  ⏳ PENDING

Short, human, plain-text. **Max 4 touches over ~3 weeks, then move to `nurture`.** Any reply, booking or payment stops the sequence immediately. For The Becoming and all Corporate/Brand: **do not send these automatically — create a task for a human with the draft.** A ₱250k relationship isn't chased by a robot.

### Applied but didn't book a call
1. *(Day 1)* > {{first_name}}, I saw your application come through — thank you for the honesty in it. Here's the link to book our call whenever you're ready: {{booking_link}} 🤍
2. *(Day 4)* > Still holding a space for you. No pressure — is there a question I can answer that would make booking easier?
3. *(Day 10)* > I'll stop nudging after this one. If the timing isn't right, that's completely okay. The link's here if it changes: {{booking_link}}.

### Booked but no-show
1. > {{first_name}}, I was looking forward to our time today and didn't want to miss you. Life happens — here's the link to pick a new time: {{booking_link}}.

### Call done, offer made, no payment
*(For The Becoming: this is a Libni/EA task with the draft below, not an automated email.)*
1. *(Day 1)* > {{first_name}}, it was a real pleasure talking. Here's your link whenever you're ready to begin: {{payment_link}}. Anything still sitting with you, tell me — I'd rather you decide clearly than quickly.
2. *(Day 5)* > Just checking in gently. Still here, still holding the space.

### Payment link opened, not completed / expired
1. > {{first_name}}, looks like your payment didn't go through — sometimes it's just the bank. Here's a fresh link: {{payment_link}}. If something else is in the way, tell me.

### Waitlist — a spot / dates opened
1. > {{first_name}}, a space has opened for {{offer_name}} 🤍 You were on the list, so you get first word. Here's how to claim it: {{link}}.

---

## Backlog re-engagement (Phase 4) — one per offer  ⏳ PENDING

Sent once to old warm leads imported from DMs/spreadsheets. Honest, not salesy.

- **General:**
  > Hi {{first_name}} — a while ago you reached out about working together and life (mine and maybe yours) got busy. No pressure at all, but if the timing's better now, here's the simplest way in: {{start_link}}. And if not, it's genuinely lovely to still have you here. — Libni

---

## Notes for Libni
- The welcome-page wording (the "You're in" web page) is in `config/onboarding.ts` and mirrors these emails. If you change an email, tell me and I'll match the page.
- Refund/cancellation lines are **not** written yet — they go into the agreements once you give me the terms.
- I kept these short on purpose. Say the word if you want them warmer, longer, or more provocative.
