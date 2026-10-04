// One-off: remove raw file uploads from the Liberate "Student video" slots in the live Studio data.
// Keeps anything that is a Vimeo / YouTube link. Run with FIREBASE_SERVICE_ACCOUNT + FIREBASE_PROJECT_ID set.
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) { console.error("FIREBASE_SERVICE_ACCOUNT not set"); process.exit(1); }
initializeApp({ credential: cert(JSON.parse(raw)), projectId: process.env.FIREBASE_PROJECT_ID });
const db = getFirestore();
const ref = db.collection("lf_content").doc("site");
const snap = await ref.get();
if (!snap.exists) { console.error("lf_content/site not found"); process.exit(1); }
const videos = snap.data().videos || {};
const isLink = (u) => /vimeo\.com|youtu\.?be/.test(String(u || ""));
const raws = Object.entries(videos).filter(([k, v]) => /^lib_video_\d+$/.test(k) && v && !isLink(v));
console.log("slots:", Object.keys(videos).filter((k) => k.startsWith("lib_video_")).map((k) => `${k}=${isLink(videos[k]) ? "link" : "upload"}`).join(", ") || "(none)");
if (!raws.length) { console.log("nothing to delete"); process.exit(0); }
const update = {};
for (const [k] of raws) update[`videos.${k}`] = FieldValue.delete();
await ref.update(update);
console.log("deleted:", raws.map(([k]) => k).join(", "));
