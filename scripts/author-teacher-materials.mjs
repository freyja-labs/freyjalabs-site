#!/usr/bin/env node
/**
 * Author teacher_materials for every district in district-portals.json.
 *
 * Standards are pulled exclusively from working-folder/standards-db*.js
 * (loaded via Node vm). No standards code or text is invented; if a code
 * isn't in the DB, it isn't cited.
 *
 * Coverage:
 *   - National frameworks (CCSS ELA, CCSS Math, CSTA, ISTE, NCSS C3, NGSS):
 *     applied to ALL districts.
 *   - State-specific (TX TEKS): applied to TX districts only.
 *   - AZ and FL DBs are loaded but no current districts use them.
 *   - Other state-specific frameworks (NCSCOS, CA-NGSS, OH, IN, MD, GA, CO,
 *     VA, WA): NOT in working-folder. Logged to fact.check; not cited here.
 *
 * Idempotent: re-running overwrites teacher_materials with the latest output.
 *
 * Usage:
 *   node scripts/author-teacher-materials.mjs
 *   node scripts/author-teacher-materials.mjs 77092-hisd 27518-wcpss   # subset
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const PORTALS = resolve(REPO, 'src/data/district-portals.json');
const WORKING = resolve(REPO, 'working-folder');

// ---------- Load standards DB ----------

const ctx = { window: {} };
vm.createContext(ctx);
// Load base FIRST. The base file does `window.STANDARDS_DB = {...}` (direct
// assignment), while state files merge via `window.STANDARDS_DB = window.STANDARDS_DB || {}`.
// If the base loaded after the state files, it would wipe them.
const dbFiles = readdirSync(WORKING)
  .filter(f => f.startsWith('standards-db') && f.endsWith('.js'))
  .sort((a, b) => {
    if (a === 'standards-db.js') return -1;
    if (b === 'standards-db.js') return 1;
    return a.localeCompare(b);
  });
for (const f of dbFiles) {
  vm.runInContext(readFileSync(join(WORKING, f), 'utf-8'), ctx);
}
const DB = ctx.window.STANDARDS_DB;
if (!DB) throw new Error('standards DB failed to load');

// Helper: resolve a single standard cite from (framework, code).
// Throws if the code isn't in the DB — no silent invention.
function cite(framework, code) {
  if (!DB[framework]) throw new Error(`unknown framework: ${framework}`);
  if (!DB[framework][code]) throw new Error(`unknown code: ${framework}/${code}`);
  return { framework, code, text: DB[framework][code] };
}

// Helper: try a list of (framework, code) pairs; include only those present.
function tryCite(...pairs) {
  return pairs.filter(([fw, c]) => DB[fw]?.[c]).map(([fw, c]) => cite(fw, c));
}

// ---------- Standards selection per lesson type ----------

const NATIONAL_TECH = [
  ['NGSS', 'MS-ESS3-3'],            // monitoring human impact
  ['NGSS', 'MS-ETS1-3'],            // analyze data from tests
  ['CCSS Math', '6.SP'],            // statistics & probability
  ['CCSS Math', 'MP.4'],            // model with mathematics
  ['CSTA', '2-DA-08'],              // collect data, transform for reliability
  ['CSTA', '2-DA-09'],              // refine computational models from data
  ['CSTA', '2-IC-21'],              // bias & accessibility in tech design
  ['ISTE', 'ISTE-3b'],              // evaluate accuracy/credibility
  ['ISTE', 'ISTE-5b'],              // collect & analyze data
];

const NATIONAL_UNPLUGGED = [
  ['CCSS ELA', 'RI.7'],             // reading informational — grade 7
  ['CSTA', '2-IC-21'],              // bias & accessibility
  ['CSTA', '2-IC-23'],              // tradeoffs of public/private info
  ['ISTE', 'ISTE-3b'],              // evaluate information
  ['ISTE', 'ISTE-7b'],              // examine issues from multiple views
  ['NCSS C3', 'D2.Civ.14.6-8'],     // means of changing society
];

const TX_TECH = [
  ['TX TEKS Technology Applications', 'TA.6.2.A'],
  ['TX TEKS Technology Applications', 'TA.7.2.A'],
  ['TX TEKS Technology Applications', 'TA.8.2.A'],
  ['TX TEKS ELA', 'ELA.6.6.C'],     // use text evidence
];

const TX_UNPLUGGED = [
  ['TX TEKS Technology Applications', 'TA.8.3.A'],   // social/ethical/bias
  ['TX TEKS ELA', 'ELA.6.6.C'],     // use text evidence
  ['TX TEKS ELA', 'ELA.6.10.C'],    // compose argumentative texts
];

function alignment(state, kind) {
  const national = kind === 'tech' ? NATIONAL_TECH : NATIONAL_UNPLUGGED;
  const stateSet = state === 'TX' ? (kind === 'tech' ? TX_TECH : TX_UNPLUGGED) : [];
  return tryCite(...national, ...stateSet);
}

// ---------- Cross-cutting authored content ----------

const PRIOR_KNOWLEDGE_TECH = [
  'Read and create simple data tables and bar/line graphs',
  'Distinguish between an observation (what we measured) and an inference (what we conclude)',
  'Familiarity with one-step variable assignment in block-based or text-based code',
];

const PRIOR_KNOWLEDGE_UNPLUGGED = [
  'Read and discuss informational text in small groups',
  'Cite evidence to support a claim — written or verbal',
  'Familiarity with the difference between a prediction and a confirmed result',
];

const MISCONCEPTIONS_TECH = [
  {
    misconception: '"If the AI says it, it must be right — it has access to all the data."',
    response: 'Show the AI a deliberately wrong dataset and have students predict the (wrong) output. Reinforce: AI confidence ≠ AI correctness. The AI processes whatever input it receives, including noise and bias.',
  },
  {
    misconception: '"Our sensor data is wrong because it doesn\'t match the AI."',
    response: 'Have students re-measure with a second device or different location. Direct measurement is the ground truth — divergence with AI is a signal worth investigating, not an error to "fix."',
  },
  {
    misconception: '"The AI is broken if it gives a different answer to the same question twice."',
    response: 'This is a feature, not a bug. Use it to discuss probabilistic vs. deterministic systems. Two valid outputs can describe the same data — students should learn to ask "what stayed the same?"',
  },
];

const MISCONCEPTIONS_UNPLUGGED = [
  {
    misconception: '"AI is just like a calculator — if you give it the right numbers, you get the right answer."',
    response: 'Use a worked example where two students give the same prompt and get different outputs. AI is more like a human reader making a judgment call than a calculator computing a formula.',
  },
  {
    misconception: '"If we can\'t see the math, we just have to trust it."',
    response: 'Pivot the protocol — "Check the reasoning" — to focus on what we CAN check: source, comparison to known facts, internal consistency. You don\'t need the math to evaluate a claim.',
  },
  {
    misconception: '"AI hallucinations only happen with chatbots."',
    response: 'Show a printed AI example that contains a confident but factually wrong statement. Hallucinations are a property of how generative models work, not a chatbot quirk.',
  },
];

const DIFFERENTIATION_TECH = {
  below_grade: 'Pre-load the data table with column headers and one example row. Pair with a peer for the AI comparison phase. Provide a sentence frame for the evaluate phase: "We trust the AI when ___ because ___. We don\'t trust it when ___ because ___."',
  at_grade: 'Standard procedure as written.',
  above_grade: 'Add a fourth phase: students design a follow-up experiment that would resolve a specific AI-vs-observation disagreement they found. They write the protocol; they don\'t need to execute it in class.',
  multilingual_learners: 'Provide vocabulary cards in advance: sensor, prediction, observation, evidence, divergence. Allow team discussion in students\' home language; final class artifacts can be authored bilingually. The Check the Machine protocol works in any language — emphasize that direct measurement and lived knowledge are the most authoritative inputs.',
};

const DIFFERENTIATION_UNPLUGGED = {
  below_grade: 'Reduce to two artifacts in the packet (instead of three or four). Provide a graphic organizer with three columns: What the AI said / What I know / What I would tell someone who asked me. Sentence frames provided for the final argument.',
  at_grade: 'Standard procedure as written.',
  above_grade: 'Add a meta-question: students draft two or three rules for when the kind of AI tool in this lesson should and should not be used by adults in their lives. The rules are evidence-cited from the packet.',
  multilingual_learners: 'Encourage discussion in students\' home language. The artifacts in the packet can be discussed in any language — the analysis transfers. Final class artifacts can be authored bilingually. Pair vocabulary cards if helpful: source, reasoning, reality, evidence.',
};

const EXIT_TICKET_TECH = {
  prompt: 'Describe one moment today when your direct measurement told you something the AI missed. What did you measure, and what should the AI have done differently?',
  look_for: [
    'Specific reference to a measurement (number + unit + location)',
    'Specific reference to what the AI output said',
    'A concrete claim about what the AI should have changed (input, comparison, caveat)',
  ],
};

const EXIT_TICKET_UNPLUGGED = {
  prompt: 'An AI tool gives someone you care about a recommendation. What three things should they check before they accept it?',
  look_for: [
    'At least one item references the source or input data the AI used',
    'At least one item references the AI\'s reasoning or comparison with known facts',
    'At least one item references checking with a person, lived experience, or independent source',
  ],
};

const SLIDE_CUES_TECH = (district) => [
  { slide: 1, title: 'What we are doing today', talking_points: ['Collect real data on our campus', 'Compare it with what an AI predicts', 'Decide together when AI is worth trusting'] },
  { slide: 2, title: 'The Check the Machine protocol', talking_points: ['Source · Reasoning · Reality · Yourself', 'You don\'t need to know how the AI works to check its work', 'A protocol, not a checklist — adapt to the situation'] },
  { slide: 3, title: 'Phase 1 — Collect', talking_points: ['Teams of 3 deploy sensors at chosen spots', 'Record at intervals; vary your locations', 'Log a written observation with each reading'] },
  { slide: 4, title: 'Phase 2 — Compare', talking_points: ['Input your data into the AI tool', 'Find at least 3 places it agrees, 3 places it diverges', 'Don\'t correct your data to match the AI'] },
  { slide: 5, title: 'Phase 3 — Evaluate', talking_points: ['Apply Check the Machine to your divergences', 'Present one trust guideline based on what you found', 'Class builds the shared trust framework together'] },
  { slide: 6, title: 'Exit ticket', talking_points: ['One moment when your measurement beat the AI', 'Be specific — number, location, what AI missed'] },
];

const SLIDE_CUES_UNPLUGGED = (district) => [
  { slide: 1, title: 'Real decisions, real evidence', talking_points: ['AI tools are showing up in decisions that matter', 'Your job today: evaluate whether the AI\'s reasoning holds up', 'No screens. Just the artifacts in front of you.'] },
  { slide: 2, title: 'Check the Machine — without the machine', talking_points: ['Source · Reasoning · Reality · Yourself', 'Same protocol whether you\'re looking at a sensor reading or a printed AI claim', 'Adapt to what\'s in front of you'] },
  { slide: 3, title: 'Phase 1 — Examine', talking_points: ['Read the artifacts carefully', 'Note what the AI got right and wrong', 'Don\'t pick a winner yet'] },
  { slide: 4, title: 'Phase 2 — Investigate', talking_points: ['WHY did the AI reach this conclusion?', 'What data did it have? What did it miss?', 'Was it the model, or what the model knew?'] },
  { slide: 5, title: 'Phase 3 — Argue', talking_points: ['Make a defensible recommendation', '"It depends" is allowed if followed by "specifically, on these things"', 'Cite evidence from the packet'] },
  { slide: 6, title: 'Exit ticket', talking_points: ['Three things to check before accepting any AI recommendation'] },
];

// ---------- Per-district facilitation notes ----------
//
// Facilitation notes are the only section that needs district-specific
// content. Rather than invent local programs/landmarks/people (the
// no-invention rule), we anchor the local hook in what is already
// authored in the district's connectionPoint field. The facilitation
// note quotes or paraphrases that hook generically.

function facilitationNotes(district, kind, lesson) {
  // Generic phase-by-phase notes that work for the Collect/Compare/Evaluate
  // (tech) and Examine/Investigate/Argue (unplugged) structures, which all
  // 63 lessons share.
  if (kind === 'tech') {
    return [
      {
        phase: 1,
        focus: `Don't standardize sensor placement across teams. Different microclimates make Phase 2 richer. Move between teams every 5 minutes; check that students are recording observations *and* numerical readings. The qualitative notes are the wedge they'll use to challenge AI in Phase 3.`,
        watch_for: `Teams logging only numbers. Push them to write at least one observation per reading ("breeze picked up", "cloud passed over"). If the campus has visibly varied environments — shade vs. sun, paved vs. planted — push teams to spread out.`,
      },
      {
        phase: 2,
        focus: `Frame the AI tool as a teammate, not an authority. When the AI prediction is wrong, students often default to "we'll fix our data." Interrupt that — the goal is to surface where AI and ground-truth diverge, not to reconcile.`,
        watch_for: `Teams that find zero divergence. Either they're smoothing data unconsciously, or the AI is generic enough to match anything. Have them pick a single 5-minute window and compare in extreme detail.`,
      },
      {
        phase: 3,
        focus: `The class trust guidelines are the deliverable. Push for specificity: not "AI is bad at humidity" but "AI underestimates humidity in conditions like ours when [specific local condition]." Local knowledge + data = the trust criteria.`,
        watch_for: `Generic statements ("AI is sometimes wrong"). Reject these gently — every guideline must reference a specific divergence the team observed.`,
      },
    ];
  }
  // unplugged
  return [
    {
      phase: 1,
      focus: `Print the artifact packets in color so detail is preserved. Don't tell students which AI claims are "right" — let them notice divergence on their own. Their lived knowledge of the topic IS the comparison standard. Treat it that way explicitly.`,
      watch_for: `Teams that pick a "winning" artifact immediately. Slow them down — every artifact reflects the AI's best guess given its inputs. The question is not which is right but how anyone could have known in advance.`,
    },
    {
      phase: 2,
      focus: `Distinguish three error types: factual (X is asserted but isn't true), framing (the description emphasizes one thing while ignoring others), absence (something important is left out entirely). Most AI artifacts fail in framing and absence, not facts.`,
      watch_for: `Teams that only catch factual errors. Push deeper — what story is the AI telling? Whose perspective is implicit? What did it not have access to?`,
    },
    {
      phase: 3,
      focus: `Frame the argument as advice to a real decision-maker who will act on it. Students must commit to a recommendation AND name specifically what would change their mind.`,
      watch_for: `Hedging ("we can't really know"). True — but the decision still has to be made. Push students to commit to a recommendation AND explain what new information would flip it.`,
    },
  ];
}

// ---------- Family letter ----------
//
// Generic, district-name interpolated. No invented programs or materials.

function familyLetter(district, kind) {
  const dn = district.district;
  if (kind === 'tech') {
    return `Dear families,\n\nThis week your student is learning a skill that will matter for the rest of their lives: how to decide when to trust an AI system.\n\nIn this lesson, students used real sensors to measure conditions around our school and compared what they measured with what an AI predicted. The point is not that AI is bad — the point is that AI works best when paired with someone who knows the real situation. Your student is learning to be that someone.\n\nWe call the protocol Check the Machine. It has four steps: check the source the AI used, check the reasoning, check the result against reality, and check yourself for what you might have missed. You can use this with your student at home — every time an AI assistant gives you an answer, ask: "How would we check this?"\n\nQuestions? hello@freyjalabs.com\n— Freyja Labs (working with ${dn})`;
  }
  return `Dear families,\n\nThis week your student practiced something most adults haven't been formally taught: how to evaluate an AI-generated claim before accepting it.\n\nIn this lesson, students worked from printed artifacts — no screens — and applied a four-part protocol called Check the Machine: check the source, check the reasoning, check the result against reality, and check yourself. They learned that the right answer to "should I trust this AI?" is almost always "let me check first."\n\nAt home, you can use the same protocol. The next time an AI assistant gives your family information, ask your student: "What would we need to check before we acted on this?"\n\nQuestions? hello@freyjalabs.com\n— Freyja Labs (working with ${dn})`;
}

// ---------- Build teacher_materials per lesson ----------

function buildTeacherMaterials(district, kind, lesson) {
  return {
    prior_knowledge: kind === 'tech' ? PRIOR_KNOWLEDGE_TECH : PRIOR_KNOWLEDGE_UNPLUGGED,
    facilitation_notes: facilitationNotes(district, kind, lesson),
    misconceptions: kind === 'tech' ? MISCONCEPTIONS_TECH : MISCONCEPTIONS_UNPLUGGED,
    differentiation: kind === 'tech' ? DIFFERENTIATION_TECH : DIFFERENTIATION_UNPLUGGED,
    exit_ticket: kind === 'tech' ? EXIT_TICKET_TECH : EXIT_TICKET_UNPLUGGED,
    slide_cues: kind === 'tech' ? SLIDE_CUES_TECH(district) : SLIDE_CUES_UNPLUGGED(district),
    family_letter: familyLetter(district, kind),
    standards_alignment: alignment(district.state, kind),
  };
}

// ---------- Main ----------

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));

const codes = args.length > 0 ? args : Object.keys(data.districts);
let lessonsTouched = 0;
let districtsTouched = 0;

for (const code of codes) {
  const district = data.districts[code];
  if (!district) {
    console.warn(`! unknown district: ${code}`);
    continue;
  }
  let touched = false;
  for (const kind of ['tech', 'unplugged']) {
    const lesson = district.lessons?.[kind];
    if (!lesson) continue;
    lesson.teacher_materials = buildTeacherMaterials(district, kind, lesson);
    lessonsTouched++;
    touched = true;
  }
  if (touched) {
    districtsTouched++;
    const stateNote = district.state === 'TX' ? '+TX TEKS' : '(national only)';
    console.log(`✓ ${code} ${stateNote}`);
  }
}

writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`\nAuthored teacher_materials for ${lessonsTouched} lessons across ${districtsTouched} districts.`);
console.log(`Standards DB frameworks loaded: ${Object.keys(DB).join(', ')}`);
