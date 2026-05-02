#!/usr/bin/env node
/**
 * Author the full structured lesson body for all 126 lessons (tech +
 * unplugged × 63 districts). Replaces the previously-shared generic
 * sensor-deployment procedure with district-specific procedure, materials,
 * grade band, subjects, duration, content objectives, and AI literacy
 * objectives — all derived from the xlsx framings already imported into
 * `lessons.<kind>.district_framing`.
 *
 * IMPORTANT: these lesson bodies are derivations of the xlsx framing
 * descriptions, NOT Mike & Andrea's actual designed materials. Each
 * lesson body is a plausible structured form of what the framing
 * describes; the procedures, time blocks, and specific materials are
 * authorial interpretation. Logged to fact.check accordingly.
 *
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTALS = resolve(__dirname, '../src/data/district-portals.json');

// Shared Check the Machine protocol — documented Freyja Labs pedagogy.
// Applied to ALL tech lessons (verified vs. CLAUDE.md).
const CHECK_THE_MACHINE = [
  { step: 1, label: 'Check the source', prompt: 'Where did the AI get its data? Is it the same data we used or generated?' },
  { step: 2, label: 'Check the reasoning', prompt: 'How did the AI reach its conclusion? Can we follow the logic?' },
  { step: 3, label: 'Check against reality', prompt: 'Does the output match what we observed with our own senses, instruments, or knowledge?' },
  { step: 4, label: 'Check yourself', prompt: 'What might we have missed? What would we want a second opinion on?' },
];

// Shared assessment description — kept generic; per-lesson criteria added later.
const ASSESSMENT = (criteria) => ({
  description: 'Each team produces a one-page artifact: their findings, the AI output they evaluated, and a written verdict on when this kind of AI work is worth trusting.',
  criteria,
});

// ---------- Lesson bodies, indexed as `${code}::${kind}` ----------
const BODIES = {

  // ============================ OHIO ============================

  '43207-ccs::tech': {
    grade_band: '6–8', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Sensors and pattern analysis',
    materials: [
      'micro:bit with temperature, light, and sound sensors (included in kit)',
      'USB cables and student devices with internet access',
      'AI pattern-analysis tool access (at landing page)',
      'School building floor map (printed)',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ deploy micro:bit sensors at chosen building locations (cafeteria, library, hallway, courtyard). Record temperature, light, and sound at 5-minute intervals for 25 minutes. Note observations alongside numerical readings.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams input their data into the AI pattern-analysis tool and ask it to identify patterns. Document at least three places the AI agrees with their observations and three where it diverges.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Each team applies the Check the Machine protocol to the divergences. Class develops shared trust criteria for AI pattern analysis on data from a campus serving 95 languages and 104 countries.' },
    ],
    content_objectives: [
      'Collect environmental data using digital sensors across multiple campus locations',
      'Represent collected data in tables and graphs to support comparison',
      'Identify patterns in physical environment data over time',
    ],
    ai_literacy_objectives: [
      'Compare AI-identified patterns with student observations to identify divergences',
      'Apply the Check the Machine protocol to evaluate AI pattern-analysis output',
      'Articulate criteria for when AI analysis is and is not worth trusting in a multilingual school context',
    ],
    assessment: ASSESSMENT('Trust criteria reference at least one specific divergence the team observed; observations and AI output are documented side by side.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '43207-ccs::unplugged': {
    grade_band: '6–8', subjects: ['Social Studies', 'ELA'], duration_minutes: 60,
    badge: 'No screens · AI prediction critique',
    materials: [
      'Printed Columbus neighborhood data cards (demographics, transit, weather) — PDF at landing page',
      'Predicted-vs-actual outcome packets',
      'Check the Machine reference card',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams receive printed cards with Columbus neighborhood data. Each team reads the data and writes one prediction per card about what an outcome (transit ridership, weather impact, service demand) might be.' },
      { phase: 2, title: 'Role-play', duration_minutes: 20, description: 'Teams role-play as an AI system: using only the data on the cards, generate a "prediction." Then receive the actual outcome packet. Document where the prediction held and where it failed.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Teams identify what local knowledge — speaking 95 languages, having family in 104 countries — adds that the data alone misses. Class builds a shared list of community-knowledge inputs no AI training set contains.' },
    ],
    content_objectives: [
      'Read and interpret community demographic, transit, and weather data',
      'Generate predictions from data and evaluate them against actual outcomes',
      'Identify gaps between aggregate data and on-the-ground knowledge',
    ],
    ai_literacy_objectives: [
      'Distinguish between data an AI has and lived knowledge it does not',
      'Articulate the role of community knowledge in AI prediction quality',
      'Identify specific community inputs no training set captures',
    ],
    assessment: ASSESSMENT('Final list cites at least three specific community-knowledge inputs and ties each to a divergence the team observed.'),
  },

  '44114-cmsd::tech': {
    grade_band: '5–8', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Learning-space environmental data',
    materials: [
      'micro:bit with temperature, light, and sound sensors (included in kit)',
      'USB cables and student devices',
      'AI environmental-analysis tool access',
      'Floor plans of new and existing learning spaces (printed)',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ measure environmental conditions in two different learning spaces (a new/redesigned space and a traditional one). Record at 5-minute intervals; note observations.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams input data into the AI tool and ask it to compare the two spaces. Document where AI insights match the team\'s observations and where they diverge.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team produces a verdict: where was the AI helpful for understanding learning spaces, and where was human judgment the better tool? Frame around Building Brighter Futures redesign questions.' },
    ],
    content_objectives: [
      'Measure environmental conditions in two contrasting learning spaces',
      'Compare quantitative data across spaces and time',
      'Document observations alongside numerical measurements',
    ],
    ai_literacy_objectives: [
      'Identify where AI environmental analysis helps and where it misses',
      'Apply the Check the Machine protocol to AI comparisons of physical spaces',
      'Articulate when human judgment outperforms AI for spatial questions',
    ],
    assessment: ASSESSMENT('Verdict cites at least one observation the AI missed and one where AI insight was useful, both anchored to specific data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '44114-cmsd::unplugged': {
    grade_band: '6–8', subjects: ['Social Studies', 'Math'], duration_minutes: 60,
    badge: 'No screens · Consolidation scenario debate',
    materials: [
      'Printed enrollment and building-condition data for fictional school scenarios (modeled on Building Brighter Futures) — PDF at landing page',
      'AI consolidation-recommendation packet',
      'Check the Machine reference card',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Plan', duration_minutes: 20, description: 'Teams receive printed enrollment, condition, and community-context data for fictional schools. Each team designs a consolidation plan using only the printed data and their own reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams receive the AI-generated consolidation plan for the same fictional schools. Document differences between team and AI plans and identify what each captured or missed.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Structured debate: when should data override community voice? Each team takes a position and defends it with evidence from the packet. Connects to real Building Brighter Futures questions.' },
    ],
    content_objectives: [
      'Interpret enrollment and building-condition data to make a planning recommendation',
      'Compare two planning approaches (human and algorithmic) on the same data',
      'Construct an evidence-based argument about a planning tradeoff',
    ],
    ai_literacy_objectives: [
      'Identify what AI consolidation analysis captures and what it omits',
      'Distinguish between data points and community attachment as inputs',
      'Articulate when AI recommendations should and should not be the deciding factor',
    ],
    assessment: ASSESSMENT('Final argument cites at least three specific data points and at least one factor (community attachment, history) the AI cannot model.'),
  },

  '45219-cps::tech': {
    grade_band: '9–12', subjects: ['CTE', 'Math'], duration_minutes: 90,
    badge: 'AI workforce-data lab · No micro:bit',
    materials: [
      'Student devices with internet access',
      'Bureau of Labor Statistics data set for the Cincinnati MSA (printed and digital, at landing page)',
      'AI tool access for workforce-projection queries',
      'Three Es career-pathway prompt cards (employed, enlisted, enrolled)',
      'Spreadsheet, chart paper, markers',
    ],
    procedure: [
      { phase: 1, title: 'Pull', duration_minutes: 25, description: 'Teams of 3+ select 3–5 careers spanning the Three Es (employed, enlisted, enrolled). Query an AI tool for current and projected workforce trends. Record AI claims with timestamps and exact prompts.' },
      { phase: 2, title: 'Verify', duration_minutes: 30, description: 'Teams cross-reference each AI claim against BLS data for the Cincinnati MSA. Document where AI matches BLS, where it diverges, and where AI introduces context not in the underlying data.' },
      { phase: 3, title: 'Argue', duration_minutes: 35, description: 'Apply Check the Machine to AI workforce projections. Each team makes a case for or against using AI for student career guidance. Class builds a shared protocol for when AI workforce advice is worth trusting.' },
    ],
    content_objectives: [
      'Pull and interpret current Cincinnati-area workforce data from authoritative sources',
      'Compare two information sources (AI and BLS) on the same career questions',
      'Construct evidence-based positions on the use of AI for career guidance',
    ],
    ai_literacy_objectives: [
      'Identify divergences between AI-generated career projections and BLS data',
      'Apply the Check the Machine protocol to AI workforce claims',
      'Articulate criteria for when to trust, verify, or override AI career recommendations',
    ],
    assessment: ASSESSMENT('Each team\'s verdict cites at least three specific AI/BLS divergences and pairs each with a recommendation about how to use (or not use) AI in counseling practice.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '45219-cps::unplugged': {
    grade_band: '9–12', subjects: ['CTE', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Three Es interview design',
    materials: [
      'Printed AI job-matching recommendations for fictional candidates (PDF at landing page)',
      'Fictional candidate resume packets',
      'Three Es interview-question template cards',
      'Check the Machine reference card; chart paper, markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams receive printed AI job-matching recommendations for 3 fictional candidates pursuing different paths across the Three Es. Note what the recommendation says and what data it used.' },
      { phase: 2, title: 'Design', duration_minutes: 20, description: 'Each team designs human interview questions to ask the same candidates about career fit. Compare what an interviewer can learn that an AI scanning a resume cannot.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Teams build a shared protocol: when is an AI job-matching recommendation a reasonable starting point, and when should a counselor override it? Anchor in the Three Es framework — employed, enlisted, enrolled paths require different verification.' },
    ],
    content_objectives: [
      'Read AI-generated career recommendations critically',
      'Design open-ended interview questions that surface candidate context',
      'Construct a protocol for combining algorithmic and human judgment',
    ],
    ai_literacy_objectives: [
      'Identify what AI job-matching captures and what it cannot ask',
      'Distinguish between resume data and lived candidate context',
      'Articulate when human interview judgment should override an AI recommendation',
    ],
    assessment: ASSESSMENT('Each team\'s final protocol references specific limitations of AI candidate matching and at least three interview questions that surface what the AI missed.'),
  },

  '43123-swcs::tech': {
    grade_band: '4–6', subjects: ['Math', 'Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Growth and change measurement',
    materials: [
      'micro:bit with temperature, light, and motion sensors (included in kit)',
      'USB cables and student devices',
      'AI prediction tool access',
      'Local growth/change scenario prompts',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ collect environmental and motion data at locations on campus (busy hallway, quiet courtyard, classroom transition). Record at 5-minute intervals; note what is changing in real time.' },
      { phase: 2, title: 'Predict', duration_minutes: 30, description: 'Teams input early data into the AI tool and ask it to predict how the rest of the day or week will unfold. Document divergences as they occur in real time.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI predictions about a fast-changing community. Each team produces a verdict: when does change move faster than the model predicting it?' },
    ],
    content_objectives: [
      'Measure environmental and motion data over time',
      'Make and verify predictions using empirical data',
      'Identify how rapidly conditions can change in a growing community',
    ],
    ai_literacy_objectives: [
      'Compare AI predictions against real-time measurements',
      'Apply the Check the Machine protocol to predictive AI output',
      'Articulate when an AI model lags behind community change',
    ],
    assessment: ASSESSMENT('Verdict cites at least one prediction and one observed outcome that diverged, with reasoning grounded in the data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '43123-swcs::unplugged': {
    grade_band: '4–6', subjects: ['Social Studies', 'Math'], duration_minutes: 60,
    badge: 'No screens · Population-growth prediction',
    materials: [
      'Printed population-growth data for a fictional fast-growing suburb (PDF at landing page)',
      'AI service-needs projection packet',
      'Community-character context cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Predict', duration_minutes: 20, description: 'Teams receive printed population-growth data and predict what services (schools, transit, parks) will be needed in 3, 5, and 10 years using only the data and reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams receive the AI-generated service-needs projection for the same data. Document where AI matches their predictions and where it diverges.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Teams identify what an AI projection misses about community character — how the new families and existing families build a place. Each team produces a recommendation for what should and should not be left to AI.' },
    ],
    content_objectives: [
      'Interpret population-growth data and project future service needs',
      'Compare two projection approaches on the same data',
      'Identify factors that quantitative models miss about community',
    ],
    ai_literacy_objectives: [
      'Identify what AI population projections capture and what they miss',
      'Distinguish between numerical projections and community-character forecasting',
      'Articulate when human judgment is essential to community planning',
    ],
    assessment: ASSESSMENT('Final recommendation cites specific divergences between team and AI projections plus at least one community-character factor the model cannot represent.'),
  },

  '43035-olsd::tech': {
    grade_band: '7–9', subjects: ['Science', 'Technology'], duration_minutes: 90,
    badge: 'micro:bit + AI · Classification system',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI tool access (chosen by each team)',
      'Industry/career application cards (Columbus tech corridor sectors)',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Investigate', duration_minutes: 25, description: 'Teams choose an industry along the Columbus tech corridor (insurance, healthcare, logistics, finance) and identify a real AI application in that field. Use micro:bit data to simulate a small classification problem the industry might face.' },
      { phase: 2, title: 'Build', duration_minutes: 30, description: 'Each team builds a simple classification rule using their sensor data (e.g., "if temperature > X and motion = Y, classify as Z"). Test the rule against new data; record errors.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI decision-making in their chosen industry context. Compare a rule-based human classifier with an AI classifier — which is more transparent? Which is more accurate? Which would families in tech-corridor jobs trust?' },
    ],
    content_objectives: [
      'Connect classroom data investigation to real-world industry applications',
      'Design and test a simple classification rule',
      'Compare classification approaches on shared data',
    ],
    ai_literacy_objectives: [
      'Identify how AI classification systems work in industries familiar to the community',
      'Apply the Check the Machine protocol to industry AI decisions',
      'Articulate trade-offs between rule-based and learned classification',
    ],
    assessment: ASSESSMENT('Final evaluation cites a specific industry, a specific classification problem, and a defensible position on rule vs. AI for that case.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '43035-olsd::unplugged': {
    grade_band: '7–9', subjects: ['Social Studies', 'CTE'], duration_minutes: 60,
    badge: 'No screens · AI hiring fairness debate',
    materials: [
      'Printed fictional job-application packets (4–6 candidates) — PDF at landing page',
      'AI screening-tool ranking output',
      'Hiring rubric template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Rank', duration_minutes: 20, description: 'Teams of 3+ receive printed fictional job applications and rank candidates using a shared rubric. Document the reasoning behind their ranking.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams receive the AI screening tool\'s ranking for the same candidates. Document where rankings agree and where they diverge.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Structured debate: which approach produced fairer results? Each team takes a position grounded in evidence from the packets. Frame around the reality that many Olentangy parents make hiring decisions professionally.' },
    ],
    content_objectives: [
      'Apply a shared rubric to evaluate qualifications',
      'Compare two ranking approaches and analyze the differences',
      'Construct an evidence-based argument about decision-making fairness',
    ],
    ai_literacy_objectives: [
      'Identify the data inputs an AI hiring tool uses and the assumptions encoded',
      'Distinguish between rule-based and pattern-based ranking decisions',
      'Articulate when human judgment should override AI ranking in hiring',
    ],
    assessment: ASSESSMENT('Argument cites specific candidates, specific rubric criteria, and specific divergences between team and AI rankings.'),
  },

  '43017-dcsd::tech': {
    grade_band: '6–8', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Cross-cultural data analysis',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI tool access (multilingual prompt-capable)',
      'Comparable environmental datasets from 3+ global cities (printed and at landing page)',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on campus and select a comparable dataset from another global context (provided). Document conditions in both contexts.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Each team prompts an AI tool to analyze the combined data. Document where AI handles cross-cultural data well and where it imposes a default cultural lens.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI handling of cross-cultural environmental data. Class produces a shared list of cultural defaults the AI assumes.' },
    ],
    content_objectives: [
      'Collect environmental data and compare with data from another geographic context',
      'Identify cultural assumptions in data analysis',
      'Articulate how context shapes data interpretation',
    ],
    ai_literacy_objectives: [
      'Identify cultural defaults embedded in AI analysis',
      'Apply the Check the Machine protocol to AI handling of cross-cultural data',
      'Recognize when an AI assumes a single cultural lens',
    ],
    assessment: ASSESSMENT('Final list cites at least three specific cultural assumptions the AI made and at least one piece of cross-cultural context the AI missed.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '43017-dcsd::unplugged': {
    grade_band: '6–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Round-trip AI translation critique',
    materials: [
      'Printed short paragraphs translated by AI into 3 languages and back to English (PDF at landing page)',
      'Original-language reference texts (community languages)',
      'Annotation worksheets',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams receive a paragraph in English, AI translations into 3 community languages, and the round-trip back to English. Note what changed at each step.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams identify what was distorted, lost, or fabricated. Where possible, students who speak the language verify the intermediate translations.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written critique: what does cross-language AI handle well, and what should never be translated by AI alone? Connect to Dublin\'s globally connected community.' },
    ],
    content_objectives: [
      'Compare a text across multiple translations and round-trip transformations',
      'Identify specific points of distortion in language transformations',
      'Construct an evidence-based critique of cross-language AI use',
    ],
    ai_literacy_objectives: [
      'Identify cultural and linguistic content AI translation tends to lose',
      'Distinguish between literal and contextual translation',
      'Articulate when AI translation is appropriate and when it is not',
    ],
    assessment: ASSESSMENT('Critique cites at least three specific transformations and pairs each with a recommendation about appropriate vs. inappropriate AI translation use.'),
  },

  '45011-lkta::tech': {
    grade_band: '6–8', subjects: ['Math', 'Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Decision risk analysis',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Decision-cost worksheet (cost of being wrong)',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect environmental data and produce their own analysis of patterns and trends. Document the analytical reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool for the same analysis. Identify where AI adds value (faster, broader patterns) and where it introduces risk (over-confident, contextually wrong).' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus a cost-of-error analysis: in what decisions would AI risk be acceptable, and in what decisions would it not? Class produces a fiscal-discipline-grade trust framework.' },
    ],
    content_objectives: [
      'Produce an independent analysis of collected data',
      'Identify where AI analysis adds value versus introduces risk',
      'Apply cost-of-error reasoning to decision contexts',
    ],
    ai_literacy_objectives: [
      'Distinguish AI confidence from AI correctness',
      'Apply the Check the Machine protocol to decision-grade AI claims',
      'Articulate when AI analysis is acceptable and when it is not for high-stakes decisions',
    ],
    assessment: ASSESSMENT('Trust framework cites specific decisions where AI is acceptable, specific decisions where it is not, and the reasoning behind each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '45011-lkta::unplugged': {
    grade_band: '6–8', subjects: ['Math', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Public-decision debate',
    materials: [
      'Printed fictional school-budget data and decision scenarios (PDF at landing page)',
      'AI-generated budget recommendation packet',
      'Structured debate format cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 20, description: 'Teams of 3+ receive printed budget data and build their own recommendation using only the data and shared reasoning. Document the argument.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams receive the AI-generated budget recommendation for the same data. Identify points of agreement and disagreement.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Structured debate format: should AI ever be the deciding voice in public budget decisions? Each team takes a position and defends it with evidence.' },
    ],
    content_objectives: [
      'Interpret budget data and construct an evidence-based recommendation',
      'Compare two analyses on the same data',
      'Participate in structured argument with defined evidence standards',
    ],
    ai_literacy_objectives: [
      'Identify what AI budget analysis captures and what it omits',
      'Distinguish between analytic recommendation and political/communal judgment',
      'Articulate when AI should and should not be a deciding voice in public decisions',
    ],
    assessment: ASSESSMENT('Debate position cites at least three specific data points and at least one community/political factor the AI cannot represent.'),
  },

  '44308-aps::tech': {
    grade_band: '7–10', subjects: ['Science', 'Technology'], duration_minutes: 90,
    badge: 'micro:bit + AI · Longitudinal AI evolution comparison',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI tool access (current generation)',
      'Archived AI outputs from 2020-era tools (printed packet, at landing page)',
      'Comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 20, description: 'Teams of 3+ collect a small sensor dataset and run it through a current AI analysis tool. Document the AI output.' },
      { phase: 2, title: 'Compare', duration_minutes: 35, description: 'Teams receive printed AI outputs from 2020-era tools analyzing similar data. Document differences in capability, accuracy, and types of failure.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine across both AI generations. Class produces a shared framework: which capabilities improved, which problems persist, and what does that pattern predict about future trustworthiness?' },
    ],
    content_objectives: [
      'Collect sensor data and run current AI analysis',
      'Compare AI outputs across two generations of tools',
      'Identify patterns of capability improvement and persistent failure',
    ],
    ai_literacy_objectives: [
      'Distinguish between AI improvements and AI marketing claims',
      'Apply the Check the Machine protocol to AI from different eras',
      'Articulate which AI failure modes have persisted and what that means for trust',
    ],
    assessment: ASSESSMENT('Framework names at least two specific improvements and two persistent failures, with examples drawn from both 2020 and current outputs.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '44308-aps::unplugged': {
    grade_band: '7–10', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · AI capability timeline',
    materials: [
      'Printed AI output samples from 2020 and 2026 (PDF at landing page)',
      'Capability category cards',
      'Comparison worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams receive paired printed AI outputs (2020 vs. 2026) on the same prompts. Categorize improvements and persistent issues.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams identify which capability gaps the AI industry actually closed and which remain (hallucination, source attribution, calibration). Use only the printed evidence.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: what does the pattern of fixed-vs-persistent failures tell us about which AI claims to trust today? Connect to Akron\'s history as an early AI literacy adopter.' },
    ],
    content_objectives: [
      'Compare paired text samples across time',
      'Categorize improvements and persistent issues in a technology over time',
      'Construct an evidence-based argument about technology trust',
    ],
    ai_literacy_objectives: [
      'Identify which AI failure modes have been resolved and which have not',
      'Apply pattern reasoning to predict which AI claims are likely to remain unreliable',
      'Articulate criteria for trust based on long-term capability patterns',
    ],
    assessment: ASSESSMENT('Position names at least three specific improvements and three persistent issues, each cited from the printed packets.'),
  },

  '43604-tps::tech': {
    grade_band: '7–9', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Logistics and supply-chain data',
    materials: [
      'micro:bit with sensors (included in kit) — used as simulated package tracker',
      'USB cables and student devices',
      'AI logistics-analysis tool access',
      'Printed supply-chain scenarios (Toledo logistics economy)',
      'Constraint cards (delivery deadlines, weather, capacity)',
    ],
    procedure: [
      { phase: 1, title: 'Track', duration_minutes: 25, description: 'Teams of 3+ use micro:bit as a simulated tracker for a fictional Toledo-area shipment. Record temperature, motion, and timing data along a route.' },
      { phase: 2, title: 'Recommend', duration_minutes: 30, description: 'Teams query an AI logistics tool to recommend route optimizations using the tracker data. Compare AI recommendations against real-world constraints.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI logistics recommendations. Class produces a list of constraints AI handled well and constraints it ignored.' },
    ],
    content_objectives: [
      'Use sensors to simulate physical-world tracking data',
      'Interpret AI recommendations against real-world constraints',
      'Identify limits of model-based recommendations',
    ],
    ai_literacy_objectives: [
      'Compare AI recommendations against real-world operating constraints',
      'Apply the Check the Machine protocol to AI logistics output',
      'Articulate when AI optimization is and is not safe to act on',
    ],
    assessment: ASSESSMENT('Final list names at least three constraints AI handled well and three it missed, anchored in the simulation data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '43604-tps::unplugged': {
    grade_band: '7–9', subjects: ['CTE', 'Math'], duration_minutes: 60,
    badge: 'No screens · Bad-data cascade',
    materials: [
      'Printed logistics scenario packets containing intentional data errors (PDF at landing page)',
      'AI recommendation outputs based on the bad data',
      'Human-checkpoint design template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Trace', duration_minutes: 20, description: 'Teams of 3+ receive printed logistics scenarios containing intentional errors. Trace how each error would propagate through an AI system\'s decision process.' },
      { phase: 2, title: 'Examine', duration_minutes: 15, description: 'Teams compare their traces with printed AI recommendations based on the corrupt data. Document where bad data led to bad outputs and where the AI compensated.' },
      { phase: 3, title: 'Design', duration_minutes: 25, description: 'Each team designs human checkpoints in the workflow that would catch the errors before they cascade. Frame around Toledo\'s logistics-economy reality.' },
    ],
    content_objectives: [
      'Trace error propagation through a multi-step decision process',
      'Identify where bad inputs lead to bad outputs',
      'Design quality-control checkpoints in a workflow',
    ],
    ai_literacy_objectives: [
      'Identify how upstream data quality affects AI output reliability',
      'Distinguish between AI errors and AI behaving correctly on bad data',
      'Articulate where human checkpoints add value to AI workflows',
    ],
    assessment: ASSESSMENT('Checkpoint design names at least two specific errors caught, where in the workflow each is caught, and the human role at each checkpoint.'),
  },

  // ============================ TEXAS ============================

  '77092-hisd::tech': {
    grade_band: '6–8', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Weather data and forecast verification',
    materials: [
      'micro:bit with temperature, humidity, and barometric sensors (included in kit)',
      'USB cables and student devices',
      'Access to a public AI weather forecast tool',
      'Houston-area microclimate site map',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ deploy micro:bit weather sensors at multiple campus microclimates (open field, breezeway, parking lot, courtyard). Record at 5-minute intervals; note sky conditions.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI weather tool for forecasts covering the same time and location windows. Document where AI predictions match measurements and where they diverge — especially after a Houston morning rain.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to the AI forecast. Class develops a Houston-specific trust framework: when is AI worth trusting on weather, and when does local microclimate data win?' },
    ],
    content_objectives: [
      'Collect weather data using digital sensors at multiple microclimate sites',
      'Compare measured weather data with predicted weather data',
      'Identify the role of microclimate variation in forecast accuracy',
    ],
    ai_literacy_objectives: [
      'Compare AI weather predictions against student-measured ground truth',
      'Apply the Check the Machine protocol to AI weather output',
      'Articulate Houston-specific criteria for when to trust, verify, or override AI weather predictions',
    ],
    assessment: ASSESSMENT('Trust framework names at least one specific divergence from a Houston microclimate and a defensible criterion derived from it.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '77092-hisd::unplugged': {
    grade_band: '6–8', subjects: ['Science', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Hurricane forecast critique',
    materials: [
      'Printed historical hurricane forecast packets (Harvey 2017 and Ike 2008 — predicted vs. actual paths) at landing page',
      'Houston-area watershed and bayou map',
      'Forecast methodology summary cards',
      'Check the Machine reference card; chart paper, markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ receive printed packets of historical hurricane forecasts (predicted track vs. actual). Note where forecasts agreed with reality and where they diverged.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Using the methodology summary cards, teams identify whether each divergence was a model failure or a missing-data failure. Document local knowledge — bayou patterns, drainage, terrain — that would have improved the forecast.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team responds to a family-decision prompt: a relative in Galveston, 36 hours from landfall. Apply Check the Machine to recommend evacuate/stay and defend with evidence.' },
    ],
    content_objectives: [
      'Read and interpret hurricane forecast track data',
      'Distinguish between model error and data error',
      'Construct an evidence-based recommendation under uncertainty',
    ],
    ai_literacy_objectives: [
      'Identify what AI forecasts capture and what they miss',
      'Distinguish between forecast confidence and forecast correctness',
      'Articulate when local knowledge should override an AI forecast',
    ],
    assessment: ASSESSMENT('Recommendation cites at least three pieces of evidence and names what new information would change the decision.'),
  },

  '75231-disd::tech': {
    grade_band: '8–10', subjects: ['Math', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Community data equity audit',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Two contrasting Dallas neighborhood context packets (printed)',
      'Data recording sheet, chart paper, markers',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on campus and select one of two contrasting Dallas neighborhood profiles to compare against. Record measurements alongside community context notes.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to analyze the combined data and produce comparisons between their school context and the chosen neighborhood. Document where AI handles the two contexts equally and where it under-represents the less-resourced one.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI handling of equity-sensitive data. Each team produces evidence about whose voices the AI under-represented and what an analyst should do about it.' },
    ],
    content_objectives: [
      'Collect environmental data and pair it with community context',
      'Compare AI handling of data across different community contexts',
      'Identify equity-relevant patterns in AI analysis output',
    ],
    ai_literacy_objectives: [
      'Identify whose data and contexts AI tools privilege',
      'Apply the Check the Machine protocol to AI handling of equity-sensitive data',
      'Articulate the analyst\'s responsibility when AI under-represents a community',
    ],
    assessment: ASSESSMENT('Evidence cites at least two specific divergences in AI treatment of the two contexts and names the implication for analyst practice.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '75231-disd::unplugged': {
    grade_band: '8–10', subjects: ['Social Studies', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Neighborhood story critique',
    materials: [
      'Printed AI-generated descriptions of two Dallas neighborhoods (PDF at landing page)',
      'Demographic, transit, and history reference cards for the same neighborhoods',
      'Annotation worksheet; chart paper, markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams receive AI-generated descriptions of two Dallas neighborhoods. Read both descriptions and annotate where each feels accurate, incomplete, or off.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Compare the AI descriptions against the demographic and historical reference cards. Document whose data is represented and whose is missing in each description.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces an evidence-based written response: should this AI description tool be used to introduce these neighborhoods to a newcomer? Defend with packet evidence.' },
    ],
    content_objectives: [
      'Read AI-generated descriptive text critically',
      'Compare descriptive claims against authoritative reference data',
      'Construct an evidence-based written argument',
    ],
    ai_literacy_objectives: [
      'Identify whose perspectives an AI description privileges',
      'Distinguish between factual error, framing error, and absence error',
      'Articulate when AI descriptions of communities are appropriate to share',
    ],
    assessment: ASSESSMENT('Written response cites at least two factual issues, two framing issues, and one absence per neighborhood description.'),
  },

  '77065-cfisd::tech': {
    grade_band: '5–7', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Cross-classroom reliability protocol',
    materials: [
      'micro:bit with sensors (included in kit) — multiple per team for parallel measurement',
      'USB cables and student devices',
      'AI analysis tool access',
      'Reliability protocol design template',
      'Data recording sheet across multiple classroom environments',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 25, description: 'Teams of 3+ design a data collection protocol intended to produce comparable results across different classroom environments. Document the protocol step by step.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams swap protocols with another team and execute the other team\'s protocol in a new classroom. Run AI analysis on both teams\' data to compare consistency.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to the question of reliability — both human protocol and AI analysis. Class produces a shared definition of "reliable" when both humans and AI are part of the system.' },
    ],
    content_objectives: [
      'Design a reproducible measurement protocol',
      'Execute another team\'s protocol and evaluate its clarity',
      'Compare data consistency across teams and environments',
    ],
    ai_literacy_objectives: [
      'Distinguish between protocol-driven reliability and AI-output reliability',
      'Apply the Check the Machine protocol to questions of consistency',
      'Articulate what "reliable" means when humans and AI are both in the system',
    ],
    assessment: ASSESSMENT('Final definition of reliability cites both a protocol decision and an AI behavior that affected consistency, with evidence from team data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '77065-cfisd::unplugged': {
    grade_band: '5–7', subjects: ['Math', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · When averages lie',
    materials: [
      'Printed performance data for fictional schools across a large district (PDF at landing page)',
      'Average-calculation worksheets',
      'Distribution-visualization paper',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Calculate', duration_minutes: 20, description: 'Teams of 3+ receive printed performance data for fictional schools and calculate averages by school and across the district.' },
      { phase: 2, title: 'Examine', duration_minutes: 15, description: 'Teams visualize the underlying distributions on chart paper. Identify what each average hides — students at the tails, schools that look average but contain very different populations.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written critique: when should "the average" be used in district decisions, and when is it dangerous? Connect to the challenge of coherence across 90+ campuses.' },
    ],
    content_objectives: [
      'Calculate and visualize statistical averages',
      'Identify what averages obscure about underlying data',
      'Construct an evidence-based argument about appropriate use of summary statistics',
    ],
    ai_literacy_objectives: [
      'Identify how AI trained on aggregate statistics can mask within-group differences',
      'Distinguish between describing a population and describing individuals',
      'Articulate when AI averages are appropriate evidence and when they are not',
    ],
    assessment: ASSESSMENT('Critique cites at least two specific cases where the average misrepresents the data and proposes when averages are appropriate.'),
  },

  '78238-nisd::tech': {
    grade_band: '7–9', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Mission-grade decision support',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI recommendation tool access',
      'Real-world challenge prompt cards (environmental monitoring, resource tracking, safety)',
      'Mission-requirements worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 25, description: 'Teams of 3+ choose a real-world challenge prompt and design a micro:bit sensor system to monitor it. Document mission requirements: what does "good enough to act on" mean for this scenario?' },
      { phase: 2, title: 'Recommend', duration_minutes: 30, description: 'Teams collect data and query an AI tool for action recommendations. Compare AI recommendations against the mission requirements documented in Phase 1.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine: would each AI recommendation be acceptable to act on under the mission requirements? Class produces shared criteria for AI as decision support in time-pressured contexts.' },
    ],
    content_objectives: [
      'Design a sensor system tied to a real-world challenge',
      'Define mission-specific success criteria before evaluating outputs',
      'Compare recommendations against pre-defined criteria',
    ],
    ai_literacy_objectives: [
      'Evaluate AI recommendations against external mission criteria',
      'Apply the Check the Machine protocol in action-oriented decision contexts',
      'Articulate when AI is sufficient decision support and when it is not',
    ],
    assessment: ASSESSMENT('Final criteria cite the mission, the AI recommendation, and the evidence that the AI did or did not meet the bar to act on.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '78238-nisd::unplugged': {
    grade_band: '7–9', subjects: ['Social Studies', 'CTE'], duration_minutes: 60,
    badge: 'No screens · Decision under incomplete intelligence',
    materials: [
      'Printed "intelligence briefing" packets with intentional gaps (PDF at landing page)',
      'AI recommendation packet based on the same incomplete data',
      'Decision-and-defense worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Decide', duration_minutes: 20, description: 'Teams of 3+ receive a printed briefing with documented gaps. Decide what action to take using only the available information; document the gaps and the reasoning behind the decision.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams examine an AI recommendation generated from the same incomplete data. Identify what assumptions the AI filled in for the missing information.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written defense of their decision and a critique of the AI\'s. Connect to the everyday adaptability of San Antonio\'s military and healthcare communities.' },
    ],
    content_objectives: [
      'Make a defensible decision under documented uncertainty',
      'Identify gaps in available information',
      'Compare decisions reached by different reasoning paths',
    ],
    ai_literacy_objectives: [
      'Identify when AI fills in missing information with assumptions',
      'Apply the Check the Machine protocol to AI decisions made under uncertainty',
      'Articulate when AI assumption-filling is acceptable and when it is dangerous',
    ],
    assessment: ASSESSMENT('Defense names the gaps, the team\'s decision, the AI\'s assumptions, and a defensible reason for choosing one over the other.'),
  },

  '77494-kisd::tech': {
    grade_band: '6–8', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Energy-system data modeling',
    materials: [
      'micro:bit with light, temperature, and motion sensors (included in kit)',
      'USB cables and student devices',
      'AI energy-modeling tool access',
      'Energy-corridor industry context cards',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ measure energy-related data on campus (light, temperature, motion correlated with HVAC and occupancy). Record at 5-minute intervals.' },
      { phase: 2, title: 'Model', duration_minutes: 30, description: 'Teams input data into an AI energy-modeling tool and ask it to identify patterns and predict next-hour conditions. Document where the model captures real dynamics and where it oversimplifies.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI energy modeling. Class produces a list of physical-system realities that AI energy models commonly miss — relevant to the families working in Houston\'s energy corridor.' },
    ],
    content_objectives: [
      'Measure proxies for energy use in a real environment',
      'Compare AI model predictions with physical-system observations',
      'Identify where models simplify physical reality',
    ],
    ai_literacy_objectives: [
      'Identify oversimplifications in AI models of physical systems',
      'Apply the Check the Machine protocol to model-based AI predictions',
      'Articulate the boundary between useful simplification and misleading abstraction',
    ],
    assessment: ASSESSMENT('Final list cites at least three specific physical realities AI missed and the energy-system implication of each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '77494-kisd::unplugged': {
    grade_band: '6–8', subjects: ['Science', 'Math'], duration_minutes: 60,
    badge: 'No screens · Energy forecast critique',
    materials: [
      'Printed energy production/consumption data (PDF at landing page)',
      'AI-generated energy forecasts for the same data',
      'Physical-system reference cards (load curves, weather effects)',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Predict', duration_minutes: 20, description: 'Teams of 3+ receive printed energy data and build their own predictions for the next time window. Document the reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare predictions with the AI-generated forecasts. Identify where AI captured the dynamics and where it oversimplified.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a critique with at least three specific simplifications. Frame around what an energy-corridor parent would notice immediately.' },
    ],
    content_objectives: [
      'Build evidence-based predictions from energy data',
      'Compare predictions across analytical approaches',
      'Identify physical-system simplifications in model output',
    ],
    ai_literacy_objectives: [
      'Identify when AI energy forecasts oversimplify physical reality',
      'Distinguish between modeling tradeoffs and modeling errors',
      'Articulate when AI energy modeling is appropriate and when it is not',
    ],
    assessment: ASSESSMENT('Critique names at least three specific simplifications and the physical reality each one omits.'),
  },

  '76107-fwisd::tech': {
    grade_band: '5–7', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Transferable verification practice',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Verification protocol reference cards',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a small micro:bit data project (their choice of focus) and collect data. The structure of the build matters more than the specific topic — practice in building.' },
      { phase: 2, title: 'Verify', duration_minutes: 30, description: 'Teams run AI analysis on the data and apply the Check the Machine protocol step by step. Document each step on a verification card.' },
      { phase: 3, title: 'Transfer', duration_minutes: 35, description: 'Class shares verification cards. Each team identifies which steps would transfer to a different topic, a different curriculum, a different AI tool — practicing the meta-skill that survives institutional change.' },
    ],
    content_objectives: [
      'Build a small, complete data investigation',
      'Apply a verification protocol systematically',
      'Identify what transfers across contexts and what is context-specific',
    ],
    ai_literacy_objectives: [
      'Apply the Check the Machine protocol step by step',
      'Distinguish between the protocol and the specific tool/topic',
      'Articulate which verification habits travel with the learner',
    ],
    assessment: ASSESSMENT('Verification card explicitly identifies which steps are tool-specific and which are transferable, with reasoning for each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '76107-fwisd::unplugged': {
    grade_band: '5–7', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · The transfer student record',
    materials: [
      'Printed fictional student academic record (PDF at landing page)',
      'AI inference output based on the record',
      'Teacher-knowledge inventory worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ examine a fictional student\'s printed record and predict what an AI placement system would infer about the student.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams compare predictions with the AI output. Identify what the AI inferred and what it missed about the student\'s real situation.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written response: what does a teacher who knows the student know that the record cannot show? Frame around the reality of frequent student transfers during institutional change.' },
    ],
    content_objectives: [
      'Read a complex academic record and infer about a student',
      'Compare two inference approaches on the same data',
      'Identify what context cannot be captured in standardized records',
    ],
    ai_literacy_objectives: [
      'Identify what AI inference systems capture and what they miss about a person',
      'Distinguish between data points and lived knowledge',
      'Articulate the role of human relationship in evaluating AI inferences',
    ],
    assessment: ASSESSMENT('Written response names at least three pieces of teacher knowledge that the AI cannot have and ties each to a likely error in the AI inference.'),
  },

  '78704-aisd::tech': {
    grade_band: '7–10', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Experimental design against AI claims',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Experimental-design template',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 20, description: 'Teams of 3+ collect a baseline dataset using micro:bit sensors. Pose a question to an AI tool about a pattern in the data; record the AI claim verbatim.' },
      { phase: 2, title: 'Design', duration_minutes: 35, description: 'Teams design an experiment — with controls, variables, and clear predictions — that would test the AI claim. Execute the experiment if time permits; otherwise document the design.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus the experimental result. Each team produces a verdict: did the AI claim hold under controlled testing? What does this tell us about claims that have not been tested?' },
    ],
    content_objectives: [
      'Design an experiment with controls and clear predictions',
      'Execute or document a controlled comparison against an AI claim',
      'Apply scientific method to evaluating model output',
    ],
    ai_literacy_objectives: [
      'Treat AI claims as hypotheses requiring testing',
      'Apply the Check the Machine protocol alongside experimental verification',
      'Articulate the difference between AI confidence and tested claims',
    ],
    assessment: ASSESSMENT('Verdict names the AI claim, the experimental design, and what the experiment found — with a defensible position on the claim\'s reliability.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '78704-aisd::unplugged': {
    grade_band: '7–10', subjects: ['Science', 'Math'], duration_minutes: 60,
    badge: 'No screens · Designing the test AI cannot pass',
    materials: [
      'Paper, ruler, tape, and other simple physical materials',
      'Printed AI capability summary cards',
      'Experimental-design worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 20, description: 'Teams of 3+ design a hands-on physical experiment that produces a result an AI could not predict from prior data alone. Document the design and the prediction reasoning.' },
      { phase: 2, title: 'Test', duration_minutes: 15, description: 'Teams execute the experiment and record actual results. Compare with what an AI trained on prior similar data would have predicted.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team articulates exactly what their experiment shows about the limits of pattern matching versus physical investigation. Class shares experiments and builds a list of question types AI cannot answer from data alone.' },
    ],
    content_objectives: [
      'Design a controllable physical experiment',
      'Document the difference between predicted and observed outcomes',
      'Identify question types that require physical investigation',
    ],
    ai_literacy_objectives: [
      'Identify the limits of pattern matching as a knowledge tool',
      'Distinguish between predictions from data and predictions from physical principles',
      'Articulate when an AI cannot, in principle, answer a question',
    ],
    assessment: ASSESSMENT('Final list names at least three categories of question that require physical investigation and one example from a team\'s experiment for each.'),
  },

  '77479-fbisd::tech': {
    grade_band: '6–8', subjects: ['Science', 'ELA'], duration_minutes: 90,
    badge: 'AI literacy + multilingual data · No micro:bit',
    materials: [
      'Student devices with AI tool access',
      'Comparable text/data prompts in multiple languages (community languages of Fort Bend)',
      'Translation comparison worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Test', duration_minutes: 25, description: 'Teams of 3+ select 3 community languages and submit identical prompts to an AI tool in each language. Record outputs.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams compare AI performance across the languages. Document where output quality differs, where cultural context is mishandled, and where the AI defaults to an English-centric framing.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team produces evidence about how AI handles the languages of the Fort Bend community — the multilingual community itself becomes the dataset.' },
    ],
    content_objectives: [
      'Compare AI output across multiple languages on identical prompts',
      'Identify cultural and linguistic biases in AI behavior',
      'Document evidence systematically across language conditions',
    ],
    ai_literacy_objectives: [
      'Identify English-centric defaults in AI behavior',
      'Apply the Check the Machine protocol to multilingual AI evaluation',
      'Articulate AI bias using the student\'s own multilingual community as the dataset',
    ],
    assessment: ASSESSMENT('Evidence names at least one quality difference, one cultural mishandling, and one English-centric default per language tested.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '77479-fbisd::unplugged': {
    grade_band: '6–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · AI translation across community languages',
    materials: [
      'Printed AI translations of identical short texts into multiple community languages (PDF at landing page)',
      'Native-speaker reference annotation worksheet',
      'Cultural-nuance reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ receive printed AI translations across 3 community languages. Students who speak each language take the lead in evaluating accuracy and cultural fit.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams document specific points of distortion, missing nuance, and culturally tone-deaf phrasing in each translation.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written verdict: when is AI translation appropriate for community communication, and when must a native speaker be involved? Connect to Fort Bend\'s 130+ languages.' },
    ],
    content_objectives: [
      'Compare translations of identical text across languages',
      'Document linguistic and cultural nuance loss',
      'Construct an evidence-based recommendation for cross-language communication',
    ],
    ai_literacy_objectives: [
      'Identify what AI translation captures versus loses',
      'Position community language knowledge as authoritative evidence',
      'Articulate appropriate-use criteria for AI translation',
    ],
    assessment: ASSESSMENT('Verdict names at least three specific distortions per language and at least one community context where AI translation is unacceptable.'),
  },

  // ============================ VIRGINIA ============================

  '22042-fcps::tech': {
    grade_band: '8–10', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · The limits of AI in research-grade work',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Observation logbook (separate from numeric data sheet)',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on campus and maintain a parallel observation logbook (qualitative notes that quantitative data does not capture).' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams run AI analysis on the numeric data only. Document AI findings, then compare against the parallel observation logbook.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team identifies what the AI missed that human observation caught — the limits of pattern matching when context cannot be measured.' },
    ],
    content_objectives: [
      'Maintain parallel quantitative and qualitative records',
      'Compare AI analysis with field-level observations',
      'Identify the analytical limits of pattern matching',
    ],
    ai_literacy_objectives: [
      'Identify what cannot be measured and therefore cannot be in AI input',
      'Apply the Check the Machine protocol at research-grade rigor',
      'Articulate when human judgment is the better analytical tool',
    ],
    assessment: ASSESSMENT('Final report names at least three observations the AI missed and pairs each with the analytical implication.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '22042-fcps::unplugged': {
    grade_band: '8–10', subjects: ['Science', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Peer review for AI claims',
    materials: [
      'Printed AI-generated science summaries (PDF at landing page)',
      'Peer-review rubric (modeled on academic standards)',
      'Annotation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ receive printed AI-generated science summaries on a topic the team can engage. Skim and note initial impressions.' },
      { phase: 2, title: 'Apply', duration_minutes: 20, description: 'Teams apply a peer-review rubric: claims supported by evidence, sources cited, methodology coherent, conclusions warranted. Mark up the document.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written reviewer report. Class compiles common failure patterns — the same patterns the rubric catches in student work.' },
    ],
    content_objectives: [
      'Apply academic peer-review standards to a written claim',
      'Identify unsupported claims, missing evidence, and logical gaps',
      'Construct a structured reviewer report',
    ],
    ai_literacy_objectives: [
      'Apply academic standards of evidence to AI-generated text',
      'Distinguish between confident phrasing and well-supported claim',
      'Articulate failure patterns common to AI-generated science writing',
    ],
    assessment: ASSESSMENT('Reviewer report names at least one unsupported claim, one missing source, and one logical gap, with the rubric criterion cited for each.'),
  },

  '20112-pwcs::tech': {
    grade_band: '5–7', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Community measurement for Elevate 2030',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Neighborhood/community context sheet',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect community-relevant data on campus and around the school neighborhood (sound at recess, light along walkways, temperature at the bus loop). Pair each measurement with community-context notes.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to identify patterns and propose community improvements. Compare AI proposals against the team\'s lived knowledge of the neighborhood.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces a Prince William-specific list of community insights AI handled well and ones it missed — connecting to the deeper-thinking emphasis of Elevate 2030.' },
    ],
    content_objectives: [
      'Pair measured data with neighborhood context',
      'Compare AI community recommendations against lived knowledge',
      'Identify gaps between data-driven and community-driven analysis',
    ],
    ai_literacy_objectives: [
      'Distinguish between AI pattern detection and community understanding',
      'Apply the Check the Machine protocol to community-focused AI claims',
      'Articulate the role of lived knowledge in evaluating AI proposals',
    ],
    assessment: ASSESSMENT('Final list cites at least one specific divergence and at least one piece of lived knowledge the AI could not access.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '20112-pwcs::unplugged': {
    grade_band: '5–7', subjects: ['ELA'], duration_minutes: 60,
    badge: 'No screens · From AI-answerable to human-investigated questions',
    materials: [
      'Printed factual question prompts (AI-answerable)',
      'Question-transformation worksheet',
      'Examples of complex open-ended questions',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Sort', duration_minutes: 15, description: 'Teams of 3+ receive printed questions and sort them: which can be answered by an AI in seconds, which cannot? Document why.' },
      { phase: 2, title: 'Transform', duration_minutes: 20, description: 'Teams take 3 of the AI-answerable questions and transform each into a deeper question that requires human investigation. Connect to community contexts where possible.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team explains why the deeper questions are worth asking. Class produces a shared definition of "questions worth investigating" — directly modeling the deeper-thinking emphasis of Elevate 2030.' },
    ],
    content_objectives: [
      'Distinguish factual from open-ended questions',
      'Transform a simple question into a deeper investigation',
      'Articulate the value of unanswerable-by-AI questions',
    ],
    ai_literacy_objectives: [
      'Identify what AI can and cannot answer well',
      'Construct questions that require human investigation',
      'Articulate why some questions matter more than answerable ones',
    ],
    assessment: ASSESSMENT('Final shared definition cites at least three transformed questions and the community-relevant reason for asking each.'),
  },

  '20148-lcps::tech': {
    grade_band: '8–10', subjects: ['Science', 'Technology'], duration_minutes: 90,
    badge: 'micro:bit + AI · Build-and-evaluate a classifier',
    materials: [
      'micro:bit with sensors (included in kit) — multiple sensor types per team',
      'USB cables and student devices',
      'Simple browser-based ML classifier framework (provided link at landing page)',
      'Bias-evaluation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 30, description: 'Teams of 3+ collect labeled training data using micro:bit sensors (e.g., "indoor" vs. "outdoor" readings) and train a small classifier in a browser-based framework.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams test the classifier with new data. Document accuracy and identify systematic failure cases — where the classifier confidently misclassifies.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine, plus a bias-evaluation step: what training data created the failure pattern? Class produces a list of biases that emerge from limited training data — relevant for a community whose families build these systems.' },
    ],
    content_objectives: [
      'Collect labeled training data',
      'Train and test a simple classifier',
      'Identify systematic patterns in classifier failures',
    ],
    ai_literacy_objectives: [
      'Understand AI classifiers from the inside — training, testing, failure',
      'Apply the Check the Machine protocol to a system the team built',
      'Articulate how training data shapes classifier behavior',
    ],
    assessment: ASSESSMENT('Final list cites at least two systematic failure cases and pairs each with a training-data limitation that produced it.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '20148-lcps::unplugged': {
    grade_band: '8–10', subjects: ['Social Studies', 'Math'], duration_minutes: 60,
    badge: 'No screens · Black-box explanation challenge',
    materials: [
      'Printed AI decision outputs (loan approval, content recommendation, hiring filter) at landing page',
      'Decision-explanation worksheet',
      'Reasoning-trace template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ receive printed AI decision outputs from three different domains (financial, content, hiring). Read each output and the limited explanation provided.' },
      { phase: 2, title: 'Explain', duration_minutes: 25, description: 'Teams attempt to explain each decision step by step. Document where the explanation is possible and where it remains opaque even to families who build these systems.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces a position: which AI decisions should remain opaque, which should be explainable, and what does that mean for accountability? Connect to the data-center families.' },
    ],
    content_objectives: [
      'Read AI decision outputs critically',
      'Construct step-by-step explanations of decisions',
      'Identify decisions that resist explanation',
    ],
    ai_literacy_objectives: [
      'Distinguish between explainable and unexplainable AI decisions',
      'Apply transparency criteria to AI in different domains',
      'Articulate accountability standards for opaque AI decisions',
    ],
    assessment: ASSESSMENT('Position names at least one decision per domain that should be explainable and one that may not need to be, with reasoning.'),
  },

  '23456-vbcps::tech': {
    grade_band: '7–9', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Defending your evidence',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Disagreement-defense worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ collect data and produce their own analysis — graphs, summary statistics, conclusions. Document the analytical reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to analyze the same data. Document where AI agrees and where it disagrees with the team\'s conclusions.' },
      { phase: 3, title: 'Defend', duration_minutes: 35, description: 'Apply Check the Machine. Each team practices defending their reasoning when AI disagrees — naming specifically why their evidence wins or where they need to update. Discipline of trusting your own data, applied to AI.' },
    ],
    content_objectives: [
      'Produce an independent analysis of measured data',
      'Compare conclusions across analytical approaches',
      'Defend an analytical position with evidence',
    ],
    ai_literacy_objectives: [
      'Distinguish between updating your view and capitulating to AI authority',
      'Apply the Check the Machine protocol when AI and observation disagree',
      'Articulate when to trust your own analysis over an AI conclusion',
    ],
    assessment: ASSESSMENT('Defense cites the AI claim, the team\'s evidence, and a defensible position on which is more reliable for this data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '23456-vbcps::unplugged': {
    grade_band: '7–9', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Conflicting-evidence debate',
    materials: [
      'Printed conflicting claims: AI system output and human expert analysis on the same question (PDF at landing page)',
      'Evidence-evaluation worksheet',
      'Defense template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ receive printed conflicting claims and evaluate the evidence on each side using only the printed material.' },
      { phase: 2, title: 'Decide', duration_minutes: 15, description: 'Each team decides which claim is more credible and documents the specific evidence behind the decision.' },
      { phase: 3, title: 'Defend', duration_minutes: 25, description: 'Teams defend their position in structured argument. Class identifies what makes evidence trustworthy regardless of source — the discipline of self-reliant verification.' },
    ],
    content_objectives: [
      'Evaluate competing claims using available evidence',
      'Construct an evidence-based decision',
      'Defend a position in structured argument',
    ],
    ai_literacy_objectives: [
      'Apply the same evidence standard to AI and human claims',
      'Identify what makes evidence trustworthy independent of source',
      'Articulate the discipline of self-reliant verification',
    ],
    assessment: ASSESSMENT('Defense names the evidence supporting the chosen claim and acknowledges what would change the position.'),
  },

  '23223-hcps::tech': {
    grade_band: '6–8', subjects: ['Science', 'CS'], duration_minutes: 90,
    badge: 'micro:bit + AI · Deepening existing CS practice',
    materials: [
      'micro:bit with sensors (included in kit) — assumed familiar',
      'USB cables and student devices',
      'AI analysis tool access',
      'CS-integration design template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Extend', duration_minutes: 25, description: 'Teams of 3+ extend an existing CS lesson by adding an AI-verification layer. Use micro:bit data already familiar to the students.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams test their extension on data and apply the Check the Machine protocol to the AI verification step. Document where the verification adds rigor and where it adds friction.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Class produces a shared judgment: when is AI verification an upgrade to existing CS practice, and when is it a distraction? Anchor in the district\'s established CS leadership.' },
    ],
    content_objectives: [
      'Extend an existing CS lesson with a new component',
      'Test an instructional design and document tradeoffs',
      'Make a judgment about when an addition improves practice',
    ],
    ai_literacy_objectives: [
      'Integrate AI verification into existing CS pedagogy',
      'Apply the Check the Machine protocol as a depth move, not an introduction',
      'Articulate when AI literacy enhances and when it diverts CS instruction',
    ],
    assessment: ASSESSMENT('Final judgment cites a specific extension, evidence of where it added rigor, and evidence of where it added friction.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '23223-hcps::unplugged': {
    grade_band: '6–8', subjects: ['ELA'], duration_minutes: 60,
    badge: 'No screens · Designing AI literacy for a colleague',
    materials: [
      'Activity-design template (15-minute scope)',
      'Subject-area cards (for cross-discipline targets)',
      'Peer-feedback rubric',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 25, description: 'Teams of 3+ design a 15-minute AI literacy activity for a colleague in another subject area (drawn from the subject-area cards). Specify materials, pacing, and the Check the Machine moment.' },
      { phase: 2, title: 'Test', duration_minutes: 15, description: 'Teams swap activities and walk through another team\'s design as if they were the target colleague. Document what is clear and what is missing.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team revises and defends the final activity. Class produces a shared list of what makes AI literacy transferable across subjects.' },
    ],
    content_objectives: [
      'Design a 15-minute instructional activity for a specific audience',
      'Walk through another team\'s design and provide structured feedback',
      'Iterate based on peer feedback',
    ],
    ai_literacy_objectives: [
      'Translate AI literacy practice for a colleague in a different subject',
      'Identify the transferable elements of AI literacy pedagogy',
      'Articulate what survives the move across disciplines',
    ],
    assessment: ASSESSMENT('Final activity is concrete enough that another team can run it and includes an explicit Check the Machine moment.'),
  },

  '23322-chesps::tech': {
    grade_band: '5–8', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Scaling a champion-level practice',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Champion-practice case study (printed)',
      'Scaling-design worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a Champion-level lesson element using micro:bit data and AI verification. Reference the case study for what "champion-level" looks like.' },
      { phase: 2, title: 'Simplify', duration_minutes: 30, description: 'Teams identify which parts of the lesson require Champion expertise and which can be made accessible to a teacher new to CS. Redesign for the broader cohort.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Class produces shared scaling guidelines: what makes Champion-level practice transferable to the broader teacher cohort?' },
    ],
    content_objectives: [
      'Build an instructional element at a high level of practice',
      'Simplify without losing the core value',
      'Construct guidelines for scaling effective practice',
    ],
    ai_literacy_objectives: [
      'Apply the Check the Machine protocol as a transferable practice',
      'Identify what AI literacy elements scale and which require expertise',
      'Articulate the difference between Champion-level and accessible-level practice',
    ],
    assessment: ASSESSMENT('Final guidelines cite at least three transferable elements and one Champion-level element that requires direct mentorship.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '23322-chesps::unplugged': {
    grade_band: '5–8', subjects: ['ELA'], duration_minutes: 60,
    badge: 'No screens · Scaling what works',
    materials: [
      'Printed case study of a successful classroom practice (PDF at landing page)',
      'Adoption-plan template',
      'Barrier-analysis worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ receive a printed case study of a successful classroom practice. Identify what made it work — the conditions, the moves, the dependencies.' },
      { phase: 2, title: 'Plan', duration_minutes: 20, description: 'Teams design a plan for helping 10 other teachers adopt the practice. Identify barriers and how to address them.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Class compares plans and identifies what makes a practice transferable. Connect to the question of how two CS Champions become a department.' },
    ],
    content_objectives: [
      'Analyze what makes a practice work in context',
      'Design a structured adoption plan',
      'Identify barriers to scaling effective practice',
    ],
    ai_literacy_objectives: [
      'Apply the Check the Machine protocol as a candidate transferable practice',
      'Identify which AI literacy moves scale and which depend on the practitioner',
      'Articulate the conditions for successful transfer',
    ],
    assessment: ASSESSMENT('Adoption plan names at least three specific barriers and addresses each with a concrete strategy.'),
  },

  // ============================ CALIFORNIA ============================

  '90017-lausd::tech': {
    grade_band: '6–8', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Neighborhood data + lived knowledge',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI environmental-analysis tool access',
      'School-neighborhood context cards',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect environmental data in their school neighborhood (sound, temperature, light) at locations that often get less monitoring attention.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to analyze the data and characterize the neighborhood. Compare AI characterization against the team\'s lived knowledge of the neighborhood.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team produces evidence of where AI characterization matched and where it failed to capture what students who live in the neighborhood know.' },
    ],
    content_objectives: [
      'Collect environmental data in a community setting',
      'Compare data-driven characterization with lived knowledge',
      'Identify gaps between aggregate analysis and on-the-ground reality',
    ],
    ai_literacy_objectives: [
      'Identify what AI environmental characterization captures and misses about neighborhoods',
      'Apply the Check the Machine protocol with lived knowledge as ground truth',
      'Articulate when local knowledge should override aggregate AI analysis',
    ],
    assessment: ASSESSMENT('Evidence cites at least one specific divergence between AI characterization and student lived knowledge of the neighborhood.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '90017-lausd::unplugged': {
    grade_band: '6–8', subjects: ['Social Studies', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Whose neighborhood story is this?',
    materials: [
      'Printed AI-generated descriptions of three LA neighborhoods (PDF at landing page)',
      'Lived-knowledge inventory worksheet',
      'Annotation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ receive printed AI-generated descriptions of three LA neighborhoods. Annotate where each description rings true and where it feels off.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Students who know each neighborhood take the lead in identifying what the AI got wrong. Document factual errors, framing errors, and absences (what the AI did not include at all).' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written verdict: should this AI description be shown to a newcomer to LA? Defend with packet evidence and lived knowledge.' },
    ],
    content_objectives: [
      'Read AI-generated descriptive text critically',
      'Distinguish factual error, framing error, and absence',
      'Construct an evidence-based written argument',
    ],
    ai_literacy_objectives: [
      'Identify whose perspective is encoded in AI neighborhood descriptions',
      'Position lived knowledge as authoritative evidence',
      'Articulate when AI descriptions of communities should and should not ship',
    ],
    assessment: ASSESSMENT('Verdict cites at least three specific issues per neighborhood (factual, framing, or absence) and a defensible recommendation.'),
  },

  '92103-sdusd::tech': {
    grade_band: '7–9', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Cross-jurisdiction data behavior',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access (multilingual prompt-capable)',
      'Comparable datasets from US and Mexico contexts (printed)',
      'Cross-context comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect data on campus and pair it with a comparable dataset from a Mexico-side context (provided). Document differences in measurement units, time conventions, and reporting standards.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to analyze the combined dataset. Document where AI handles cross-border data well and where it imposes a single-jurisdiction default.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI handling of cross-border data. Class produces evidence about data discontinuities the AI did and did not handle — relevant to a binational community.' },
    ],
    content_objectives: [
      'Compare datasets across two national contexts',
      'Identify reporting and measurement convention differences',
      'Document AI handling of contextual differences',
    ],
    ai_literacy_objectives: [
      'Identify single-jurisdiction defaults in AI analysis',
      'Apply the Check the Machine protocol to cross-border data',
      'Articulate when AI handling of cross-context data is appropriate',
    ],
    assessment: ASSESSMENT('Evidence cites at least two specific cross-border discontinuities and pairs each with how AI handled (or mishandled) it.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '92103-sdusd::unplugged': {
    grade_band: '7–9', subjects: ['Social Studies', 'Math'], duration_minutes: 60,
    badge: 'No screens · Two-country, two-dataset analysis',
    materials: [
      'Printed paired data that changes at the US-Mexico border (PDF at landing page)',
      'AI analysis output for the same data',
      'Convention-difference reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ receive paired data from the two sides of the border. Identify discontinuities and trace where each dataset uses different conventions.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Compare team observations against printed AI analysis of the same data. Document where AI handled the discontinuities and where it papered over them.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a critique: when is AI safe to use on cross-border data, and when must a binational analyst be in the room? Connect to San Diego\'s binational identity.' },
    ],
    content_objectives: [
      'Identify discontinuities in cross-jurisdiction data',
      'Compare two analytical approaches on the same data',
      'Construct an evidence-based critique',
    ],
    ai_literacy_objectives: [
      'Identify how AI handles or hides data discontinuities',
      'Articulate the role of human analyst expertise in cross-border analysis',
      'Apply binational lived knowledge as a verification source',
    ],
    assessment: ASSESSMENT('Critique names at least two specific discontinuities AI mishandled and the binational expertise required to catch each.'),
  },

  '90810-lbusd::tech': {
    grade_band: '5–7', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Real-vs-artifact trend detection',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI trend-detection tool access',
      'Multi-day data recording sheet',
      'Trend-vs-artifact reference card',
    ],
    procedure: [
      { phase: 1, title: 'Track', duration_minutes: 25, description: 'Teams of 3+ build a micro:bit data-collection setup that runs for multiple days. Sample data is provided if multi-day collection is not possible in the workshop window.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to identify trends in the multi-day data. Document each AI-claimed trend.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus a real-vs-artifact analysis: which AI-identified trends are genuine and which are statistical artifacts? Class produces a Long Beach-quality framework for honest improvement claims.' },
    ],
    content_objectives: [
      'Track data over multiple days',
      'Distinguish trends from statistical noise',
      'Produce evidence-based judgments about improvement claims',
    ],
    ai_literacy_objectives: [
      'Identify when AI-claimed trends are genuine and when they are artifacts',
      'Apply the Check the Machine protocol to longitudinal AI claims',
      'Articulate honest evidentiary standards for improvement',
    ],
    assessment: ASSESSMENT('Framework cites at least one trend judged genuine and one judged artifact, with reasoning grounded in the data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '90810-lbusd::unplugged': {
    grade_band: '5–7', subjects: ['Math', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Real or artifact?',
    materials: [
      'Printed trend data showing apparent "improvement" (PDF at landing page)',
      'AI-generated improvement claims for the same data',
      'Statistical-artifact reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ receive printed trend data and AI-generated improvement claims. Read both carefully.' },
      { phase: 2, title: 'Investigate', duration_minutes: 20, description: 'Teams determine which improvement claims are genuine and which are artifacts of how the data was sliced (small sample, regression to mean, selective time window).' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written verdict: which improvement claims would survive Long Beach-grade scrutiny? Defend with evidence from the data.' },
    ],
    content_objectives: [
      'Distinguish trend from artifact in printed data',
      'Identify statistical reasons a trend may be artifactual',
      'Construct an evidence-based evaluation of improvement claims',
    ],
    ai_literacy_objectives: [
      'Apply skepticism to AI-generated improvement claims',
      'Identify which AI claims would and would not survive honest review',
      'Articulate honest assessment standards for AI trend output',
    ],
    assessment: ASSESSMENT('Verdict cites at least two genuine improvements and two artifacts, with the statistical reasoning behind each judgment.'),
  },

  '93721-fusd::tech': {
    grade_band: '6–8', subjects: ['Science', 'Agriculture'], duration_minutes: 90,
    badge: 'micro:bit + AI · Soil and ag-system data',
    materials: [
      'micro:bit with soil moisture, temperature, and light sensors (included in kit)',
      'USB cables and student devices',
      'AI agricultural-recommendation tool access',
      'Central Valley crop and growing-season reference cards',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ measure soil moisture, temperature, and light at chosen sites (planters, garden, sun/shade locations). Record at intervals over the workshop.' },
      { phase: 2, title: 'Recommend', duration_minutes: 30, description: 'Teams query an AI agricultural tool for crop or growing recommendations using their data. Compare AI recommendations against Central Valley reference cards from local growers.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team produces evidence of where AI agricultural recommendations match Central Valley reality and where they miss what local growers know.' },
    ],
    content_objectives: [
      'Measure soil and environmental conditions relevant to growing',
      'Compare AI recommendations against authoritative local knowledge',
      'Identify gaps between general models and local farming reality',
    ],
    ai_literacy_objectives: [
      'Identify when AI recommendations encode general assumptions that fail locally',
      'Apply the Check the Machine protocol with local grower knowledge as ground truth',
      'Articulate when local knowledge outperforms scale models',
    ],
    assessment: ASSESSMENT('Evidence cites at least two specific gaps between AI recommendation and Central Valley grower knowledge.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '93721-fusd::unplugged': {
    grade_band: '6–8', subjects: ['Agriculture', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Field notes vs. algorithm',
    materials: [
      'Printed agricultural recommendations from a 30-year local farmer (PDF at landing page)',
      'AI-generated agricultural recommendations trained on national data (same scenarios)',
      'Comparison worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read both sets of recommendations side by side. Note where they agree and where they diverge.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams trace each divergence: does the local knowledge include something the AI lacks (microclimate, water-table specifics, crop history), or vice versa?' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a critique: in which growing decisions does local knowledge outperform large-scale AI models, and when is each appropriate? Connect to Central Valley realities.' },
    ],
    content_objectives: [
      'Compare two sources of agricultural recommendations',
      'Identify the source of each divergence',
      'Construct an evidence-based recommendation about appropriate use',
    ],
    ai_literacy_objectives: [
      'Identify scale-model blindspots in agricultural AI',
      'Position local expert knowledge as authoritative',
      'Articulate when each kind of knowledge applies',
    ],
    assessment: ASSESSMENT('Critique cites at least three specific divergences and ties each to a context where local or large-scale knowledge wins.'),
  },

  '95624-egusd::tech': {
    grade_band: '4–6', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Measuring change in a growing community',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI pattern-analysis tool access',
      'Change-tracking worksheet',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on campus and document conditions that have changed recently (new building, new student arrivals, new traffic pattern).' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to identify patterns in the data. Compare patterns the AI finds with the changes students have witnessed.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class evaluates whether AI pattern detection handles change as well as students who live with the community shifts every day.' },
    ],
    content_objectives: [
      'Measure environmental data',
      'Identify recent community changes from observation',
      'Compare AI pattern detection with student observation of change',
    ],
    ai_literacy_objectives: [
      'Identify where AI lags behind community change',
      'Apply the Check the Machine protocol to AI pattern claims',
      'Articulate when student observation outperforms AI pattern detection',
    ],
    assessment: ASSESSMENT('Final evaluation cites at least one change students observed and one AI pattern claim, with a defensible judgment about which captured the reality better.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '95624-egusd::unplugged': {
    grade_band: '4–6', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · The new student and what data misses',
    materials: [
      'Printed fictional student profile (data only) — PDF at landing page',
      'AI-generated recommendation based on the profile',
      '"What a teacher who talked to the family knows" reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read a fictional new-student data profile and the AI-generated recommendation. Predict where the AI is right and where it misses.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams reveal the "what a teacher knows" reference cards (information not in the profile but available from a family conversation). Compare with AI inferences.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a verdict: how should AI recommendations for new students be used in a district receiving new families every week?' },
    ],
    content_objectives: [
      'Read a student data profile critically',
      'Compare data-driven inference with relational knowledge',
      'Construct an evidence-based recommendation about appropriate AI use',
    ],
    ai_literacy_objectives: [
      'Identify what AI student-recommendation systems capture and miss',
      'Distinguish between data points and relational knowledge',
      'Articulate when AI recommendations are an appropriate aid',
    ],
    assessment: ASSESSMENT('Verdict names at least two pieces of relational knowledge AI cannot have and a defensible policy for using AI recommendations.'),
  },

  '95126-sjusd::tech': {
    grade_band: '7–10', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Build a classifier from your own data',
    materials: [
      'micro:bit with multiple sensor types (included in kit)',
      'USB cables and student devices',
      'Browser-based ML classifier framework (link at landing page)',
      'Training-data design worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Train', duration_minutes: 30, description: 'Teams of 3+ design a binary classification problem (e.g., "indoor vs. outdoor", "morning vs. afternoon"), collect labeled training data with micro:bit sensors, and train a small classifier in the browser framework.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams test the classifier on new data. Document accuracy, identify systematic failures, and trace each failure to a training-data limitation.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine to a system the team built. Class produces engineering-side insights about how AI systems learn and where they break — directly relevant to a Silicon Valley community.' },
    ],
    content_objectives: [
      'Design a binary classification problem',
      'Collect labeled training data',
      'Train, test, and analyze a small classifier',
    ],
    ai_literacy_objectives: [
      'Understand AI from the engineering side',
      'Identify how training data shape classifier behavior',
      'Apply the Check the Machine protocol to a system the team built',
    ],
    assessment: ASSESSMENT('Final analysis names the classification problem, accuracy results, and at least two systematic failures traced to training data.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '95126-sjusd::unplugged': {
    grade_band: '7–10', subjects: ['Social Studies', 'CTE'], duration_minutes: 60,
    badge: 'No screens · AI screener vs. human interviewer',
    materials: [
      'Printed fictional candidate resumes (PDF at landing page)',
      'AI screener output for each candidate',
      'Human-interview question template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Screen', duration_minutes: 20, description: 'Teams of 3+ split into two roles: an AI screener (must use only the resume data) and a human interviewer (designs open-ended questions). Document each role\'s reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare what each role surfaces. Document what an AI screener catches and misses; what a human interviewer catches and misses.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: how should hiring combine the two? Connect to Silicon Valley parents who have been on both sides.' },
    ],
    content_objectives: [
      'Role-play distinct evaluation approaches',
      'Compare what different methods reveal and conceal',
      'Construct an evidence-based hiring recommendation',
    ],
    ai_literacy_objectives: [
      'Identify what AI screening captures and what it cannot',
      'Articulate the comparative strengths of AI screening and human interviewing',
      'Construct a role for each in fair hiring',
    ],
    assessment: ASSESSMENT('Position cites specific candidate cases and names what each method revealed or concealed.'),
  },

  // ============================ COLORADO ============================

  '80203-dps::tech': {
    grade_band: '5–8', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Student-directed investigation',
    materials: [
      'micro:bit with multiple sensor types (included in kit)',
      'USB cables and student devices',
      'AI tool access (for student-chosen use)',
      'Investigation-design template',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Choose', duration_minutes: 15, description: 'Each team of 3+ chooses a question they care about. Document why the question matters and what evidence would resolve it.' },
      { phase: 2, title: 'Investigate', duration_minutes: 40, description: 'Teams collect data with micro:bit sensors and use AI as one resource among several. Document where AI helped, where it slowed them down, and where they directed AI rather than being directed by it.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team reflects: was AI a tool we used or a tool that used us? Class produces a shared list of practices that keep students in the driver seat — directly aligned with DPS\'s educator-empowerment culture.' },
    ],
    content_objectives: [
      'Choose and frame an investigable question',
      'Direct an investigation with multiple resources',
      'Reflect on the role of each resource in the work',
    ],
    ai_literacy_objectives: [
      'Position AI as a directable resource, not an authority',
      'Apply the Check the Machine protocol within self-directed work',
      'Articulate what student agency looks like when AI is in the room',
    ],
    assessment: ASSESSMENT('Reflection cites the question chosen, where AI was used, and a defensible position on whether the student directed the AI or vice versa.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '80203-dps::unplugged': {
    grade_band: '5–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · The question determines the answer',
    materials: [
      'Question-quality reference cards',
      'Investigation-plan template (paper)',
      'AI-approach-to-question prediction worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Choose', duration_minutes: 15, description: 'Each team of 3+ chooses a community question they care about. Document why the question matters.' },
      { phase: 2, title: 'Plan', duration_minutes: 20, description: 'Teams design an investigation plan using only paper and reasoning. Predict how an AI would approach the same question and where its approach would fall short.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team explains why the quality of the question determines the quality of the answer. Class collects the strongest questions for further investigation — aligned with student-agency culture.' },
    ],
    content_objectives: [
      'Pose a question worth investigating',
      'Design an investigation plan',
      'Compare human and algorithmic approaches to the same question',
    ],
    ai_literacy_objectives: [
      'Identify how AI reframes a question through its approach',
      'Distinguish well-formed questions from underspecified ones',
      'Articulate why question quality bounds AI usefulness',
    ],
    assessment: ASSESSMENT('Investigation plan names the question, the approach, and a clear contrast between human and AI approaches to it.'),
  },

  '80401-jeffco::tech': {
    grade_band: '8–10', subjects: ['Science', 'Any'], duration_minutes: 90,
    badge: 'micro:bit + AI · Designing AI-resistant assessment',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Assessment-redesign template',
      'Comparison rubric',
    ],
    procedure: [
      { phase: 1, title: 'Investigate', duration_minutes: 30, description: 'Teams of 3+ complete a micro:bit-based investigation. Document not just the result but the reasoning at each decision point.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to perform the same investigation/analysis. Compare AI output with the team\'s reasoning trace; identify what AI cannot replicate.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine. The lesson itself becomes a model: what does an assessment look like that requires student reasoning even when AI is in the room? Connect directly to Andrew Gitner\'s assessment work.' },
    ],
    content_objectives: [
      'Document reasoning during an investigation, not just results',
      'Compare reasoning traces with AI output',
      'Identify what student reasoning AI cannot replicate',
    ],
    ai_literacy_objectives: [
      'Distinguish AI-replicable work from work requiring student reasoning',
      'Apply the Check the Machine protocol to assessment design',
      'Articulate what makes an assessment AI-resistant',
    ],
    assessment: ASSESSMENT('The artifact IS the assessment model — submitted reasoning trace cites moments only a student could have produced.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '80401-jeffco::unplugged': {
    grade_band: '8–10', subjects: ['Any'], duration_minutes: 60,
    badge: 'No screens · The assessment redesign challenge',
    materials: [
      'Printed traditional test questions across subjects (PDF at landing page)',
      'Assessment-redesign template',
      'AI-resistance criteria reference card',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ select a printed traditional test question and complete it. Then attempt the same question using only AI; document the result.' },
      { phase: 2, title: 'Redesign', duration_minutes: 25, description: 'Teams redesign the question so that original student thinking is required even when AI is available. Use the AI-resistance criteria as guidance.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Class compares redesigns. Each team explains what their redesign demands of the student that AI cannot supply. Directly connected to Jeffco\'s assessment work.' },
    ],
    content_objectives: [
      'Analyze a test question for what it actually measures',
      'Redesign assessment for the post-AI environment',
      'Articulate criteria for AI-resistant work',
    ],
    ai_literacy_objectives: [
      'Identify which assessment formats AI can complete and which it cannot',
      'Distinguish recall from reasoning in question design',
      'Construct assessments that survive AI availability',
    ],
    assessment: ASSESSMENT('Redesign demonstrably requires reasoning AI cannot supply; team explanation cites the specific element that resists AI.'),
  },

  '80104-dcsd-co::tech': {
    grade_band: '7–9', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Precision measurement under questioning',
    materials: [
      'micro:bit with high-resolution sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Precision-protocol design template',
      'Reference measurement tools (rulers, scales, thermometers)',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 25, description: 'Teams of 3+ design a precision measurement system using micro:bit sensors. Document the protocol, expected accuracy, and known sources of error.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams collect measurements and run AI analysis. Compare AI-reported precision against reference measurements; document where AI improved or degraded accuracy.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus a precision audit. Class produces a list: when does AI improve measurement, and when does it introduce false precision?' },
    ],
    content_objectives: [
      'Design a precision measurement protocol',
      'Compare measurements against reference standards',
      'Identify sources of measurement error',
    ],
    ai_literacy_objectives: [
      'Distinguish real precision from apparent precision in AI output',
      'Apply the Check the Machine protocol to precision claims',
      'Articulate when AI improves and when it degrades measurement accuracy',
    ],
    assessment: ASSESSMENT('Final list cites at least one case where AI improved precision and one where it introduced false precision, with reference-measurement evidence.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '80104-dcsd-co::unplugged': {
    grade_band: '7–9', subjects: ['Math', 'Science'], duration_minutes: 60,
    badge: 'No screens · Estimation as a discipline',
    materials: [
      'Printed estimation challenge prompts (PDF at landing page)',
      'AI-generated estimates for the same prompts',
      'Estimation reasoning worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Estimate', duration_minutes: 20, description: 'Teams of 3+ tackle estimation challenges (how many windows in this building? how many leaves on a tree?) using only observation and reasoning. Document the estimate and the reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare estimates with printed AI-generated estimates for the same prompts. Identify where each approach was stronger.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a verdict: when does disciplined human estimation outperform algorithmic precision? Connect to a community that values disciplined questioning.' },
    ],
    content_objectives: [
      'Apply structured estimation techniques',
      'Document reasoning behind an estimate',
      'Compare estimation approaches and identify strengths',
    ],
    ai_literacy_objectives: [
      'Identify cases where local observation beats algorithmic estimation',
      'Apply disciplined skepticism to AI precision claims',
      'Articulate the value of human observation in measurement',
    ],
    assessment: ASSESSMENT('Verdict names at least one challenge where human estimation won and one where AI did, with evidence.'),
  },

  '80111-ccsd::tech': {
    grade_band: '9–11', subjects: ['Science', 'Humanities'], duration_minutes: 90,
    badge: 'micro:bit + AI · Multidisciplinary AI-limits investigation',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Multidisciplinary problem prompt cards',
      'Argument-essay template',
    ],
    procedure: [
      { phase: 1, title: 'Investigate', duration_minutes: 30, description: 'Teams of 3+ choose a multidisciplinary problem (climate, equity, public health) and use micro:bit data plus AI analysis to investigate it.' },
      { phase: 2, title: 'Argue', duration_minutes: 30, description: 'Each team writes a college-level evidence-based argument about the limits of AI for this problem. Cite specific moments where AI fell short.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine. Class shares arguments and identifies common failure modes — the kind of college-prep critical thinking Cherry Creek expects.' },
    ],
    content_objectives: [
      'Investigate a multidisciplinary problem',
      'Construct a college-level evidence-based argument',
      'Identify systematic limitations across a problem domain',
    ],
    ai_literacy_objectives: [
      'Apply college-level critical thinking to AI output',
      'Document specific AI limitations with evidence',
      'Articulate AI\'s role in complex problems',
    ],
    assessment: ASSESSMENT('Argument cites at least three specific AI limitations and uses standard academic argumentation conventions.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '80111-ccsd::unplugged': {
    grade_band: '9–11', subjects: ['ELA', 'Humanities'], duration_minutes: 60,
    badge: 'No screens · AI essay vs. student voice',
    materials: [
      'Printed AI-generated college essay (fictional applicant) — PDF at landing page',
      'Printed student-written essay (fictional applicant)',
      'Voice-and-craft annotation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ read both essays. Annotate where each feels distinctly human and where each feels generic.' },
      { phase: 2, title: 'Investigate', duration_minutes: 20, description: 'Teams identify what makes writing distinctly human — voice, specific experience, idiosyncrasy. Document what AI essays consistently lack.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a verdict: what can admissions officers detect, and what cannot they detect? Connect to Cherry Creek\'s college-readiness identity.' },
    ],
    content_objectives: [
      'Read and annotate two writing samples critically',
      'Identify markers of distinct authorial voice',
      'Construct an evidence-based literary judgment',
    ],
    ai_literacy_objectives: [
      'Identify what AI writing consistently lacks',
      'Distinguish detectable from undetectable AI involvement',
      'Articulate what makes writing distinctly human',
    ],
    assessment: ASSESSMENT('Verdict cites at least three voice markers in the student essay and at least three patterns in the AI essay.'),
  },

  '80011-aps-co::tech': {
    grade_band: '6–8', subjects: ['Science', 'ELA'], duration_minutes: 90,
    badge: 'AI multilingual evaluation + micro:bit anchor',
    materials: [
      'micro:bit with sensors (included in kit) — used as data anchor',
      'USB cables and student devices',
      'AI tool access (multilingual prompt-capable)',
      'Multilingual prompt cards (community languages)',
      'Comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Anchor', duration_minutes: 20, description: 'Teams of 3+ collect a small micro:bit dataset to provide an objective anchor. Document data and observations.' },
      { phase: 2, title: 'Test', duration_minutes: 35, description: 'Teams query an AI tool in multiple community languages — students use their own home languages. Compare AI performance differences using the micro:bit data as the shared reference.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team produces evidence about AI bias surfaced by Aurora\'s 130+ languages — multilingual students become the experts.' },
    ],
    content_objectives: [
      'Anchor analysis with shared objective data',
      'Compare AI behavior across multiple languages',
      'Position multilingual fluency as analytical authority',
    ],
    ai_literacy_objectives: [
      'Identify AI bias through linguistic diversity',
      'Apply the Check the Machine protocol with multilingual evidence',
      'Articulate what English-centric AI misses',
    ],
    assessment: ASSESSMENT('Evidence cites at least one specific AI behavior difference per language and what it reveals about training-data assumptions.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '80011-aps-co::unplugged': {
    grade_band: '6–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · 130 languages testing AI',
    materials: [
      'Printed AI translations and outputs in multiple community languages (PDF at landing page)',
      'Native-speaker annotation worksheet',
      'Cultural-context reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ work in linguistic groups. Each group reviews printed AI outputs in their home language and annotates where the AI handled the language well or poorly.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams identify cultural and linguistic patterns that AI mishandles — students with multilingual backgrounds become the authoritative experts.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written report on AI performance in their language. Class compiles a multilingual AI-bias map of Aurora\'s communities.' },
    ],
    content_objectives: [
      'Evaluate written output in a language the student knows well',
      'Document linguistic and cultural mishandling',
      'Construct a structured multilingual evidence report',
    ],
    ai_literacy_objectives: [
      'Position multilingual fluency as authoritative AI evaluation evidence',
      'Identify systematic AI weaknesses by language',
      'Articulate the cost of English-centric AI training',
    ],
    assessment: ASSESSMENT('Multilingual report names at least three specific mishandlings per language and the cultural context required to catch each.'),
  },

  '80501-svvsd::tech': {
    grade_band: '7–9', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Workplace decision support',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI workplace-recommendation tool access',
      'Workplace scenario cards',
      'Decision-protocol worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 25, description: 'Teams of 3+ design a sensor system for a chosen workplace scenario (manufacturing line, healthcare monitoring, environmental compliance). Document expected operating parameters.' },
      { phase: 2, title: 'Recommend', duration_minutes: 30, description: 'Teams collect data and query an AI tool for workplace recommendations. Compare AI recommendations against the team\'s expected parameters.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces a workplace decision protocol: when does an employee follow AI, and when must human judgment override it?' },
    ],
    content_objectives: [
      'Design a workplace-relevant sensor system',
      'Compare AI recommendations against operational parameters',
      'Construct a decision protocol for combined AI/human work',
    ],
    ai_literacy_objectives: [
      'Identify when AI workplace recommendations require human override',
      'Apply the Check the Machine protocol in workplace contexts',
      'Articulate the role of human judgment in AI-supported work',
    ],
    assessment: ASSESSMENT('Decision protocol cites specific scenarios for follow-AI and override-AI, with reasoning grounded in operational parameters.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '80501-svvsd::unplugged': {
    grade_band: '7–9', subjects: ['CTE', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Override or follow?',
    materials: [
      'Printed workplace scenario cards (PDF at landing page)',
      'AI-recommendation outputs for each scenario',
      'Override-criteria template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Role-play', duration_minutes: 20, description: 'Teams of 3+ role-play workplace scenarios. The AI system recommends one action; the employee\'s judgment suggests another. Document the reasoning on both sides.' },
      { phase: 2, title: 'Decide', duration_minutes: 15, description: 'Teams reach a decision: follow the AI, override the AI, or seek more information. Document the criteria used.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces an override framework usable in actual jobs. Class compiles patterns: when human override is appropriate and when AI should be followed.' },
    ],
    content_objectives: [
      'Role-play workplace decision-making',
      'Construct override criteria for AI recommendations',
      'Generalize a decision framework from specific scenarios',
    ],
    ai_literacy_objectives: [
      'Articulate when AI workplace recommendations should be followed',
      'Identify when human judgment must override AI',
      'Construct a portable override framework',
    ],
    assessment: ASSESSMENT('Override framework cites at least three scenario categories and the criteria for each.'),
  },

  // ============================ GEORGIA ============================

  '30024-gcps::tech': {
    grade_band: '6–8', subjects: ['Science', 'Technology'], duration_minutes: 90,
    badge: 'micro:bit + AI · Beyond-flagship AI literacy',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Cross-discipline activity prompt cards',
      'Data recording sheet and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ choose a content area outside their AI specialty (humanities, arts, world languages) and design a hands-on data investigation a teacher in that area could lead.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams collect data and apply AI analysis. Document where the AI literacy moves transferred well to the new content area and where they did not.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces a transferable design pattern: AI literacy that scales beyond Seckinger\'s flagship pathway.' },
    ],
    content_objectives: [
      'Design instruction outside the team\'s home content area',
      'Document what transfers across disciplines',
      'Construct a portable design pattern',
    ],
    ai_literacy_objectives: [
      'Apply the Check the Machine protocol in non-CS content areas',
      'Identify which AI literacy moves are content-area independent',
      'Articulate what scaling beyond a flagship requires',
    ],
    assessment: ASSESSMENT('Final design pattern names at least one AI literacy move that transferred and one that needed adaptation, with evidence.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '30024-gcps::unplugged': {
    grade_band: '6–8', subjects: ['ELA'], duration_minutes: 60,
    badge: 'No screens · Translate deep knowledge for a non-specialist',
    materials: [
      'Knowledge-translation template',
      'Subject-area cards',
      'Peer-feedback rubric',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Choose', duration_minutes: 15, description: 'Each team of 3+ chooses a CS or AI concept they understand deeply. Document why it matters.' },
      { phase: 2, title: 'Translate', duration_minutes: 25, description: 'Teams design a way to teach the concept to someone with no CS background — a humanities teacher, an art teacher, a parent. Iterate based on what makes it land.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team explains what makes their concept transferable. Class identifies common moves that work — the same problem Gwinnett faces beyond the flagship.' },
    ],
    content_objectives: [
      'Identify deep knowledge in your own area',
      'Translate technical knowledge for a non-specialist',
      'Iterate based on peer feedback',
    ],
    ai_literacy_objectives: [
      'Identify the translatable core of an AI literacy concept',
      'Distinguish jargon from substance',
      'Construct teaching moves that transfer beyond specialists',
    ],
    assessment: ASSESSMENT('Final translation lands with at least one peer who has no CS background, verified through structured feedback.'),
  },

  '30060-ccsd-ga::tech': {
    grade_band: '5–7', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Replicable investigation protocol',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Replicable-protocol design template',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Investigate', duration_minutes: 25, description: 'Teams of 3+ work through a structured investigation using a shared protocol. Each team documents results AND reflects on which protocol steps were ambiguous.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams swap protocol notes with another team. Identify where the protocol produced consistent results and where it diverged due to interpretation.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI verification of the investigation. Class refines the protocol toward a version every Cobb classroom could replicate — coherence at 106,000-student scale.' },
    ],
    content_objectives: [
      'Execute a shared investigation protocol',
      'Identify points of protocol ambiguity',
      'Refine a protocol for cross-classroom consistency',
    ],
    ai_literacy_objectives: [
      'Apply the Check the Machine protocol consistently across classrooms',
      'Identify how protocol clarity affects AI-output reliability',
      'Articulate the link between protocol design and verification consistency',
    ],
    assessment: ASSESSMENT('Refined protocol cites at least two ambiguities resolved and one that remains, with reasoning about why.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '30060-ccsd-ga::unplugged': {
    grade_band: '5–7', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · One policy, many buildings',
    materials: [
      'Printed policy statement (PDF at landing page)',
      'Three different fictional school context cards',
      'Implementation-comparison worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Read', duration_minutes: 15, description: 'Teams of 3+ read the printed policy statement and the three school context cards.' },
      { phase: 2, title: 'Implement', duration_minutes: 20, description: 'Each team designs implementation plans for the policy in each of the three school contexts. Document where context shapes interpretation.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a verdict: how does this challenge map to AI systems trained on one context and deployed in another? Connect to coherence-at-scale.' },
    ],
    content_objectives: [
      'Interpret a policy statement across multiple contexts',
      'Identify how context shapes implementation',
      'Generalize from policy implementation to AI transferability',
    ],
    ai_literacy_objectives: [
      'Connect human policy implementation to AI training-context limitations',
      'Identify when AI fails to transfer across contexts',
      'Articulate the parallel between policy adaptation and AI generalization',
    ],
    assessment: ASSESSMENT('Verdict draws an explicit parallel between policy adaptation and AI cross-context behavior with at least two specific examples.'),
  },

  '30083-dksd::tech': {
    grade_band: '6–8', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Same data, different interpretations',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Context-cue prompt cards (Decatur / Stonecrest / rural DeKalb)',
      'Comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect a shared dataset using micro:bit sensors. Document the data once.' },
      { phase: 2, title: 'Reframe', duration_minutes: 30, description: 'Each team queries the AI tool with a different context cue (Decatur / Stonecrest / rural DeKalb). Document how the AI\'s interpretation shifts based on the framing.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class identifies how AI interpretations depend on context cues — and learns to ask "whose context?" of every AI output.' },
    ],
    content_objectives: [
      'Collect a shared dataset',
      'Vary context cues and observe interpretive differences',
      'Identify how framing shapes analytical output',
    ],
    ai_literacy_objectives: [
      'Identify the role of context cues in AI interpretation',
      'Apply the Check the Machine protocol to context-shaped output',
      'Articulate the question "whose context?" as a verification habit',
    ],
    assessment: ASSESSMENT('Final analysis cites at least two interpretive differences across contexts and the inputs that produced each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '30083-dksd::unplugged': {
    grade_band: '6–8', subjects: ['Social Studies', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Identical data, different communities',
    materials: [
      'Printed identical datasets (PDF at landing page)',
      'Three different community context cards (Decatur / Stonecrest / rural DeKalb)',
      'Interpretation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Read', duration_minutes: 15, description: 'Teams of 3+ receive identical printed datasets but different community context cards.' },
      { phase: 2, title: 'Interpret', duration_minutes: 20, description: 'Each team writes an interpretation of the data assuming their context. Compare interpretations across teams.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Class identifies how context changes interpretation of the same data — and connects this to the lesson AI systems still need to learn.' },
    ],
    content_objectives: [
      'Interpret data within a given context',
      'Compare interpretations across contexts',
      'Identify how context shapes meaning of identical data',
    ],
    ai_literacy_objectives: [
      'Apply context-sensitivity reasoning to AI output',
      'Identify how AI struggles with context shifts',
      'Articulate why "same data" produces different appropriate interpretations',
    ],
    assessment: ASSESSMENT('Final analysis cites at least two interpretation differences and the context features that produced them.'),
  },

  '30339-fcs::tech': {
    grade_band: '7–9', subjects: ['Math', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Aggregate vs. individual data',
    materials: [
      'micro:bit with sensors (included in kit) — collect data across diverse settings',
      'USB cables and student devices',
      'AI analysis tool access',
      'Aggregate-vs-individual worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect data from clearly different micro-environments (sun, shade, building interior). Maintain individual readings, not just averages.' },
      { phase: 2, title: 'Aggregate', duration_minutes: 30, description: 'Teams compute district-wide averages from the data. Query AI for analysis based on averages alone, then on the individual readings. Document differences.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine to AI handling of aggregate vs. individual data. Class produces evidence for what AI trained on averages misses about communities like Fulton\'s.' },
    ],
    content_objectives: [
      'Collect data across diverse settings',
      'Compute and compare aggregate and individual analyses',
      'Identify what aggregation hides',
    ],
    ai_literacy_objectives: [
      'Distinguish AI behavior on aggregated vs. individual data',
      'Apply the Check the Machine protocol to aggregate analysis',
      'Articulate when an AI trained on averages misrepresents individuals',
    ],
    assessment: ASSESSMENT('Evidence cites at least two specific differences between aggregate and individual AI analysis and what each reveals.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '30339-fcs::unplugged': {
    grade_band: '7–9', subjects: ['Math', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · The average student does not exist',
    materials: [
      'Printed data spanning very different communities (PDF at landing page)',
      'Average-calculation worksheet',
      'Distribution-visualization paper',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Calculate', duration_minutes: 20, description: 'Teams of 3+ compute averages from printed data spanning communities like Fulton\'s College Park-to-Alpharetta range. Document the averages.' },
      { phase: 2, title: 'Visualize', duration_minutes: 15, description: 'Teams visualize the underlying distributions on chart paper. Identify how few — if any — actual students or schools resemble "the average."' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: when does training on averages produce AI that fails the people it claims to serve? Connect to Fulton\'s spectrum.' },
    ],
    content_objectives: [
      'Calculate and visualize averages from diverse data',
      'Identify the gap between average and actual',
      'Construct an evidence-based critique of average-based reasoning',
    ],
    ai_literacy_objectives: [
      'Identify how AI training on averages affects individuals',
      'Distinguish describing a population from describing individuals',
      'Articulate when AI averages mislead',
    ],
    assessment: ASSESSMENT('Position cites at least two cases where the average misrepresents the underlying communities.'),
  },

  '30040-fycs::tech': {
    grade_band: '7–9', subjects: ['Science', 'Engineering'], duration_minutes: 90,
    badge: 'micro:bit + AI · Durability of AI conclusions',
    materials: [
      'micro:bit with sensors (included in kit) — set up for long-term monitoring',
      'USB cables and student devices',
      'AI analysis tool access',
      'Durability-test worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a micro:bit monitoring system. Document the assumptions and the conditions under which it should remain accurate.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams change conditions (temperature shift, sensor placement, lighting). Run AI analysis as conditions evolve. Document where AI confidence stays high but accuracy degrades.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus a durability audit. Class produces a Forsyth-grade framework: how do we tell if an AI claim will still be true next month?' },
    ],
    content_objectives: [
      'Build a monitoring system with documented assumptions',
      'Test the system under changing conditions',
      'Identify when system output remains accurate',
    ],
    ai_literacy_objectives: [
      'Distinguish AI confidence from AI accuracy under changing conditions',
      'Apply the Check the Machine protocol to durability claims',
      'Articulate criteria for assessing the shelf life of AI claims',
    ],
    assessment: ASSESSMENT('Final framework cites at least two cases where AI confidence outlasted AI accuracy and the implication for trust.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '30040-fycs::unplugged': {
    grade_band: '7–9', subjects: ['ELA', 'Science'], duration_minutes: 60,
    badge: 'No screens · Will this answer still be right next year?',
    materials: [
      'Printed AI outputs from prior years (PDF at landing page)',
      'Current-year reference data',
      'Durability-evaluation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ receive printed AI outputs from prior years. Read the claims and evaluate which still hold up against current information.' },
      { phase: 2, title: 'Categorize', duration_minutes: 15, description: 'Teams categorize claims: still accurate, partly outdated, fully wrong now. Document why each category emerged.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a framework for assessing the shelf life of AI claims today — what categories of claim age well, what categories age badly. Connect to Forsyth\'s expectation of rigor that endures.' },
    ],
    content_objectives: [
      'Evaluate the current accuracy of historical claims',
      'Categorize claims by durability',
      'Construct a framework for predicting future accuracy',
    ],
    ai_literacy_objectives: [
      'Distinguish durable from time-bound AI claims',
      'Apply pattern reasoning to predict shelf life',
      'Articulate criteria for AI claims that warrant long-term trust',
    ],
    assessment: ASSESSMENT('Framework names at least three claim categories with examples drawn from the printed packet.'),
  },

  // ============================ INDIANA ============================

  '46802-fwcs::tech': {
    grade_band: '7–9', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Quality control as data work',
    materials: [
      'micro:bit with sensors (included in kit) — used as quality-control sensor',
      'USB cables and student devices',
      'AI manufacturing-analysis tool access',
      'Quality-control reference standards',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a micro:bit-based quality-control sensor for a simple manufactured object (paper structure, taped joint, folded part). Document target specifications.' },
      { phase: 2, title: 'Inspect', duration_minutes: 30, description: 'Teams collect inspection data and run AI-assisted quality analysis. Compare AI conclusions against the team\'s direct inspection.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class identifies where AI quality analysis succeeded and where direct human inspection was the better tool — bridging Fort Wayne\'s manufacturing heritage to data work.' },
    ],
    content_objectives: [
      'Build a sensor-based inspection system',
      'Compare AI-assisted with direct inspection',
      'Identify the appropriate role of each method',
    ],
    ai_literacy_objectives: [
      'Identify AI strengths and limits in manufacturing analysis',
      'Apply the Check the Machine protocol to quality decisions',
      'Articulate the place of computational thinking in manufacturing transitions',
    ],
    assessment: ASSESSMENT('Final analysis cites at least two inspection cases — one where AI excelled and one where human inspection won.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '46802-fwcs::unplugged': {
    grade_band: '7–9', subjects: ['CTE', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Human eye vs. machine eye',
    materials: [
      'Printed photos of manufactured parts with various defects (PDF at landing page)',
      'AI quality-inspection results',
      'Defect categorization worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Inspect', duration_minutes: 20, description: 'Teams of 3+ examine printed part photos and identify defects. Document the type and severity of each.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare findings with the printed AI quality-inspection results. Document where each approach caught defects the other missed.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: how should manufacturing inspection combine human and AI judgment? Connect to Fort Wayne\'s manufacturing economy.' },
    ],
    content_objectives: [
      'Apply visual inspection criteria',
      'Compare two inspection approaches',
      'Construct a structured combined-inspection recommendation',
    ],
    ai_literacy_objectives: [
      'Identify what AI image inspection catches and misses',
      'Apply combined-judgment reasoning to inspection workflows',
      'Articulate when human inspection remains essential',
    ],
    assessment: ASSESSMENT('Position cites at least two part defects each method handled differently and the combined-inspection recommendation.'),
  },

  '46204-ips::tech': {
    grade_band: '5–8', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Cross-context model evaluation',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'School-context reference cards (traditional, charter, magnet)',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect data in their specific school context. Document what makes their school context distinct (size, schedule, student population, governance).' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to analyze the data. Document where AI generalizations apply to their context and where they impose assumptions from a different context.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces evidence about AI behavior across IPS\'s Innovation Network model — traditional and charter schools under one umbrella.' },
    ],
    content_objectives: [
      'Collect and document context-specific data',
      'Identify when AI generalizations apply or fail',
      'Construct evidence about cross-context AI behavior',
    ],
    ai_literacy_objectives: [
      'Question whether AI trained in one context works in another',
      'Apply the Check the Machine protocol to cross-context AI use',
      'Articulate the limits of AI generalizations',
    ],
    assessment: ASSESSMENT('Evidence cites at least two AI generalizations that did not transfer and the context features that made them fail.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '46204-ips::unplugged': {
    grade_band: '5–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · The personalization paradox',
    materials: [
      'Printed fictional student profile (PDF at landing page)',
      'AI-generated personalized learning plan',
      'Team-designed learning plan worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 20, description: 'Teams of 3+ design a learning plan for a fictional student using only the profile data. Document reasoning.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare their plan with the AI-generated plan. Document where personalization helps and where it creates blind spots.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a verdict: in an Innovation Network with multiple school types, when does AI personalization serve students and when does it sort them?' },
    ],
    content_objectives: [
      'Design a learning plan from profile data',
      'Compare personalization approaches',
      'Identify blind spots in algorithmic personalization',
    ],
    ai_literacy_objectives: [
      'Identify what AI personalization captures and misses',
      'Distinguish between supportive and reductive personalization',
      'Articulate when AI sorting harms the students it claims to serve',
    ],
    assessment: ASSESSMENT('Verdict cites at least two specific places personalization helped and two where it created blind spots.'),
  },

  '47713-evsc::tech': {
    grade_band: '5–7', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · River corridor measurement',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Ohio River corridor reference materials',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on campus, treating it as a stand-in for measurements at points along the Ohio River corridor. Document conditions.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to characterize conditions. Compare AI characterization against printed river-corridor reference materials.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class identifies where local river-corridor knowledge serves as a check on AI environmental analysis.' },
    ],
    content_objectives: [
      'Collect environmental data with attention to local geography',
      'Compare AI analysis with regional reference materials',
      'Identify the role of local knowledge in environmental analysis',
    ],
    ai_literacy_objectives: [
      'Position regional knowledge as authoritative reference',
      'Apply the Check the Machine protocol to environmental AI',
      'Articulate when local knowledge improves AI analysis',
    ],
    assessment: ASSESSMENT('Final report cites at least one piece of regional knowledge that improved analysis and the corresponding AI miss.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '47713-evsc::unplugged': {
    grade_band: '5–7', subjects: ['Science', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Local knowledge vs. national models',
    materials: [
      'Printed historical Ohio River flood data (PDF at landing page)',
      'AI flood predictions trained on national data',
      'Local flood-knowledge reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ examine printed historical flood data for the Ohio River corridor. Document patterns the data shows.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare the printed AI flood predictions (trained on national data) with the local historical data. Identify where the AI missed Ohio River specifics.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: when does local knowledge about a specific river system outperform national models? Connect to Evansville families\' multi-generation knowledge.' },
    ],
    content_objectives: [
      'Read regional historical data',
      'Compare local data with national-model predictions',
      'Identify where local knowledge wins',
    ],
    ai_literacy_objectives: [
      'Identify when AI models trained on national data fail locally',
      'Position local generational knowledge as evidence',
      'Articulate when local knowledge should override AI predictions',
    ],
    assessment: ASSESSMENT('Position cites at least two specific Ohio River patterns the national model missed and the local-knowledge source for each.'),
  },

  '46038-hse::tech': {
    grade_band: '8–10', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Future-of-work investigation',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'AI-replaceable-vs-human-only worksheet',
      'Workforce-trend reference cards',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 30, description: 'Teams of 3+ build an AI-assisted data analysis project. Document each step and which steps the AI did and which they did themselves.' },
      { phase: 2, title: 'Categorize', duration_minutes: 30, description: 'Teams categorize the steps: which would AI replace in a workplace, which would remain uniquely human, which would be human-AI collaboration. Document reasoning.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine. Class produces a future-of-work analysis: what skills remain uniquely human as AI tools improve? Connected to Innovation 2028.' },
    ],
    content_objectives: [
      'Build an AI-assisted project end to end',
      'Categorize steps by automation potential',
      'Construct a future-of-work analysis',
    ],
    ai_literacy_objectives: [
      'Identify AI-replaceable versus uniquely human steps',
      'Apply the Check the Machine protocol to AI-assisted workflows',
      'Articulate skills that remain valuable as AI improves',
    ],
    assessment: ASSESSMENT('Future-of-work analysis cites at least three uniquely human skills with reasoning for each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '46038-hse::unplugged': {
    grade_band: '8–10', subjects: ['CTE', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Designing the job that doesn\'t exist yet',
    materials: [
      'Printed AI career-recommendation outputs (PDF at landing page)',
      'Job-design template',
      'Future-skill reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 20, description: 'Teams of 3+ design a job description for a career that does not currently exist but plausibly will in 10 years. Document the skills required.' },
      { phase: 2, title: 'Test', duration_minutes: 15, description: 'Teams evaluate whether the printed AI career-recommendation tool would suggest this job to any student. Identify why the AI cannot see the future.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: what does it tell us about AI career guidance that it cannot recommend the jobs students will actually hold? Connect to HSE\'s Innovation 2028.' },
    ],
    content_objectives: [
      'Construct a job description for a hypothetical future career',
      'Evaluate AI tool coverage',
      'Construct an evidence-based critique',
    ],
    ai_literacy_objectives: [
      'Identify the gap between AI training data and future possibility',
      'Articulate why AI career tools lag behind labor market change',
      'Construct a recommendation about AI in career guidance',
    ],
    assessment: ASSESSMENT('Position names at least one specific future job and explains why the AI tool cannot suggest it.'),
  },

  '46033-ccs-in::tech': {
    grade_band: '8–10', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Evidence vs. pattern matching',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Evidence-vs-pattern reference card',
      'Investigation-design worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Investigate', duration_minutes: 30, description: 'Teams of 3+ conduct a micro:bit-based scientific investigation. Reach evidence-based conclusions; document the chain of reasoning from data to conclusion.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to analyze the same data and reach a conclusion. Document where AI pattern matching produced something that resembled understanding and where it fell short.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine. Class debates: which approach produces more trustworthy results, evidence-based investigation or AI pattern matching? Connect to Carmel\'s substance-over-slogan culture.' },
    ],
    content_objectives: [
      'Conduct a complete evidence-based scientific investigation',
      'Document a chain of reasoning from data to conclusion',
      'Compare investigation with pattern matching',
    ],
    ai_literacy_objectives: [
      'Distinguish pattern matching from understanding',
      'Apply the Check the Machine protocol with rigor',
      'Articulate why evidence-based reasoning produces more trustworthy conclusions',
    ],
    assessment: ASSESSMENT('Final debate position cites at least two specific differences between the team conclusion and the AI conclusion, with reasoning about which is more trustworthy.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '46033-ccs-in::unplugged': {
    grade_band: '8–10', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Courtroom evidence standards for AI',
    materials: [
      'Printed AI-generated claims (PDF at landing page)',
      'Evidence-standard reference cards (beyond reasonable doubt, preponderance of evidence)',
      'Standards-application worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ read printed AI-generated claims. Document what each claim asserts and what evidence (if any) supports it.' },
      { phase: 2, title: 'Apply', duration_minutes: 25, description: 'Teams apply two evidence standards to each claim: would it survive "preponderance of evidence"? Would it survive "beyond reasonable doubt"? Document the reasoning.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces a position: in which contexts should AI claims face which evidence standard? Connect to Carmel\'s intellectual rigor expectations.' },
    ],
    content_objectives: [
      'Apply legal evidence standards to written claims',
      'Compare standards and their implications',
      'Construct a context-appropriate evidence framework',
    ],
    ai_literacy_objectives: [
      'Apply formal evidence standards to AI output',
      'Distinguish standards by stakes and consequences',
      'Articulate when AI claims must clear which bar',
    ],
    assessment: ASSESSMENT('Position cites at least three claims and the standard applied to each, with reasoning grounded in the evidence-standard reference.'),
  },

  '46236-msdlt::tech': {
    grade_band: '5–8', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Adding AI literacy to STEM foundation',
    materials: [
      'micro:bit with sensors (included in kit) — assumed familiar',
      'USB cables and student devices',
      'AI analysis tool access',
      'STEM-integration template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ design a small computational thinking investigation, building on the existing STEM-certified practice. Document the CT moves used.' },
      { phase: 2, title: 'Layer', duration_minutes: 30, description: 'Teams add an AI verification layer to the investigation. Document how the AI literacy moves integrate with the existing CT moves.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces evidence about how AI literacy lays cleanly on top of an existing strong STEM foundation — relevant to Lawrence\'s 8 STEM-certified schools.' },
    ],
    content_objectives: [
      'Design an investigation building on existing CT practice',
      'Integrate AI literacy with established STEM moves',
      'Document the integration explicitly',
    ],
    ai_literacy_objectives: [
      'Add AI verification to existing CT pedagogy',
      'Apply the Check the Machine protocol within STEM-grounded work',
      'Articulate AI literacy as the next layer on a strong foundation',
    ],
    assessment: ASSESSMENT('Final evidence cites at least one CT move and one AI literacy move that integrate, with reasoning about the value added.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '46236-msdlt::unplugged': {
    grade_band: '5–8', subjects: ['Any'], duration_minutes: 60,
    badge: 'No screens · CT integration design',
    materials: [
      'Printed lesson outlines from various subject areas',
      'CT-integration template',
      'Reflection worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Choose', duration_minutes: 15, description: 'Teams of 3+ choose a printed non-STEM subject lesson and identify CT moves that could enhance it without requiring technology.' },
      { phase: 2, title: 'Design', duration_minutes: 25, description: 'Teams redesign the lesson to integrate CT (decomposition, pattern recognition, abstraction, algorithms) using only paper and discussion.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team explains how CT moves transferred. Class produces evidence that CT is a way of thinking — not a technology requirement. Builds on Lawrence Township STEM identity.' },
    ],
    content_objectives: [
      'Identify CT moves in a non-STEM context',
      'Redesign instruction with explicit CT moves',
      'Articulate CT as a portable way of thinking',
    ],
    ai_literacy_objectives: [
      'Recognize that AI literacy depends on the CT foundation',
      'Apply CT moves as a precondition for AI verification',
      'Articulate the relationship between CT and AI literacy',
    ],
    assessment: ASSESSMENT('Redesigned lesson explicitly cites at least three CT moves added, with reasoning for each.'),
  },

  // ============================ MARYLAND ============================

  '20850-mcps::tech': {
    grade_band: '8–10', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Peer review for AI claims',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Peer-review rubric (NIH-style)',
      'Lab notebook and chart paper',
    ],
    procedure: [
      { phase: 1, title: 'Investigate', duration_minutes: 25, description: 'Teams of 3+ design and execute a micro:bit-based experiment with controls and clear hypothesis. Document methodology.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to analyze their data. Document AI claims and the supporting reasoning the AI offers.' },
      { phase: 3, title: 'Review', duration_minutes: 35, description: 'Apply Check the Machine plus a peer-review rubric to AI analysis. Class produces a community-of-researchers-grade verdict on AI evidentiary practice.' },
    ],
    content_objectives: [
      'Design a controlled experiment',
      'Apply peer-review standards to written analysis',
      'Construct an evidence-based critique',
    ],
    ai_literacy_objectives: [
      'Apply peer-review evidentiary standards to AI output',
      'Identify common evidentiary failures in AI claims',
      'Articulate research-grade trust criteria',
    ],
    assessment: ASSESSMENT('Peer-review verdict cites at least three rubric criteria the AI met or failed, each anchored in the AI output.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '20850-mcps::unplugged': {
    grade_band: '8–10', subjects: ['Science', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Lab report peer review',
    materials: [
      'Printed AI-generated lab reports (PDF at landing page)',
      'NIH-style peer-review rubric',
      'Annotation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Read', duration_minutes: 15, description: 'Teams of 3+ read printed AI-generated lab reports critically. Make initial notes on impressions.' },
      { phase: 2, title: 'Apply', duration_minutes: 25, description: 'Teams apply NIH-style peer review: methods, controls, statistical reasoning, conclusions warranted by evidence. Mark up the document.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces a structured reviewer report. Class compiles failure patterns common to AI-generated lab writing — relevant to a community of professional reviewers.' },
    ],
    content_objectives: [
      'Read lab reports critically against an evidence rubric',
      'Identify methodological and statistical issues',
      'Construct a structured reviewer report',
    ],
    ai_literacy_objectives: [
      'Apply professional peer-review standards to AI text',
      'Identify common AI failure modes in scientific writing',
      'Construct evidence-based revision recommendations',
    ],
    assessment: ASSESSMENT('Reviewer report names at least three rubric failures with the AI text quoted as evidence.'),
  },

  '20772-pgcps::tech': {
    grade_band: '6–8', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Equity-evaluating AI in schools',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'School-context cards (different demographics, resource levels)',
      'Equity-comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on campus and pair it with a school-context card describing a different school in the district.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to analyze their data and provide recommendations. Compare AI behavior across the team\'s context and the contrast school context.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus an equity audit. Class produces evidence about where AI supports and where it undermines equitable access — relevant to PGCPS\'s mission.' },
    ],
    content_objectives: [
      'Pair measured data with school context',
      'Compare AI behavior across school contexts',
      'Construct evidence about equity-relevant AI behavior',
    ],
    ai_literacy_objectives: [
      'Identify equity implications of AI behavior across contexts',
      'Apply the Check the Machine protocol to equity-relevant AI claims',
      'Articulate when AI supports versus undermines equity',
    ],
    assessment: ASSESSMENT('Evidence cites at least one specific AI behavior difference between contexts and the equity implication.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '20772-pgcps::unplugged': {
    grade_band: '6–8', subjects: ['Social Studies', 'Math'], duration_minutes: 60,
    badge: 'No screens · The equity audit',
    materials: [
      'Printed AI resource-allocation system output (PDF at landing page)',
      'School demographic data cards',
      'Audit worksheet with equity criteria',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ examine the printed AI system\'s output for resource allocation across schools with different demographics. Document the patterns.' },
      { phase: 2, title: 'Audit', duration_minutes: 15, description: 'Teams apply equity criteria from the audit worksheet. Identify bias patterns and propose specific corrections.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces an audit report with documented bias and proposed corrections. Connected directly to PGCPS\'s equity mission.' },
    ],
    content_objectives: [
      'Read system output for distributional patterns',
      'Apply equity criteria to algorithmic decisions',
      'Construct corrective recommendations',
    ],
    ai_literacy_objectives: [
      'Identify equity bias in algorithmic resource allocation',
      'Apply audit standards to AI systems',
      'Articulate corrective interventions',
    ],
    assessment: ASSESSMENT('Audit report cites at least two specific bias patterns and proposes a concrete correction for each.'),
  },

  '21204-bcps::tech': {
    grade_band: '5–7', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Cross-context generalization test',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Building-context cards (urban, suburban, rural Baltimore County)',
      'Comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect data on campus and pair it with a building-context card describing a different Baltimore County setting.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams query an AI tool to analyze their data using one context, then prompt it to apply the same analysis to the contrast context. Document differences.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces evidence about whether AI analysis transfers across the urban-suburban-rural span of Baltimore County.' },
    ],
    content_objectives: [
      'Collect and document context-paired data',
      'Compare AI analysis across contexts',
      'Identify limits of cross-context generalization',
    ],
    ai_literacy_objectives: [
      'Identify when AI analysis transfers between contexts',
      'Apply the Check the Machine protocol to cross-context generalization',
      'Articulate context-sensitivity criteria',
    ],
    assessment: ASSESSMENT('Evidence cites at least two transfer failures and the context features that produced them.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '21204-bcps::unplugged': {
    grade_band: '5–7', subjects: ['Social Studies', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Does this apply here?',
    materials: [
      'Printed AI recommendations designed for one community type (PDF at landing page)',
      'Local-school context cards',
      'Applicability worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Read', duration_minutes: 15, description: 'Teams of 3+ read printed AI recommendations designed for a specific community type. Note key assumptions.' },
      { phase: 2, title: 'Apply', duration_minutes: 25, description: 'Teams apply the recommendations to their own school context using the worksheet. Identify which transfer cleanly, which need adaptation, and which fail entirely.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces a position: how should districts evaluate whether AI recommendations from one community apply to theirs? Connect to Baltimore County\'s diversity.' },
    ],
    content_objectives: [
      'Read recommendations critically',
      'Evaluate cross-context applicability',
      'Construct a transfer-evaluation framework',
    ],
    ai_literacy_objectives: [
      'Identify embedded assumptions in AI recommendations',
      'Apply context-transfer reasoning to AI outputs',
      'Articulate evaluation criteria for cross-context AI use',
    ],
    assessment: ASSESSMENT('Position cites at least one recommendation that transferred cleanly, one that needed adaptation, and one that failed.'),
  },

  '21401-aacps::tech': {
    grade_band: '7–10', subjects: ['Science', 'Technology'], duration_minutes: 90,
    badge: 'micro:bit radio + AI · Cybersecurity-grade verification',
    materials: [
      'micro:bit with radio capability (included in kit) — paired devices',
      'USB cables and student devices',
      'AI analysis tool access',
      'Noise-introduction protocol cards',
      'Cybersecurity verification reference card',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a micro:bit communication system using radio. Send and receive messages between paired devices and document baseline accuracy.' },
      { phase: 2, title: 'Disrupt', duration_minutes: 30, description: 'Teams introduce noise (interference, partial transmission). Run AI analysis to verify the integrity of received messages. Document where AI catches corruption and where it fails.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply cybersecurity verification principles plus Check the Machine to AI output verification. Class produces a Cyber Command-grade list of AI verification techniques and their limits.' },
    ],
    content_objectives: [
      'Build a working micro:bit communication system',
      'Test the system under controlled disruption',
      'Apply cybersecurity verification principles',
    ],
    ai_literacy_objectives: [
      'Apply cybersecurity verification thinking to AI output',
      'Identify limits of AI verification under noise',
      'Articulate the connection between cybersecurity and AI literacy',
    ],
    assessment: ASSESSMENT('Final list cites at least one AI verification technique that worked, one that failed, and the noise condition for each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '21401-aacps::unplugged': {
    grade_band: '7–10', subjects: ['Math', 'Technology'], duration_minutes: 60,
    badge: 'No screens · Signals and noise verification game',
    materials: [
      'Printed message-verification game cards (PDF at landing page) — authentic and spoofed messages',
      'Verification reasoning worksheet',
      'Cybersecurity-principle reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ receive printed message cards — some authentic, some spoofed. Document initial impressions of each.' },
      { phase: 2, title: 'Verify', duration_minutes: 25, description: 'Teams apply cybersecurity verification principles using only printed evidence and reasoning. Document why each judgment was reached.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces a verdict on each message and explains the reasoning. Class identifies which verification techniques transfer directly to evaluating AI outputs.' },
    ],
    content_objectives: [
      'Apply structured verification reasoning',
      'Distinguish authentic from spoofed messages',
      'Identify verification techniques',
    ],
    ai_literacy_objectives: [
      'Apply cybersecurity verification reasoning to AI outputs',
      'Identify which techniques transfer between domains',
      'Articulate the parallel between message and AI verification',
    ],
    assessment: ASSESSMENT('Verdict cites at least three messages, the reasoning, and the cybersecurity principle applied.'),
  },

  '21202-bcpss::tech': {
    grade_band: '5–8', subjects: ['Science', 'Social Studies'], duration_minutes: 90,
    badge: 'micro:bit + AI · Community-driven block investigation',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Neighborhood reference materials',
      'Community-knowledge inventory worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect data about their own neighborhood — walking routes, transit stops, nearby businesses. Document conditions.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to characterize the neighborhood from the data. Document where AI characterization matches community knowledge and where it falls short.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Each team produces evidence positioning community expertise as a check on AI characterization — aligned with Baltimore\'s self-determination tradition.' },
    ],
    content_objectives: [
      'Collect community-relevant data',
      'Compare AI characterization with lived knowledge',
      'Position community expertise as analytical authority',
    ],
    ai_literacy_objectives: [
      'Identify what AI neighborhood analysis captures and misses',
      'Apply the Check the Machine protocol with community knowledge',
      'Articulate community expertise as ground truth',
    ],
    assessment: ASSESSMENT('Evidence cites at least two specific divergences between AI characterization and community knowledge.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '21202-bcpss::unplugged': {
    grade_band: '5–8', subjects: ['Social Studies', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Our block knows',
    materials: [
      'Printed AI-generated descriptions of Baltimore neighborhoods (PDF at landing page)',
      'Community-knowledge inventory worksheet',
      'Annotation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read printed AI descriptions of Baltimore neighborhoods they know. Annotate where the descriptions feel accurate and where they feel off.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams document specifically what the AI got wrong — facts, framing, or absence — drawing on lived community knowledge.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a written verdict positioning students as the authoritative source on their own neighborhoods. Aligned with Baltimore\'s tradition of community self-determination.' },
    ],
    content_objectives: [
      'Read AI descriptions critically',
      'Identify factual, framing, and absence issues',
      'Position community knowledge as authoritative',
    ],
    ai_literacy_objectives: [
      'Identify AI failure modes for community description',
      'Apply community knowledge as verification',
      'Articulate self-determination as an AI evaluation principle',
    ],
    assessment: ASSESSMENT('Verdict cites at least three specific AI errors per neighborhood and pairs each with community knowledge.'),
  },

  '21042-hcpss::tech': {
    grade_band: '8–10', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Research-grade methodology comparison',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Research methodology reference card',
      'Methodology-comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 30, description: 'Teams of 3+ design a research investigation using micro:bit data. Document the research question, methodology, and predicted findings.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to perform the same investigation. Document the AI\'s methodology — what it asked, what it analyzed, what it concluded.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine. Class compares: what is the difference between asking a research question and querying a model? Designed for one of the most educated communities in the nation.' },
    ],
    content_objectives: [
      'Design a research methodology with explicit reasoning',
      'Compare student methodology with AI methodology',
      'Articulate the difference between research and querying',
    ],
    ai_literacy_objectives: [
      'Identify what AI inquiry methodology lacks',
      'Apply the Check the Machine protocol to AI methodology',
      'Articulate research-grade differences between human and AI inquiry',
    ],
    assessment: ASSESSMENT('Methodology comparison cites at least three specific differences between team and AI approaches.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '21042-hcpss::unplugged': {
    grade_band: '8–10', subjects: ['ELA', 'Science'], duration_minutes: 60,
    badge: 'No screens · Can AI ask good questions?',
    materials: [
      'Printed AI-generated research questions (PDF at landing page)',
      'Question-quality rubric (research-grade)',
      'Question-improvement worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ read printed AI-generated research questions. Make initial impressions of which look investigable.' },
      { phase: 2, title: 'Apply', duration_minutes: 25, description: 'Teams apply a research-grade question-quality rubric. Document which questions meet the bar and which need significant revision.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces an improved version of one weak question. Class compiles common ways AI research questions fall short of research-community standards.' },
    ],
    content_objectives: [
      'Apply a research-grade question-quality rubric',
      'Identify question-design weaknesses',
      'Improve a question through revision',
    ],
    ai_literacy_objectives: [
      'Distinguish research-quality questions from queries',
      'Identify common AI research-question failures',
      'Articulate research-grade question criteria',
    ],
    assessment: ASSESSMENT('Improved question demonstrates clear improvement against the rubric, with the original failure cited.'),
  },

  // ============================ WASHINGTON ============================

  '98134-sps::tech': {
    grade_band: '7–10', subjects: ['Science', 'Technology'], duration_minutes: 90,
    badge: 'micro:bit + AI · Build a classifier from the inside',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'Browser-based ML classifier framework',
      'Engineering-design template',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Train', duration_minutes: 30, description: 'Teams of 3+ design a binary classification problem and train a small classifier using micro:bit sensor data. Document training-data choices.' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams test the classifier on new data. Identify where it succeeds and where it fails systematically.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine to a system the team built. Class produces engineering-side insights — relevant to a community where families build these systems.' },
    ],
    content_objectives: [
      'Design a binary classification task',
      'Train and test a small classifier',
      'Identify systematic failure patterns',
    ],
    ai_literacy_objectives: [
      'Understand AI from the engineering side',
      'Identify how training-data choices shape behavior',
      'Apply the Check the Machine protocol to a system the team built',
    ],
    assessment: ASSESSMENT('Final analysis names training-data choices, test results, and at least two systematic failures linked to training-data limitations.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '98134-sps::unplugged': {
    grade_band: '7–10', subjects: ['Math', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Paper prototype of training data bias',
    materials: [
      'Printed limited training datasets (PDF at landing page)',
      'Rule-design worksheet',
      'Test-data cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 20, description: 'Teams of 3+ create a paper "AI system" by writing classification rules from a limited printed training dataset.' },
      { phase: 2, title: 'Test', duration_minutes: 15, description: 'Teams test their rules against new data cards. Document where the rules succeed and where they produce wrong or unfair results.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team identifies how training-data limitations produced specific biases. Class compiles patterns relevant to a community whose families build production AI systems.' },
    ],
    content_objectives: [
      'Construct classification rules from training data',
      'Test rules against new data',
      'Trace failures to training-data limitations',
    ],
    ai_literacy_objectives: [
      'Identify how training data shapes AI behavior',
      'Distinguish bias from accuracy',
      'Articulate the role of training-data choices in real AI systems',
    ],
    assessment: ASSESSMENT('Final analysis cites at least two specific bias patterns and the training-data limitation that produced each.'),
  },

  '98052-lwsd::tech': {
    grade_band: '8–10', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · The dinner-table explainability test',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Explanation-audience cards (kindergartener, grandparent, city council)',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a micro:bit data project. Use AI for analysis and document the AI\'s decision steps.' },
      { phase: 2, title: 'Explain', duration_minutes: 30, description: 'Each team practices explaining the AI decision to three different audiences (kindergartener, grandparent, city council). Document where the explanation works and where it falls apart.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus an explainability audit. Class produces a Microsoft-corridor-grade insight: explainability is a design problem, not a simplification problem.' },
    ],
    content_objectives: [
      'Build an AI-assisted data project',
      'Practice explaining technical decisions to varied audiences',
      'Identify the design implications of explainability',
    ],
    ai_literacy_objectives: [
      'Distinguish explainability from simplification',
      'Apply the Check the Machine protocol with explainability as a criterion',
      'Articulate explainability as a core AI design problem',
    ],
    assessment: ASSESSMENT('Final insight cites at least three explanation attempts (one per audience) and the design lesson from each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '98052-lwsd::unplugged': {
    grade_band: '8–10', subjects: ['ELA', 'Math'], duration_minutes: 60,
    badge: 'No screens · Explain like I\'m five',
    materials: [
      'Printed complex AI decision case (PDF at landing page)',
      'Audience-specific explanation templates',
      'Peer-feedback worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Read', duration_minutes: 15, description: 'Teams of 3+ read a printed complex AI decision and the available technical explanation.' },
      { phase: 2, title: 'Translate', duration_minutes: 25, description: 'Teams produce three explanations: one for a kindergartener, one for a grandparent, one for a city council member. Document what each version requires.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team explains why explainability is a design problem. Class identifies what makes explanation transferable across audiences. Designed for students whose families discuss ML at dinner.' },
    ],
    content_objectives: [
      'Translate technical content for varied audiences',
      'Identify what each audience requires for understanding',
      'Articulate explainability as a design challenge',
    ],
    ai_literacy_objectives: [
      'Identify explainability as a core AI requirement',
      'Distinguish accurate simplification from misleading simplification',
      'Articulate how design choices affect explainability',
    ],
    assessment: ASSESSMENT('Three explanations are coherent for their respective audiences and preserve the truth of the decision.'),
  },

  '98405-tps-wa::tech': {
    grade_band: '5–8', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Port-city science',
    materials: [
      'micro:bit with environmental sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Tacoma waterfront context cards',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ collect environmental data on or near campus, treating it as a stand-in for waterfront measurements. Document conditions.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to characterize the data and infer about the broader port environment. Compare AI inference against printed waterfront context cards.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces evidence about real-world community data as a foundation for AI thinking — the working waterfront as classroom.' },
    ],
    content_objectives: [
      'Collect data with attention to a community-specific setting',
      'Compare AI inference with community-context references',
      'Construct evidence about local-data foundations for AI',
    ],
    ai_literacy_objectives: [
      'Position community-specific data as the foundation for AI evaluation',
      'Apply the Check the Machine protocol with local context',
      'Articulate when local data improves AI evaluation',
    ],
    assessment: ASSESSMENT('Evidence cites at least one AI inference about the port environment and the local context that supports or refutes it.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '98405-tps-wa::unplugged': {
    grade_band: '5–8', subjects: ['Social Studies', 'Science'], duration_minutes: 60,
    badge: 'No screens · What the ships tell us',
    materials: [
      'Printed shipping data for the Tacoma port (PDF at landing page)',
      'Observational reference cards from waterfront workers',
      'Comparison worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read the printed shipping data. Document patterns the data shows.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare with observational reference cards from waterfront workers. Identify what the workers know that the data does not show.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position about what ground-level observation adds to logistics databases. Connect to Tacoma\'s working waterfront identity.' },
    ],
    content_objectives: [
      'Read shipping data',
      'Compare data with observational knowledge',
      'Construct an evidence-based argument',
    ],
    ai_literacy_objectives: [
      'Identify what AI shipping analysis captures and misses',
      'Position worker observation as authoritative',
      'Articulate the role of ground-level knowledge in AI evaluation',
    ],
    assessment: ASSESSMENT('Position cites at least two patterns workers know that the data omits.'),
  },

  '99201-sps-wa::tech': {
    grade_band: '7–9', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Local industry investigation',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Local industry context cards (health, aerospace, ag-tech)',
      'Investigation-design worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Choose', duration_minutes: 20, description: 'Each team of 3+ chooses a local eastern Washington industry and identifies a real challenge it faces. Document a small investigation using micro:bit data as a stand-in for industry data.' },
      { phase: 2, title: 'Investigate', duration_minutes: 35, description: 'Teams use AI tools to investigate the challenge. Document where AI added value and where local industry expertise would have been needed.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces evidence that STEM careers exist in eastern Washington — and that AI is a tool those careers use, not a replacement for them.' },
    ],
    content_objectives: [
      'Identify a real challenge in a local industry',
      'Investigate using AI tools and document the work',
      'Articulate the role of AI in local careers',
    ],
    ai_literacy_objectives: [
      'Position AI as a career tool requiring expertise',
      'Apply the Check the Machine protocol in industry contexts',
      'Articulate the connection between classroom AI and local careers',
    ],
    assessment: ASSESSMENT('Investigation report cites the industry, the challenge, the AI use, and the human expertise required.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '99201-sps-wa::unplugged': {
    grade_band: '7–9', subjects: ['CTE', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · National models meet regional reality',
    materials: [
      'Printed AI predictions trained on national data (PDF at landing page)',
      'Eastern Washington-specific reference data',
      'Discrepancy worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read printed AI predictions in agriculture, health, or weather based on national data.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare predictions with eastern Washington-specific reference data. Document where national models fail regionally.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a critique: how should regional analysts use AI built on national data? Investigate urban-data bias in training sets.' },
    ],
    content_objectives: [
      'Compare national-model predictions with regional reference data',
      'Identify systematic regional biases',
      'Construct an evidence-based critique',
    ],
    ai_literacy_objectives: [
      'Identify urban-data bias in AI training',
      'Articulate when regional knowledge must override national models',
      'Apply regional context as authoritative evidence',
    ],
    assessment: ASSESSMENT('Critique cites at least three specific regional biases and the local-knowledge source for each.'),
  },

  '98005-bsd::tech': {
    grade_band: '8–10', subjects: ['Science', 'Engineering'], duration_minutes: 90,
    badge: 'micro:bit + AI · Edge-case stress testing',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'Browser-based simple AI system framework',
      'Edge-case design worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 30, description: 'Teams of 3+ build a simple micro:bit AI system that classifies or predicts based on sensor data. Document expected operating range.' },
      { phase: 2, title: 'Stress', duration_minutes: 30, description: 'Teams design edge-case test scenarios deliberately outside expected range. Run the tests and document failures.' },
      { phase: 3, title: 'Improve', duration_minutes: 30, description: 'Apply Check the Machine plus an engineering improvement step. Class produces a list of how the team would harden the system — Eastside-tech-grade QA.' },
    ],
    content_objectives: [
      'Build a working classification or prediction system',
      'Design edge-case tests',
      'Identify and document failure modes',
    ],
    ai_literacy_objectives: [
      'Distinguish a working demo from a reliable system',
      'Apply edge-case stress testing to AI',
      'Articulate engineering-grade reliability criteria',
    ],
    assessment: ASSESSMENT('Hardening list cites at least two specific edge-case failures and the proposed engineering response.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '98005-bsd::unplugged': {
    grade_band: '8–10', subjects: ['Science', 'Engineering'], duration_minutes: 60,
    badge: 'No screens · The edge-case challenge',
    materials: [
      'Printed AI system specifications (PDF at landing page)',
      'Edge-case design worksheet',
      'Failure-mode reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 15, description: 'Teams of 3+ read printed specifications for a well-designed AI system. Note the stated capabilities and assumed operating range.' },
      { phase: 2, title: 'Design', duration_minutes: 25, description: 'Teams identify scenarios that would produce incorrect or harmful outputs and design test cases to expose each failure. Document the reasoning.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team explains why finding failures is itself a design skill. Class compiles patterns from the QA discipline that the surrounding tech community uses professionally.' },
    ],
    content_objectives: [
      'Read system specifications critically',
      'Design edge-case test cases',
      'Articulate failure-finding as a discipline',
    ],
    ai_literacy_objectives: [
      'Apply QA thinking to AI systems',
      'Identify failure modes systematically',
      'Articulate the engineering value of failure discovery',
    ],
    assessment: ASSESSMENT('Test-case design covers at least three distinct failure modes with the reasoning behind each.'),
  },

  // ============================ NORTH CAROLINA ============================

  '27518-wcpss::tech': {
    grade_band: '6–8', subjects: ['Math', 'Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Trajectory pattern analysis',
    materials: [
      'micro:bit with sensors (included in kit) — set up for time-series data',
      'USB cables and student devices',
      'AI analysis tool access',
      'Trajectory-vs-correlation reference card',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect time-series data over the workshop session (or use multi-day sample data) using micro:bit sensors. Document the trajectories.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to identify trajectories and patterns. Document each AI-claimed pattern.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class evaluates which AI patterns reflect understanding and which are spurious correlations — the difference between correlation and understanding that Pathways to Excellence requires.' },
    ],
    content_objectives: [
      'Collect and analyze time-series data',
      'Identify trajectories versus noise',
      'Distinguish correlation from understanding',
    ],
    ai_literacy_objectives: [
      'Identify when AI patterns reflect underlying understanding',
      'Apply the Check the Machine protocol to longitudinal AI claims',
      'Articulate criteria for meaningful pattern detection',
    ],
    assessment: ASSESSMENT('Final analysis cites at least one meaningful trajectory and one spurious correlation, with reasoning.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '27518-wcpss::unplugged': {
    grade_band: '6–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Following AI reasoning, not just answers',
    materials: [
      'Printed AI-generated academic recommendations for fictional students (PDF at landing page)',
      'Reasoning-trace worksheet',
      'Student-perspective reference cards',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read AI-generated academic recommendations and the limited reasoning offered. Trace the reasoning step by step.' },
      { phase: 2, title: 'Investigate', duration_minutes: 15, description: 'Teams compare AI recommendations with what each fictional student would choose for themselves (using student-perspective reference cards). Identify divergences.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a verdict: when does AI pathway recommendation serve the student, and when does it sort the student? Connected to "Pathways to Excellence & Equity."' },
    ],
    content_objectives: [
      'Read recommendations and trace the reasoning',
      'Compare algorithmic with self-determined pathways',
      'Construct an evidence-based recommendation framework',
    ],
    ai_literacy_objectives: [
      'Distinguish AI reasoning from AI answers',
      'Identify when AI pathways diverge from student agency',
      'Articulate when AI recommendations should be a starting point versus a conclusion',
    ],
    assessment: ASSESSMENT('Verdict cites at least two recommendations and the divergence from each student\'s self-determined pathway.'),
  },

  '28217-cms::tech': {
    grade_band: '8–10', subjects: ['Math', 'Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Quantitative reasoning vs. value reasoning',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Financial-context scenario cards',
      'Comparison worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Collect', duration_minutes: 25, description: 'Teams of 3+ collect a small dataset and analyze it for both numerical patterns and contextual meaning.' },
      { phase: 2, title: 'Compare', duration_minutes: 30, description: 'Teams query an AI tool to perform the same analysis. Compare AI output with the team\'s reasoning, paying particular attention to where AI handled the numbers but missed the meaning.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class produces a Charlotte-financial-industry-grade evidence base: AI processes numbers without understanding value, risk, or consequence.' },
    ],
    content_objectives: [
      'Analyze data for both quantitative and contextual meaning',
      'Compare AI analysis with human reasoning',
      'Identify when AI handles numbers but misses meaning',
    ],
    ai_literacy_objectives: [
      'Distinguish AI quantitative processing from value reasoning',
      'Apply the Check the Machine protocol with attention to value',
      'Articulate the limits of AI in decisions involving stakes',
    ],
    assessment: ASSESSMENT('Evidence cites at least two cases where AI handled the math but missed the meaning, with the financial context for each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '28217-cms::unplugged': {
    grade_band: '8–10', subjects: ['Math', 'CTE'], duration_minutes: 60,
    badge: 'No screens · AI financial advice critique',
    materials: [
      'Printed AI-generated financial advice scenarios (PDF at landing page)',
      'Basic financial reasoning reference card',
      'Critique worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Examine', duration_minutes: 20, description: 'Teams of 3+ read printed AI-generated financial advice for fictional scenarios. Document what the advice says and the implied reasoning.' },
      { phase: 2, title: 'Apply', duration_minutes: 15, description: 'Teams apply basic financial reasoning to evaluate the advice — does it account for value, risk, and consequence? Document gaps.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a critique: in what financial decisions can AI process the numbers, and in what decisions must a human do the value reasoning? Connected to Charlotte\'s financial industry.' },
    ],
    content_objectives: [
      'Read financial advice critically',
      'Apply basic financial reasoning',
      'Identify gaps between calculation and decision',
    ],
    ai_literacy_objectives: [
      'Distinguish numerical processing from value-aware reasoning',
      'Apply financial-grade critique to AI advice',
      'Articulate when AI is appropriate financial support',
    ],
    assessment: ASSESSMENT('Critique cites at least two specific gaps in AI financial advice and the value reasoning required to address each.'),
  },

  '27401-gcs::tech': {
    grade_band: '6–8', subjects: ['Science', 'CTE'], duration_minutes: 90,
    badge: 'micro:bit + AI · Physical processes meet data',
    materials: [
      'micro:bit with sensors (included in kit) — multiple sensor types',
      'USB cables and student devices',
      'AI analysis tool access',
      'Manufacturing/logistics scenario cards',
      'Data recording sheet',
    ],
    procedure: [
      { phase: 1, title: 'Measure', duration_minutes: 25, description: 'Teams of 3+ use micro:bit sensors to measure a physical process (motion, temperature change, force). Document the physical reality.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to analyze the data and infer about the physical process. Compare AI inference with what the team observed.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine. Class connects the lesson to Piedmont Triad\'s economic transition — computational thinking as the thread between making things and understanding systems.' },
    ],
    content_objectives: [
      'Measure a physical process with sensors',
      'Compare AI inference with direct observation',
      'Identify the connection between physical and computational thinking',
    ],
    ai_literacy_objectives: [
      'Identify what AI inference about physical processes captures and misses',
      'Apply the Check the Machine protocol with physical observation as ground truth',
      'Articulate computational thinking as a bridge between domains',
    ],
    assessment: ASSESSMENT('Final analysis cites at least one AI inference and the physical observation that supports or refutes it.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '27401-gcs::unplugged': {
    grade_band: '6–8', subjects: ['CTE', 'ELA'], duration_minutes: 60,
    badge: 'No screens · The quality argument',
    materials: [
      'Simple physical objects to evaluate (paper bridge, folded structure, taped joint)',
      'Printed AI image-based quality assessment of the same objects',
      'Quality-evaluation rubric',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 15, description: 'Teams of 3+ examine simple physical objects and write a structured quality evaluation using the rubric.' },
      { phase: 2, title: 'Compare', duration_minutes: 20, description: 'Teams compare their evaluation with a printed AI image-based assessment. Document where the AI caught issues the team missed and where the team caught issues the AI missed.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team produces a position: who caught more issues — the AI or the team? Connected to the Piedmont Triad\'s manufacturing heritage.' },
    ],
    content_objectives: [
      'Evaluate physical objects using a structured rubric',
      'Compare two evaluation approaches',
      'Construct an evidence-based quality argument',
    ],
    ai_literacy_objectives: [
      'Identify what AI image assessment captures and misses',
      'Position direct physical evaluation as a check on AI',
      'Articulate the comparative strengths of human and AI inspection',
    ],
    assessment: ASSESSMENT('Position cites at least two specific issues each method caught that the other missed.'),
  },

  '27105-wsfcs::tech': {
    grade_band: '5–8', subjects: ['Science', 'Engineering'], duration_minutes: 90,
    badge: 'micro:bit + AI · Make-something investigation',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Build materials (cardboard, tape, paper, markers)',
      'Design-process worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Make', duration_minutes: 30, description: 'Teams of 3+ identify a problem and build a micro:bit-based solution. Document the design process and use AI as one tool among several (idea generation, code suggestions, materials list).' },
      { phase: 2, title: 'Test', duration_minutes: 30, description: 'Teams test the solution and use AI to analyze the results. Document where AI added value and where the team\'s own judgment as makers was the better source.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 30, description: 'Apply Check the Machine. Class produces evidence of AI as a tool the maker directs — connected to Winston-Salem\'s innovation-and-making culture.' },
    ],
    content_objectives: [
      'Identify a problem and design a solution',
      'Use AI as one tool in a maker process',
      'Document the design and testing process',
    ],
    ai_literacy_objectives: [
      'Position AI as a directable tool, not an authority',
      'Apply the Check the Machine protocol within a maker workflow',
      'Articulate when maker judgment supersedes AI suggestion',
    ],
    assessment: ASSESSMENT('Documentation cites at least two AI uses and the maker judgment that confirmed or overrode each.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '27105-wsfcs::unplugged': {
    grade_band: '5–8', subjects: ['ELA', 'Engineering'], duration_minutes: 60,
    badge: 'No screens · Maker description vs. AI description',
    materials: [
      'Build materials (paper, tape, cardboard)',
      'Printed AI-generated descriptions from photos of similar objects (PDF at landing page)',
      'Description-quality rubric',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 20, description: 'Teams of 3+ build a simple physical structure and write a detailed description so that another team could rebuild it.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams compare with a printed AI-generated description from a photo of a similar object. Identify what each description captures and misses.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Class evaluates: whose description is more useful for someone trying to rebuild it? Identifies what makers know that observers miss.' },
    ],
    content_objectives: [
      'Build and describe a physical structure',
      'Compare description approaches',
      'Articulate maker knowledge versus observer knowledge',
    ],
    ai_literacy_objectives: [
      'Identify what AI image-based description misses',
      'Position maker knowledge as authoritative',
      'Articulate the comparative value of process description vs. visual description',
    ],
    assessment: ASSESSMENT('Final analysis cites at least three specific things makers know that the AI description missed.'),
  },

  '28306-ccs-nc::tech': {
    grade_band: '6–8', subjects: ['Science', 'Math'], duration_minutes: 90,
    badge: 'micro:bit + AI · Adaptability under condition change',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Condition-change scenario cards',
      'Adaptability-evaluation worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Build', duration_minutes: 25, description: 'Teams of 3+ build a micro:bit data system that works under stable conditions. Document the assumptions.' },
      { phase: 2, title: 'Change', duration_minutes: 30, description: 'Teams introduce condition changes drawn from scenario cards (sensor relocation, environmental shift, time-of-day shift). Run AI analysis as conditions change. Document where the system holds up and where it fails.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus an adaptability audit. Class produces a list of verification habits that travel with the learner — relevant to military-connected students who move frequently.' },
    ],
    content_objectives: [
      'Build a data system with documented assumptions',
      'Test the system under condition changes',
      'Identify what verification habits remain transferable',
    ],
    ai_literacy_objectives: [
      'Identify when AI analysis fails under condition shifts',
      'Apply the Check the Machine protocol to changing contexts',
      'Articulate verification habits that travel across contexts',
    ],
    assessment: ASSESSMENT('Final list cites at least two condition shifts that broke the analysis and the verification habits that transferred.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '28306-ccs-nc::unplugged': {
    grade_band: '6–8', subjects: ['ELA', 'Social Studies'], duration_minutes: 60,
    badge: 'No screens · Decision under incomplete information',
    materials: [
      'Printed situation reports with intentional gaps (PDF at landing page)',
      'AI recommendation packet based on the same incomplete data',
      'Decision-defense worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Decide', duration_minutes: 20, description: 'Teams of 3+ receive a printed situation report with documented gaps. Decide what action to take using only the available information.' },
      { phase: 2, title: 'Compare', duration_minutes: 15, description: 'Teams examine the AI recommendation generated from the same incomplete data. Identify what assumptions the AI filled in.' },
      { phase: 3, title: 'Argue', duration_minutes: 25, description: 'Each team defends their decision and critiques the AI\'s. Connect to the everyday adaptability Fort Liberty families practice.' },
    ],
    content_objectives: [
      'Make a defensible decision under uncertainty',
      'Identify gaps in available information',
      'Compare two reasoning approaches',
    ],
    ai_literacy_objectives: [
      'Identify when AI fills gaps with assumptions',
      'Apply the Check the Machine protocol under uncertainty',
      'Articulate when AI assumption-filling is acceptable',
    ],
    assessment: ASSESSMENT('Defense names the gaps, the team\'s decision, the AI\'s assumptions, and a defensible reason for choosing one over the other.'),
  },

  '27702-dpsnc::tech': {
    grade_band: '8–10', subjects: ['Science'], duration_minutes: 90,
    badge: 'micro:bit + AI · Triangle-grade research evaluation',
    materials: [
      'micro:bit with sensors (included in kit)',
      'USB cables and student devices',
      'AI analysis tool access',
      'Research-evidentiary-standards reference card',
      'Investigation-design worksheet',
    ],
    procedure: [
      { phase: 1, title: 'Design', duration_minutes: 25, description: 'Teams of 3+ design a micro:bit-based investigation with a clear research question, controls, and predicted findings. Document methodology.' },
      { phase: 2, title: 'Analyze', duration_minutes: 30, description: 'Teams query an AI tool to analyze their data and reach conclusions. Document the AI\'s output verbatim.' },
      { phase: 3, title: 'Evaluate', duration_minutes: 35, description: 'Apply Check the Machine plus research-grade evidentiary standards. Each team produces a verdict on the AI\'s output — the standard the Triangle research community sets professionally.' },
    ],
    content_objectives: [
      'Design a controlled investigation with clear methodology',
      'Apply research evidentiary standards to analysis',
      'Construct a research-grade verdict',
    ],
    ai_literacy_objectives: [
      'Apply research-grade standards to AI output',
      'Identify common AI failures under rigorous evidence review',
      'Articulate research community trust criteria',
    ],
    assessment: ASSESSMENT('Verdict cites at least three evidentiary standards the AI met or failed, with the AI output quoted as evidence.'),
    check_the_machine: CHECK_THE_MACHINE,
  },
  '27702-dpsnc::unplugged': {
    grade_band: '8–10', subjects: ['Science', 'ELA'], duration_minutes: 60,
    badge: 'No screens · Literature review of AI summaries',
    materials: [
      'Printed AI-generated research summaries (PDF at landing page)',
      'Original abstracts (printed for comparison)',
      'Annotation worksheet',
      'Chart paper and markers',
    ],
    procedure: [
      { phase: 1, title: 'Read', duration_minutes: 15, description: 'Teams of 3+ read AI-generated research summaries.' },
      { phase: 2, title: 'Compare', duration_minutes: 25, description: 'Teams compare AI summaries against the printed original abstracts. Document what was lost, distorted, or invented.' },
      { phase: 3, title: 'Argue', duration_minutes: 20, description: 'Each team produces a literature-review-grade evaluation. Designed for the Research Triangle, where evaluating research quality is a community skill.' },
    ],
    content_objectives: [
      'Read research summaries critically',
      'Compare summaries against original sources',
      'Construct a literature-review evaluation',
    ],
    ai_literacy_objectives: [
      'Apply literature-review standards to AI summaries',
      'Identify what AI summarization typically loses',
      'Articulate research-grade summary criteria',
    ],
    assessment: ASSESSMENT('Evaluation cites at least three specific issues per summary (loss, distortion, invention) and the original-abstract evidence for each.'),
  },

};

// ---------- Apply ----------

const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));
let updated = 0;
const noBody = [];

for (const code of Object.keys(data.districts)) {
  for (const kind of ['tech', 'unplugged']) {
    const lesson = data.districts[code].lessons?.[kind];
    if (!lesson) continue;
    const body = BODIES[`${code}::${kind}`];
    if (!body) {
      noBody.push(`${code}::${kind}`);
      continue;
    }
    // Replace structural fields. Preserve title, district_framing, distinction,
    // teacher_materials (already authored).
    Object.assign(lesson, body);
    updated++;
  }
}

writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`✓ ${updated} lesson bodies authored across ${Object.keys(data.districts).length} districts`);
if (noBody.length) console.log(`! no body authored for: ${noBody.join(', ')}`);




















