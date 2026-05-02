#!/usr/bin/env node
/**
 * Fetch street network data for each district from OpenStreetMap.
 *
 * Two-stage:
 *   1) Nominatim geocode → center lat/lon for the district HQ city.
 *   2) Overpass API → street ways within a small bbox around that center.
 *
 * Output is cached in src/data/district-maps.json. Re-running is idempotent;
 * districts already present in the cache are skipped unless --force is passed.
 *
 * Usage:
 *   node scripts/fetch-district-maps.mjs              # incremental
 *   node scripts/fetch-district-maps.mjs --force      # refetch all
 *   node scripts/fetch-district-maps.mjs 77092-hisd   # one district
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const PORTALS = resolve(REPO, 'src/data/district-portals.json');
const MAPS = resolve(REPO, 'src/data/district-maps.json');

const USER_AGENT = 'FreyjaLabs-DistrictMaps/1.0 (hello@freyjalabs.com)';
const VIEWBOX_W = 800;
const VIEWBOX_H = 500;
// ~0.015 degrees lat ~= 1.7km. Width adjusted by latitude in projection.
const BBOX_HALF_LAT = 0.015;
const MAX_MAJOR_PATHS = 50;
const MAX_MID_PATHS = 100;
const MAX_MINOR_PATHS = 120;
const SIMPLIFY_EPSILON = 2.2; // pixels in viewBox space

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyCodes = args.filter(a => !a.startsWith('--'));

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchJson(url, init = {}, attempt = 1) {
  const res = await fetch(url, {
    ...init,
    headers: { 'User-Agent': USER_AGENT, ...(init.headers || {}) },
  });
  if (res.status === 429 || res.status === 504 || res.status === 503) {
    if (attempt > 4) throw new Error(`HTTP ${res.status} after ${attempt} attempts: ${url}`);
    const wait = 2000 * attempt;
    console.log(`  retry in ${wait}ms (status ${res.status})`);
    await sleep(wait);
    return fetchJson(url, init, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function geocode(district) {
  // Try district name + state first; fall back to city + state.
  const queries = [
    `${district.district}, ${district.city}, ${district.state}, USA`,
    `${district.city}, ${district.state}, USA`,
  ];
  for (const q of queries) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const json = await fetchJson(url);
    await sleep(1100); // Nominatim usage policy: max 1 req/sec.
    if (json && json.length > 0) {
      return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon), source: q };
    }
  }
  return null;
}

async function fetchStreets(center) {
  const halfLon = BBOX_HALF_LAT / Math.cos((center.lat * Math.PI) / 180);
  const south = center.lat - BBOX_HALF_LAT;
  const north = center.lat + BBOX_HALF_LAT;
  const west = center.lon - halfLon;
  const east = center.lon + halfLon;

  const query = `
    [out:json][timeout:30];
    (
      way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified)$"](${south},${west},${north},${east});
    );
    out geom;
  `;
  const url = 'https://overpass-api.de/api/interpreter';
  const json = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });
  return { bbox: { south, west, north, east }, ways: json.elements || [] };
}

function classify(highway) {
  if (['motorway', 'trunk', 'primary'].includes(highway)) return 'major';
  if (['secondary', 'tertiary'].includes(highway)) return 'mid';
  return 'minor';
}

function project(lat, lon, bbox) {
  const x = ((lon - bbox.west) / (bbox.east - bbox.west)) * VIEWBOX_W;
  const y = (1 - (lat - bbox.south) / (bbox.north - bbox.south)) * VIEWBOX_H;
  return [Math.round(x), Math.round(y)];
}

// Douglas-Peucker line simplification.
function simplify(points, eps) {
  if (points.length <= 2) return points;
  const sqEps = eps * eps;
  function dp(start, end, mark) {
    let maxSqDist = 0;
    let idx = -1;
    const [x1, y1] = points[start];
    const [x2, y2] = points[end];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    for (let i = start + 1; i < end; i++) {
      const [px, py] = points[i];
      const t = ((px - x1) * dx + (py - y1) * dy) / len2;
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      const sq = (px - projX) ** 2 + (py - projY) ** 2;
      if (sq > maxSqDist) {
        maxSqDist = sq;
        idx = i;
      }
    }
    if (maxSqDist > sqEps && idx > -1) {
      mark[idx] = true;
      dp(start, idx, mark);
      dp(idx, end, mark);
    }
  }
  const mark = new Array(points.length).fill(false);
  mark[0] = true;
  mark[points.length - 1] = true;
  dp(0, points.length - 1, mark);
  return points.filter((_, i) => mark[i]);
}

function inViewBox(pts) {
  return pts.some(([x, y]) => x >= -10 && x <= VIEWBOX_W + 10 && y >= -10 && y <= VIEWBOX_H + 10);
}

function buildPaths(streets) {
  const projected = streets.ways
    .map(w => {
      const cls = classify(w.tags?.highway);
      const raw = (w.geometry || []).map(g => project(g.lat, g.lon, streets.bbox));
      const pts = simplify(raw, SIMPLIFY_EPSILON);
      return { cls, pts, len: raw.length };
    })
    .filter(w => w.pts.length >= 2 && inViewBox(w.pts));
  return projected;
}

function pathToD(pts) {
  return pts.map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `L${x} ${y}`)).join(' ');
}

function capByLength(arr, max) {
  if (arr.length <= max) return arr;
  arr.sort((a, b) => b.len - a.len);
  return arr.slice(0, max);
}

function pathsToSvgD(paths) {
  const groups = { major: [], mid: [], minor: [] };
  for (const w of paths) groups[w.cls].push(w);

  groups.major = capByLength(groups.major, MAX_MAJOR_PATHS);
  groups.mid = capByLength(groups.mid, MAX_MID_PATHS);
  groups.minor = capByLength(groups.minor, MAX_MINOR_PATHS);

  return {
    major: groups.major.map(w => pathToD(w.pts)),
    mid: groups.mid.map(w => pathToD(w.pts)),
    minor: groups.minor.map(w => pathToD(w.pts)),
  };
}

async function processDistrict(code, district, cache) {
  if (!force && cache[code]) {
    console.log(`✓ ${code} cached, skipping`);
    return cache[code];
  }
  console.log(`→ ${code} (${district.district})`);
  const center = await geocode(district);
  if (!center) {
    console.warn(`  ! geocode failed`);
    return null;
  }
  console.log(`  center ${center.lat.toFixed(4)}, ${center.lon.toFixed(4)}`);
  const streets = await fetchStreets(center);
  console.log(`  ${streets.ways.length} ways`);
  await sleep(1500); // Be nice to Overpass.
  const paths = buildPaths(streets);
  const groups = pathsToSvgD(paths);
  const totalPaths = groups.major.length + groups.mid.length + groups.minor.length;
  console.log(`  ${totalPaths} paths (M:${groups.major.length} mid:${groups.mid.length} m:${groups.minor.length})`);
  return {
    center,
    bbox: streets.bbox,
    viewBox: { w: VIEWBOX_W, h: VIEWBOX_H },
    paths: groups,
  };
}

async function main() {
  const portals = JSON.parse(readFileSync(PORTALS, 'utf-8'));
  const cache = existsSync(MAPS) ? JSON.parse(readFileSync(MAPS, 'utf-8')) : {};

  const codes = onlyCodes.length > 0 ? onlyCodes : Object.keys(portals.districts);

  for (const code of codes) {
    const district = portals.districts[code];
    if (!district) {
      console.warn(`! unknown district code: ${code}`);
      continue;
    }
    try {
      const result = await processDistrict(code, district, cache);
      if (result) {
        cache[code] = result;
        // Persist after each district so a crash mid-run doesn't lose progress.
        writeFileSync(MAPS, JSON.stringify(cache, null, 2));
      }
    } catch (err) {
      console.warn(`  ! ${code} failed: ${err.message}`);
    }
  }

  console.log(`\nDone. ${Object.keys(cache).length} districts cached → ${MAPS}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
