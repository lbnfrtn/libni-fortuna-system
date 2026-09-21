# GHL Build Sheet

Click-by-click setup inside GoHighLevel (white-labelled as **VBI**, `app.vbi.systems`). No coding. The EA can do all of this. Location ID: `8gAGOfERvVoKqReLLEmc`.

Do it in this order. Phase 1 only needs the **bold** sections; the rest can wait for later phases.

Whenever this sheet says "**copy the ID**", you'll find it in the URL bar or a settings field in GHL. At the end there's a table showing exactly which `.env.local` line each ID goes into.

---

## 1. Custom fields  **(Phase 1)**

Settings → **Custom Fields** → Add Field. Create these (type in brackets). Use these exact names so they're easy to find:

| Field name | Type | Env var to paste its ID into |
|---|---|---|
| LF Order ID | Text | `GHL_FIELD_ORDER_ID` |
| LF Amount Due | Number | `GHL_FIELD_AMOUNT_DUE` |
| LF Amount Paid | Number | `GHL_FIELD_AMOUNT_PAID` |
| LF Balance | Number | `GHL_FIELD_BALANCE` |
| LF Payment Method | Text | `GHL_FIELD_PAYMENT_METHOD` |
| LF Payment Date | Date | `GHL_FIELD_PAYMENT_DATE` |
| LF Payment Plan | Text | `GHL_FIELD_PAYMENT_PLAN` |
| LF Next Instalment Due | Date | `GHL_FIELD_NEXT_INSTALMENT_DUE` |
| LF Offer of Interest | Text | `GHL_FIELD_OFFER_OF_INTEREST` |
| LF Lead Source | Text | `GHL_FIELD_LEAD_SOURCE` |
| LF Source Detail | Text | `GHL_FIELD_SOURCE_DETAIL` |

To get a field's ID: open the field, and the ID is in the address bar (a long string). Copy it.

> **Shortcut (optional):** once `GHL_API_TOKEN` is in `.env.local`, run `npm run ghl:bootstrap` — it creates all 11 fields for you and prints the env lines to paste. Safe to re-run (skips ones that already exist). Pipelines and workflows still have to be built by hand below.

> You don't have to create all of these to test. Any field left blank in `.env.local` is simply skipped — the system logs it instead of setting it. Start with Order ID, Amount Paid, Balance.

---

## 2. Tags — do NOT create these by hand

The system creates tags automatically when it writes to a contact. You only need to **know** them, because your workflows (Section 4) listen for them:

- `payment-pending:<offer>` — a link was created; they owe money
- `paid:<offer>` — first payment received → **this is what starts onboarding**
- `customer:<offer>` — they're a paying client of this offer
- `instalment-due` — they still have a payment coming
- `lead:<offer>`, `applied:<offer>`, `waitlist:<offer>` — from the forms (Phase 2)

`<offer>` is the short slug, e.g. `paid:ignite`, `paid:the-becoming`.

---

## 3. Pipelines  **(Phase 1: build the Consumer one; the other two can follow)**

Settings → **Pipelines** → Create. Build three, with these stages in order. **Copy each pipeline's ID and each stage's ID.**

### Consumer  → env `GHL_PIPELINE_CONSUMER`
| Stage | Env var |
|---|---|
| New lead | `GHL_STAGE_CONSUMER_NEW_LEAD` |
| Engaged | `GHL_STAGE_CONSUMER_ENGAGED` |
| Applied | `GHL_STAGE_CONSUMER_APPLIED` |
| Call booked | `GHL_STAGE_CONSUMER_CALL_BOOKED` |
| Offer made | `GHL_STAGE_CONSUMER_OFFER_MADE` |
| Payment pending | `GHL_STAGE_CONSUMER_PAYMENT_PENDING` |
| Paid / Won | `GHL_STAGE_CONSUMER_PAID_WON` |

(Also add "Lost" and "Nurture" stages for your own use — the system doesn't need their IDs.)

### Corporate & Speaking → env `GHL_PIPELINE_CORPORATE`
New inquiry (`..._NEW_INQUIRY`) · Discovery booked (`..._DISCOVERY`) · Proposal sent (`..._PROPOSAL`) · Negotiating (`..._NEGOTIATING`) · Contract signed (`..._CONTRACT`) · Invoice sent (`..._INVOICE`) · Paid deposit (`..._PAID`)
(env prefix `GHL_STAGE_CORP_`)

### Brands → env `GHL_PIPELINE_BRAND`
New inquiry (`..._NEW_INQUIRY`) · Brief received (`..._BRIEF`) · Proposal sent (`..._PROPOSAL`) · Agreement signed (`..._AGREEMENT`) · Invoice sent (`..._INVOICE`) · In production (`..._PRODUCTION`) · Delivered/Paid (`..._DELIVERED`)
(env prefix `GHL_STAGE_BRAND_`)

---

## 4. Workflows — the messages  **(Phase 1: build #A and #B)**

Automations → Workflows → Create. These are what actually email the client. The system never sends email; it just adds a tag and your workflow reacts.

### Workflow A — "Ignite: Paid → Welcome"
- **Trigger:** Contact Tag Added → tag is `paid:ignite`
- **Steps:**
  1. **Send Email:** the "Ignite — You're in" email (copy in `docs/MESSAGES.md`). Put the welcome-page link and booking link in it.
  2. **Wait 48 hours** → **If/Else:** has the intake form been filled?
     - No → **Send Email:** the gentle nudge (MESSAGES.md), then **Create Task** for the EA.
     - Yes → end.
- **Internal:** at the start, also **Send internal notification** to Libni + EA: "Ignite paid — {{contact.name}}".

### Workflow B — "The Becoming: Paid → Welcome"
- **Trigger:** Contact Tag Added → `paid:the-becoming`
- **Steps:**
  1. **Send Email:** "The Becoming — You're in" (MESSAGES.md), with the welcome page, the **agreement** (GHL Documents) and the booking link.
  2. **Wait 48 hours** → If agreement not signed → nudge email + **Create Task** for the EA ("chase agreement — {{contact.name}}").
  3. Because ₱250k relationships aren't chased by robots: also **Create Task for Libni** on day 1: "Personally welcome {{contact.name}} to The Becoming."

### Workflow C — "Instalment reminders"  *(Phase 3, note it here)*
- **Trigger:** tag `instalment-due` (the system re-adds it and sets "LF Next Instalment Due").
- 3 days before / on the day / 3 days after the date in "LF Next Instalment Due", send a short reminder with the payment link. Overdue → **Create EA Task**, never an automated threat.

---

## 5. Documents (agreement / waiver)  **(Phase 1 for The Becoming)**

Payments/Marketing → **Documents & Contracts** → build:
- **The Becoming agreement** (Libni's terms + refund/cancellation line once she gives it).
- Later: Essence retreat agreement + health/consent waiver.

Put the sign link into Workflow B's first email. When GHL fires "document signed", you can (optionally, Phase 3) move the opportunity forward.

---

## 6. Calendars  **(Phase 1: the two below)**

Calendars → create:
- **Ignite session** (90 min) — the link goes on the Ignite welcome page + email.
- **The Becoming — first session** — link on that welcome page + email.
- (Phase 2) **Discovery call** for The Becoming applications.

Paste each calendar's public link where the welcome page shows `#booking` (in `config/onboarding.ts`), or embed it in the GHL email.

---

## 7. Where to paste all the IDs

Open `.env.local` and fill the `GHL_*` lines using the env-var names in the tables above. Example:

```
GHL_API_TOKEN=pit-xxxxxxxx
GHL_PIPELINE_CONSUMER=abc123...
GHL_STAGE_CONSUMER_PAYMENT_PENDING=def456...
GHL_STAGE_CONSUMER_PAID_WON=ghi789...
GHL_FIELD_ORDER_ID=...
```

Leave any you haven't made yet blank — the system just skips them. Fill the Consumer pipeline's "payment pending" and "paid/won" stages first; those are what Ignite and The Becoming use.

---

## 8. Instagram inbox  (Phase 2)

Settings → Integrations → connect **Instagram** to GHL Conversations. Once connected, DMs land in the GHL inbox and the EA can reply there. Add the saved replies from `docs/MESSAGES.md` as **Snippets** (Conversations → Snippets). **No auto-reply bot** — a person always replies. Every snippet points to `/start`.

## 9. Forms & the front door  (Phase 2 — built in code, nothing to build in GHL)

The website forms and the `/start` decision flow are branded pages in this app (not GHL forms). They post straight into GHL: the contact is upserted, tagged (`lead:` / `applied:` / `waitlist:`), fielded (offer of interest, source, source detail), and an opportunity is created in the right pipeline. So for forms you don't build anything in GHL — you just need the pipelines/fields from sections 1 & 3 to exist so the data lands somewhere. Put the `/start` link in Libni's IG bio and content.

## 10. Onboarding for every offer  (Phase 3)

Each offer fires `paid:<slug>` on first payment. Build one workflow per active offer, same shape as A/B above. Keep the emails in Libni's voice (`docs/MESSAGES.md`).

| Offer | Trigger tag | Workflow should send |
|---|---|---|
| Ignite | `paid:ignite` | Welcome email + booking + intake (Workflow A) |
| The Becoming | `paid:the-becoming` | Welcome + agreement + intake + booking + Libni task (Workflow B) |
| Private Studio | `paid:private-studio` | Welcome, confirm date/guests, prep note |
| Liberate | `paid:liberate` | Welcome, intake, call schedule |
| Founders Circle | `paid:founders-circle` | Welcome, date/place details |
| Essence Retreat | `paid:essence-retreat` | See §11 (multi-step) |
| Corporate / Speaking | `paid:organizations` / `paid:speaking` | Confirmation + planning checklist task for EA |
| Brands | `paid:brands` | Confirmation + brief/timeline task |

For every one: also **nudge once after 48h** if the agreement/intake isn't done, then **create an EA task**. Don't over-message.

## 11. Essence Retreat flow  (Phase 3)

The retreat is deposit → balance → logistics, capped at **20 seats** (the code flips the page/form to waitlist automatically once 20 seats are paid — nothing to do in GHL for that).

1. **Application/waitlist** → they apply via `/apply/essence-retreat`. Tag `applied:essence-retreat` or `waitlist:essence-retreat`.
2. **You approve** a seat → the EA creates the deposit order in the Payment Desk (Deposit + balance plan; the code uses a 30% deposit).
3. **Deposit paid** (`paid:essence-retreat`) → workflow: send **agreement + health/consent waiver** (GHL Documents), confirm the seat, say the balance is due before the retreat.
4. **Balance** → the second instalment link goes out with the reminder cadence (§12). When paid, the retreat is fully paid.
5. **Logistics sequence** (closer to the date, a separate workflow or scheduled emails): packing list, travel details, dietary/health & emergency-contact form.
6. **Post-retreat** → follow-up email + next-step offer.

Set the balance due date on the order to "30 days before the retreat" when you create it (spec §12.2 default).

## 12. Payment-plan reminders  (Phase 3 — runs in code, one GHL workflow)

The app runs a daily job (Vercel Cron) that finds instalments due and adds a tag + sets **LF Next Instalment Due**:
- 3 days before, on the day, 3 days after → tag `instalment-due`
- more than 3 days late → tag `instalment-overdue` **and** an internal task for the EA (a person follows up — never an automated threat).

**You build one workflow:** Trigger = tag `instalment-due` → send a short, warm reminder email with the payment link (MESSAGES.md, add a reminder template). Trigger = tag `instalment-overdue` → assign the EA task / notify. That's it — the timing is handled for you.

*(Developer: the cron is `/api/cron/reminders`, scheduled in `vercel.json`, protected by `CRON_SECRET`.)*

## 13. Follow-up sequences  (Phase 4)

Build these as GHL workflows. Copy is in `docs/MESSAGES.md`. **Golden rules:** max 4 touches over ~3 weeks; **any reply/booking/payment removes the contact from the sequence** (add a "remove from workflow" on those triggers); then tag `nurture`.

| Sequence | Trigger | Touches | Notes |
|---|---|---|---|
| Applied, no call booked | tag `applied:<offer>` + no `call-booked:` after 1 day | Day 1 / 4 / 10 | Consumer offers only |
| No-show | GHL "appointment no-show" | Day 0 | Rebook link |
| Offer made, no payment | tag `offer-made:<offer>` (no `paid:` after 1 day) | Day 1 / 5 | **The Becoming: task for a human, not auto-email** |
| Link expired / not completed | tag added by the app on expiry | Day 0 | Fresh link |
| Waitlist opened | you add tag `waitlist-open:<offer>` when a spot frees | Day 0 | First word to the list |

**Human-not-robot rule:** for The Becoming and everything Corporate/Brand, the workflow's action is **Create Task** (assigned to Libni or EA) with the suggested draft, not Send Email.

## 14. Backlog import  (Phase 4)

To load old warm leads from DMs/spreadsheets:
1. Put them in a CSV with headers `name,email,phone,offerSlug,source,sourceDetail` (template: `docs/backlog-template.csv`).
2. Go to the Payment Desk → **/desk/import**, paste the CSV, click Import.
3. Everyone lands in GHL tagged `nurture` (+ their offer's `lead:` tag). Build one workflow on tag `nurture` that sends the single re-engagement message (MESSAGES.md) — **once**, then leaves them in your regular newsletter.

---

## Phase 1 "done" checklist

- [ ] Custom fields created (at least Order ID, Amount Paid, Balance)
- [ ] Consumer pipeline built, IDs pasted
- [ ] Workflow A (Ignite paid → welcome) built and turned on
- [ ] Workflow B (The Becoming paid → welcome) built and turned on
- [ ] The Becoming agreement drafted in Documents
- [ ] Ignite + The Becoming calendars created, links pasted
- [ ] Messages in `docs/MESSAGES.md` approved by Libni
