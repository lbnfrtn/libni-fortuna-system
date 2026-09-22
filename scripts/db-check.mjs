#!/usr/bin/env node
// ============================================================================
// Database health-check. Confirms the app can reach its data store.
//   - ORDER_STORE=file (default): checks the local /data folder is writable.
//   - ORDER_STORE=firestore: connects to Firestore, writes + reads + deletes a
//     throwaway doc, and reports success. Needs FIREBASE_* creds.
// Usage: node scripts/db-check.mjs
// ============================================================================
import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
try {
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch { /* rely on process.env */ }

const mode = process.env.ORDER_STORE || "file";
console.log(`Data store mode: ${mode}\n`);

if (mode === "file") {
  const dir = join(root, "data");
  try {
    mkdirSync(dir, { recursive: true });
    const probe = join(dir, ".probe");
    writeFileSync(probe, "ok");
    rmSync(probe);
    console.log("✅ Local file store is writable at ./data — good for dev/test.");
    console.log("   For production, set ORDER_STORE=firestore and Firebase creds, then re-run.");
  } catch (e) {
    console.error("❌ Cannot write to ./data:", e.message);
    process.exit(1);
  }
} else {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) { console.error("❌ ORDER_STORE=firestore but FIREBASE_SERVICE_ACCOUNT is not set."); process.exit(1); }
  try {
    const { initializeApp, cert } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");
    initializeApp({
      credential: cert(raw.trim().startsWith("{") ? JSON.parse(raw) : raw),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    const db = getFirestore();
    // Firestore reserves ids wrapped in double underscores.
    const ref = db.collection("lf_orders").doc("healthcheck-probe");
    await ref.set({ at: new Date().toISOString(), probe: true });
    const snap = await ref.get();
    await ref.delete();
    if (snap.exists) console.log("✅ Firestore connected: wrote, read and deleted a test doc in lf_orders.");
    else { console.error("❌ Wrote a doc but couldn't read it back."); process.exit(1); }
  } catch (e) {
    console.error("❌ Firestore check failed:", e.message);
    process.exit(1);
  }
}
