# CLAUDE.md — Freyja Labs Website

## Project Overview

Build the production website for **Freyja Labs** (Freyja Laboratory LLC), a national consulting firm delivering customized, hands-on professional development to school districts, schools, and organizations. The site lives at **freyjalabs.com** and is backed by a GitHub repository with automated deployment.

The founders are Mike Borowczak, Ph.D. (hardware security researcher, engineering educator) and Andrea C. Burrows Borowczak, Ph.D. (STEM education scholar, teacher preparation specialist). The brand is fully independent of their university affiliations — do not reference UCF, DRACO Lab, or any institutional affiliation in the site content.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Astro** (latest stable) | Content-driven, zero JS by default, markdown-first, fast builds |
| Styling | **Tailwind CSS v4** | Utility-first, design token consistency, rapid iteration |
| Content | **Astro Content Collections** (Markdown/MDX) | Type-safe, file-based content that non-developers can edit |
| Forms | **Formspree** | Zero-backend contact form |
| Deployment | **GitHub Pages** via GitHub Actions | Auto-deploy on push to `main` |
| Domain | `freyjalabs.com` (already owned) | DNS configured to point at GitHub Pages |

### Why Astro over Jekyll/Hugo/Next.js

- Mike has Jekyll experience (DRACO Lab site) but Astro is a strict upgrade: same file-based content model, faster builds, component islands for any interactive elements, and native Tailwind integration without plugin wrestling.
- No React runtime shipped to the client unless explicitly opted in via `client:load` directive.
- Content Collections give type-safe frontmatter validation — catches broken metadata at build time, not in production.

---

## Brand Design System

### Color Palette

```css
/* Design tokens — map to Tailwind config */
--forest:       #3D6B4F;   /* Primary — headings, CTAs, brand mark */
--forest-dark:  #2A4E38;   /* Hover states */
--forest-light: #5A8E6D;   /* Subtle accents, tags */
--earth:        #6B5B3E;   /* Secondary — subheadings, warm accents */
--earth-light:  #8A7A5C;   /* Secondary hover */
--clay:         #9E7E5A;   /* Tertiary decorative */
--sand:         #D4C5A9;   /* Decorative, pull-quotes */
--cream:        #FAF7F2;   /* Page background */
--warm-white:   #FFFEF9;   /* Card/section backgrounds */
--ink:          #1C1C1C;   /* Body text */
--muted:        #5A5A5A;   /* Secondary text */
--faded:        #8A8A8A;   /* Captions, metadata */
--border:       #DDD5C8;   /* Borders, dividers */
```

### Typography

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| Display / Headings | Cormorant Garamond | 400, 500, 600 | Georgia, serif |
| Body / UI | Outfit | 300, 400, 500, 600 | system-ui, sans-serif |
| Code / Labels | JetBrains Mono | 400, 500 | monospace |

Load via Google Fonts with `font-display: swap`. Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`.

### Visual Direction

**Warm academic.** Approachable, earthy, professional. The aesthetic evokes natural materials — forest, clay, sand, aged paper — grounded in the physical world even when the content is digital. Design should feel like a well-made field journal, not a SaaS landing page.

Key principles:
- **No generic AI aesthetics.** No purple gradients, no Inter font, no cookie-cutter hero sections with stock photos.
- **Generous whitespace.** Let the content breathe. The site should feel calm and confident.
- **Subtle texture.** Light grain overlays, organic border radii, warm shadows. Nothing glossy.
- **Motion with restraint.** Fade-in on scroll, gentle hover states. No parallax, no particle effects, no gratuitous animation.
- **Serif headings, sans body.** The serif/sans pairing communicates established authority alongside modern clarity.

### Brand Mark

The brand mark is the word "Freyja Labs" set in Cormorant Garamond, weight 600, color `--forest`. No icon/logomark at launch — the wordmark is the brand. If an icon is needed later, the concept is a **meristem** (plant growth tip) — a stylized botanical node suggesting growth, branching, and the origin point of new development.

### Tagline

> Where growth begins.

---

## Site Architecture

```
/                     → Home (landing page)
/about                → About — founders, philosophy, story
/services             → Services overview
/services/[slug]      → Individual service detail pages
/approach             → The Freyja Labs approach (pedagogy, CRAFT reference, "small tell lots of do")
/contact              → Contact form + scheduling
/blog                 → Blog index (future — scaffold but can be empty at launch)
/blog/[slug]          → Blog post template
```

### Page-by-Page Specification

#### Home (`/`)

The landing page. Single-scroll with anchored sections. Must accomplish three things in 10 seconds: communicate what Freyja Labs does, establish credibility, and provide a clear CTA.

**Sections in order:**

1. **Hero** — Large serif headline: "Professional development *where growth begins.*" Subline: firm description in 2 sentences. Two CTAs: "Start a Conversation" (primary, links to /contact) and "Explore Services" (secondary, links to /services). Right side or background: subtle SVG illustration (meristem/growth motif — animated growing plant with pulsing growth nodes). Do NOT use stock photography.

2. **Philosophy strip** — Three cards: "Tailored to You" (every engagement is custom), "Hands-On by Design" (small tell, lots of do), "Research-Grounded" (active researchers, not ex-practitioners). Each card has a small icon, heading, and 2-sentence description.

3. **Services overview** — 2x2 grid of service cards (Custom Workshops, District Consulting, Train-the-Trainer, Virtual & Hybrid). Each card has a monospace label tag, serif heading, and brief description. Cards link to /services/[slug].

4. **Founders preview** — Side-by-side founder cards with initials avatar (no photos at launch), name, title, and 3-sentence bio. "Learn more" links to /about.

5. **Social proof / quote block** — Centered blockquote: "We've been delivering CS integration, computational modeling, and AI literacy workshops for years before they became policy mandates. Our clients get access to the thinking that will matter next." Attribution: "— Mike & Andrea, Co-Founders". This section can later be replaced with client testimonials.

6. **CTA section** — Full-width forest-green background. "Ready to start?" headline. Brief sentence. Email CTA button: `hello@freyjalabs.com`.

7. **Footer** — Wordmark, copyright, LLC name, minimal nav links.

#### About (`/about`)

- **Origin story** — Why Freyja Labs exists. The education landscape is changing; teachers need support structures, not generic PD. Frame the founding as a response to a real problem.
- **Founder full bios** — Expanded versions. Emphasize the combination: deep technical expertise (hardware security, AI/ML, computing) + rigorous pedagogical research (STEM integration, teacher prep, curriculum design). Do NOT name UCF or any university. Use phrases like "at a major research university" or "directs a research lab." List selected credentials: funded research portfolio ($8M+), NSF PI experience, journal editorship, national PD delivery track record.
- **Philosophy section** — Expand on "small tell, lots of do." Reference the CRAFT framework lightly as "a research-backed pedagogical framework developed by the founders" — do not spell out the acronym or make it the centerpiece. Emphasize: tailored design, active participation, evidence-based content, forward-looking topics.

#### Services (`/services`)

Overview page with expanded descriptions of each service line. Each service gets a card that links to its detail page.

**Service detail pages** (content collection entries):

1. **Custom Workshops** (`/services/custom-workshops`)
   - Multi-day, on-site, hands-on
   - Fully designed for the audience (needs assessment → custom build)
   - Topics: STEM integration, AI literacy, computational thinking, curriculum alignment
   - "What to expect" section: pre-engagement survey, custom session design, facilitator materials, post-session resources
   - Price range indication: "Engagements typically range from $5,000–$25,000 depending on scope and duration."

2. **District Consulting** (`/services/district-consulting`)
   - Long-term strategic partnerships (6–12 months)
   - Needs assessment, strategic planning, curriculum audit, implementation coaching, evaluation
   - For districts pursuing systemic STEM/CS/AI integration
   - Price range: "District partnerships typically range from $25,000–$75,000+ depending on scope."

3. **Train-the-Trainer** (`/services/train-the-trainer`)
   - Licensed facilitator-ready PD modules
   - Facilitator guides, participant materials, assessment rubrics, certification
   - Build internal capacity that sustains beyond the engagement
   - Price range: "$15,000–$40,000 per module including initial training."

4. **Virtual & Hybrid** (`/services/virtual-hybrid`)
   - 90-minute to full-day virtual sessions
   - Asynchronous modules with optional live coaching
   - Same "small tell, lots of do" philosophy in remote format
   - Price range: "$2,000–$8,000 per session or module."

#### Approach (`/approach`)

Deeper explanation of the Freyja Labs methodology. NOT a sales page — this is the "show your work" page for curriculum directors and district leaders who want to understand the pedagogical foundation.

- **The problem with generic PD** — Brief, evidence-informed critique of sit-and-get PD models. No citations needed, but the tone should be informed, not polemical.
- **Our design principles** — Expand on: (1) audience-specific design, (2) active participation ratios, (3) research grounding, (4) forward-looking content selection.
- **The CRAFT connection** — One section referencing the founders' pedagogical framework. Frame as: "Our approach is informed by CRAFT (Contextualize, Reframe, Assemble, Fortify, Transfer), a peer-reviewed instructional design framework developed through our research." Link to the published paper or book site if desired. Do NOT make this the page's centerpiece.
- **What makes us different** — Ahead-of-the-curve positioning. CS integration before mandates, AI literacy before the hype cycle, computational modeling before it was a buzzword.

#### Contact (`/contact`)

- Contact form (Formspree): Name, email, organization, role, message, optional "How did you hear about us?" dropdown.
- Direct email: `hello@freyjalabs.com`
- Optional: Calendly embed for scheduling an intro call (scaffold the embed slot even if not ready at launch).
- No phone number at launch.

#### Blog (`/blog`)

- Scaffold the content collection and index/detail templates.
- Launch with 0–2 seed posts if content is available. Otherwise, leave empty with a "Coming soon" state.
- Blog post template: title, date, author, tags, reading time estimate, full markdown body.
- Index page: reverse-chronological list with title, date, excerpt, and tag pills.

---

## Content Collections Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    tag: z.string(), // e.g., "On-Site", "Strategic", "Scalable", "Flexible"
    order: z.number(), // display order
    priceRange: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.enum(['Mike Borowczak', 'Andrea Burrows Borowczak', 'Freyja Labs']),
    tags: z.array(z.string()).optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, blog };
```

---

## Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Nav.astro            — Fixed nav with scroll effect, mobile hamburger
│   │   ├── Footer.astro         — Wordmark, copyright, nav links
│   │   └── BaseLayout.astro     — HTML shell, meta tags, font loading, analytics slot
│   ├── ui/
│   │   ├── Button.astro         — Primary/secondary/light variants
│   │   ├── SectionLabel.astro   — Monospace uppercase label
│   │   ├── Card.astro           — Reusable card with hover state
│   │   └── ContactForm.astro    — Form with Formspree integration
│   ├── home/
│   │   ├── Hero.astro
│   │   ├── PhilosophyGrid.astro
│   │   ├── ServicesPreview.astro
│   │   ├── FoundersPreview.astro
│   │   ├── QuoteBlock.astro
│   │   └── CtaBanner.astro
│   └── icons/
│       └── MeristemGlyph.astro  — SVG growth illustration with CSS animation
├── content/
│   ├── services/
│   │   ├── custom-workshops.md
│   │   ├── district-consulting.md
│   │   ├── train-the-trainer.md
│   │   └── virtual-hybrid.md
│   └── blog/
│       └── (empty or seed posts)
├── layouts/
│   ├── BaseLayout.astro
│   ├── PageLayout.astro         — Standard page with nav/footer
│   └── BlogPostLayout.astro     — Blog post with metadata header
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── services/
│   │   ├── index.astro
│   │   └── [...slug].astro
│   ├── approach.astro
│   ├── contact.astro
│   └── blog/
│       ├── index.astro
│       └── [...slug].astro
└── styles/
    └── global.css               — Tailwind directives, custom utilities, font-face
```

---

## Tailwind Configuration

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest:      { DEFAULT: '#3D6B4F', dark: '#2A4E38', light: '#5A8E6D' },
        earth:       { DEFAULT: '#6B5B3E', light: '#8A7A5C' },
        clay:        '#9E7E5A',
        sand:        '#D4C5A9',
        cream:       '#FAF7F2',
        'warm-white':'#FFFEF9',
        ink:         '#1C1C1C',
        muted:       '#5A5A5A',
        faded:       '#8A8A8A',
        border:      '#DDD5C8',
      },
      fontFamily: {
        serif:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:   ['"Outfit"', 'system-ui', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'grow':    'growUp 2s ease forwards',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
};
```

---

## SEO & Meta

Every page must include:

```html
<title>{pageTitle} — Freyja Labs</title>
<meta name="description" content="{pageDescription}">
<meta property="og:title" content="{pageTitle} — Freyja Labs">
<meta property="og:description" content="{pageDescription}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://freyjalabs.com{path}">
<meta property="og:image" content="https://freyjalabs.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://freyjalabs.com{path}">
```

Generate an OG image (1200x630) using the brand palette: cream background, "Freyja Labs" in Cormorant Garamond, tagline below, meristem glyph element. Save as `public/og-image.png`.

---

## Deployment Configuration

### GitHub Pages (via GitHub Actions)

The site deploys to GitHub Pages on every push to `main`. The workflow at `.github/workflows/deploy.yml` uses the official `withastro/action` to build and `actions/deploy-pages` to publish.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        with:
          node-version: 20
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Custom domain

`public/CNAME` contains `freyjalabs.com` so the custom domain persists across deploys. One-time setup in the GitHub repo:

1. **Settings → Pages → Source: `GitHub Actions`**
2. **Settings → Pages → Custom domain: `freyjalabs.com`**, then enable **Enforce HTTPS** once the cert provisions
3. DNS for `freyjalabs.com`:
   - `A` apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` apex → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME www` → `freyja-labs.github.io`

---

## Accessibility Requirements

- All images have descriptive `alt` text.
- Color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text). The palette has been selected to meet these ratios against `--cream` and `--warm-white` backgrounds.
- Skip-to-content link on every page.
- Form inputs have associated `<label>` elements.
- Focus states are visible and styled (forest green outline).
- Nav is keyboard-navigable; mobile menu is toggled with a button, not a checkbox hack.
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- `prefers-reduced-motion` media query disables all animations.

---

## Performance Budget

- **Lighthouse score:** 95+ on all four categories (Performance, Accessibility, Best Practices, SEO).
- **First Contentful Paint:** < 1.5s.
- **Total page weight:** < 300KB (excluding fonts).
- **Font loading:** Preconnect + `font-display: swap`. Subset fonts if Astro plugin available.
- **Images:** Use Astro's `<Image>` component for automatic optimization. WebP/AVIF with fallback.
- **No client-side JS** unless explicitly needed for an interactive component (contact form validation, mobile nav toggle). Use `<script>` tags in Astro components, not React/Vue islands, for simple interactions.

---

## Build Order for Claude Code

When building this site, follow this sequence:

1. **Scaffold** — `npm create astro@latest freyja-labs` with Tailwind integration. Set up the Tailwind config, global CSS, and font loading.
2. **BaseLayout + Nav + Footer** — Get the shell rendering with correct typography and colors.
3. **Home page** — Build all six sections. This is the hero deliverable; get it right.
4. **Services** — Content collection + overview page + detail pages.
5. **About** — Founders, philosophy, origin story.
6. **Approach** — Methodology deep-dive.
7. **Contact** — Form integration.
8. **Blog** — Scaffold collection + templates. Seed with placeholder if no content.
9. **SEO + OG image** — Meta tags, sitemap, robots.txt.
10. **Deploy config** — GitHub Pages workflow + CNAME.
11. **Accessibility audit** — Run Lighthouse, fix any issues.

---

## Content Guardrails

- **Never reference UCF, DRACO Lab, or any university by name.** Use "a major research university" or "a 50-member research lab" or "an engineering education journal."
- **Never reference Idaho National Laboratory (INL)** as an affiliation.
- **The CRAFT framework** is referenced lightly, not branded around. One section on /approach, mentioned as "a peer-reviewed framework developed by the founders." Do not spell out the acronym prominently or use CRAFT brand colors (navy/gold/red) on this site.
- **Tone:** Direct, warm, confident. Evidence-first. No edu-jargon for jargon's sake. Write like smart people talking to smart people. Avoid superlatives and marketing fluff.
- **No stock photography at launch.** Use SVG illustrations, the meristem glyph, and typographic design. Photos can be added later when professional headshots and event photography are available.
- **Collaborative work is always groups of 3+, never pairs.** If any content describes workshop activities, groups are always three or more participants.

---

## File: `package.json` (starter)

```json
{
  "name": "freyja-labs",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/tailwind": "^6.x",
    "@astrojs/mdx": "^4.x",
    "@astrojs/sitemap": "^3.x"
  }
}
```
