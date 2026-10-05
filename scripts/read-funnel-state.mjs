// Read-only: what the live email engine holds (sequences, enrolments, last sends).
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)), projectId: process.env.FIREBASE_PROJECT_ID });
const db = getFirestore();
for (const col of ["lf_funnel", "lf_content", "lf_orders"]) {
  const snap = await db.collection(col).limit(50).get();
  console.log(`${col}: ${snap.size} doc(s)`);
  for (const d of snap.docs) {
    const x = d.data();
    if (col === "lf_funnel") {
      console.log(" sequences:", (x.sequences || []).map((s) => `${s.id}(${s.steps?.length}${s.edited ? ",edited" : ""})`).join(" "));
      console.log(" enrolments:", (x.enrolments || []).length, "suppressed:", (x.suppressed || []).length, "log:", (x.log || []).length);
      for (const l of (x.log || []).slice(-5)) console.log("  ", l.at, l.kind, l.ok ? "ok" : "FAIL", l.mock ? "(mock)" : "", l.subject?.slice(0, 40));
    } else if (col === "lf_orders") console.log("  ", d.id, x.status, x.offerSlug, x.totalPHP);
  }
}
