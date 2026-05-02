#!/usr/bin/env node
/**
 * Soften the heavy CRAFT and Check the Machine name-drops across district
 * portal content. The page should feel like a custom-build offer, not a
 * product pitch for a branded framework.
 *
 * Strategy:
 *   - In narrative content (contextNarrative, district_framing, distinction,
 *     procedure descriptions, ai_lit_objectives), replace explicit brand
 *     name-drops with the underlying capability (verification protocol,
 *     design framework, structured practice, etc.).
 *   - Preserve one formal mention per page max — handled by the template
 *     (the lesson.check_the_machine section keeps its name there with a
 *     soft blog link).
 *   - Re-author the CRAFT-mentioning closing sentences in contextNarratives
 *     toward custom-build framing.
 *
 * Idempotent: running twice yields the same result.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTALS = resolve(__dirname, '../src/data/district-portals.json');

// Hand-rewritten replacements for the contextNarrative closing sentences.
// Each narrative ended with a CRAFT-heavy sentence; we replace it with a
// custom-build closer that's specific to the district context.
const CONTEXT_CLOSER_REWRITES = [
  // OHIO — generic Ohio closer
  {
    match: /That's the work Freyja Labs supports — structured time for teachers to explore, build, and develop their own pedagogical approaches, grounded in the CRAFT framework so the practice transfers as tools and contexts change\.$/,
    replace: "That's where Freyja Labs comes in: we custom-build a path with your teachers, designed for what your students need and what your community is already navigating.",
  },
  {
    match: /The CRAFT framework is built for moments like this: a structured way to translate "AI literacy" into something teachers can actually do on a Tuesday in October, with materials they continue to use and adapt as the consolidation unfolds and the technology landscape keeps shifting\.$/,
    replace: "We design with your teachers, not for them — translating policy language into something they can actually do on a Tuesday in October, in the context of the consolidation your community is living through.",
  },
  {
    match: /The CRAFT framework gives Cincinnati teachers a repeatable design process for lessons where students build, test, and verify what AI produces — the kind of pedagogical foundation that holds up as the policy moves into year two and beyond\.$/,
    replace: "Freyja Labs comes in to build that practice with your teachers — custom-designed for Cincinnati students, anchored in the Three Es you've already organized around.",
  },
  {
    match: /The CRAFT framework gives that staff a common language and a repeatable process for designing instruction, so the foundation being built is durable rather than improvised\.$/,
    replace: "We custom-build a shared design practice with your staff — durable rather than improvised, made for the foundation you're laying as the district grows.",
  },
  {
    match: /CRAFT and the Check the Machine protocol are built to do exactly that\.$/,
    replace: "We design that depth with your teachers, custom-built for Olentangy students and the community's expectations.",
  },
  {
    match: /The CRAFT framework gives teachers a structured way to design lessons that meet that bar — instruction grounded in building, testing, and reflection rather than exposure\.$/,
    replace: "We custom-build with your teachers — instruction grounded in building, testing, and reflection rather than exposure, designed for what Dublin families already bring to the conversation.",
  },
  {
    match: /CRAFT is designed for that — a process teachers internalize and continue using long after the workshop ends\.$/,
    replace: "We design something teachers internalize and continue using long after the workshop ends — custom-built with Lakota staff, in the spirit of the district's measured culture.",
  },
  {
    match: /The CRAFT framework and Check the Machine protocol are designed to do that kind of layered work: not introductory exposure, but pedagogical depth for educators who are ready to design instruction at the next level of sophistication\.$/,
    replace: "We meet your teachers where they are — designing the next layer with them, not introducing concepts the district has already operationalized.",
  },
  {
    match: /The CRAFT framework supports that — structured lesson design that makes the connection between classroom work and the regional economy explicit and repeatable\.$/,
    replace: "We co-design that connection between classroom work and the regional economy with your teachers — explicit, custom-built, repeatable.",
  },

  // TEXAS — generic Texas closer
  {
    match: /CRAFT provides the lesson design structure for that work, and the Check the Machine protocol gives Houston students a verification practice they can apply across subjects and tools — durable habits that travel with them past whatever curriculum or AI tool happens to be in use this year\.$/,
    replace: "We co-design that work with your teachers — custom-built for Houston students, anchored in the lived experience your families bring to questions about weather, water, and trust.",
  },
  {
    match: /CRAFT and Check the Machine are designed for that integration — frameworks teachers across math, science, and humanities can apply to their existing instruction and grow with over time\.$/,
    replace: "We custom-build with your teachers across content areas — designing instruction that's recognizably Dallas, recognizably yours, and grows with the staff over time.",
  },
  {
    match: /CRAFT gives Cy-Fair the kind of common pedagogical scaffold that makes consistent practice possible at this scale, while still leaving room for site-level adaptation\.$/,
    replace: "We co-design a shared pedagogical scaffold with Cy-Fair leadership — consistent enough to work across 90+ campuses, custom enough to fit the building you're standing in.",
  },
  {
    match: /CRAFT and the Check the Machine protocol give Northside teachers practices that transfer across the rapidly growing population, from the older campuses to the buildings still being designed\.$/,
    replace: "We custom-build practices with your teachers that transfer across the rapidly growing population — from older campuses to buildings still being designed.",
  },
  {
    match: /CRAFT gives Katy teachers a structured design process for lessons where students build, test, and verify — the kind of work that translates to the careers their parents already do\.$/,
    replace: "We design with your teachers in mind — lessons where students build, test, and verify, custom-built for the careers Katy parents already work in.",
  },
  {
    match: /CRAFT is built for exactly that kind of stability: a transferable design process teachers can carry from year to year regardless of what changes around them\.$/,
    replace: "We co-design a transferable practice with your teachers — something they carry from year to year regardless of what changes around them.",
  },
  {
    match: /CRAFT and Check the Machine are designed for that audience — substance over slogans, materials teachers continue to use, a process they can adapt to their specific students\.$/,
    replace: "We design with that audience in mind: substance over slogans, materials your teachers continue to use, a practice they can adapt to their specific students.",
  },
  // FWISD has CRAFT in the middle of the paragraph — special-case rewrite
  {
    match: /The pedagogical framework that helps most here is the one that holds up across changes in administration, curriculum, and tool selection\. CRAFT is built for exactly that kind of stability: a transferable design process teachers can carry from year to year regardless of what changes around them\. With Texas's CS teacher-shortage designation, building computational thinking capacity across content areas is the realistic path, and Check the Machine gives students a verification practice that doesn't depend on any specific AI tool to remain relevant\.$/,
    replace: "The practice that helps most here is one that holds up across changes in administration, curriculum, and tool selection — a transferable design teachers can carry from year to year regardless of what changes around them. With Texas's CS teacher-shortage designation, building computational thinking capacity across content areas is the realistic path. We co-design that with your teachers — custom-built for Fort Worth, durable through whatever comes next.",
  },
  {
    match: /CRAFT gives Fort Bend teachers a structured way to design instruction that makes that diversity productive, and Check the Machine gives students from any language background a repeatable verification practice they can carry forward\.$/,
    replace: "We co-design with your teachers — custom-built for the 130+ languages Fort Bend students bring, where multilingual lived experience becomes the verification source.",
  },

  // VIRGINIA
  {
    match: /CRAFT supports that transition: a structured lesson design process that helps teachers integrate computational thinking and AI literacy into their existing instruction, with the rigor a community of researchers, engineers, and policymakers will actually respect\.$/,
    replace: "We co-design with Fairfax teachers — custom-built for the rigor a community of researchers, engineers, and policymakers will actually respect.",
  },
  {
    match: /CRAFT gives them a structured design process for that, with materials they continue to use as Elevate 2030 takes shape\.$/,
    replace: "We design with your teachers — custom-built materials they continue to use as Elevate 2030 takes shape.",
  },
  {
    match: /CRAFT and Check the Machine are designed for that level of work\.$/,
    replace: "We design that depth with your teachers — custom-built for Loudoun students who arrive with home contexts most districts cannot assume.",
  },
  {
    match: /CRAFT and Check the Machine are explicitly designed for that\.$/,
    replace: "We co-design with Virginia Beach teachers — building the kind of student responsibility for verification that the surrounding community already values.",
  },
  {
    match: /CRAFT is designed for districts that have moved past introductory exposure: a structured design process for teachers ready to build instruction where computational thinking and AI literacy are part of the rigor, not separate from it\.$/,
    replace: "We design with Henrico's CS leadership — custom-built for teachers ready to build instruction where computational thinking and AI literacy are part of the rigor, not separate from it.",
  },
  {
    match: /CRAFT provides exactly that — a structured lesson design process the Champions and their colleagues can extend across the district, with materials they continue to use and adapt as the SOLs roll out\.$/,
    replace: "We design with the Champions already in your buildings — custom-built so the practice extends across the district, with materials your teachers continue to use as the SOLs roll out.",
  },

  // CALIFORNIA
  {
    match: /CRAFT answers it with a structured lesson design process that treats AI as a context for critical thinking rather than a tool to master, and Check the Machine gives students a verification practice they can apply across the wildly different schools that make up LAUSD\.$/,
    replace: "We co-design with LAUSD teachers — treating AI as a context for critical thinking, not a tool to master, with practices custom-built for the wildly different schools that make up your district.",
  },
  {
    match: /CRAFT gives San Diego teachers a structured design process, and Check the Machine gives students a verification habit that's as relevant in a Spanish-language ELA lesson as it is in a biology lab\.$/,
    replace: "We co-design with San Diego teachers — custom-built across two languages, two cultures, and the binational identity of the community.",
  },
  {
    match: /CRAFT provides the pedagogical structure for that: a design process teachers continue to use long after the workshop ends, treating AI as a context for critical thinking rather than yet another initiative to absorb\.$/,
    replace: "We co-design with Long Beach — building on the institutional muscle that earned the Broad Prize, designed to last past the workshop.",
  },
  {
    match: /CRAFT and Check the Machine give Fresno teachers a structured way to build it in their classrooms, in instruction that respects what students bring and prepares them for the conversations they'll be in for the next 50 years\.$/,
    replace: "We co-design with Fresno teachers — instruction that respects what students bring and prepares them for the conversations they'll be in for the next 50 years.",
  },
  {
    match: /CRAFT is built for moments like this: a pedagogical structure teachers across the growing staff can share, allowing site-level adaptation without losing common practice\. Check the Machine gives students a verification habit that travels with them as they move between buildings and grade bands\.$/,
    replace: "We custom-build with Elk Grove staff — a shared practice teachers across the growing staff can use, with site-level adaptation that doesn't lose coherence as students move between buildings.",
  },
  {
    match: /CRAFT and Check the Machine are designed for that depth\.$/,
    replace: "We design with that bar in mind — custom-built for San Jose teachers and students who arrive with home contexts most districts cannot assume.",
  },

  // COLORADO
  {
    match: /CRAFT is designed for that kind of empowerment-oriented PD — a structured lesson design process that gives teachers a foundation to build on rather than a script to follow\.$/,
    replace: "We design with DPS teachers — custom-built foundations they direct, in the empowerment culture the district has organized around.",
  },
  {
    match: /CRAFT is designed exactly for that work, and Check the Machine gives Gitner's team a concrete verification protocol that pairs naturally with the assessment redesign already underway\.$/,
    replace: "We co-design with Gitner's team — custom-built to pair naturally with the assessment redesign already underway.",
  },
  {
    match: /CRAFT meets the Douglas County bar by giving teachers a substantive lesson design process they continue to use long after the workshop ends, with materials they own and adapt — the kind of investment that earns and keeps that professional respect\.$/,
    replace: "We design with Douglas County teachers — substantive, custom-built, materials your staff own and adapt long after the workshop ends.",
  },
  {
    match: /CRAFT and Check the Machine give Cherry Creek teachers a structured design process and a verification practice for students that meet the depth the community expects, with materials and habits that continue past the workshop\.$/,
    replace: "We co-design with Cherry Creek teachers — meeting the depth the community expects, with materials and practices that continue past the workshop.",
  },
  {
    match: /CRAFT and Check the Machine give Aurora teachers a structured way to build that critical literacy in students, designing instruction where multilingual lived experience is data the AI doesn't have — which is exactly the point\.$/,
    replace: "We co-design with Aurora teachers — custom-built for the 130+ languages your students bring, where multilingual lived experience becomes the data the AI doesn't have.",
  },
  {
    match: /CRAFT pairs well with the Innovation Center's project-based ethos: a structured lesson design process that helps teachers extend classroom-to-industry connection into AI literacy and computational thinking, with verification practices students carry into internships and beyond\.$/,
    replace: "We co-design with St. Vrain — custom-built to extend the Innovation Center's classroom-to-industry connection, with practices students carry into internships and beyond.",
  },

  // GEORGIA
  {
    match: /CRAFT and Check the Machine extend Gwinnett's existing capacity with structured pedagogical practice — the kind of depth that holds up as tools and policy continue to evolve\.$/,
    replace: "We design with Gwinnett's team — extending the lead Seckinger has already built into the rest of the district, custom-built for what your teachers need next.",
  },
  {
    match: /CRAFT provides exactly the kind of structured pedagogical foundation Cobb's stability deserves: a design process teachers across the district can share, with materials and practices that continue past any single workshop\.$/,
    replace: "We co-design with Cobb teachers — custom-built for the stability your district has earned, with practices that continue past any single workshop.",
  },
  {
    match: /CRAFT is built for districts where a one-size-fits-all approach obviously fails: a structured lesson design process teachers across very different schools can apply to their specific students, with Check the Machine giving every classroom — university-prep or rural — the same verification practice for students to learn and own\.$/,
    replace: "We co-design with DeKalb teachers — custom-built for the diversity from Decatur to Stonecrest, where a one-size-fits-all approach obviously fails.",
  },
  {
    match: /CRAFT gives Fulton teachers a pedagogical foundation that adapts to the school they're in — a structured design process flexible enough for differential context without losing the common practice that makes coherent district-wide work possible\.$/,
    replace: "We co-design with Fulton teachers — custom-built to adapt to the school they're in, from College Park to Alpharetta, without losing district-wide coherence.",
  },
  {
    match: /CRAFT is built to meet that bar: a structured lesson design process teachers continue to use, with substance that holds up under the kind of scrutiny Forsyth families bring to it\.$/,
    replace: "We design with Forsyth teachers — custom-built to meet research-grade scrutiny, with substance that holds up under the questions families bring.",
  },

  // INDIANA
  {
    match: /CRAFT helps Fort Wayne teachers develop computational thinking pedagogy they can integrate into their content areas, with materials they continue to use as the regional economy evolves\.$/,
    replace: "We co-design with Fort Wayne teachers — custom-built for the bridge between industrial heritage and the data-driven economy your community is entering.",
  },
  {
    match: /CRAFT is the pedagogical scaffolding that holds across an Innovation Network — common design process at the district level, site adaptation at the school level, materials teachers across both contexts continue to use\.$/,
    replace: "We co-design with IPS — custom-built for the Innovation Network's mix of school types, with materials teachers across both contexts continue to use.",
  },
  {
    match: /CRAFT gives Evansville teachers a structured lesson design process that ties computational thinking to the actual work students will encounter, with Check the Machine providing a verification practice as relevant in healthcare contexts as in manufacturing ones\.$/,
    replace: "We co-design with Evansville teachers — custom-built to tie classroom work to the careers students will actually encounter on the river city's working waterfront.",
  },
  {
    match: /CRAFT pairs naturally with HSE's existing forward orientation: a structured pedagogical process teachers can apply to instruction that meets the community's expectation for substantive innovation rather than performative novelty\.$/,
    replace: "We design with HSE teachers — custom-built to meet the community's expectation for substantive innovation rather than performative novelty.",
  },
  {
    match: /CRAFT clears the Carmel bar by being exactly what the name implies — a structured framework teachers can examine, critique, and use, grounded in research and built for sustained practice rather than seasonal initiative\.$/,
    replace: "We co-design with Carmel teachers — substance over slogans, grounded in research, built for sustained practice rather than seasonal initiative.",
  },
  {
    match: /CRAFT is designed for districts at this stage of maturity: a structured design process for teachers ready to build instruction at the next level of pedagogical sophistication, with the Check the Machine protocol giving students a verification practice that complements an already-strong STEM identity\.$/,
    replace: "We co-design with Lawrence Township — custom-built for teachers ready to build instruction at the next level on top of an already-strong STEM identity.",
  },

  // MARYLAND
  {
    match: /CRAFT and Check the Machine bring the pedagogical structure MCPS specifically needs: a substantive design process teachers can defend in conversations with parents who will ask hard questions and expect real answers\.$/,
    replace: "We co-design with MCPS teachers — custom-built for conversations with parents who will ask hard questions and expect real answers.",
  },
  {
    match: /CRAFT gives PGCPS a pedagogical framework that travels: a structured design process teachers across very different schools can apply to their specific students, with materials and practices that continue past the workshop and reach the classrooms equity demands they reach\.$/,
    replace: "We co-design with PGCPS — custom-built to reach every school, not just the well-resourced ones, with materials and practices that continue past the workshop.",
  },
  {
    match: /CRAFT is built exactly for districts where one approach can't fit everywhere: a structured pedagogical process teachers across very different building contexts can adapt to their specific students, with shared design language that makes district-wide work possible without forcing uniformity that doesn't fit the local reality\.$/,
    replace: "We co-design with Baltimore County teachers — custom-built for the geographic diversity, with shared design language that doesn't force uniformity where it doesn't fit.",
  },
  {
    match: /CRAFT and Check the Machine give Anne Arundel teachers a pedagogical structure that respects the technical sophistication of the surrounding community while building the same disciplined practice in students that the surrounding workforce depends on\.$/,
    replace: "We co-design with Anne Arundel teachers — custom-built to respect the technical sophistication of the Naval Academy / NSA / Cyber Command community surrounding the district.",
  },
  {
    match: /CRAFT is designed for self-determined PD: a structured framework teachers internalize and continue to use, with the agency to adapt it to their students and their communities — exactly the kind of capacity-building that grows from within rather than depending on outside provision\.$/,
    replace: "We co-design with Baltimore City teachers — capacity-building that grows from within, in the tradition of community self-determination the district has built around.",
  },
  {
    match: /CRAFT meets the Howard County bar: a structured pedagogical framework teachers can examine, critique, and adopt because it is grounded in research rather than marketing\. Check the Machine gives students a verification practice that respects their intelligence and prepares them for the conversations they will be in for the rest of their professional lives\.$/,
    replace: "We co-design with Howard County teachers — grounded in research, designed for students who deserve to be respected as intelligent and prepared for the conversations ahead.",
  },

  // WASHINGTON
  {
    match: /CRAFT aligns directly with that approach: a structured design process for teachers to build the human-centered habits the state framework names, with Check the Machine giving Seattle students a concrete verification practice that operationalizes the "Human reflection" stage of H-AI-H in classrooms across all 109 schools\.$/,
    replace: "We co-design with Seattle teachers — custom-built to operationalize Washington's Human-Centered AI framework in classrooms across all 109 schools.",
  },
  {
    match: /CRAFT gives Lake Washington teachers a structured design process for the depth this community demands, and Check the Machine gives students a verification habit that respects their existing fluency while pushing them past it into rigorous evaluation rather than passive use\.$/,
    replace: "We co-design with Lake Washington teachers — custom-built for the depth this Microsoft-corridor community demands, pushing students past consumer-grade fluency into real evaluation.",
  },
  {
    match: /CRAFT is designed to operationalize that across very different building contexts: a structured lesson design process teachers across Tacoma's whole district can use, with Check the Machine giving every student — at SAMi and at every other school — the same verification practice to learn and own\.$/,
    replace: "We co-design with Tacoma teachers — custom-built to serve the whole district, not just the magnet, with practices every student can learn and own.",
  },
  {
    match: /CRAFT gives Spokane teachers a structured design process that ties computational thinking to the careers around them, with Check the Machine providing a verification practice as relevant in clinical settings or aerospace as in agricultural data analysis\.$/,
    replace: "We co-design with Spokane teachers — custom-built to tie classroom work to the health, aerospace, and ag-tech careers students see around them.",
  },
  {
    match: /CRAFT gives Bellevue teachers a structured design process that meets the community's standard, and Check the Machine pushes students past consumer-grade familiarity with AI into the rigorous evaluation practice that the surrounding tech industry actually depends on for its real work\.$/,
    replace: "We co-design with Bellevue teachers — custom-built to meet the Eastside tech community's standard for intellectual depth.",
  },

  // NORTH CAROLINA
  {
    match: /CRAFT gives Wake teachers the lesson design foundation; Check the Machine gives students a concrete verification practice that complements EVERY directly\. Together they help WCPSS build CS capacity that turns into lasting pedagogical practice rather than a course-staffing exercise\.$/,
    replace: "We co-design with Wake teachers — custom-built so CS capacity turns into lasting pedagogical practice, complementing the EVERY framework already in motion.",
  },
  {
    match: /CRAFT helps CMS teachers design lessons where students build the disciplined verification habits the surrounding industry already runs on\. Check the Machine extends the EVERY framework into a student practice they can carry from a classroom into a finance internship a few years later\.$/,
    replace: "We co-design with CMS teachers — custom-built so students develop the verification habits the surrounding banking industry already runs on, extending NCDPI's EVERY framework into student practice.",
  },
  {
    match: /CRAFT gives Guilford teachers a structured lesson design process that connects computational thinking to the actual workforce transition students will navigate, with Check the Machine providing a verification practice as relevant in a logistics dispatch as in a biotech lab\.$/,
    replace: "We co-design with Guilford teachers — custom-built to connect classroom work to the textiles-to-biotech transition students will actually navigate.",
  },
  {
    match: /CRAFT is exactly the kind of make-something pedagogy this culture rewards: teachers leave with lessons they built, materials they own, and a process they continue to use\.$/,
    replace: "We co-design with Winston-Salem/Forsyth teachers — make-something pedagogy that rewards the district's culture of practical creativity.",
  },
  {
    match: /CRAFT is designed for that: a transferable lesson design process that holds up across district moves, curriculum changes, and tool shifts\. North Carolina's CS graduation requirement reaches full implementation in 2026-27 with the NCDPI AI Guidebook and EVERY framework\. Check the Machine gives students the same verification practice whether they're at a Cumberland school this year or a different state's school the next\.$/,
    replace: "We co-design with Cumberland County teachers — practices that travel with military-connected students wherever they go next, anchored in NCDPI's EVERY framework.",
  },
  {
    match: /CRAFT meets the Durham bar by being grounded in 15\+ years of educational research and producing instruction that holds up under the kind of scrutiny Triangle families bring\. Check the Machine gives students an experimental-design-grade verification practice for their own classroom work\.$/,
    replace: "We co-design with Durham teachers — grounded in 15+ years of educational research, designed to hold up under the scrutiny Triangle families bring.",
  },
];

// Lesson body softening — find/replace patterns for procedure descriptions,
// AI literacy objectives, distinctions, district_framings.
const LESSON_REPLACEMENTS = [
  // procedure descriptions — Phase 3 typically opens with "Apply Check the Machine"
  { from: /Apply the Check the Machine protocol to /g, to: 'Apply the verification protocol to ' },
  { from: /Apply Check the Machine plus /g, to: 'Apply the verification protocol plus ' },
  { from: /Apply Check the Machine to /g, to: 'Apply the verification protocol to ' },
  { from: /Apply Check the Machine across /g, to: 'Apply the verification protocol across ' },
  { from: /Apply Check the Machine\./g, to: 'Apply the verification protocol.' },
  { from: /Apply Check the Machine, /g, to: 'Apply the verification protocol, ' },
  { from: /Apply Check the Machine: /g, to: 'Apply the verification protocol: ' },
  { from: /apply Check the Machine to determine /g, to: 'apply the verification protocol to determine ' },
  { from: /apply Check the Machine to recommend /g, to: 'apply the verification protocol to recommend ' },
  { from: /the Check the Machine protocol/g, to: 'the verification protocol' },
  { from: /Check the Machine protocol/g, to: 'verification protocol' },
  { from: /Check the Machine plus /g, to: 'the verification protocol plus ' },
  { from: /Check the Machine \(/g, to: 'the verification protocol (' },
  { from: / plus Check the Machine /g, to: ' plus the verification protocol ' },
  { from: /the Check the Machine moment/g, to: 'the verification moment' },
  { from: /Check the Machine moment/g, to: 'verification moment' },
  // ai_literacy_objectives — "Apply the Check the Machine protocol to ..."
  { from: /Apply the verification protocol to evaluate AI pattern-analysis output/g, to: 'Apply structured verification practice to evaluate AI output' },
  { from: /Apply the verification protocol to /g, to: 'Apply structured verification practice to ' },
  { from: /the verification protocol within /g, to: 'a structured verification practice within ' },
  { from: /the verification protocol with /g, to: 'a structured verification practice with ' },
  // contextNarrative inline mentions (NISD-style)
  { from: /the verification habits CRAFT builds are/g, to: 'the verification habits we build with your teachers are' },
  // teacher_materials sweeps — slide cues, family letters, materials lists
  { from: /Check the Machine reference card/g, to: 'Verification protocol reference card' },
  { from: /Check the Machine — without the machine/g, to: 'Verification protocol — without the machine' },
  { from: /a four-part protocol called Check the Machine/g, to: 'a four-part verification protocol' },
  { from: /a protocol called Check the Machine/g, to: 'a verification protocol' },
  { from: /protocol called Check the Machine/g, to: 'verification protocol' },
  { from: /Check the Machine works in any language/g, to: 'The verification protocol works in any language' },
  { from: /The Check the Machine protocol/g, to: 'The verification protocol' },
  { from: /Check the Machine to your divergences/g, to: 'the verification protocol to your divergences' },
  { from: /Apply Check the Machine/g, to: 'Apply the verification protocol' },
  { from: /We call the protocol Check the Machine/g, to: 'We call the protocol the verification protocol' },
  { from: /\bCheck the Machine\b/g, to: 'the verification protocol' },
];

const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));
let contextRewrites = 0;
let lessonReplacements = 0;
const unmatchedNarratives = [];

for (const code of Object.keys(data.districts)) {
  const dist = data.districts[code];

  // 1) Context narrative closer rewrites
  const cn = dist.contextNarrative;
  if (cn) {
    let rewritten = cn;
    for (const { match, replace } of CONTEXT_CLOSER_REWRITES) {
      if (match.test(rewritten)) {
        rewritten = rewritten.replace(match, replace);
      }
    }
    if (rewritten !== cn) {
      dist.contextNarrative = rewritten;
      contextRewrites++;
    } else if (cn.includes('CRAFT')) {
      unmatchedNarratives.push(code);
    }
  }

  // 2) Lesson content sweep — apply LESSON_REPLACEMENTS to procedure
  // descriptions, ai_literacy_objectives, distinction, district_framing.
  for (const kind of ['tech', 'unplugged']) {
    const lesson = dist.lessons?.[kind];
    if (!lesson) continue;
    const apply = (s) => {
      if (typeof s !== 'string') return s;
      let result = s;
      for (const { from, to } of LESSON_REPLACEMENTS) result = result.replace(from, to);
      return result;
    };
    if (lesson.procedure) {
      lesson.procedure = lesson.procedure.map(p => {
        const before = p.description;
        p.description = apply(p.description);
        if (p.description !== before) lessonReplacements++;
        return p;
      });
    }
    if (lesson.ai_literacy_objectives) {
      const before = JSON.stringify(lesson.ai_literacy_objectives);
      lesson.ai_literacy_objectives = lesson.ai_literacy_objectives.map(apply);
      if (JSON.stringify(lesson.ai_literacy_objectives) !== before) lessonReplacements++;
    }
    if (lesson.distinction) {
      const before = lesson.distinction;
      lesson.distinction = apply(lesson.distinction);
      if (lesson.distinction !== before) lessonReplacements++;
    }
    if (lesson.district_framing) {
      const before = lesson.district_framing;
      lesson.district_framing = apply(lesson.district_framing);
      if (lesson.district_framing !== before) lessonReplacements++;
    }
  }

  // Sweep contextNarrative one more time for inline lesson-style replacements
  if (dist.contextNarrative) {
    const before = dist.contextNarrative;
    let after = before;
    for (const { from, to } of LESSON_REPLACEMENTS) after = after.replace(from, to);
    if (after !== before) {
      dist.contextNarrative = after;
      contextRewrites++;
    }
  }

  // Sweep teacher_materials too — slide cues, family letters, differentiation,
  // and materials lists often contain "Check the Machine".
  for (const kind of ['tech', 'unplugged']) {
    const tm = dist.lessons?.[kind]?.teacher_materials;
    if (!tm) continue;
    const apply = (s) => {
      if (typeof s !== 'string') return s;
      let result = s;
      for (const { from, to } of LESSON_REPLACEMENTS) result = result.replace(from, to);
      return result;
    };
    // Differentiation
    if (tm.differentiation) {
      for (const k of Object.keys(tm.differentiation)) {
        tm.differentiation[k] = apply(tm.differentiation[k]);
      }
    }
    // Family letter
    if (tm.family_letter) tm.family_letter = apply(tm.family_letter);
    // Slide cues
    if (tm.slide_cues) {
      tm.slide_cues = tm.slide_cues.map(s => ({
        ...s,
        title: apply(s.title),
        talking_points: (s.talking_points || []).map(apply),
      }));
    }
    // Facilitation notes
    if (tm.facilitation_notes) {
      tm.facilitation_notes = tm.facilitation_notes.map(n => ({
        ...n,
        focus: apply(n.focus),
        watch_for: apply(n.watch_for),
      }));
    }
    // Exit ticket
    if (tm.exit_ticket) {
      tm.exit_ticket.prompt = apply(tm.exit_ticket.prompt);
      tm.exit_ticket.look_for = (tm.exit_ticket.look_for || []).map(apply);
    }
    // Misconceptions
    if (tm.misconceptions) {
      tm.misconceptions = tm.misconceptions.map(m => ({
        ...m,
        misconception: apply(m.misconception),
        response: apply(m.response),
      }));
    }
    // Prior knowledge
    if (tm.prior_knowledge) {
      tm.prior_knowledge = tm.prior_knowledge.map(apply);
    }
  }

  // Sweep materials lists across both lessons (often have "Check the Machine reference card")
  for (const kind of ['tech', 'unplugged']) {
    const lesson = dist.lessons?.[kind];
    if (!lesson?.materials) continue;
    lesson.materials = lesson.materials.map(m => {
      let result = m;
      for (const { from, to } of LESSON_REPLACEMENTS) result = result.replace(from, to);
      return result;
    });
  }
}

writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`✓ ${contextRewrites} contextNarrative closers rewritten`);
console.log(`✓ ${lessonReplacements} lesson content replacements applied`);
if (unmatchedNarratives.length) {
  console.log(`! contextNarratives still containing CRAFT (no rewrite pattern matched): ${unmatchedNarratives.join(', ')}`);
}
