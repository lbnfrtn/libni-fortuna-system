# CLAUDE.md — Libni Fortuna System

Standing brief for Claude Code working in this repo. Read `HANDOFF.md` and `README.md` too.

## What this is
The thin glue layer between Libni's website/DMs, **GoHighLevel** (CRM, the system of record for people + client-facing messages) and **Xendit** (Philippine payments). GHL can't take GCash/Maya natively; this fills only that gap. Built from `spec.md`. All five spec phases are complete and tested in **test mode**; not deployed.

## Non-negotiables
- **Never deploy or switch to live keys without Libni.** Deploy + live Xendit keys + GHL token need her logins. Test mode (mock Xendit, safe-mode GHL, file store) must always keep working with no keys.
- **Code writes DATA + a TAG; GHL workflows do the communicating.** Never send client emails from code. If a message needs to change, edit `docs/MESSAGES.md` and the GHL workflow, not code.
- **`markPaid` is the one place a payment becomes real.** It must stay idempotent. Both the Xendit webhook and the EA's manual Verify go through it.
- **`LF-` prefix + Xendit Invoices only.** This keeps the shared Xendit account from colliding with Project Me (`pm-`, subscriptions). Don't use the subscription/`/sessions` API here.
- **Prices live only in `config/offers.ts`.** `null` price or `waitlistOnly` = waitlist. Don't hardcode amounts elsewhere.
- **Don't invent** refund/cancellation terms or TBD prices — those are Libni's. Leave clearly-marked TODOs.
- **Don't over-build.** Minimum viable. If GHL already does it, don't rebuild it (no custom CRM/email/calendar/portal).

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
- `config/ghl-map.ts` — pipeline/stage/field IDs from env (filled via Build Sheet or `npm run ghl:bootstrap`)
- `lib/xendit.ts` / `lib/ghl.ts` — the only files that talk to those services (isolated, mock/safe modes)
- `lib/orders.ts` (create + plan scheduling), `lib/markPaid.ts`, `lib/lead.ts`, `lib/reminders.ts`, `lib/capacity.ts`, `lib/digest.ts`
- `app/` — `/start`, `/apply/[offer]`, `/desk`(+`/import`), `/pay/[id]`, `/welcome/[offer]`, `/mock-pay`, `app/api/*`
- `docs/` — GHL-BUILD-SHEET, MESSAGES, SOPs, TEMPLATES, GO-LIVE

## Brand voice (anything client-facing)
Personal, warm, grounded, honest, speaks to "you". Never generic coaching-marketing. Core line: *Come home to yourself.*
