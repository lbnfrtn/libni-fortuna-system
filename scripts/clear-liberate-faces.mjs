// One-off: drop the Studio face overrides for the on-camera students so the page
// falls back to the faces cropped from their own testimony videos (face2-*.jpg).
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)), projectId: process.env.FIREBASE_PROJECT_ID });
const ref = getFirestore().collection("lf_content").doc("site");
const photos = (await ref.get()).data().photos || {};
const slots = ["libw_tonet", "libw_bam", "libw_kimi", "libw_joyce", "libw_danessa", "libw_mitch", "libw_precious", "libw_ikay"];
console.log("libw slots present:", Object.keys(photos).filter((k) => k.startsWith("libw_")).join(", "));
const update = {};
for (const k of slots) if (photos[k]) update[`photos.${k}`] = FieldValue.delete();
if (!Object.keys(update).length) { console.log("nothing to clear"); process.exit(0); }
await ref.update(update);
console.log("cleared:", Object.keys(update).map((k) => k.replace("photos.", "")).join(", "));
