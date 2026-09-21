#!/usr/bin/env node
// ============================================================================
// GHL bootstrap — creates the custom fields this system needs, via the GHL API
// (spec §6: "create fields by API where possible"), and prints the env lines to
// paste into .env.local. Pipelines/stages/workflows still use the Build Sheet
// (workflows can't be created by API).
//
// Usage:  node scripts/ghl-bootstrap.mjs
// Needs GHL_API_TOKEN and GHL_LOCATION_ID in .env.local (or the environment).
// Safe to re-run: existing fields (matched by name) are skipped, not duplicated.
// ============================================================================
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Tiny .env.local loader (no dependency).
function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* no .env.local — rely on process.env */
  }
}
loadEnv();

const TOKEN = process.env.GHL_API_TOKEN;
const LOCATION = process.env.GHL_LOCATION_ID;
const VERSION = process.env.GHL_API_VERSION || "2021-07-28";
const API = "https://services.leadconnectorhq.com";

if (!TOKEN || !LOCATION) {
  console.error("Missing GHL_API_TOKEN or GHL_LOCATION_ID in .env.local. Aborting (nothing was created).");
  process.exit(1);
}

// name -> [env var, GHL dataType]
const FIELDS = {
  "LF Order ID": ["GHL_FIELD_ORDER_ID", "TEXT"],
  "LF Amount Due": ["GHL_FIELD_AMOUNT_DUE", "NUMERICAL"],
  "LF Amount Paid": ["GHL_FIELD_AMOUNT_PAID", "NUMERICAL"],
  "LF Balance": ["GHL_FIELD_BALANCE", "NUMERICAL"],
  "LF Payment Method": ["GHL_FIELD_PAYMENT_METHOD", "TEXT"],
  "LF Payment Date": ["GHL_FIELD_PAYMENT_DATE", "DATE"],
  "LF Payment Plan": ["GHL_FIELD_PAYMENT_PLAN", "TEXT"],
  "LF Next Instalment Due": ["GHL_FIELD_NEXT_INSTALMENT_DUE", "DATE"],
  "LF Offer of Interest": ["GHL_FIELD_OFFER_OF_INTEREST", "TEXT"],
  "LF Lead Source": ["GHL_FIELD_LEAD_SOURCE", "TEXT"],
  "LF Source Detail": ["GHL_FIELD_SOURCE_DETAIL", "TEXT"],
};

const headers = { Authorization: `Bearer ${TOKEN}`, Version: VERSION, "Content-Type": "application/json", Accept: "application/json" };

async function listExisting() {
  const res = await fetch(`${API}/locations/${LOCATION}/customFields`, { headers });
  if (!res.ok) throw new Error(`list customFields failed (${res.status}): ${await res.text()}`);
  const j = await res.json();
  const arr = j.customFields || j.customField || [];
  const map = new Map();
  for (const f of arr) map.set(f.name, f.id);
  return map;
}

async function createField(name, dataType) {
  const res = await fetch(`${API}/locations/${LOCATION}/customFields`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, dataType, model: "contact" }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`create "${name}" failed (${res.status}): ${j.message || JSON.stringify(j)}`);
  return (j.customField || j).id;
}

(async () => {
  console.log(`Bootstrapping custom fields on location ${LOCATION}…\n`);
  const existing = await listExisting();
  const envLines = [];
  for (const [name, [envVar, dataType]] of Object.entries(FIELDS)) {
    let id = existing.get(name);
    if (id) {
      console.log(`= exists   ${name}`);
    } else {
      id = await createField(name, dataType);
      console.log(`+ created  ${name}`);
    }
    envLines.push(`${envVar}=${id}`);
  }
  console.log(`\n--- paste these into .env.local (and Vercel env at go-live) ---\n`);
  console.log(envLines.join("\n"));
  console.log(`\nPipelines, stages and workflows are still set up by hand — see docs/GHL-BUILD-SHEET.md.`);
})().catch((e) => {
  console.error("\nBootstrap failed:", e.message);
  process.exit(1);
});
