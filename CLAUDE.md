# CLAUDE.md — Libni Fortuna System

Standing brief for Claude Code working in this repo. Read `HANDOFF.md` and `README.md` too.

## What this is
Libni's website **and** her whole back office: leads, a Dubsado-style CRM (pipeline, client records, form answers), **Xendit** payments (GCash/Maya/QRPh/card + manual transfer), onboarding, email sequences, and the content Studio. **This app is the only system of record — there is no outside CRM.** GoHighLevel was removed entirely on 2026-10-07 (Libni's decision); never reintroduce it or any other external CRM.

## Non-negotiables
- **Never switch to live payment keys without Libni.** Live Xendit keys need her logins. Test mode (mock Xendit, mock-logging mail, file store) must always keep working with no keys.
- **The site sends its own letters (Libni's decision, 2026-09-29).** `lib/mail.ts` (Resend, mock-logs without `RESEND_API_KEY`) is the only place email leaves the app; `lib/funnel.ts` holds the sequences, enrolments and unsubscribes, edited by Libni at `/admin/email`. Enrolment happens from what people do (`lib/lead.ts`, `lib/markPaid.ts`, `/api/powerhour`, the reminders cron); paying stops pre-sale nudges, a hand-set pipeline stage stops application nudges. Never send from anywhere else, and never send to a suppressed address.
- **EmailOctopus is Libni's mailing list (her decision, 2026-10-08).** `lib/emailoctopus.ts` only adds/tags contacts (mock-logs without `EMAILOCTOPUS_API_KEY`; `EMAILOCTOPUS_LIST_ID` optional — blank = her biggest list, looked up via the API) and never blocks a sale; her automations there run off the tags (`come-home-checkout`, `come-home-buyer`, field `ComeHomeLink`). The site still sends its own receipts/delivery letters. Copy for her automation: `docs/COME-HOME-EMAILS.md`.
- **`markPaid` is the one place a payment becomes real.** It must stay idempotent. Both the Xendit webhook and the EA's manual Verify go through it.
- **`LF-` prefix + Xendit Invoices only.** This keeps the shared Xendit account from colliding with Project Me (`pm-`, subscriptions). Don't use the subscription/`/sessions` API here.
- **Prices live only in `config/offers.ts`.** `null` price or `waitlistOnly` = waitlist. Don't hardcode amounts elsewhere.
- **Don't invent** refund/cancellation terms or TBD prices — those are Libni's. Leave clearly-marked TODOs.
- **Don't over-build.** Minimum viable. Calendars stay external (Calendly link in the Studio); no custom scheduler.

## Verify local changes
```bash
npm test          # 40+ vitest tests
npm run typecheck
npm run dev        # http://localhost:4310
```
**Gotcha:** never run `npm run build` while `next dev` is running — it corrupts the dev server's `.next` and causes 500s on chunk loads. Fix: stop dev, `rm -rf .next`, restart.

## Map
- `config/offers.ts` — offers, prices, journeys (source of truth)
- `config/onboarding.ts` — welcome-page copy (Libni's voice)
- `config/forms.ts` — application/inquiry questions per track
- `lib/leadlog.ts` — every lead with tags + application answers (answers are sensitive: admin-only, never logged/exported)
- `lib/xendit.ts` — the only file that talks to Xendit (isolated, mock mode). `lib/notify.ts` — internal team alerts (server log)
- `lib/orders.ts` (create + plan scheduling), `lib/markPaid.ts`, `lib/lead.ts`, `lib/reminders.ts`, `lib/capacity.ts`, `lib/digest.ts`
- `lib/funnel.ts` + `lib/mail.ts` — email sequences, letters, unsubscribe (`/admin/email`, `/api/funnel`, `/api/cron/funnel` hourly, `/unsubscribe`)
- `lib/content.ts` + `config/site-slots.ts` + `config/content-options.ts` — everything Libni edits in `/admin/studio` (photos, engagements with details/photos/“show on”, stories, press, links incl. Calendly + Instagram feed)
- `lib/instagram.ts` — latest posts via the Behold feed link; `app/components/Engagements.tsx` — expandable engagement rows, year accordion, last gathering, photo marquee
- `app/` — `/start`, `/apply/[offer]`, `/desk`(+`/import`), `/pay/[id]`, `/welcome/[offer]`, `/mock-pay`, `app/api/*`
- `/come-home` — the ₱299 workbook + meditation (offer `come-home`); paying unlocks `/come-home/welcome?o=&t=` (token = `lib/downloads.ts` `orderToken`, also used by `welcomeLink()` for every offer's post-payment link). Files live in `public/dl/<random folder>/` — never link that folder anywhere public.
- `docs/` — MESSAGES, SOPs, TEMPLATES, GO-LIVE, COME-HOME-EMAILS

## Brand voice (anything client-facing)
Personal, warm, grounded, honest, speaks to "you". Never generic coaching-marketing. Core line: *Come home to yourself.*
