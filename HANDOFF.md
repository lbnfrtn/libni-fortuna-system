# HANDOFF — read this first

Plain language. Written for Libni and the EA, not for a developer.

---

## What this is (in one breath)

When someone wants to work with you, this system lets you (or your EA) send them a payment link in under a minute, takes their GCash/card/bank payment, and then — on its own — marks them paid in GoHighLevel and sets off the welcome email, agreement and booking. No more "here are my bank details," waiting for a screenshot, and doing everything by hand.

**What it does NOT do:** it doesn't replace GoHighLevel. Everything your client *reads* (emails, reminders) still lives in GHL, where your EA can edit the words without a developer. This system just handles the part GHL can't: taking Philippine payments and telling GHL who paid.

---

## What's built and working right now (all five phases)

- **The Payment Desk** (`/desk`) — pick a client, an offer, how they're paying (full / plan / deposit), click once, get a link to send. Plus an **open-orders** view with balances, resend, and one-click Verify.
- **Payments** through Xendit (GCash, Maya, QRPh, card) plus a **manual bank-transfer** path with proof + EA verify.
- **The "paid" moment** — when they pay, the order is marked paid, GHL is updated, and the tag that starts onboarding fires. Same for a verified manual transfer.
- **Welcome pages** — the calm "You're in" page, per offer, in your voice.
- **Payment plans & deposits** — The Becoming in 3 payments, 30% retreat deposits, 50/50 corporate.
- **The front door** (`/start`) — the guided "Work with Libni" flow for your bio/DMs, plus branded **application & inquiry forms** (`/apply/<offer>`) that drop leads into GHL with their source tagged.
- **Automatic payment-plan reminders** (3 days before / on the day / 3 days after; overdue → EA task, never a robot threat).
- **Essence retreat flow** — deposit → balance → logistics, and a hard **cap of 20 seats** that flips the page to waitlist when full.
- **Follow-up** sequences (specced in GHL) and a **backlog importer** (`/desk/import`) for your old DM/spreadsheet leads.
- **A weekly digest** to you — cash collected, closes, new orders, outstanding balances, anything stuck.
- **A public website** — home, about, work-with-me and contact pages in your voice (`/`, `/about`, `/work-with-me`, `/contact`), all leading to `/start`. Testimonials/photos are clean placeholders for you to fill with real ones.
- **Your own dashboard** (`/dashboard`, same login as the Desk) — a live view of the money side: cash this week, open orders, what's awaiting your verify, balances, Essence seats left, and recent activity.
- **A real database path** — orders save to a local file while testing, and to **Firestore** (Google, same as Project Me) in production. Flip one setting at go-live; check it with `npm run db:check`. See `docs/DATABASE.md`.

Every offer is in one config file. It has been tested end-to-end on a laptop in **test mode** (33 automated tests pass, production build clean). **No real money has moved and it's not deployed** — that's the go-live step below, which needs your keys and logins.

---

## Try it yourself (5 minutes, safe, no money)

1. Open a terminal in this folder and run:
   ```bash
   npm install
   npm run dev
   ```
2. Go to **http://localhost:4310/desk** in your browser.
3. Create a link: pick "Ignite", type any name and email, click **Create payment link**.
4. Click the payment link it gives you. You'll see a **test checkout** (clearly labelled — no real money). Click "Pay now".
5. You land on the **welcome page**. Behind the scenes the order is now marked paid.
6. Back on the Desk, that person shows as paid. That's the whole flow.

To test a bank transfer: on the Desk, copy the "bank-transfer page" link instead, open it, paste any link as "proof", submit — then back on the Desk click **Verify**. That's exactly what your EA will do when they see money land in the bank.

---

## The one file you'll change most: prices

All prices live in **`config/offers.ts`**. To change Ignite's price, find `pricePHP: 7777` under `ignite` and change the number. That's it — nothing else to touch.

- A price of `null` **or** `waitlistOnly: true` means the offer collects a **waitlist** instead of taking money. That's how Liberate, Essence, Founders Circle and Workshops behave until you give me prices and dates.
- To **open** a waitlisted offer: set its `pricePHP` to the real number and delete the `waitlistOnly: true` line.

## Adding a new offer

Copy an existing block in `config/offers.ts`, give it a new `slug` (a short lowercase name, no spaces), set the price and options, and add a welcome message for it in `config/onboarding.ts`. Then tell me and I'll add its GHL workflow to the Build Sheet. (Full steps are commented at the top of both files.)

---

## What YOU and the EA must do by hand (the checklist)

Nothing below involves code. It's all clicking in GoHighLevel and pasting a few values.

### To connect the real services (when you're ready)
1. **Xendit test keys** — Xendit → Settings → Developers → API keys. Copy the **TEST** secret key and the **webhook verification token**. Paste them into `.env.local` (see `.env.example` for exactly where). Keep the live keys off until go-live.
2. **GHL API token** — a Private Integration token for your location. Paste into `.env.local`.
3. **The GHL build** — follow **[docs/GHL-BUILD-SHEET.md](./docs/GHL-BUILD-SHEET.md)**: it walks the EA click-by-click through the three pipelines, the tags, the custom fields, and the two "paid → welcome" workflows (Ignite and The Becoming). It also shows where to paste the resulting IDs.
4. **Approve the messages** — read **[docs/MESSAGES.md](./docs/MESSAGES.md)** and tell me what to change. Nothing a client reads goes live until you approve it.
5. **Your bank details** — for the manual-transfer page. Put them in `.env.local` (bank, account name, number).

### Still needed from you (I can't invent these)
- **Prices/dates** for Liberate, Essence, Founders Circle, Workshops.
- **Refund/cancellation terms per offer** — even one line each (e.g. "Ignite: reschedule up to 48h, no refund"). These go on the agreements and checkout.

---

## Going live

The full, ordered checklist is in **[docs/GO-LIVE.md](./docs/GO-LIVE.md)**. In short: you finalise refund terms + prices + approve messages; the EA does the GHL Build Sheet; then the Xendit live keys, Firestore, Vercel deploy and one real small test payment. Deploying needs your Vercel login and live keys — I can't do that part for you, but everything is ready for it.

**Important safety fact:** this system shares your Xendit account with Project Me. It only ever touches payments whose ID starts with `LF-`, and it uses Xendit's **Invoice** notifications, which are a separate channel from Project Me's subscription notifications. So the two cannot break each other.

---

## Who to call when something looks wrong

- **A client paid but nothing happened** → check the Desk; the order should say "paid". If it does but no email went out, the problem is the GHL workflow (the EA can open it in GHL). If the order still says "pending", the Xendit webhook didn't arrive — check the webhook address in Xendit.
- **The Desk won't load** → the app isn't running or isn't deployed; restart `npm run dev` locally, or check Vercel once we're live.
- **Anything in code** → that's me (Claude Code). Open this folder and ask.

---

## Going to production (developer note)

- Set `ORDER_STORE=firestore` and run `npm i firebase-admin`, then provide `FIREBASE_SERVICE_ACCOUNT` + `FIREBASE_PROJECT_ID`. Orders move from the local `/data/orders.json` to the `lf_orders` Firestore collection. The file store is dev/test only.
- The Desk login is a simple passcode + email allow-list (fine for two people). If per-person Firebase Auth is wanted, swap `lib/auth.ts`; noted but not required.
- The manual-transfer "proof" is currently a pasted link. Wiring a real file upload (Firebase Storage) is a small go-live upgrade.
- The welcome-page CTA buttons (`#agreement`, `#intake`, `#booking`) are placeholders — paste the real GHL links per the Build Sheet.
