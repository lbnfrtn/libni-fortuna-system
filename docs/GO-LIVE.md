# Go-Live Checklist

Everything is built and tested in **test mode**. This is the ordered list to switch it on for real. Nothing here should be rushed — do it in order, and stop if anything looks off.

Libni + Claude (or a developer) do steps 3–7 together.

---

## 1. Decisions Libni must finalise
- [ ] **Refund / cancellation terms** — review and approve the drafts in `docs/REFUNDS.md` (edit anything, mark ✅). Once approved, the one-liners paste into `config/offers.ts` (`refundNote`) and the agreements; they then show on checkout automatically.
- [ ] **Prices/dates** for any offer you're opening (Liberate, Essence, Founders Circle, Workshops). Until set, they stay waitlist-only — that's fine.
- [ ] **Approve every message** in `docs/MESSAGES.md` (change ⏳ to ✅).

## 2. GoHighLevel build (EA, using `docs/GHL-BUILD-SHEET.md`)
- [ ] Custom fields created; IDs pasted into env.
- [ ] Consumer pipeline (at least) built; IDs pasted.
- [ ] Workflows built and turned on: Ignite paid→welcome, The Becoming paid→welcome, instalment-due reminder, nurture re-engagement. (Others as you activate offers.)
- [ ] The Becoming agreement in Documents (with refund terms).
- [ ] Ignite + The Becoming calendars created; links pasted into `config/onboarding.ts` (replace the `#booking` etc. placeholders) or into the GHL emails.
- [ ] Instagram connected to GHL Conversations; saved replies added.

## 3. Xendit
- [ ] Paste **TEST** keys into `.env.local`; run one full test payment end-to-end (GCash test) and confirm the welcome email fires from GHL.
- [ ] Confirm the **Invoice** webhook is a **separate** row from Project Me's recurring/payment-session webhook. Point the **Invoice** webhook at `https://<your-domain>/api/webhooks/xendit`.
- [ ] Ask Xendit / check the dashboard for the **fee per method on a ₱250,000 payment**; decide which methods to show for The Becoming (card vs bank vs instalments).
- [ ] Only when all the above passes: switch to **LIVE** keys and set `APP_MODE=live`. (Live keys also automatically disable the test `/mock-pay` page.)

## 4. Storage (production)
- [ ] `npm i firebase-admin`, set `ORDER_STORE=firestore`, `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT`. Orders now persist in Firestore, not the local file.
- [ ] (Optional but recommended) wire the manual-transfer "proof" to a real file upload (Firebase Storage) instead of a pasted link.

## 5. Deploy to Vercel
- [ ] Push the repo, import to Vercel.
- [ ] Set every env var from `.env.example` in Vercel's project settings (use LIVE values).
- [ ] Set `APP_BASE_URL` to the real domain.
- [ ] Set a strong `CRON_SECRET` (the crons in `vercel.json` — reminders daily, digest weekly — are then protected).
- [ ] Set `DESK_PASSCODE` (so the Payment Desk isn't open) and `DESK_OWNER_EMAIL` / `DESK_ASSISTANT_EMAILS`.
- [ ] Put the real **bank details** in the env vars.

## 6. Smoke test on the live domain
- [ ] `/start` loads and recommends offers.
- [ ] Create a real **small** order on the Desk; pay it with a real GCash of a tiny amount; confirm: order → paid, GHL contact tagged `paid:…`, welcome email received, welcome page correct.
- [ ] Do a manual-transfer test: submit proof → EA verifies → paid.
- [ ] Trigger the digest preview and confirm the numbers look right.
- [ ] Refund the tiny test payment in Xendit and note it (SOP 4).

## 7. Launch
- [ ] Put the `/start` link in Libni's IG bio and link-in-bio.
- [ ] Import the backlog (SOP 9) and send the one re-engagement message.
- [ ] Watch the first few real payments closely for a week.

---

## What "done" means
When steps 1–6 pass on the live domain, the leak is closed: an inquiry can become a paid, welcomed client without anything going through Libni by hand. Libni stays in the work; the system carries the rest.
