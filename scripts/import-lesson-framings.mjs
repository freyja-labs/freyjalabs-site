#!/usr/bin/env node
/**
 * Import district-specific lesson framings from the prospecting xlsx into
 * src/data/district-portals.json.
 *
 * Adds per district lesson:
 *   - lessons.tech.district_framing      (from xlsx First Touch, cover note stripped)
 *   - lessons.unplugged.district_framing (from xlsx Back Side)
 *
 * The existing lesson title, overview, procedure, materials, etc. are
 * preserved — district_framing is the rich, district-specific narrative
 * that the page leads with above the structured content.
 *
 * Idempotent. Run with no args to import all; pass codes for a subset.
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
  process.exit(1);
}

const py = `
import json, openpyxl
wb = openpyxl.load_workbook(${JSON.stringify(XLSX)}, read_only=True, data_only=True)
ws = wb['Districts']
rows = list(ws.iter_rows(values_only=True))
headers = rows[0]
out = []
for r in rows[1:]:
    if not any(r): continue
    out.append({h: (str(v).strip() if v is not None else '') for h, v in zip(headers, r)})
print(json.dumps(out))
`;
const xlsxRows = JSON.parse(execFileSync('python3', ['-c', py], { encoding: 'utf-8', maxBuffer: 8 * 1024 * 1024 }));

const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));

let updated = 0;
const skipped = [];
for (const row of xlsxRows) {
  const code = row['District Portal URL'].replace('freyjalabs.com/pd/', '').trim();
  if (args.length > 0 && !args.includes(code)) continue;
  const dist = data.districts[code];
  if (!dist) { console.warn(`! unknown district code: ${code}`); continue; }

  // Strip cover note from First Touch — that text is meant for the printed card.
  const firstTouch = (row['First Touch (Kit + Lesson)'] || '').split(/cover note/i)[0].trim();
  const backSide = (row['Back Side (Unplugged Activity)'] || '').trim();

  if (firstTouch && dist.lessons?.tech) {
    dist.lessons.tech.district_framing = firstTouch;
    updated++;
  }
  if (backSide && dist.lessons?.unplugged) {
    dist.lessons.unplugged.district_framing = backSide;
    updated++;
  }
  console.log(`✓ ${code}`);
}

writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`\n${updated} lesson framings updated`);
if (skipped.length) console.log(`skipped: ${skipped.join(', ')}`);
