// Read-only: dump the live Studio content keys + Liberate quotes/testimonials (for review).
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)), projectId: process.env.FIREBASE_PROJECT_ID });
const d = (await getFirestore().collection("lf_content").doc("site").get()).data();
console.log("top keys:", Object.keys(d).join(", "));
for (const k of Object.keys(d)) if (Array.isArray(d[k])) console.log(`array ${k}: ${d[k].length}`);
const w = d.liberateWords || d.testimonials || [];
for (const x of w) console.log(JSON.stringify({ id: x.id, name: x.name, role: x.role, program: x.program }));
const lw = d.liberate || {};
console.log("liberate keys:", Object.keys(lw).join(", "));
