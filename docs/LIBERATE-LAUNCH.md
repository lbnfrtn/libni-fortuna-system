# Liberate — launch checklist (November 3, 2026 intake)

The whole flow is built. What's left is keys and links — no code.

## The flow, as it works today
1. **Landing** `libni.co/liberate` → "I'm ready to Liberate" → `/liberate/join` (name, email, full or 3 payments) → payment link (GCash / Maya / card) or bank transfer → `/welcome/liberate`.
2. **Talk first** → `/liberate/apply` → the affordability question. "Not right now" ends the form kindly (no call, Power Hour offered). Otherwise the application lands in the Desk and the *Liberate · wants to talk first* letters go out (day 0, 3, 10) with your Calendly link.
3. **Unpaid link** → *Payment link · not yet paid* letters (day 0, 1, 3). Stop the moment they pay.
4. **Paid** → order marked paid by the Xendit webhook → *Liberate · welcome to the circle*:
   - straight away: welcome + portal link + access code + when we meet
   - 3 days later: "Before we begin"
   - Nov 2: "Tomorrow, 7 pm"
   - Nov 4: "After our first night"
   - Dec 21: holiday pause (back Jan 5)
   - Feb 3: "After week twelve" (retreat ahead, alumni Thursday Labs)
5. **Portal** `/portal/liberate` — email + access code; roadmap, sessions, replays, Zoom link.

Letters are editable at `/admin/email` ("send me a test" is there too). Dated letters wait for their date.

## Your steps (in order)
1. **Resend** (sends the letters): resend.com → sign up → *Domains* → add `libni.co` → copy the DNS records into wherever libni.co's DNS lives (Vercel → Domains, if the domain is on Vercel) → wait for "Verified" → *API Keys* → create one.
2. **Xendit**: dashboard toggled to **Live** → Settings → Developers → API keys → copy the **secret key**; Webhooks → copy the **verification token** and set the **Invoices** webhook URL to `https://libni.co/api/webhooks/xendit`.
3. **Vercel** → project → Settings → Environment Variables → add (Production):
   `RESEND_API_KEY`, `MAIL_FROM` = `Libni Fortuna <hello@libni.co>`, `CRON_SECRET` (any long random string), `XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`, `APP_MODE` = `live`. Then *Deployments → Redeploy*.
4. **Liberate HQ** `libni.co/admin/liberate`: set the **access code** and the **default Zoom link**. **Studio → Links**: paste the Calendly link for the Liberate call.
5. **Test**: `/desk` → create a small Power Hour link for yourself → pay it with GCash → you should land on the welcome page, get the email, see the order "paid" in the Desk. Refund it in Xendit.
6. **Go**: share `libni.co/liberate`.
