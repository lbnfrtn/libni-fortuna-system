# LIBERATE — build spec for Claude Code

This file is the brief for building the Liberate sales page and the client journey behind it (apply → book a call → close → pay → onboard). Put it in the root of the project as `spec.md`, put the `design-reference/` folder next to it, and start Claude Code with:

> Read spec.md and design-reference/. Do the "Before you write any code" section first and wait for my answers.

---

## For Libni: what you need to have ready

Claude Code will ask you for these. Nothing else is needed from you to start.

1. **Payment plan terms** for the ₱70,000 (how many payments, how much each, when each is due), or "full payment only".
2. **Your call hours**: which days and times you take Liberate calls.
3. **Program dates**: first session date, weekly day and time, retreat date.
4. **The four FAQ answers** from your current page.
5. **Your photos**, in one folder, named by slot (list in section 6).
6. **Testimonials** that clients have agreed to make public.
7. **Accounts** you will be asked to create or log in to: Vercel, Supabase, an email-sending service, a scheduling tool. Claude Code will tell you exactly when, and you paste in the keys it asks for. Never paste keys into chat with anyone else.

---

## 1. What we are building, in one paragraph

Liberate is Libni Fortuna's 3-month group coaching experience (₱70,000, next intake October 2026). People arrive from Instagram on a phone, read the sales page, apply, book a call with Libni, and if Libni says yes, they pay, sign, and get onboarded. Today that path is DMs, bank details and screenshots. This build replaces the admin work, not the relationship: **Libni personally decides who joins. The system never makes or implies a sales decision.**

## 2. Ground rules for Claude Code

- **Work in phases (section 9). Stop after each phase** and report, in plain language with no jargon: what you built, what you tested and how, what is left, and what Libni or her EA must do.
- **Never claim something works if it is mocked.** Label every feature in each report as one of: `IMPLEMENTED`, `MOCKED`, `NEEDS A KEY`, `NEEDS SETUP OUTSIDE THE APP`.
- **Test the running app after every phase**, at 390px wide first, then desktop.
- **Minimum tools.** Do not add a service or library without saying why in one sentence. If something can be a database table and a simple screen, it is not a new platform.
- **Disagree out loud.** If something in this spec is a bad idea given what you find in the codebase, say so and recommend an alternative before building.
- **Ask only what you need to move forward.** One short batch of questions per phase at most.
- All secrets in environment variables. Nothing secret reaches the browser. Payment and booking status are only ever changed on the server.
- Emails and on-screen messages must sound like Libni: warm, direct, first person, "you". No "Dear customer", no "Your submission has been received".

## 3. Before you write any code

Inspect the existing project and report:

1. What already exists (pages, components, styling, any database or auth).
2. What can be reused, and what should be rebuilt.
3. Whether this lives inside the main libni.co app or as its own app. **Recommendation: inside the main app**, at `/liberate`, because the backend below is shared by every offer.
4. The list of accounts and keys you need from Libni, in the order you will need them.
5. Your phase plan, adjusted to what you found.

Then wait for a go-ahead.

## 4. The most important design decision: one backend for every offer

Libni has other offers that follow the same path (The Becoming is application + call; Power Hour is direct booking; retreats are waitlists). **Do not build a Liberate-only system.** Build the journey once, with an `offers` table, and make Liberate the first row. Every lead, application, call, payment and onboarding record points at an offer. Application questions, price, payment plan and onboarding checklist are configured per offer, not hard-coded.

Build only Liberate's screens now. Just don't paint it into a corner.

## 5. Tech

- Next.js (App Router), TypeScript, Tailwind CSS, deployed on Vercel.
- Supabase: Postgres, Auth, Storage. Row-level security on every table. Public visitors can insert an application and nothing else.
- Email: one transactional email service (recommend Resend; say so if you prefer another and why).
- Scheduling: **use a ready-made scheduler embedded in the page, do not build one.** Put it behind a small adapter (`lib/scheduling/`) so the provider can be swapped. Recommend Cal.com; Calendly must remain possible. Bookings reach the app through the provider's webhook, verified by signature.
- Payments: see section 8. Put providers behind an adapter too (`lib/payments/`).

## 6. The public pages

The designs are in `design-reference/` as HTML. **Match them closely.** They are the approved look. Rebuild them as proper components; do not paste the HTML in.

### Design tokens

| Token | Value | Use |
|---|---|---|
| cream | `#EEE7DA` | page background |
| paper | `#F7F3EB` | alternate sections, form fields |
| ink | `#1B1815` | text, solid buttons |
| soft | `#5C554C` | secondary text |
| line | `#C9BFAD` | hairlines |
| gold | `#A88B4A` on light, `#D9C28A` on dark | thin frames, dividers, roadmap path |
| plum | `#5B4470` | roadmap section, selected states, signature |
| terracotta | `#B8623B` | hover and focus only |
| night | `#2A2329` | hero, retreat, closing section |

- Headlines: Cormorant Garamond, light (300), sentence case. Body: Helvetica Neue / Helvetica. Signature: La Belle Aurore.
- Square corners. Thin 1px lines. A gold 1px frame inset inside the hero, the retreat image, the closing section and every photo. A double gold frame around the investment block. Small gold diamond divider above key moments.
- No gradients as decoration, no rounded cards, no scroll animations, no pink, no spiritual clip-art. A dark scrim over the hero photo for legibility is fine.
- Buttons: uppercase, 12px, wide letter-spacing, at least 54px tall. Every tap target at least 44px.
- Logo files: `design-reference/liberate-logo-white.png` and `liberate-logo-ink.png`.

### `/liberate` — sales page, sections in order

1. **Hero** (night, full-width photo): logo, "For the soul-led ones ready to let go of the weight and come home to their power.", supporting line, "Next intake: October 2026", buttons "Liberate yourself today" (scrolls to investment) and "Book a call" (goes to `/liberate/apply`).
2. **There comes a moment when the tools stop working.** Photo left, copy right, the four fading "tools", button "Is this for me?".
3. **They've called you intuitive, grounded, even strong.** Copy left, bath portrait right.
4. **Introducing… Liberate.** Dark logo, the real Zoom screenshot shown large with no laptop mockup, short copy.
5. **Here's what you'll experience inside.** Eight items, each with a photo. Four columns on desktop; on mobile a list with a small square photo on the left.
6. **Your 12-week roadmap** (plum). A winding path: month one left to right, curve down, month two right to left, curve down, month three left to right, ending on a solid gold "Liberation" stop. On mobile, one vertical path.
7. **It doesn't end on Zoom. It ends with a celebration.** Full-width retreat photo, copy, photo mosaic of seven images.
8. **My story: Why I created Liberate.** Portrait left, Libni's story right, handwritten "Libni".
9. **Real people. Real shifts.** Video testimonials plus written quotes, from the database. **Never invent a testimonial.** If there are none, hide the section.
10. **Your peace of mind matters.** The no-refund copy exactly as in the design. Button "I'm ready to be held".
11. **The investment.** ₱70,000, payment plan line (from the database), inclusions list, button "I'm ready to Liberate", and the line: "This takes you to a short application, then a call with me. No payment is taken until we both know it's the right space for you."
12. **Honest answers for the ones who feel the pull.** FAQ accordion, from the database.
13. **Closing** (night): "You don't need to become someone else. You need the freedom to be yourself." Two buttons.
14. Footer: "Come home to yourself.", socials, hello@libni.co.

All copy is in the design file. Use it word for word.

**Every "apply", "I'm ready" and "Book a call" button goes to `/liberate/apply`. No button on this page takes payment.**

### Editable content ("slots")

Everything marked as a placeholder in the design must be editable from the admin without code:

- **Photo slots**, each with a fixed name shown in the admin: Hero portrait · Moment portrait · Bath portrait · Zoom group screenshot · Group at the table · Inside 1 to 8 · Retreat wide shot · Retreat mosaic 1 to 7 · Story portrait · Welcome video · Application-received video (optional).
- Price, payment plan line, intake label ("October 2026"), program dates, retreat details.
- FAQs (question, answer, order, show/hide).
- Testimonials (video or text, first name or approved attribution, optional photo, order, show/hide, and a required "client has agreed to this being public" tick box).

Until a photo slot is filled, show the designed placeholder block, not a broken image. Resize and compress uploads on the server; serve modern formats; lazy-load everything below the hero.

### `/liberate/apply` — application, then booking

Mobile first. Three short steps with a progress bar, as designed.

- **Intro:** "Let's see if Liberate is the right space for you." About 7 minutes · then you choose a time · no payment is taken here.
- **Step 1, about you:** first name, last name, email, phone with country code, Instagram (optional), country.
- **Step 2, where you are right now:** What brought you to Liberate, and what are you navigating right now? · What pattern do you most want to break? · What would you love to experience by the end of Liberate?
- **Step 3, your readiness:** What inner work have you done before? · Why now? · If Liberate feels like the right fit, are you ready to invest ₱70,000? (Yes, I'm ready / Yes, with a payment plan / I'd like to talk it through) · How did you hear about Liberate? (Instagram, TikTok, Podcast, Substack, A friend or past client, Libni's website, Somewhere else)

Requirements:
- Save progress in the browser after each step so a dropped connection or an Instagram in-app-browser reload does not wipe answers.
- Validate gently, in Libni's voice, next to the field. Never clear what the person typed.
- Questions are stored per offer in the database so they can change without code.
- On submit (server side): create or update the lead, save the application, set status to `APPLICATION_SUBMITTED`, record attribution (section 7), send the "application received" email, notify Libni and her EA, then show the booking step.
- **Booking step:** "Thank you. Now let's find a time to connect." Embedded scheduler, prefilled with name and email, carrying the lead ID. Times shown in the visitor's time zone.
- When the scheduler's webhook confirms: save date, time, time zone, meeting link, calendar event ID, lead ID; set status to `CALL_BOOKED`. Handle reschedule and cancel webhooks too.
- **Done screen:** "It's in the calendar." with the booked time, as designed.
- If someone applies but does not book, they stay at `APPLICATION_SUBMITTED` and get one gentle reminder email after 24 hours with their personal booking link. One reminder only.

### `/welcome/[token]` — welcome page after joining

As designed: logo, "Welcome. You said yes.", upright welcome video, note from Libni, five next steps (sign agreement, intake form, join community, save the dates, open portal), support email. Each step shows done/not done for that client. Reached by a private link in the welcome email, not by public URL.

## 7. Data

Propose the final schema in your plan. It must cover at least:

- `offers` (name, slug, price, currency, payment plan options, application questions, onboarding checklist template, active intake label and dates)
- `leads` (contact details, offer, status, source, utm_source, utm_medium, utm_campaign, utm_content, referrer, first-seen date, owner)
- `applications` (lead, offer, answers as structured data, submitted date)
- `calls` (lead, start time, time zone, meeting link, provider, provider event ID, status: booked / completed / no-show / cancelled / rescheduled)
- `notes` (lead, author, text, date)
- `clients` (lead, offer, cohort, joined date)
- `payments` and `payment_installments` (amount, due date, method, status, proof file, provider reference, verified by, verified date)
- `agreements` (client, file or provider reference, sent date, signed date)
- `onboarding_items` (client, item, done, done date, done by)
- `media_slots`, `testimonials`, `faqs`, `site_settings`
- `email_templates` (editable text) and `email_log` (what was sent to whom, when, and whether it was delivered)
- `activity_log` (every status change: who, when, from, to)

**Lead statuses:** `NEW_LEAD` → `APPLICATION_SUBMITTED` → `CALL_BOOKED` → `CALL_COMPLETED` → `FOLLOW_UP` → `CLOSED_WON` → `PAYMENT_PENDING` → `ONBOARDING` → `ACTIVE_CLIENT`, plus `CLOSED_LOST` from any stage (with a reason).

**Attribution:** capture UTM values and referrer on first visit, keep them through the application, and store them on the lead. First touch wins; also keep last touch. No cookie banner-triggering trackers; first-party only.

**Privacy:** applications contain very personal writing. Only Libni and her EA roles can read them. No application text in email notifications to staff, only a link to the admin. Add a simple privacy notice on the application and a way to delete a lead and everything attached to it.

## 8. Admin (`/admin`)

Sign-in by email magic link through Supabase Auth, allow-listed emails only. Two roles: **Owner** (Libni: everything) and **EA** (everything except deleting leads and changing prices). Must be fully usable on a phone.

1. **Leads:** table view first (name, email, source, status, call date, payment status, onboarding progress; search and filter). Kanban board by status second. **Build the table first; the board is Phase 4.**
2. **Lead detail:** contact, application answers, call info, notes, status history, payment, onboarding checklist. Buttons: Mark call completed · Follow up · Close won · Close lost.
3. **Close won** (only ever pressed by a person): set `CLOSED_WON`, create the client and payment records using the plan Libni picks on that screen, send the payment instructions email and the agreement, then set `PAYMENT_PENDING`. **The person is not a paid client yet.**
4. **Payments.** Two stages:
   - **Stage A, build now:** manual payments by GCash and bank transfer. The client gets a private payment page showing the amount due, the account details and an "upload your proof of payment" button. Status: `PENDING` → `SUBMITTED` → `VERIFIED` (= paid). Libni or her EA checks the proof against the bank or GCash record and presses Verify. Only Verify marks anything as paid. Installments each follow the same steps, with a reminder email three days before each due date.
   - **Stage B, later and only on request:** card and e-wallet checkout through PayMongo or Xendit behind the payments adapter, with signed webhooks. Never trust a browser "success" redirect. Statuses `PENDING`, `PAID`, `FAILED`, `REFUNDED`.
5. **Onboarding:** after the first payment is verified, status becomes `ONBOARDING`, the welcome email goes out with the private welcome-page link, and the checklist appears: Payment received · Agreement signed · Intake completed · Community access · Portal access · Welcome email · First session. When all are ticked, status becomes `ACTIVE_CLIENT`.
6. **Page content:** the slots screen from section 6. Tap a slot, choose a file, preview, save.
7. **Testimonials, FAQs, Program settings, Email templates:** simple list-and-edit screens.
8. **Numbers** (Phase 6): leads, applications, calls, closes and verified revenue, by source and by month.

**Agreement:** start simple. A page showing the agreement text, a typed full name, a tick box, a timestamp and IP, saved as a PDF to storage and emailed to both sides. Recommend a dedicated e-signature tool only if Libni asks for one.

**Client portal:** do **not** build a new meditation and workshop library. Libni already has the Project Me app for guided practices. For now "Open your portal" on the welcome page links to a simple private Liberate page: next session, schedule, workbook and resource links, community link, retreat info, announcements. Revisit whether it should live inside Project Me after the first cohort starts.

## 9. Emails

Editable templates, written in Libni's voice, plain and personal, signed "Libni". First drafts are yours to write; mark them clearly as drafts for her to edit.

Application received · Book-your-call reminder (once, 24h) · Call confirmation · Call reminder (day before) · Follow-up after call (sent manually from the lead screen, never automatically) · Payment instructions · Payment proof received · Payment verified · Installment reminder · Welcome to Liberate · Intake reminder · Community access · Session reminder · Retreat information.

Staff notifications: new application, call booked, payment proof uploaded.

Set up the sending domain properly (SPF, DKIM) on libni.co and walk Libni through the DNS records step by step.

## 10. Phases

The October 2026 intake is the deadline that matters. Phases 1 and 2 are what fill the cohort; ship them first and do not let later phases delay them.

| Phase | What | Done when |
|---|---|---|
| 0 | Inspect, report, plan (section 3) | Libni has said go |
| 1 | Design system + `/liberate` sales page with placeholder slots, live on Vercel | Page matches the design on a phone and on desktop; passes a basic accessibility and speed check |
| 2 | Database, application, scheduler embed and webhook, application and booking emails, a plain admin list of applicants | A real test application appears in the admin with its answers, source and booked call time, and both emails arrive |
| 3 | Admin sign-in, lead detail, notes, statuses, page content slots, testimonials, FAQs, settings | Libni uploads a photo from her phone and sees it on the live page |
| 4 | Close won, manual payments with proof upload and verify, installments, agreement, Kanban board | A test client goes from call completed to verified payment without a single DM |
| 5 | Onboarding checklist, welcome page and video, welcome and reminder emails, simple Liberate client page | A test client reaches `ACTIVE_CLIENT` |
| 6 | Numbers by source, polish, error monitoring, backups, hand-over notes for the EA | Libni can answer "where did my clients come from?" from the admin |
| Later | Online checkout (payments Stage B), second offer on the same backend | Only when asked |

## 11. Quality bar

- Phone first: no pinching, no sideways scrolling, fields at 16px or larger so iOS does not zoom, works inside the Instagram in-app browser.
- Accessible: real buttons, links and labels; visible keyboard focus; text contrast at least 4.5:1; reduced-motion respected.
- Fast: hero image prioritised, everything else lazy; aim for a good mobile Lighthouse score and say what the score is.
- Safe: rate-limit and bot-protect the application form without a puzzle captcha; verify every webhook signature; signed, expiring links for private pages and uploaded proofs.
- Honest: no fake countdowns, no invented scarcity numbers, no invented testimonials or statistics. "Spots are limited and held with intention" is the only scarcity line.

## 12. Still to be decided by Libni

Treat each as a clearly marked placeholder until answered. Do not guess.

- Payment plan terms for ₱70,000.
- Call days and hours; call length (design assumes 30 minutes on Zoom).
- Program dates and retreat details.
- The four FAQ answers.
- Whether the welcome video also gets a shorter cousin on the application-received screen.
- Bank and GCash details to show on the payment page.
- Agreement text.
