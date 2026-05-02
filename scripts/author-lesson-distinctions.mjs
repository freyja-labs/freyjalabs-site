#!/usr/bin/env node
/**
 * Author one "what's new — what wouldn't have happened before this PD"
 * distinction callout per lesson (126 total: tech + unplugged × 63 districts).
 *
 * Each callout is 1-2 sentences naming the specific instructional move the
 * PD enables. Anchored to the district-specific lesson hook (from
 * district_framing) and the documented PD pedagogy (Check the Machine
 * protocol, AI as teammate to challenge, local knowledge as ground truth).
 *
 * Provenance: lesson hooks and local context come from
 * district-details/freyja-labs-prospecting-database-v8.xlsx (already
 * imported into district_framing). The "before" framing is a plausible
 * generalization about typical teacher approaches to AI in the classroom
 * without the PD — explicitly NOT a claim about any specific district's
 * current practice.
 *
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTALS = resolve(__dirname, '../src/data/district-portals.json');

// Each value: { tech: string, unplugged: string }
const DISTINCTIONS = {
  // ============================ OHIO ============================
  '43207-ccs': {
    tech: 'Without the PD, the sensor data and the AI pattern analysis would land as the answer. After: students treat AI as a teammate to challenge, and the 95-language student body brings community knowledge the model cannot access.',
    unplugged: 'Without the PD, an AI prediction about Columbus neighborhoods would be a fact to discuss. After: students role-play as the AI itself, then catch what 104 countries of community knowledge add — knowledge no training set contains.',
  },
  '44114-cmsd': {
    tech: 'Without the PD, the building-environment data would document the classroom. After: students compare AI analysis with their own observation and surface what the model misses about the spaces being redesigned in Building Brighter Futures.',
    unplugged: 'Without the PD, a consolidation map would be a planning document. After: students design a consolidation themselves, run AI on the same data, and confront the question no algorithm can answer — when does community attachment override efficiency?',
  },
  '45219-cps': {
    tech: 'Without the PD, AI workforce projections land as career advice. After: students verify them against Bureau of Labor Statistics data for the Cincinnati metro and learn to treat AI career guidance as a draft, not a destination.',
    unplugged: 'Without the PD, an AI job-matching recommendation reads as a fit. After: students design human interview questions in parallel — and discover what the Three Es (employed, enlisted, enrolled) require that no resume scanner can ask.',
  },
  '43123-swcs': {
    tech: 'Without the PD, AI predictions about a growing community would be the forecast. After: students collect their own sensor data, compare with AI predictions, and learn that change moves faster than the model that predicts it.',
    unplugged: 'Without the PD, an AI population projection would be the plan. After: students predict community needs using only what they observe locally, then identify exactly what the model misses about a fast-growing suburban district.',
  },
  '43035-olsd': {
    tech: 'Without the PD, AI applications in tech-corridor industries would be a career-day topic. After: students build a working classification system themselves and evaluate AI decision-making in contexts their families navigate every workday.',
    unplugged: 'Without the PD, an AI hiring tool ranking would feel impartial. After: students rank the same fictional candidates, surface their own assumptions, and debate which approach actually produced fairer results — a question many of their parents face professionally.',
  },
  '43017-dcsd': {
    tech: 'Without the PD, AI handling of global data would be a vocabulary exercise. After: students collect data, see how AI handles it across cultural and geographic contexts, and identify exactly where the model breaks down in a globally connected community.',
    unplugged: 'Without the PD, an AI translation would read as a translation. After: students examine round-trip translations in their own community languages and see what gets distorted, lost, or fabricated when culture is reduced to tokens.',
  },
  '45011-lkta': {
    tech: 'Without the PD, AI conclusions look like answers worth acting on. After: students compare their own analysis with the AI output and identify where the AI adds value versus where it introduces decision risk — exactly the discipline a fiscally engaged community demands.',
    unplugged: 'Without the PD, an AI budget recommendation would close the debate. After: students build their own argument first, then examine the AI recommendation, and learn to defend their reasoning in a structured public-decision format.',
  },
  '44308-aps': {
    tech: 'Even with five years of AI literacy work in the district, AI remains a moving target. After: students examine AI outputs from 2020 vs. 2026 and trace what changed — the meta-skill that lets early adopters keep their edge as the technology evolves.',
    unplugged: 'Without the PD, comparing AI outputs across years would be a history lesson. After: students name exactly which problems AI fixed, which ones persist, and what that pattern says about which AI claims to trust over time.',
  },
  '43604-tps': {
    tech: 'Without the PD, AI logistics analysis would be a workforce-prep topic. After: students build supply-chain monitoring with their own sensors and evaluate AI recommendations against real-world constraints — the gap between simulation and the working economy.',
    unplugged: 'Without the PD, bad supply-chain data is a story problem. After: students trace how errors cascade through an AI system and design the human checkpoints that prevent the cascade — the same discipline Toledo logistics employers run on.',
  },

  // ============================ TEXAS ============================
  '77092-hisd': {
    tech: 'Without the PD, an AI weather forecast lands as the forecast. After: students measure conditions themselves and learn that local data is the ground truth — the move that matters most when the forecast involves a Houston bayou.',
    unplugged: 'Without the PD, examining historical hurricane forecasts is a data exercise. After: students apply a structured verification protocol to forecasts that affected real Houston families and learn that lived experience of a bayou rising is data no training set contains.',
  },
  '75231-disd': {
    tech: 'Without the PD, AI bias is a slide in a deck. After: students collect community data themselves, see how AI handles different Dallas neighborhoods differently, and produce evidence of bias from data they generated — equity work as classroom practice.',
    unplugged: 'Without the PD, an AI neighborhood description is a description. After: students examine how AI tells the story of their community vs. another, identify whose voice is missing, and build the verification habit equity work depends on.',
  },
  '77065-cfisd': {
    tech: 'Without the PD, "consistent data collection" is a procedure. After: students design the protocol themselves, then evaluate whether AI analysis stays consistent across different classroom environments — the same coherence problem Cy-Fair faces across 90+ campuses.',
    unplugged: 'Without the PD, school averages are summary statistics. After: students calculate the averages themselves and surface what gets hidden — the move that translates directly to evaluating any AI trained on aggregate district data.',
  },
  '78238-nisd': {
    tech: 'Without the PD, designing a sensor system is an engineering exercise. After: students design for a real-world challenge and evaluate AI recommendations against mission requirements — the action-bias of the surrounding military and healthcare workforce, applied to AI.',
    unplugged: 'Without the PD, an "intelligence briefing with gaps" is a worksheet. After: students must decide what action to take with incomplete information, then examine how an AI recommendation engine handles the same gaps — a discipline that travels with them past school.',
  },
  '77494-kisd': {
    tech: 'Without the PD, AI energy modeling reads as the model. After: students collect their own energy-related data, see where AI oversimplifies the physical system, and build the questioning habit students from energy-corridor families recognize from their parents\' work.',
    unplugged: 'Without the PD, AI energy forecasts are projections. After: students build their own predictions from data, compare with AI, and identify exactly where the model loses fidelity to the real system — the same failure mode the local industry watches for.',
  },
  '76107-fwisd': {
    tech: 'Without the PD, the lesson is one more thing to teach during a transition. After: students learn the Check the Machine protocol — a verification habit that travels with them to whatever curriculum, district, or AI tool comes next.',
    unplugged: 'Without the PD, "what your record doesn\'t show" is a discussion topic. After: students examine a fictional academic record and name exactly what an AI infers vs. what a teacher who knows the student would know — a transferable lesson during institutional change.',
  },
  '78704-aisd': {
    tech: 'Without the PD, "evaluating AI claims" is a goal. After: students design experiments — actual experiments with controls — that test whether AI-generated claims about their data hold up. Scientific method meets AI evaluation.',
    unplugged: 'Without the PD, talking about AI limits is a discussion. After: students design a hands-on experiment that produces results an AI cannot predict from prior data — the durable proof that pattern-matching is not understanding.',
  },
  '77479-fbisd': {
    tech: 'Without the PD, AI bias is an abstraction. After: students collect data themselves and examine how AI tools perform across the languages and cultural contexts of their own community — using Fort Bend\'s 130+ languages as the dataset that reveals the bias.',
    unplugged: 'Without the PD, AI translation is a feature. After: students test translations in their family languages without screens — printed AI outputs only — and become the experts on what AI mishandles. The community knowledge IS the curriculum.',
  },

  // ============================ VIRGINIA ============================
  '22042-fcps': {
    tech: 'Without the PD, AI pattern analysis is the analysis. After: students collect data, run AI, and identify what the AI missed that human observation caught — the rigor a community of researchers, engineers, and policymakers will actually respect.',
    unplugged: 'Without the PD, evaluating AI claims is a class discussion. After: students apply a peer-review rubric to AI-generated science summaries and identify unsupported claims, missing evidence, and logical gaps — the same skills they use in their own academic work.',
  },
  '20112-pwcs': {
    tech: 'Without the PD, "using data to understand the community" is a project. After: students collect community data themselves, evaluate AI analysis against their lived experience, and surface where the model misses what they actually know — the kind of deeper thinking Elevate 2030 names as the point.',
    unplugged: 'Without the PD, asking good questions is a writing skill. After: students practice transforming AI-answerable questions into ones requiring human investigation — directly modeling Elevate 2030\'s commitment to expanding opportunity through deeper thinking.',
  },
  '20148-lcps': {
    tech: 'Without the PD, AI is what their parents work on at the data center. After: students build a simple machine-learning classifier themselves, examine its accuracy and biases, and understand AI from the inside — the depth this community has every right to expect.',
    unplugged: 'Without the PD, "explaining AI decisions" is a thought exercise. After: students try to explain real printed AI outputs (loan approval, content recommendation, hiring filter) and discover which decisions they can explain — and which remain opaque even to families who build these systems.',
  },
  '23456-vbcps': {
    tech: 'Without the PD, "trust your data" is a slogan. After: students collect data, compare with AI output, and practice defending their own reasoning when the two disagree — the discipline of trusting your evidence, applied to AI.',
    unplugged: 'Without the PD, the AI vs. human-expert debate is academic. After: students receive conflicting printed claims and must decide which to trust using only the printed evidence — the same self-reliant verification their community values.',
  },
  '23223-hcps': {
    tech: 'Without the PD, AI literacy starts at the beginning. After: students integrate verification into existing CS instruction — a deepening, not an introduction, for a district led by a 2025 VDOE CS Champion.',
    unplugged: 'Without the PD, transferring CS practice is a hope. After: students design a 15-minute AI literacy activity for a colleague in another subject — and the activity itself is the assessment of whether they can transfer what they know.',
  },
  '23322-chesps': {
    tech: 'Without the PD, the question of how to scale CS Champion-level work has no concrete answer. After: students experience the Check the Machine protocol — a transferable verification practice any teacher, regardless of CS background, can adopt.',
    unplugged: 'Without the PD, "scaling what works" is a planning conversation. After: students examine a successful classroom practice and design a transfer plan — confronting the question that defines whether two Champions become a department or a district.',
  },

  // ============================ CALIFORNIA ============================
  '90017-lausd': {
    tech: 'Without the PD, AI environmental analysis lands as the analysis. After: students evaluate whether the AI\'s conclusions match their community\'s lived experience, and learn to use local knowledge as the ground truth — exactly the move AB 2876 will require at scale.',
    unplugged: 'Without the PD, AI neighborhood descriptions are descriptions. After: students examine printed AI descriptions of LA communities they know and identify what the AI got wrong about the places they live in. 420K students means no two neighborhoods are the same — and the model can\'t see most of them.',
  },
  '92103-sdusd': {
    tech: 'Without the PD, AI handling of cross-border data is a translation problem. After: students examine how AI behaves with data from different geographic and linguistic contexts — using San Diego\'s binational identity as the lens that reveals the model\'s blind spots.',
    unplugged: 'Without the PD, "data discontinuities at the border" is a research topic. After: students examine printed data that changes at the US-Mexico border and investigate how AI handles the discontinuity — knowledge San Diego students bring from daily life.',
  },
  '90810-lbusd': {
    tech: 'Without the PD, an AI-identified trend is a trend. After: students track patterns over multiple days and learn to distinguish genuine improvement from statistical artifact — the same honest assessment the Broad Prize culture is built on.',
    unplugged: 'Without the PD, "real or artifact" is a research methodology question. After: students apply the question to printed trend data, then to AI-generated improvement claims, and build a habit of skepticism that doesn\'t crack under positive headlines.',
  },
  '93721-fusd': {
    tech: 'Without the PD, AI agricultural recommendations are guidance. After: students collect soil and environmental data themselves, evaluate AI predictions against the system that feeds the Central Valley, and learn that local knowledge is data the model needs and rarely has.',
    unplugged: 'Without the PD, "whose knowledge counts" is a discussion. After: students compare printed advice from a 30-year local farmer with AI recommendations trained on national data — and develop language for when local knowledge outperforms scale.',
  },
  '95624-egusd': {
    tech: 'Without the PD, AI pattern analysis is the analysis. After: students collect environmental data themselves, evaluate whether AI handles change as well as they do, and build the verification habit that scales as the district keeps changing.',
    unplugged: 'Without the PD, an AI student-recommendation system is a tool. After: students examine a fictional student profile and discuss what an AI recommendation suggests vs. what a teacher who talked to the family would know — a question Elk Grove faces with every new family.',
  },
  '95126-sjusd': {
    tech: 'Without the PD, building an ML classifier is a project. After: students see AI from the engineering side — how systems learn, where they break, what the humans building them need to know — exactly the depth a Silicon Valley community has every right to expect.',
    unplugged: 'Without the PD, the AI vs. human-interviewer debate is conceptual. After: students role-play both sides — AI screener and human interviewer — and discover what each approach reveals and conceals. Many parents have been on both sides; the learning has somewhere to land.',
  },

  // ============================ COLORADO ============================
  '80203-dps': {
    tech: 'Without the PD, the question and the tool are decided for the student. After: students choose their own investigation, treat AI as one resource among several, and direct the work — exactly the agency DPS\'s educator-empowerment culture is designed to grow.',
    unplugged: 'Without the PD, "ask good questions" is a writing skill. After: students choose a community question they care about, design an investigation plan, and discover that the quality of the question determines the quality of any answer — AI included.',
  },
  '80401-jeffco': {
    tech: 'Without the PD, "AI-resistant assessment" is a problem statement. After: students complete a micro:bit investigation, compare their reasoning with AI analysis, and the lesson itself models what AI-resistant assessment looks like — directly extending Andrew Gitner\'s work.',
    unplugged: 'Without the PD, redesigning assessments is a planning task. After: students take a traditional test question and redesign it so original thinking is required even when AI is available — the same problem Jeffco is solving district-wide.',
  },
  '80104-dcsd-co': {
    tech: 'Without the PD, AI is the precision tool. After: students design precision measurement systems themselves, then evaluate whether AI improves or degrades their accuracy — the kind of disciplined questioning a high-expectations community recognizes as substance.',
    unplugged: 'Without the PD, estimation is a math exercise. After: students practice precision estimation with only observation and reasoning, compare with AI predictions, and discover that disciplined human observation often matches algorithmic precision for local, specific questions.',
  },
  '80111-ccsd': {
    tech: 'Without the PD, AI literacy is one more thing to add to a college-prep curriculum. After: students tackle a multidisciplinary problem with sensor data and AI analysis, then write an evidence-based argument about the limits of AI — college-level critical thinking applied to AI.',
    unplugged: 'Without the PD, AI-vs.-student writing is a comparison exercise. After: students compare a printed AI college essay with a student-written one, identify what makes writing distinctly human, and discuss what admissions officers can — and cannot — detect.',
  },
  '80011-aps-co': {
    tech: 'Without the PD, AI bias is a topic. After: students test AI in multiple languages and evaluate performance differences — using their own multilingual community as the dataset that reveals the bias. Aurora\'s 130+ languages aren\'t the variable; they\'re the experiment.',
    unplugged: 'Without the PD, "AI multilingual mishandling" is an article. After: students with multilingual backgrounds evaluate printed AI translations in their home languages and become the authoritative experts. Lived experience IS the verification source.',
  },
  '80501-svvsd': {
    tech: 'Without the PD, AI workplace tools are a CTE topic. After: students design a sensor system for a workplace scenario, evaluate AI recommendations in context, and learn that AI in the workplace requires human judgment — the move St. Vrain\'s career-connected model is built around.',
    unplugged: 'Without the PD, "when to override the algorithm" is a workplace discussion. After: students role-play workplace scenarios where an AI system recommends one action and the employee\'s judgment suggests another — and develop a framework they can carry into actual jobs.',
  },

  // ============================ GEORGIA ============================
  '30024-gcps': {
    tech: 'Without the PD, AI literacy stays inside the Seckinger pathway. After: content-area teachers without an AI background lead hands-on data investigation that delivers AI literacy through their own subject — the move that scales depth beyond the flagship.',
    unplugged: 'Without the PD, "scaling AI literacy" is a logistics question. After: teachers experience the translation challenge themselves — taking deep knowledge and designing how to teach it to someone with no background — the exact problem of going from Seckinger to every school.',
  },
  '30060-ccsd-ga': {
    tech: 'Without the PD, "consistent practice at scale" is a goal. After: teachers across 106,000 students share a structured investigation process any classroom can replicate — the same verification habits everywhere, the same ground truth.',
    unplugged: 'Without the PD, "context shapes interpretation" is a slide. After: teachers see how the same policy plays out in three different school contexts — and confront the same problem AI faces when trained on one context and deployed in another.',
  },
  '30083-dksd': {
    tech: 'Without the PD, AI outputs read as the same regardless of who\'s asking. After: students collect data in their school environment and examine how AI interprets the same data differently depending on context — and learn to ask "whose context?" every time.',
    unplugged: 'Without the PD, "context matters" is an axiom. After: teams receive identical printed datasets but different community context cards (Decatur, Stonecrest, rural DeKalb) and discover how context changes interpretation — the same lesson AI systems need to learn.',
  },
  '30339-fcs': {
    tech: 'Without the PD, AI trained on aggregate data is just AI. After: students examine how models trained on averages mask within-district differences — the gap between an average Fulton student and any actual student in College Park or Alpharetta.',
    unplugged: 'Without the PD, "the average student" is a statistical concept. After: students calculate averages from their own district data and discover the average describes no one who actually exists — directly applicable to any AI trained on the same averages.',
  },
  '30040-fycs': {
    tech: 'Without the PD, AI analysis reads as the analysis. After: students build a monitoring system and evaluate whether AI stays accurate as conditions change — the durability question a research-grade community asks of any claim.',
    unplugged: 'Without the PD, "AI shelf life" is a meta-question. After: students examine printed AI outputs from prior years and evaluate which aged well and which became wrong — building a framework they can apply to today\'s confident AI claims.',
  },

  // ============================ INDIANA ============================
  '46802-fwcs': {
    tech: 'Without the PD, "computing changed manufacturing" is a textbook fact. After: students build a quality-control sensor themselves, evaluate AI-assisted manufacturing analysis, and live the bridge between Fort Wayne\'s industrial heritage and the data-driven economy that\'s arriving.',
    unplugged: 'Without the PD, AI quality inspection is a workplace anecdote. After: students compare their human inspection of printed parts photos against AI inspection results — and discover what each approach catches that the other misses.',
  },
  '46204-ips': {
    tech: 'Without the PD, AI works the same in every classroom — until it doesn\'t. After: students collect data in their specific school context and evaluate whether AI generalizations apply, building the questioning habit that an Innovation Network with multiple school types demands.',
    unplugged: 'Without the PD, "AI personalization" reads as a feature. After: students design a learning plan for a fictional student, examine the AI-generated plan for the same student, and identify where personalization helps — and where it creates blind spots.',
  },
  '47713-evsc': {
    tech: 'Without the PD, AI environmental analysis lands as the answer. After: students measure conditions along the Ohio River corridor with their own sensors and learn that local knowledge of the river is a check the model needs and rarely has.',
    unplugged: 'Without the PD, AI flood predictions are forecasts. After: students analyze printed historical flood data for the Ohio River and investigate when local knowledge about the river outperforms national models — knowledge Evansville families carry across generations.',
  },
  '46038-hse': {
    tech: 'Without the PD, "future jobs" is a career-day topic. After: students build an AI-assisted data project and evaluate what skills remain uniquely human — directly modeling Innovation 2028\'s challenge of preparing for an AI-adjacent workforce.',
    unplugged: 'Without the PD, designing future jobs is a creative-writing exercise. After: students design a job that doesn\'t exist yet and evaluate whether an AI career-recommendation tool would ever suggest it — surfacing the gap between AI\'s training data and tomorrow\'s economy.',
  },
  '46033-ccs-in': {
    tech: 'Without the PD, AI analysis reads as analysis. After: students compare evidence-based scientific conclusions with AI pattern-matching and evaluate which approach produces more trustworthy results — exactly the substance-over-slogan bar Carmel families set.',
    unplugged: 'Without the PD, "evidence standards" is an English-class topic. After: students apply courtroom evidence standards (beyond reasonable doubt, preponderance of evidence) to AI claims — and discover that different standards lead to different conclusions, every time.',
  },
  '46236-msdlt': {
    tech: 'Without the PD, AI literacy starts from zero. After: students integrate AI verification into the existing computational thinking practice that lives in 8 STEM-certified Lawrence schools — adding the next layer to a foundation that\'s already strong.',
    unplugged: 'Without the PD, "computational thinking" is a curriculum standard. After: students design a lesson integrating CT into a non-STEM subject area using only paper and discussion — and discover that CT is a way of thinking, not a technology requirement.',
  },

  // ============================ MARYLAND ============================
  '20850-mcps': {
    tech: 'Without the PD, AI analysis lands as analysis. After: students design experiments with sensor data, then apply peer-review process to AI analysis of their own data — the same evidentiary standard the surrounding community of researchers uses professionally.',
    unplugged: 'Without the PD, peer review is something parents do at work. After: students apply NIH-style criteria to AI-generated lab reports and identify unsupported claims, missing controls, statistical errors — the discipline the surrounding NIH/FDA community runs on.',
  },
  '20772-pgcps': {
    tech: 'Without the PD, AI works the same regardless of school. After: students examine how AI tools perform differently in different school contexts — and produce evidence of where AI supports equity and where it undermines it. Equity work, classroom-level.',
    unplugged: 'Without the PD, an AI resource-allocation system is a black box. After: students examine how a fictional system distributes materials across schools with different demographics, identify the bias, and propose corrections — exactly the equity audit PGCPS\'s mission demands.',
  },
  '21204-bcps': {
    tech: 'Without the PD, AI analysis applies the same way in every building. After: students collect data and evaluate whether AI works the same in Towson, Dundalk, and Catonsville — the context-sensitivity question a geographically diverse county must keep asking.',
    unplugged: 'Without the PD, AI recommendations apply universally. After: students evaluate whether printed AI recommendations designed for one community type apply in their own school — and discover that context transfer is the hardest problem AI faces.',
  },
  '21401-aacps': {
    tech: 'Without the PD, AI verification and cybersecurity verification are different fields. After: students build a micro:bit communication system, introduce noise, and apply cybersecurity principles to AI verification — the connection a Naval Academy / NSA / Cyber Command community grasps immediately.',
    unplugged: 'Without the PD, AI verification is a methodology slide. After: students play a paper-based message-verification game distinguishing authentic from spoofed messages — and recognize that the same logic applies to evaluating any AI output.',
  },
  '21202-bcpss': {
    tech: 'Without the PD, AI describes the neighborhood. After: students collect data about their own block, use AI to analyze it, and evaluate whether the AI\'s conclusions match community knowledge — community expertise as the authoritative check.',
    unplugged: 'Without the PD, AI descriptions of Baltimore neighborhoods read as descriptions. After: students compare those descriptions with their own lived experience and become the authoritative source — the move that aligns with Baltimore\'s tradition of community self-determination.',
  },
  '21042-hcpss': {
    tech: 'Without the PD, AI-generated analysis is a research result. After: students design their own investigation, compare their methodology with AI analysis, and evaluate the difference between asking a question and querying a model — exactly the rigor the surrounding research community expects.',
    unplugged: 'Without the PD, "AI research questions" is a debate topic. After: students evaluate whether AI-generated research questions meet the standard of a good scientific investigation — and practice improving weak ones. The standard is the home environment\'s.',
  },

  // ============================ WASHINGTON ============================
  '98134-sps': {
    tech: 'Without the PD, AI is what their parents build at Amazon, Microsoft, or Boeing. After: students build a simple AI classifier themselves and evaluate its decisions — experiencing the engineering side of AI as a system humans design, not a system that designs itself.',
    unplugged: 'Without the PD, AI bias is something engineers debug. After: students build a paper "AI system" by writing rules from a limited dataset, test it on new data, and discover how training data bias emerges from the ground up — the same pattern their families work to fix.',
  },
  '98052-lwsd': {
    tech: 'Without the PD, AI is fluent for many LWSD students. After: they practice explaining AI decisions in plain language and discover that explainability is a core AI skill — if you cannot explain how AI reached a conclusion, you cannot trust it. Even Microsoft families need this practice.',
    unplugged: 'Without the PD, "explain AI decisions" is a thought exercise. After: students practice explaining a complex AI decision to different audiences (kindergartener, grandparent, city council) and discover explainability is a design problem, not a simplification problem.',
  },
  '98405-tps-wa': {
    tech: 'Without the PD, AI environmental analysis is the data report. After: students measure conditions near the Tacoma waterfront with their own sensors and use that real-world community data as the foundation for AI thinking — port-city science, classroom-level.',
    unplugged: 'Without the PD, shipping data describes the port. After: students analyze printed shipping data and compare with their own observation of port activity — and discover what ground-level observation adds that logistics databases miss.',
  },
  '99201-sps-wa': {
    tech: 'Without the PD, "STEM careers" is a guidance-counselor topic. After: students investigate a local industry challenge with sensor data and AI tools — and see that real STEM careers exist in eastern Washington\'s health, agriculture, and aerospace sectors.',
    unplugged: 'Without the PD, AI predictions match the model. After: students compare AI predictions trained on national data with printed eastern-Washington-specific data — and discover the urban-data bias that bakes into models trained without their region\'s reality.',
  },
  '98005-bsd': {
    tech: 'Without the PD, AI demos look polished. After: students build a working AI system, then stress-test it with edge cases — and discover the difference between a working demo and a reliable system. Bellevue\'s engineering culture knows the difference; now students do too.',
    unplugged: 'Without the PD, finding AI failures is a debugging story. After: students identify scenarios where a well-designed AI system would produce incorrect or harmful outputs and design test cases to expose the failure — the same QA discipline the surrounding tech community runs on.',
  },

  // ============================ NORTH CAROLINA ============================
  '27518-wcpss': {
    tech: 'Without the PD, AI-identified patterns in academic data look meaningful. After: students collect longitudinal data and evaluate whether AI patterns are meaningful or misleading — the difference between correlation and understanding. Pathways to Excellence requires the latter.',
    unplugged: 'Without the PD, an AI academic recommendation is a recommendation. After: students trace the reasoning behind printed AI recommendations for fictional students and evaluate whether the AI\'s pathway is the pathway the student would choose for themselves.',
  },
  '28217-cms': {
    tech: 'Without the PD, AI analysis is analysis. After: students collect data, run AI, and examine how AI handles quantitative reasoning vs. human analysts — and learn that AI processes numbers without understanding value, risk, or consequence. The Charlotte financial industry depends on that distinction.',
    unplugged: 'Without the PD, AI financial advice is advice. After: students examine printed AI-generated financial guidance and evaluate it using basic financial reasoning — discovering that AI processes numbers without understanding value. A banking-capital insight, made concrete.',
  },
  '27401-gcs': {
    tech: 'Without the PD, "computing connects industries" is a textbook claim. After: students measure physical processes with sensors and evaluate AI analysis of manufacturing and logistics data — and live computational thinking as the literal thread the Piedmont Triad\'s economic transition depends on.',
    unplugged: 'Without the PD, AI quality assessment from photos seems credible. After: students examine a physical paper-bridge object themselves, compare with an AI assessment from a photo, and ask: who caught more? The answer is rarely the AI.',
  },
  '27105-wsfcs': {
    tech: 'Without the PD, AI is a tool to use. After: students identify a problem, build a sensor-based solution, and use AI as one tool in their design process — AI as something the maker directs, not a system the maker obeys. Make-something pedagogy meets AI literacy.',
    unplugged: 'Without the PD, an AI description of a built object is descriptive. After: students build something themselves, write their own description, and compare with what AI generates from a photo — and discover that makers know things observers miss.',
  },
  '28306-ccs-nc': {
    tech: 'Without the PD, AI works the same regardless of context. After: students build a sensor system, then test whether it and AI analysis hold up when conditions change — adaptability as the verification practice that travels with military-connected students who move frequently.',
    unplugged: 'Without the PD, "incomplete situation report" is a discussion prompt. After: students must decide what action to take with the gaps, then examine how an AI recommendation system handled the same incomplete data — the daily reality of Fort Liberty families.',
  },
  '27702-dpsnc': {
    tech: 'Without the PD, AI analysis is a result. After: students design their own investigation, use AI for analysis, and evaluate the AI output using research-grade evidentiary standards — exactly the standard the Triangle research community sets for itself professionally.',
    unplugged: 'Without the PD, AI research summaries appear accurate. After: students evaluate AI summaries against the printed original abstracts and identify what was lost, distorted, or invented — the same literature-review discipline the surrounding community brings to actual research.',
  },
};

// ---------- Apply ----------

const data = JSON.parse(readFileSync(PORTALS, 'utf-8'));
let updated = 0;
const missing = [];
for (const [code, kinds] of Object.entries(DISTINCTIONS)) {
  if (!data.districts[code]) { missing.push(code); continue; }
  for (const [kind, distinction] of Object.entries(kinds)) {
    if (!data.districts[code].lessons?.[kind]) continue;
    data.districts[code].lessons[kind].distinction = distinction.trim();
    updated++;
  }
}
const noDistinction = Object.keys(data.districts).filter(c => !DISTINCTIONS[c]);

writeFileSync(PORTALS, JSON.stringify(data, null, 2));
console.log(`✓ ${updated} distinctions written`);
if (missing.length) console.log(`! unknown codes: ${missing.join(', ')}`);
if (noDistinction.length) console.log(`! districts without distinctions: ${noDistinction.join(', ')}`);
