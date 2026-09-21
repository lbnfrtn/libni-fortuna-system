# SOPs — for the EA

Plain steps. You should never have to ask Libni "what do I do next?" — it's here.

---

## SOP 1 — Send a payment link after a call

1. Go to the **Payment Desk** (`/desk`) and sign in.
2. **Offer**: choose what they're buying. (If it's a custom/corporate amount, choose the offer and type the amount.)
3. Type the client's **name** and **email** (phone optional).
4. **How are they paying?** → Pay in full / Payment plan / Deposit. Pick what Libni agreed on the call.
5. Click **Create payment link**.
6. On the right you'll see the link. Either:
   - **Copy** it and send by DM/Viber/WhatsApp (use the message in `docs/MESSAGES.md`), or
   - copy the **bank-transfer page** link if they want to pay by bank.
7. Done. When they pay, everything else is automatic. You'll get a notification.

**Time check:** this should take under a minute.

---

## SOP 2 — Verify a manual bank transfer

You'll get a notification: "Manual payment proof submitted — please verify."

1. Open the **Payment Desk**. The order shows status **submitted** with a reference code (e.g. `LF-7K3Q`).
2. Open the client's proof (the link they submitted) **and** check the actual bank account for a matching amount + reference.
3. **Only if the money is really there:** click **Verify** on that order.
4. That marks them paid and starts onboarding automatically — same as a card payment.

**Never click Verify on a claim you haven't seen in the bank.** An unverified payment is not a payment.

---

## SOP 3 — Resend or re-create a payment link

- On the Desk, find the order and click **Resend link**. It generates a fresh link and copies it to your clipboard. Send it.
- For a payment plan, "Resend" gives the link for the **next unpaid** payment.

---

## SOP 4 — Handle a refund or cancellation request

1. **Do not process anything in Xendit yourself.** Refunds are Libni's decision and follow the offer's written policy.
2. Create a task for Libni (or message her) with: client name, offer, amount paid, reason given, and the date.
3. Once Libni decides, if a refund is approved she (or the person with Xendit access) issues it in the Xendit dashboard. Then note it on the client's GHL contact.
4. Move the opportunity to **Lost** (or a "Refunded" note) so reporting stays honest.

*(Refund terms per offer will be added here once Libni provides them.)*

---

## SOP 5 — Add a new offer or change a price

- **Change a price:** open `config/offers.ts`, find the offer, change `pricePHP`. Save. (If you're not comfortable editing the file, send Libni/Claude the new number.)
- **New offer:** copy an existing block in `config/offers.ts`, give it a new short `slug`, set price + options; add a welcome message in `config/onboarding.ts`; then ask Claude to add its GHL workflow to the Build Sheet.
- **Open a waitlisted offer** (Essence, Liberate, etc.): set its real `pricePHP` and remove the `waitlistOnly: true` line.

---

## SOP 6 — Something looks broken

1. **Client says they paid but got nothing:**
   - Open the Desk, find the order.
   - If it says **paid** → the payment worked; the issue is the GHL email/workflow. Open that workflow in GHL and check it's turned on.
   - If it still says **pending** → the payment didn't reach us. Check Xendit for the payment, and check the Invoice webhook address in Xendit → Developers → Webhooks.
2. **The Desk won't open:** locally, restart with `npm run dev`. Once we're live on Vercel, check the Vercel dashboard.
3. **Anything code-related:** open this folder in Claude Code and describe what happened. Don't guess in Xendit or the database.

---

## SOP 7 — Weekly review

The system now emails Libni a **weekly digest** (cash collected, closes, new orders, outstanding balances, anything stuck >7 days). You can also see it any time at **/desk** → open `/api/cron/digest?preview=1` while signed in.

Still glance at the Desk's **Open orders** weekly:
- Any **submitted** transfers you haven't verified? Do SOP 2.
- Any instalment **balances** past their **next-due** date? The system already tags them; make sure the reminder went and, if it stays unpaid, follow up personally.
- Anything **pending** for more than a week with no movement? Reach out.

---

## SOP 8 — Corporate / brand: inquiry → proposal → invoice

1. Inquiry arrives (form `/apply/organizations`, `/apply/speaking`, or `/apply/brands`) → it's in the Corporate/Brand pipeline at "New inquiry".
2. Book the discovery call. After it, draft a proposal from `docs/TEMPLATES.md` (GHL Documents). Move the deal to "Proposal sent".
3. On agreement, send the agreement (GHL Documents) — move to "Contract/Agreement signed".
4. Invoice from the **Payment Desk**: choose the offer, type the **custom amount** (and a description), pick **Deposit + balance** if it's 50/50. Send the link. Move to "Invoice sent".
5. When paid, onboarding/planning tasks fire automatically.
6. **Receipts:** until BIR registration is done, issue **acknowledgement receipts only**. If a corporate client needs an official invoice or will withhold tax, flag it to Libni/the accountant — don't improvise.

---

## SOP 9 — Import a backlog of old leads

1. Put the leads in a spreadsheet with columns: `name, email, phone, offerSlug, source, sourceDetail` (see `docs/backlog-template.csv`). Only name + email are required.
2. Export as CSV.
3. Payment Desk → **/desk/import** → paste the CSV → **Import**.
4. They're added to GHL tagged `nurture` (+ their offer). Libni's approved re-engagement message goes out once via the `nurture` workflow. Don't hard-sell.
