#!/usr/bin/env node
/**
 * Replace each district's engagementOptions with a five-tier ladder that
 * spans 15–100 participants. Idempotent: re-running yields the same shape.
 *
 *   1) Intimate Cohort        15–30   2 days
 *   2) Building Faculty       30–60   2 days, multi-facilitator break-outs
 *   3) District Institute     60–100  3 days, parallel grade-band tracks
 *   4) Leadership Orientation  5–15   4 hours
 *   5) Six-Week Coaching      cohort  follow-up
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTALS = resolve(__dirname, '../src/data/district-portals.json');

const TIERS = [
  {
    id: 'cohort-workshop',
    name: 'Intimate Cohort Workshop',
    duration: '2 days (12 hours)',
    description: 'Hands-on PD with deep iteration per participant. Day 1: foundations and guided lesson design. Day 2: independent design, peer review, implementation planning. Best for grade-level teams, content-area cohorts, or single-school faculties.',
    participants: '15–30 teachers',
    tier: 'cohort',
    deliverables: 'Each participant leaves with 2–3 classroom-ready lessons they built themselves, plus shared facilitator notes.',
  },
  {
    id: 'building-workshop',
    name: 'Building Faculty Workshop',
    duration: '2 days (12 hours)',
    description: 'Whole-school PD with two facilitators running parallel break-out tracks (e.g., elementary / secondary, or content-area splits). Common opening and closing sessions; differentiated middle. Best for full-faculty rollouts where every teacher in the building participates.',
    participants: '30–60 teachers',
    tier: 'building',
    deliverables: 'Building-wide lesson library, cross-grade alignment notes, shared vocabulary and protocols.',
  },
  {
    id: 'districtwide-institute',
    name: 'District-Wide Institute',
    duration: '3 days (18 hours)',
    description: 'Multi-school institute with a full Freyja Labs facilitation team. Parallel grade-band tracks, daily plenary keynote and synthesis, and an admin strand running alongside. Built for district-level CS, AI literacy, or STEM integration rollouts.',
    participants: '60–100 teachers + admin strand',
    tier: 'institute',
    deliverables: 'District lesson catalog, scope-and-sequence draft, leadership policy brief, year-one implementation roadmap.',
  },
  {
    id: 'leadership-halfday',
    name: 'Leadership Orientation',
    duration: '4 hours',
    description: 'For leaders exploring AI literacy or CS PD. Hands-on demo using the same protocols teachers experience, policy landscape review, and a planning conversation about scope and rollout.',
    participants: '5–15 administrators and coaches',
    tier: 'leadership',
    deliverables: 'Policy brief, readiness assessment, engagement plan.',
  },
  {
    id: 'coaching-6week',
    name: 'Six-Week Virtual Coaching',
    duration: '6 weeks (6 sessions)',
    description: 'Post-workshop follow-up: implementation support, troubleshooting, lesson refinement. Scales to any cohort size with small-group breakouts.',
    participants: 'Workshop cohort (any size)',
    tier: 'coaching',
    deliverables: 'Revised lessons, implementation log, student work portfolio.',
  },
];

const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));
let count = 0;
for (const code of Object.keys(data.districts)) {
  data.districts[code].engagementOptions = TIERS.map(t => ({ ...t }));
  count++;
}
writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`Updated engagementOptions on ${count} districts.`);
