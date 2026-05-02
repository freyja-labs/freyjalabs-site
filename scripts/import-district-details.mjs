#!/usr/bin/env node
/**
 * Import narrative context fields from the local prospecting xlsx
 * (district-details/freyja-labs-prospecting-database-v8.xlsx) into
 * src/data/district-portals.json.
 *
 * Adds per district:
 *   - policyLandscape   (state-level AI/ed policy framing)
 *   - knownInitiatives  (district-specific current initiatives)
 *   - districtNeeds     (state-level narrative — what we believe districts need)
 *
 * Adds top-level:
 *   - stateContext      (state code → public, non-PII state context)
 *
 * What is intentionally NOT imported:
 *   - Superintendent / CAO / coordinator names (already partially present in
 *     existing connectionPoint; we do not add new PII surface here)
 *   - Email addresses (prospecting only)
 *   - Outreach status, notes, owner (internal sales workflow)
 *   - Office addresses (not useful for marketing site)
 *   - Key Contact in State Overview (prospecting)
 *
 * Provenance:
 *   district-details/freyja-labs-prospecting-database-v8.xlsx (local-only,
 *   not in repo). The script is the only authorized importer; do not edit
 *   these fields by hand in district-portals.json.
 *
 * Idempotent. Run with no args to import all districts; pass codes to
 * import a subset.
 *
 * Implementation note: this script invokes Python (openpyxl) to read the
 * xlsx and pipes JSON back. We could add an npm xlsx parser, but Python
 * is already a dev dependency on this machine and the script is local-only.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const PORTALS = resolve(REPO, 'src/data/district-portals.json');
const XLSX = resolve(REPO, 'district-details/freyja-labs-prospecting-database-v8.xlsx');

if (!existsSync(XLSX)) {
  console.error(`! xlsx not found: ${XLSX}`);
  console.error('  Drop the prospecting database into district-details/ to run this importer.');
  process.exit(1);
}

// ---------- Pull data out of xlsx via Python ----------

const py = `
import json, sys, openpyxl
wb = openpyxl.load_workbook(${JSON.stringify(XLSX)}, read_only=True, data_only=True)

def rows_of(sheet):
    return list(sheet.iter_rows(values_only=True))

def to_records(rows):
    headers = rows[0]
    out = []
    for r in rows[1:]:
        if not any(r): continue
        out.append({h: (str(v).strip() if v is not None else '') for h, v in zip(headers, r)})
    return out

districts = to_records(rows_of(wb['Districts']))
state_overview = to_records(rows_of(wb['State Overview']))

print(json.dumps({'districts': districts, 'state_overview': state_overview}))
`;

const raw = execFileSync('python3', ['-c', py], { encoding: 'utf-8', maxBuffer: 8 * 1024 * 1024 });
const xlsxData = JSON.parse(raw);

// ---------- Build state context ----------

const stateContext = {};
for (const row of xlsxData.state_overview) {
  const code = row['State'];
  if (!code) continue;
  // Public-only fields. NO Key Contact, NO Intermediary Channel detail
  // (the latter could be useful but feels prospecting-adjacent).
  stateContext[code] = {
    csGradReq: row['CS Graduation Req'] || '',
    effectiveDate: row['Effective Date'] || '',
    aiLegislation: row['AI Legislation'] || '',
    statePdFunding: row['State PD Funding'] || '',
    certPathway: row['Cert Pathway'] || '',
    readinessLevel: row['Readiness Level'] || '',
  };
  // Drop empty entries.
  for (const k of Object.keys(stateContext[code])) {
    if (!stateContext[code][k]) delete stateContext[code][k];
  }
}

// ---------- Map xlsx rows to district codes ----------

const xlsxByCode = {};
for (const row of xlsxData.districts) {
  const url = row['District Portal URL'] || '';
  const code = url.replace('freyjalabs.com/pd/', '').trim();
  if (!code) continue;
  xlsxByCode[code] = row;
}

// ---------- Apply to district-portals.json ----------

const portals = JSON.parse(readFileSync(PORTALS, 'utf-8'));
portals.stateContext = stateContext;

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const codes = args.length > 0 ? args : Object.keys(portals.districts);

let updated = 0;
const skipped = [];
for (const code of codes) {
  const dist = portals.districts[code];
  const src = xlsxByCode[code];
  if (!dist) { console.warn(`! unknown district: ${code}`); continue; }
  if (!src) { skipped.push(code); continue; }

  // Replace fields when source has content; clear when source is empty.
  const policy = src['Policy Landscape'];
  const init = src['Known Initiatives'];
  const needs = src['District Needs'];
  // We deliberately DO NOT overwrite connectionPoint here — the existing
  // value matches the xlsx already, and overwriting risks losing any
  // hand-edits the user has made in the JSON. Same for other lesson fields.

  if (policy) dist.policyLandscape = policy; else delete dist.policyLandscape;
  if (init)   dist.knownInitiatives = init; else delete dist.knownInitiatives;
  if (needs)  dist.districtNeeds = needs; else delete dist.districtNeeds;

  updated++;
}

writeFileSync(PORTALS, JSON.stringify(portals, null, 2));
console.log(`✓ ${updated} districts updated with narrative context`);
console.log(`  stateContext entries: ${Object.keys(stateContext).length}`);
if (skipped.length) console.log(`  skipped (no xlsx row): ${skipped.join(', ')}`);
