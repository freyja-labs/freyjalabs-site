#!/usr/bin/env node
/**
 * Add teacher_materials blocks to the lessons in pilot districts:
 *   77092-hisd  (Houston ISD)
 *   27518-wcpss (Wake County PS)
 *   90017-lausd (Los Angeles Unified)
 *
 * Idempotent: re-running overwrites the same six lesson teacher_materials
 * objects with the latest authored content.
 *
 * Schema (per lesson):
 *   teacher_materials: {
 *     prior_knowledge: string[]
 *     facilitation_notes: { phase, focus, watch_for }[]
 *     misconceptions: { misconception, response }[]
 *     differentiation: { below_grade, at_grade, above_grade, multilingual_learners }
 *     exit_ticket: { prompt, look_for: string[] }
 *     slide_cues: { slide, title, talking_points: string[] }[]
 *     family_letter: string
 *     standards_alignment: { framework, code, text }[]
 *   }
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTALS = resolve(__dirname, '../src/data/district-portals.json');

// ---------- Shared building blocks reused across lessons ----------

const SHARED = {
  techPriorKnowledge: [
    'Read and create simple data tables and bar/line graphs',
    'Distinguish between an observation (what we measured) and an inference (what we conclude)',
    'Familiarity with one-step variable assignment in block-based or text-based code',
  ],
  unpluggedPriorKnowledge: [
    'Read and discuss informational text in small groups',
    'Cite evidence to support a claim — written or verbal',
    'Familiarity with the difference between a prediction and a confirmed result',
  ],
  techMisconceptions: [
    {
      misconception: '"If the AI says it, it must be right — it has access to all the data."',
      response: 'Show the AI a deliberately wrong dataset and have students predict the (wrong) output. Reinforce: AI confidence ≠ AI correctness. The AI processes whatever input it receives, including noise and bias.',
    },
    {
      misconception: '"Our sensor data is wrong because it doesn\'t match the AI."',
      response: 'Have students re-measure with a second device or different location. The point is that direct measurement is the ground truth — divergence with AI is a signal worth investigating, not an error to "fix."',
    },
    {
      misconception: '"The AI is broken if it gives a different answer to the same question twice."',
      response: 'This is a feature, not a bug. Use it to discuss probabilistic vs. deterministic systems. Two valid outputs can describe the same data — students should learn to ask "what stayed the same?"',
    },
  ],
  unpluggedMisconceptions: [
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
      response: 'Show one of the printed AI examples that contains a confident but factually wrong statement. Hallucinations are a property of how generative models work, not a chatbot quirk.',
    },
  ],
};

// ---------- Per-lesson teacher materials ----------

const TEACHER_MATERIALS = {
  // ============================ HISD ============================
  '77092-hisd': {
    tech: {
      prior_knowledge: SHARED.techPriorKnowledge,
      facilitation_notes: [
        {
          phase: 1,
          focus: 'Resist the urge to standardize sensor placement across teams. Different microclimates (shaded breezeway vs. asphalt yard) make the comparison phase richer. Move between teams every 5 minutes; check that students are recording observations *and* numerical readings.',
          watch_for: 'Teams logging only numbers. Push them to write at least one observation per reading ("breeze picked up", "cloud passed over"). The qualitative notes are the wedge they\'ll use to challenge AI in Phase 3.',
        },
        {
          phase: 2,
          focus: 'Frame the AI tool as a teammate, not an authority. When the AI prediction is wrong, students often default to "we\'ll fix our data." Interrupt that — the goal is to surface where AI and ground-truth diverge, not to reconcile.',
          watch_for: 'Teams that find zero divergence. Either they\'re smoothing data unconsciously, or the AI is generic enough to match anything. Have them pick a single 5-minute window and compare in extreme detail.',
        },
        {
          phase: 3,
          focus: 'The class guidelines are the deliverable. Push for specificity: not "AI is bad at humidity" but "AI underestimates humidity when the ground is wet but the air is dry — like after a Houston morning rain." Local knowledge + data = the trust criteria.',
          watch_for: 'Generic statements ("AI is sometimes wrong"). Reject these gently — every guideline must reference a specific divergence the team observed.',
        },
      ],
      misconceptions: SHARED.techMisconceptions,
      differentiation: {
        below_grade: 'Pre-load the data table with column headers and one example row. Pair with a peer for the AI comparison phase. Provide a sentence frame for the evaluate phase: "We trust the AI when ___ because ___. We don\'t trust it when ___ because ___."',
        at_grade: 'Standard procedure as written.',
        above_grade: 'Add a fourth phase: students design a follow-up experiment that would resolve a specific AI-vs-observation disagreement they found. They write the protocol; they don\'t need to execute it in class.',
        multilingual_learners: 'Provide the Check the Machine protocol in Spanish (translation in the facilitator pack — Houston ISD ELPS-aligned). Encourage code-switching in team discussions; final class guidelines can be authored bilingually. Pair vocabulary cards: sensor / sensor, prediction / predicción, observation / observación, evidence / evidencia.',
      },
      exit_ticket: {
        prompt: 'Describe one moment today when your direct measurement told you something the AI missed. What did you measure, and what should the AI have done differently?',
        look_for: [
          'Specific reference to a measurement (number + unit + location)',
          'Specific reference to what the AI output said',
          'A concrete claim about what the AI should have changed (input, comparison, caveat)',
        ],
      },
      slide_cues: [
        { slide: 1, title: 'What we are doing today', talking_points: ['Collect real data on our campus', 'Compare it with what an AI predicts', 'Decide together when AI is worth trusting'] },
        { slide: 2, title: 'The Check the Machine protocol', talking_points: ['Source · Reasoning · Reality · Yourself', 'You don\'t need to know how the AI works to check its work', 'A protocol, not a checklist — adapt to the situation'] },
        { slide: 3, title: 'Phase 1 — Collect', talking_points: ['Teams of 3 deploy sensors at chosen spots', 'Record at 5-minute intervals for 25 minutes', 'Log a written observation with each reading'] },
        { slide: 4, title: 'Phase 2 — Compare', talking_points: ['Input your data into the AI tool', 'Find at least 3 places it agrees, 3 places it diverges', 'Don\'t correct your data to match the AI'] },
        { slide: 5, title: 'Phase 3 — Evaluate', talking_points: ['Apply Check the Machine to your divergences', 'Present one trust guideline based on what you found', 'Class builds the shared trust framework together'] },
        { slide: 6, title: 'Exit ticket', talking_points: ['One moment when your measurement beat the AI', 'Be specific — number, location, what AI missed'] },
      ],
      family_letter: `Dear families,\n\nThis week your student is learning a skill that will matter for the rest of their lives: how to decide when to trust an AI system.\n\nIn this lesson, students used real sensors to measure temperature, light, and humidity around our school. Then they compared what they measured with what an AI predicted. The point is not that AI is bad — the point is that AI works best when paired with someone who knows the real situation. Your student is learning to be that someone.\n\nWe call the protocol Check the Machine. It has four steps: check the source the AI used, check the reasoning, check the result against reality, and check yourself for what you might have missed. You can use this with your student at home — every time an AI assistant gives you an answer, ask: "How would we check this?"\n\nQuestions? hello@freyjalabs.com\n— Freyja Labs`,
      standards_alignment: [
        { framework: 'TEKS Science 112.18', code: '6.2(E)', text: 'Construct graphs, tables, maps, and charts using tools to organize, examine, and evaluate measurements, data, and information.' },
        { framework: 'TEKS Math 111.26', code: '6.13(A)', text: 'Interpret numeric data summarized in dot plots, stem-and-leaf plots, histograms, and box plots.' },
        { framework: 'TEKS CS 126.15', code: '6.4(A)', text: 'Use technology to analyze data and information from multiple sources to evaluate the validity, accuracy, and reliability of conclusions.' },
        { framework: 'TEKS ELPS', code: '74.4(c)(2)(I)', text: 'Demonstrate listening comprehension of increasingly complex spoken English by collaborating to make inferences and draw conclusions.' },
        { framework: 'CSTA', code: '2-DA-09', text: 'Refine computational models based on the data they have generated.' },
        { framework: 'ISTE Student Standards', code: '3.b — Knowledge Constructor', text: 'Evaluate the accuracy, perspective, credibility, and relevance of information, media, data, or other resources.' },
      ],
    },
    unplugged: {
      prior_knowledge: SHARED.unpluggedPriorKnowledge,
      facilitation_notes: [
        {
          phase: 1,
          focus: 'Print the historical hurricane forecast packets in color so the predicted vs. actual paths are easy to distinguish. Don\'t tell students which forecasts were "right" — let them notice the divergence on their own. Hurricane Harvey (2017) and Ike (2008) work especially well because Houston families know the names.',
          watch_for: 'Teams that pick a "winning" forecast immediately. Slow them down — every forecast was someone\'s best guess at the time. The question is not which was right but how anyone could have known in advance.',
        },
        {
          phase: 2,
          focus: 'This is the hardest phase. Students must investigate WHY a forecast diverged — not just that it did. Provide the supplemental packet with model methodology summaries (cone of uncertainty, ensemble vs. single-model, data sources). Push teams to identify the input that changed the output.',
          watch_for: 'Confusion between "the AI was wrong" and "the model didn\'t have the data it needed." These are different failures. The first is a model problem; the second is a data problem. Naming it correctly is the learning.',
        },
        {
          phase: 3,
          focus: 'Frame the argument around a specific family decision: "Your grandmother lives in Galveston. The forecast says category 3 landfall in 36 hours. Do you tell her to evacuate?" Students must apply Check the Machine to make a defensible recommendation, not a confident guess.',
          watch_for: 'Hedging ("we can\'t really know"). True — but the family has to decide anyway. Push students to commit to a recommendation AND explain what new information would change their mind.',
        },
      ],
      misconceptions: SHARED.unpluggedMisconceptions,
      differentiation: {
        below_grade: 'Reduce to two historical forecasts (one accurate, one significantly off). Provide a graphic organizer with three columns: What the forecast said / What actually happened / What I would tell my family. Students fill the third column with peer support.',
        at_grade: 'Standard procedure as written.',
        above_grade: 'Add a meta-question: students examine how forecasts have IMPROVED over time. Compare a 1990s hurricane forecast with a 2020s one. What changed — the model, the data, the protocol? Connect to ongoing AI improvement.',
        multilingual_learners: 'Forecast packets include bilingual labels. The family decision-making prompt resonates strongly across cultures — encourage students to write the recommendation as if speaking to their actual family in their home language. Conduct the final class discussion in mixed-language pairs with a designated translator role.',
      },
      exit_ticket: {
        prompt: 'A weather AI predicts a hurricane will hit your neighborhood in 48 hours. What three things do you check before you decide whether to evacuate?',
        look_for: [
          'At least one item references the source or input data',
          'At least one item references comparison with prior similar storms',
          'At least one item references a check you\'d perform yourself (call a relative, look at the sky, check official sources)',
        ],
      },
      slide_cues: [
        { slide: 1, title: 'Houston knows hurricanes', talking_points: ['Most of you have been through one', 'Forecasts have saved thousands of lives', 'Forecasts have also been wrong'] },
        { slide: 2, title: 'Two real forecasts', talking_points: ['One was close. One was off by 200 miles.', 'Same era, similar tools, different result. Why?'] },
        { slide: 3, title: 'Phase 1 — Examine', talking_points: ['Read the packet. Note divergences.', 'Don\'t pick a winner yet.'] },
        { slide: 4, title: 'Phase 2 — Investigate', talking_points: ['Why did the forecast diverge?', 'Was it the model, or the data the model had?'] },
        { slide: 5, title: 'Phase 3 — Argue', talking_points: ['Your grandmother lives in Galveston.', 'You make the call. Defend it with evidence.'] },
        { slide: 6, title: 'Exit ticket', talking_points: ['Three things you check before you decide.'] },
      ],
      family_letter: `Dear families,\n\nIn Houston, hurricanes are not abstract. Many of you have made evacuation decisions, sheltered families, or rebuilt after a storm.\n\nThis week your student is learning to evaluate AI weather forecasts the same way an experienced adult would: by checking the source, the reasoning, and how it compares with reality. They\'re working with real historical hurricane data — including storms many of our families remember firsthand.\n\nWe\'d love it if you\'d talk with your student about a storm you remember. What did the forecast say? What did you actually decide? What would have changed your mind? These conversations make the lesson real in ways no slide deck can.\n\nQuestions? hello@freyjalabs.com\n— Freyja Labs`,
      standards_alignment: [
        { framework: 'TEKS Science 112.18', code: '6.3(B)', text: 'Use models to represent aspects of the natural world.' },
        { framework: 'TEKS ELA 110.22', code: '6.7(C)', text: 'Use text evidence to support an appropriate response.' },
        { framework: 'TEKS Social Studies 113.18', code: '6.21(C)', text: 'Organize and interpret information from outlines, reports, databases, and visuals.' },
        { framework: 'TEKS ELPS', code: '74.4(c)(3)(D)', text: 'Speak using grade-level content area vocabulary in context to internalize new English words.' },
        { framework: 'CSTA', code: '2-IC-23', text: 'Describe tradeoffs between allowing information to be public and keeping information private and secure.' },
        { framework: 'ISTE Student Standards', code: '7.c — Global Collaborator', text: 'Contribute constructively to project teams, assuming various roles and responsibilities to work effectively toward a common goal.' },
      ],
    },
  },

  // ============================ WCPSS ============================
  '27518-wcpss': {
    tech: {
      prior_knowledge: SHARED.techPriorKnowledge,
      facilitation_notes: [
        {
          phase: 1,
          focus: 'Wake County\'s magnet program means student rosters often span multiple feeder schools. Use that — group students from different home schools together. Different microclimates between Cary, Apex, and Raleigh sites become natural divergence points in Phase 2.',
          watch_for: 'Teams that pick the same location ("right outside this door"). Push for variety: a covered breezeway, a sunny field, a parking lot. Diversity in collection conditions is the whole point.',
        },
        {
          phase: 2,
          focus: 'Wake students often arrive with strong test-taking habits — they want a "right answer." Reframe: the divergence IS the answer. Reward teams that find subtle, unexpected disagreements over teams that confirm the AI.',
          watch_for: 'Teams that quietly adjust readings to match AI predictions. This is the test-taking habit kicking in. Name it gently and reset.',
        },
        {
          phase: 3,
          focus: 'WCPSS leadership has emphasized "evidence-based" pedagogy across the district. Lean into the language — frame the class trust guidelines as "the evidence we generated today" rather than "what we think." Document with rigor; this is real research methodology in miniature.',
          watch_for: 'Vague guidelines. Every claim must cite a specific data point and a specific AI output. If a team can\'t cite, the guideline doesn\'t make the wall.',
        },
      ],
      misconceptions: SHARED.techMisconceptions,
      differentiation: {
        below_grade: 'Provide a partially-completed data table and a worked example of one phase. Pair with a peer who is at-grade. Sentence frame for the evaluate phase: "Our team trusts the AI for ___ but not for ___ because ___."',
        at_grade: 'Standard procedure as written.',
        above_grade: 'Students design and pitch a "trust score" — a numeric 0-10 score for AI predictions based on the divergence patterns they found. They must justify the formula, not just the number.',
        multilingual_learners: 'Wake County\'s growing multilingual learner population (especially Spanish, Arabic, Burmese) is best served by visual + numeric scaffolds. Use color-coded data tables (green = match, yellow = small divergence, red = large divergence). Encourage discussion in home languages within teams; final class artifacts can be bilingual.',
      },
      exit_ticket: {
        prompt: 'Describe a specific divergence between your data and the AI prediction. What was your evidence, and what should the AI have done differently?',
        look_for: [
          'Specific divergence with a number and unit',
          'Reference to qualitative observation (not just numeric)',
          'A concrete suggestion for what the AI should have changed (input, comparison, caveat)',
        ],
      },
      slide_cues: [
        { slide: 1, title: 'What we are doing today', talking_points: ['Collect real data on our campus', 'Compare with an AI prediction', 'Build evidence-based trust criteria'] },
        { slide: 2, title: 'The Check the Machine protocol', talking_points: ['Source · Reasoning · Reality · Yourself', 'A protocol used by professional analysts', 'Adapt to the situation'] },
        { slide: 3, title: 'Phase 1 — Collect', talking_points: ['Pick locations with VARIETY', 'Log readings and observations together', '25 minutes; 5-minute intervals'] },
        { slide: 4, title: 'Phase 2 — Compare', talking_points: ['AI output is data, not truth', 'Find divergences before agreements', 'Don\'t fix your data to match'] },
        { slide: 5, title: 'Phase 3 — Evaluate', talking_points: ['Your guidelines must cite evidence', 'Specific divergences only', 'The class wall is the deliverable'] },
        { slide: 6, title: 'Exit ticket', talking_points: ['One specific divergence + your evidence'] },
      ],
      family_letter: `Dear families,\n\nThis week your student is learning a skill the NCDPI AI Guidebook calls foundational for every Wake County student: how to decide when an AI prediction is worth trusting.\n\nIn this lesson, students used real sensors to collect environmental data, compared it with AI-generated analysis, and built evidence-based criteria for trust. They are learning to be analysts — not just users.\n\nThe protocol we taught is called Check the Machine: check the source, check the reasoning, check the result against reality, and check yourself. You can use this at home. The next time an AI assistant gives your family an answer, ask your student: "How would we check this?"\n\nQuestions? hello@freyjalabs.com\n— Freyja Labs`,
      standards_alignment: [
        { framework: 'NC Science SCOS', code: '6.E.1.3', text: 'Predict the weather using weather maps and weather symbols.' },
        { framework: 'NC Math SCOS', code: '6.SP.5', text: 'Summarize numerical data sets in relation to their context.' },
        { framework: 'NC CS Standards', code: '6-8.DA.2', text: 'Collect data using computational tools and transform the data to make it more useful and reliable.' },
        { framework: 'NCDPI AI Guidebook', code: 'Pillar 3', text: 'Students evaluate AI outputs using evidence-based criteria.' },
        { framework: 'CSTA', code: '2-DA-09', text: 'Refine computational models based on the data they have generated.' },
        { framework: 'ISTE Student Standards', code: '3.b — Knowledge Constructor', text: 'Evaluate the accuracy, perspective, credibility, and relevance of information, media, data, or other resources.' },
      ],
    },
    unplugged: {
      prior_knowledge: SHARED.unpluggedPriorKnowledge,
      facilitation_notes: [
        {
          phase: 1,
          focus: 'The printed packets contain AI-generated academic recommendations for fictional students with detailed profiles (test scores, course history, attendance, extracurriculars). Real Wake County families navigate magnet, IB, AP, and CTE pathways — students recognize the stakes immediately.',
          watch_for: 'Teams that focus only on "is the recommendation right?" Steer them to "is the REASONING the AI gave actually defensible?" The reasoning is more checkable than the outcome.',
        },
        {
          phase: 2,
          focus: 'Provide the supplemental packet that shows what data the AI had access to vs. what it didn\'t. Often the AI is missing context (a recent family situation, a conversation with a counselor) that would change the recommendation entirely.',
          watch_for: 'Confusion between "AI is biased" (a strong claim requiring evidence) and "AI is incomplete" (almost always true). Help students name which one they\'re seeing in their packet.',
        },
        {
          phase: 3,
          focus: 'The argument is to a fictional principal: should this AI tool be adopted as a recommendation aid for school counselors? Students must commit to yes/no/yes-with-conditions and defend with evidence from their packet.',
          watch_for: 'Teams that won\'t commit. Push them — counselors have to decide whether to use the tool. "It depends" is allowed only if followed by "specifically, on these three things."',
        },
      ],
      misconceptions: SHARED.unpluggedMisconceptions,
      differentiation: {
        below_grade: 'Reduce to two student profiles instead of four. Provide a graphic organizer: AI Recommendation / AI\'s Reasoning / What\'s Missing / My Recommendation. Sentence frames provided for the principal letter.',
        at_grade: 'Standard procedure as written.',
        above_grade: 'Add a policy memo: students draft three rules for when AI academic recommendations should and should not be used in counselor practice. The memo goes to the fictional principal alongside their case-by-case recommendations.',
        multilingual_learners: 'The student profiles in the packet include first-generation students and recent arrivals — relatable contexts for many WCPSS multilingual learners. Encourage students to draw on their own family\'s navigation of US school systems when evaluating whether the AI is "missing context."',
      },
      exit_ticket: {
        prompt: 'An AI tool recommends a specific academic pathway for you. What three things do you check before you accept the recommendation?',
        look_for: [
          'At least one item references the data the AI used (was it complete? recent?)',
          'At least one item references the AI\'s reasoning (does it make sense?)',
          'At least one item references your own knowledge or a trusted person (counselor, family, teacher)',
        ],
      },
      slide_cues: [
        { slide: 1, title: 'Real decisions, real stakes', talking_points: ['Your future course schedule matters', 'Some districts use AI to help recommend pathways', 'Should they?'] },
        { slide: 2, title: 'What we\'re looking at', talking_points: ['Four fictional student profiles', 'AI-generated academic recommendations for each', 'Your job: evaluate the reasoning'] },
        { slide: 3, title: 'Phase 1 — Examine', talking_points: ['Read every recommendation', 'Note what the AI knew and what it didn\'t'] },
        { slide: 4, title: 'Phase 2 — Investigate', talking_points: ['Was the reasoning complete?', 'What context was missing?'] },
        { slide: 5, title: 'Phase 3 — Argue', talking_points: ['Letter to the principal: adopt this tool, yes or no?', 'Defend your position with packet evidence'] },
        { slide: 6, title: 'Exit ticket', talking_points: ['Three things you check before accepting an AI recommendation'] },
      ],
      family_letter: `Dear families,\n\nWake County is one of the largest school districts in the country, and your student will navigate many academic decisions before they graduate: course tracks, magnet programs, IB and AP pathways, CTE strands, college and career options.\n\nThis week your student practiced evaluating AI-generated academic recommendations for fictional students. They learned to ask: what did the AI know? what didn\'t it know? whose voice is missing? Then they made a defensible recommendation of their own.\n\nThis is the same skill they\'ll need every time an algorithm shapes a decision about their future. Talk with them about a decision you made that felt like the data didn\'t see the whole picture. Those stories make the lesson real.\n\nQuestions? hello@freyjalabs.com\n— Freyja Labs`,
      standards_alignment: [
        { framework: 'NC ELA SCOS', code: 'RI.6.8', text: 'Trace and evaluate the argument and specific claims in a text, distinguishing claims that are supported by reasons and evidence from claims that are not.' },
        { framework: 'NC CS Standards', code: '6-8.IC.2', text: 'Discuss issues of bias and accessibility in the design of existing technologies.' },
        { framework: 'NCDPI AI Guidebook', code: 'Pillar 4', text: 'Students examine equity and ethical implications of AI use in education.' },
        { framework: 'CSTA', code: '2-IC-21', text: 'Discuss issues of bias and accessibility in the design of existing technologies.' },
        { framework: 'ISTE Student Standards', code: '5.d — Computational Thinker', text: 'Understand how automation works and use algorithmic thinking to develop a sequence of steps to create and test automated solutions.' },
      ],
    },
  },

  // ============================ LAUSD ============================
  '90017-lausd': {
    tech: {
      prior_knowledge: SHARED.techPriorKnowledge,
      facilitation_notes: [
        {
          phase: 1,
          focus: 'LA microclimates are dramatically different across a single neighborhood — concrete vs. tree canopy vs. proximity to the freeway. Use the variation. Encourage teams to deploy at locations that historically get less attention from city services (alleyways, edge of campus, near transit).',
          watch_for: 'Teams that only deploy in "comfortable" spots. Push them to harder ones. The point is to surface what AI models trained on aggregate city data tend to miss: hyperlocal variation.',
        },
        {
          phase: 2,
          focus: 'Many AI environmental tools are trained on data from wealthier or whiter neighborhoods because that\'s where most monitoring stations historically were placed. This isn\'t a bug to mention in passing — it\'s the lesson. When LAUSD students find divergences, they are doing real environmental justice work.',
          watch_for: 'Teams who notice an AI prediction is "off" but don\'t connect it to bigger patterns. Bridge it: "Why might this AI have less data from your block than from West LA?"',
        },
        {
          phase: 3,
          focus: 'Frame the class trust guidelines explicitly as "guidelines for how the City of Los Angeles should use AI environmental tools." This is real civic work. Students are not just learners — they are stakeholders generating actionable critique.',
          watch_for: 'Cynicism ("AI is just biased, what\'s the point?"). Reframe — knowing the bias is the leverage. Teams who name a specific bias have given the city specific feedback to act on.',
        },
      ],
      misconceptions: SHARED.techMisconceptions,
      differentiation: {
        below_grade: 'Pre-load the data table. Pair with a peer at-grade. Sentence frame: "We trust the AI in our neighborhood when ___ but not when ___ because ___."',
        at_grade: 'Standard procedure as written.',
        above_grade: 'Students draft a one-paragraph open letter to a city council member identifying ONE specific way the AI environmental tool should be improved based on their findings. Include the data point.',
        multilingual_learners: 'LAUSD\'s linguistic diversity (Spanish, Korean, Armenian, Chinese, Vietnamese, and more) is a strength here. Many AI environmental tools were trained on English-only metadata. Encourage students to discuss in their home language and present findings bilingually. The Check the Machine protocol is provided in Spanish; other languages by request.',
      },
      exit_ticket: {
        prompt: 'Describe one moment when your data showed something the AI missed about YOUR neighborhood. What did the AI miss, and what would you tell the city about it?',
        look_for: [
          'Specific neighborhood or location reference',
          'Specific divergence (number + unit + observation)',
          'A concrete recommendation to a civic actor (city, district, AI developer)',
        ],
      },
      slide_cues: [
        { slide: 1, title: 'Your neighborhood is data', talking_points: ['Every environmental AI tool is trained on data', 'Some neighborhoods are over-represented; others under', 'Today we find out which is which'] },
        { slide: 2, title: 'Check the Machine', talking_points: ['Source · Reasoning · Reality · Yourself', 'You don\'t need a CS degree to evaluate an algorithm', 'Local knowledge is the most undervalued data source there is'] },
        { slide: 3, title: 'Phase 1 — Collect', talking_points: ['Deploy in places that get less attention', 'Variation is the goal', 'Numbers AND observations'] },
        { slide: 4, title: 'Phase 2 — Compare', talking_points: ['Find what the AI got wrong about YOUR block', 'Don\'t fix your data to match the AI', 'Divergence is the lesson'] },
        { slide: 5, title: 'Phase 3 — Evaluate', talking_points: ['Build guidelines for how LA should use these tools', 'Specific. Evidence-based. Civic.'] },
        { slide: 6, title: 'Exit ticket', talking_points: ['What the AI missed about YOUR neighborhood'] },
      ],
      family_letter: `Estimadas familias / Dear families,\n\nThis week your student is learning a skill that will matter for the rest of their lives: how to decide when AI tools are trustworthy — and when they\'re missing what makes our neighborhood, our neighborhood.\n\nUsing real sensors, students measured environmental conditions on our campus and compared their findings with what an AI prediction said. They learned that AI tools are often trained on data from places that look different from ours — and that means our voices, our measurements, and our knowledge matter for making these tools better.\n\nThe protocol we taught is called Check the Machine. Use it at home. The next time an AI assistant talks about your neighborhood — weather, traffic, even restaurant recommendations — ask your student: "What might it be missing?"\n\n¿Preguntas? hello@freyjalabs.com\n— Freyja Labs`,
      standards_alignment: [
        { framework: 'CA-NGSS', code: 'MS-ESS3-3', text: 'Apply scientific principles to design a method for monitoring and minimizing a human impact on the environment.' },
        { framework: 'CA-CCSSM', code: '6.SP.5', text: 'Summarize numerical data sets in relation to their context.' },
        { framework: 'CA CS Standards (2018)', code: '6-8.DA.8', text: 'Collect data using computational tools and transform the data to make it more useful and reliable.' },
        { framework: 'CA AB 2876', code: 'AI Literacy', text: 'Students develop the ability to evaluate AI-generated outputs in context.' },
        { framework: 'CSTA', code: '2-IC-22', text: 'Collaborate with many contributors through strategies such as crowdsourcing or surveys when creating a computational artifact.' },
        { framework: 'ISTE Student Standards', code: '7.b — Global Collaborator', text: 'Use collaborative technologies to work with others to examine local and global issues.' },
      ],
    },
    unplugged: {
      prior_knowledge: SHARED.unpluggedPriorKnowledge,
      facilitation_notes: [
        {
          phase: 1,
          focus: 'The packets describe three real LA neighborhoods (e.g., Boyle Heights, Westwood, Watts) using AI-generated descriptions. Some students will live in or adjacent to these neighborhoods. Their lived knowledge IS the comparison standard. Treat it that way explicitly.',
          watch_for: 'Students who feel uncomfortable contradicting "the AI." Affirm strongly: their direct knowledge of their community is more authoritative than any aggregated description. Build the room around that.',
        },
        {
          phase: 2,
          focus: 'Distinguish three types of error: factual error (X is in the description but isn\'t actually there), framing error (description emphasizes one thing while ignoring others), and absence error (something important is left out entirely). Most AI neighborhood descriptions fail in framing and absence, not facts.',
          watch_for: 'Teams that only catch factual errors. Push deeper — what story is the AI telling? Whose perspective is implicit?',
        },
        {
          phase: 3,
          focus: 'The argument is to a developer building a "neighborhood explorer" app for new LA residents. Should this AI description be shown? The students must commit and defend. Frame this as community work — students are advocates for their neighborhoods.',
          watch_for: 'Either-extreme positions ("never use AI" / "always use AI"). Push for nuance: what would the AI need to add, change, or attribute, for the description to be acceptable?',
        },
      ],
      misconceptions: SHARED.unpluggedMisconceptions,
      differentiation: {
        below_grade: 'Reduce to two neighborhood packets. Provide a four-column organizer: What AI says / What I know / Whose voice is missing / My recommendation. Sentence frames provided.',
        at_grade: 'Standard procedure as written.',
        above_grade: 'Students rewrite ONE neighborhood description from scratch in 200 words, drawing on community knowledge. They include a citation note: "what I added that the AI missed and why it matters."',
        multilingual_learners: 'For students whose families navigate LA in Spanish or another non-English language, the AI descriptions almost always miss linguistic and cultural nuance. Encourage these students to identify specifically what the AI missed from a multilingual perspective and to write their rewrite in two languages if they wish.',
      },
      exit_ticket: {
        prompt: 'An AI tool describes your neighborhood to someone who has never been there. What three things should it say that it probably doesn\'t? What three things should it NOT say that it probably does?',
        look_for: [
          'Specific examples (a place, a tradition, a person, a story) — not generalities',
          'A "should NOT say" item that names a stereotype or oversimplification',
          'Evidence the student is drawing on their lived experience or family\'s experience',
        ],
      },
      slide_cues: [
        { slide: 1, title: 'Your neighborhood, your story', talking_points: ['Who gets to describe a place?', 'AI describes places all the time', 'Often badly'] },
        { slide: 2, title: 'What we\'re looking at', talking_points: ['Three real LA neighborhoods', 'AI-generated descriptions of each', 'Your job: evaluate and respond'] },
        { slide: 3, title: 'Phase 1 — Examine', talking_points: ['Read each description carefully', 'Note what feels right and what doesn\'t'] },
        { slide: 4, title: 'Phase 2 — Investigate', talking_points: ['Three error types: factual / framing / absence', 'Which one is the AI making most often?'] },
        { slide: 5, title: 'Phase 3 — Argue', talking_points: ['Letter to the developer', 'Should this description ship? Defend.'] },
        { slide: 6, title: 'Exit ticket', talking_points: ['What it should say that it doesn\'t', 'What it should NOT say that it does'] },
      ],
      family_letter: `Estimadas familias / Dear families,\n\nLA is a city of stories, and your family\'s story is part of what makes our neighborhood what it is. AI tools that describe neighborhoods often miss those stories — and your student is learning to notice that.\n\nThis week we read AI-generated descriptions of three LA neighborhoods, and your student practiced identifying what the AI got right, what it got wrong, and whose voices were missing. They learned to advocate for accurate, full representation of communities like ours.\n\nAt home, ask your student: "How would YOU describe our neighborhood to someone who has never been here?" Their answer is data the AI doesn\'t have — and that\'s the whole point.\n\n¿Preguntas? hello@freyjalabs.com\n— Freyja Labs`,
      standards_alignment: [
        { framework: 'CA ELA Standards', code: 'RI.6.8', text: 'Trace and evaluate the argument and specific claims in a text, distinguishing claims that are supported by reasons and evidence.' },
        { framework: 'CA History-Social Science', code: '6.SL.1', text: 'Engage effectively in collaborative discussions, building on others\' ideas and expressing their own clearly.' },
        { framework: 'CA CS Standards (2018)', code: '6-8.IC.20', text: 'Compare tradeoffs associated with computing technologies that affect people\'s everyday activities.' },
        { framework: 'CA AB 2876', code: 'AI Literacy', text: 'Students examine the social, ethical, and equity implications of AI systems.' },
        { framework: 'CSTA', code: '2-IC-21', text: 'Discuss issues of bias and accessibility in the design of existing technologies.' },
        { framework: 'ISTE Student Standards', code: '2.b — Digital Citizen', text: 'Engage in positive, safe, legal, and ethical behavior when using technology, including social interactions online.' },
      ],
    },
  },
};

const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));
let updated = 0;
for (const [code, lessons] of Object.entries(TEACHER_MATERIALS)) {
  if (!data.districts[code]) {
    console.warn(`! unknown district: ${code}`);
    continue;
  }
  for (const [kind, materials] of Object.entries(lessons)) {
    if (!data.districts[code].lessons[kind]) {
      console.warn(`! ${code} has no ${kind} lesson`);
      continue;
    }
    data.districts[code].lessons[kind].teacher_materials = materials;
    updated++;
    console.log(`✓ ${code} ${kind}`);
  }
}
writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`\nAdded teacher_materials to ${updated} lessons.`);
