# Database & Backend

Plain-language, then the technical bits.

## In plain language

**The "backend" is already here.** It's the set of behind-the-scenes routines that create payment links, listen for "they paid," update GoHighLevel, take in leads, send reminders, and build your weekly numbers. You never see it directly — you see the Payment Desk, the Dashboard and the website, and the backend does the work underneath.

**The "database" is where orders and payments are remembered.** There are two modes, and the code is identical in both — only where it saves changes:

- **File mode (default, for testing):** saves to a file on the computer running it (`/data/orders.json`). Perfect for trying things safely. Not for real use.
- **Firestore mode (for real):** saves to Firebase Firestore — the same Google database Project Me already uses. Reliable, backed up by Google, reachable from anywhere. This is what we switch on at go-live.

Nothing about your day-to-day changes between the two. You flip one setting and paste one key.

**What's stored:** each order — who it's for, the offer, the amounts, what's paid, the payment method and date, and a history of events. Leads and all the client messaging live in **GoHighLevel**, not here. This database is only the money/orders side.

## How to check it's working
```bash
npm run db:check
```
In file mode it confirms the folder is writable. In Firestore mode it connects, writes a test record, reads it back, and deletes it — proving the whole path works.

## Switching to the real database (go-live)
1. Create (or reuse) a Firebase project and a **service account** key (JSON). (This needs your Google login — it's one of the few things only you can do.)
2. In `.env.local` (and in Vercel at deploy):
   ```
   ORDER_STORE=firestore
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_SERVICE_ACCOUNT={...the service-account JSON...}   # or a path to the file
   ```
3. `npm run db:check` → should say ✅ Firestore connected.
4. Deploy the security rules in `firestore.rules` (they lock the data to server-only — no browser can ever read it).

`firebase-admin` is already installed, so nothing else to add.

## Technical notes (for a developer)
- One interface, two adapters: `lib/store.ts` (`FileStore`, `FirestoreStore`), selected by `ORDER_STORE`. Orders live in the `lf_orders` collection, keyed by order id (`LF-…`).
- The store is injectable (`setStore`) so tests use an in-memory version — no disk, no network.
- Firestore access is server-only via the Admin SDK; `firestore.rules` denies all client access by design.
- API routes under `app/api/**` are the backend surface: `orders`, `webhooks/xendit`, `lead`, `import`, `cron/reminders`, `cron/digest`, `desk/login`, and per-order `verify`/`resend`/`submit-proof`/`cancel`.
- `markPaid` (`lib/markPaid.ts`) is the single, idempotent write path for a payment becoming real, shared by the Xendit webhook and manual verification.
