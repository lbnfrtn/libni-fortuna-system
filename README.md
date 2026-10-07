# Libni Fortuna System

Libni's website and her entire back office — the only system of record (no outside CRM; GoHighLevel was removed 2026-10-07).

- **Branded forms** → every lead, with tags and application answers, into the site's own CRM
- **Pipeline** (`/admin/pipeline`) → every person in their real stage, with notes, next actions and form answers
- **Payment Desk** (`/desk`) → Xendit payment links and manual-transfer verification
- **Webhook** → hears "paid" from Xendit; `markPaid` records it and starts the welcome letters
- **Email & funnel** (`/admin/email`) → every automatic letter, edited by Libni, sent by the site itself
- **Welcome pages** → the calm "you're in" page after payment

> New here? Read **[HANDOFF.md](./HANDOFF.md)** first — it's written for a non-developer.

## Run it locally (no keys needed)

```bash
npm install
cp .env.example .env.local   # already present with safe test defaults
npm run dev                  # http://localhost:4310
```

With no keys set it runs in **mock mode**: a fake Xendit checkout, letters that only log what they would send, and data saved to `/data`. You can test the entire flow. See HANDOFF.md → "Try it yourself".

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app on http://localhost:4310 |
| `npm test` | Run the automated tests (25 tests) |
| `npm run typecheck` | Type-check without building |
| `npm run build` | Production build |

## Where things are

| Path | What |
|---|---|
| `config/offers.ts` | **The single source of truth for prices & journeys.** Change a price here, nothing else. |
| `config/onboarding.ts` | Welcome-page copy per offer (in Libni's voice) |
| `lib/leadlog.ts` | Every lead, with tags and application answers (admin-only) |
| `lib/xendit.ts` | The only file that talks to Xendit (isolated on purpose) |
| `lib/crm.ts` | The CRM: people merged from leads + orders + notes, with pipeline stages |
| `lib/markPaid.ts` | The single moment a payment becomes real |
| `lib/orders.ts` | Order creation + payment-plan scheduling |
| `app/desk/` | The Payment Desk |
| `app/welcome/[offer]/` | Post-payment welcome pages |
| `app/pay/[id]/` | Manual bank-transfer fallback page |
| `app/api/webhooks/xendit/` | Xendit payment webhook |
| `docs/` | Message templates, SOPs, go-live checklist |

## Status

**Live at libni.co.** See `docs/GO-LIVE.md` for the remaining switch-on items (live payment keys).

| Phase | What | State |
|---|---|---|
| 1 | Payments: Desk, Xendit invoices, webhook, markPaid, manual transfer, welcome pages | ✅ |
| 2 | Front door `/start`, application/inquiry forms, source tracking | ✅ |
| 3 | Onboarding per offer, payment-plan reminders (cron), Essence capacity/deposit/balance, waitlists | ✅ |
| 4 | Follow-up sequences, backlog importer, expired-link handling | ✅ |
| 5 | Corporate/brand templates, custom invoices, weekly digest (cron), SOPs, go-live checklist | ✅ |
| + | Public website (home / about / work-with-me / contact) fronting `/start` | ✅ |
| + | Internal live **dashboard** (`/dashboard`) — cash, orders, balances, seats, stuck | ✅ |
| + | Database: Firestore adapter wired + `npm run db:check`; file mode for local dev | ✅ |
