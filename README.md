# Libni Fortuna System

The thin "glue" layer between Libni's website/DMs, **GoHighLevel** (the CRM), and **Xendit** (Philippine payments). GHL can't take GCash/Maya/QRPh natively; this fills that gap and nothing more.

- **Branded forms** → create/updates a contact in GHL
- **Payment Desk** (`/desk`) → creates Xendit payment links after a call
- **Webhook** → hears "paid" from Xendit and tells GHL, which runs the client-facing workflows
- **Welcome pages** → the calm "you're in" page after payment

Everything a client *reads* lives in GHL where the EA can edit it. This code only writes data and adds a tag; GHL workflows do the communicating.

> New here? Read **[HANDOFF.md](./HANDOFF.md)** first — it's written for a non-developer.

## Run it locally (no keys needed)

```bash
npm install
cp .env.example .env.local   # already present with safe test defaults
npm run dev                  # http://localhost:4310
```

With no keys set it runs in **mock mode**: a fake Xendit checkout, a GHL that only logs what it would send, and orders saved to `/data`. You can test the entire flow. See HANDOFF.md → "Try it yourself".

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
| `config/ghl-map.ts` | Pipeline / stage / custom-field IDs (filled from the Build Sheet) |
| `lib/xendit.ts` | The only file that talks to Xendit (isolated on purpose) |
| `lib/ghl.ts` | The only file that talks to GHL |
| `lib/markPaid.ts` | The single moment a payment becomes real |
| `lib/orders.ts` | Order creation + payment-plan scheduling |
| `app/desk/` | The Payment Desk |
| `app/welcome/[offer]/` | Post-payment welcome pages |
| `app/pay/[id]/` | Manual bank-transfer fallback page |
| `app/api/webhooks/xendit/` | Xendit payment webhook |
| `docs/` | GHL Build Sheet, message templates, SOPs |

## Status

**All five phases built, tested in test mode** (33 tests pass, `npm run build` clean). Not deployed. See `docs/GO-LIVE.md` for the switch-on checklist.

| Phase | What | State |
|---|---|---|
| 1 | Payments: Desk, Xendit invoices, webhook, markPaid, manual transfer, welcome pages | ✅ |
| 2 | Front door `/start`, application/inquiry forms, source tracking | ✅ |
| 3 | Onboarding per offer, payment-plan reminders (cron), Essence capacity/deposit/balance, waitlists | ✅ |
| 4 | Follow-up sequences (GHL specs), backlog importer, expired-link handling | ✅ |
| 5 | Corporate/brand templates, custom invoices, weekly digest (cron), SOPs, go-live checklist | ✅ |
| + | Public website (home / about / work-with-me / contact) fronting `/start` | ✅ |
| + | Internal live **dashboard** (`/dashboard`) — cash, orders, balances, seats, stuck | ✅ |
| + | Database: Firestore adapter wired + `npm run db:check`; file mode for local dev | ✅ |
