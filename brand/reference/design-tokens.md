# Freyja Labs — Design Tokens

Quick reference for designers, developers, and anyone working in design tools.

---

## Color Palette

### Primary

| Name | Hex | RGB | CMYK | HSL |
|---|---|---|---|---|
| Forest | `#3D6B4F` | `61, 107, 79` | `65, 28, 70, 25` | `141, 27%, 33%` |
| Forest Dark | `#2A4E38` | `42, 78, 56` | `75, 32, 80, 50` | `141, 30%, 24%` |
| Forest Light | `#5A8E6D` | `90, 142, 109` | `55, 18, 60, 18` | `141, 22%, 45%` |
| Earth | `#6B5B3E` | `107, 91, 62` | `35, 42, 75, 35` | `39, 27%, 33%` |

### Neutrals

| Name | Hex | RGB | CMYK |
|---|---|---|---|
| Cream (page bg) | `#FAF7F2` | `250, 247, 242` | `1, 2, 4, 0` |
| Warm White (surface) | `#FFFEF9` | `255, 254, 249` | `0, 0, 2, 0` |
| Sand (decorative) | `#D4C5A9` | `212, 197, 169` | `15, 18, 35, 5` |
| Border | `#DDD5C8` | `221, 213, 200` | `12, 13, 22, 4` |
| Ink (body text) | `#1C1C1C` | `28, 28, 28` | `70, 65, 65, 75` |
| Muted (secondary) | `#5A5A5A` | `90, 90, 90` | `55, 45, 45, 30` |
| Faded (caption) | `#8A8A8A` | `138, 138, 138` | `45, 35, 35, 15` |

---

## Typography

### Display & Editorial — Cormorant Garamond

- Source: Google Fonts (SIL Open Font License, free for commercial use)
- Weights used: 400, 500, 600
- Italic: 400
- Fallback: `Georgia, "Hoefler Text", "Times New Roman", serif`

### UI & Body — Outfit

- Source: Google Fonts (SIL Open Font License, free for commercial use)
- Weights used: 400, 500, 600
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`

### Heading scale (web)

| Element | Font | Size | Weight | Line height |
|---|---|---|---|---|
| H1 / Hero | Cormorant Garamond | 48–56px | 500 | 1.05 |
| H2 / Section | Cormorant Garamond | 32–40px | 500–600 | 1.1 |
| H3 / Subsection | Cormorant Garamond | 22–26px | 600 | 1.2 |
| Eyebrow / Label | Outfit | 11–13px | 600 | 1.3 (uppercase, letter-spacing 1.5–2px) |
| Body | Outfit | 15–17px | 400 | 1.6 |
| Small / Caption | Outfit | 12–13px | 400 | 1.5 |

---

## CSS Variables (web)

```css
:root {
  --forest:        #3D6B4F;
  --forest-dark:   #2A4E38;
  --forest-light:  #5A8E6D;
  --earth:         #6B5B3E;
  --earth-light:   #8A7A5C;
  --clay:          #9E7E5A;
  --sand:          #D4C5A9;
  --cream:         #FAF7F2;
  --warm-white:    #FFFEF9;
  --ink:           #1C1C1C;
  --muted:         #5A5A5A;
  --faded:         #8A8A8A;
  --border:        #DDD5C8;

  --font-serif:    'Cormorant Garamond', Georgia, serif;
  --font-sans:     'Outfit', system-ui, sans-serif;
  --font-mono:     'JetBrains Mono', monospace;
}
```

## Tailwind extension

```javascript
// tailwind.config.mjs — extend
colors: {
  forest:      { DEFAULT: '#3D6B4F', dark: '#2A4E38', light: '#5A8E6D' },
  earth:       { DEFAULT: '#6B5B3E', light: '#8A7A5C' },
  clay:        '#9E7E5A',
  sand:        '#D4C5A9',
  cream:       '#FAF7F2',
  'warm-white': '#FFFEF9',
  ink:         '#1C1C1C',
  muted:       '#5A5A5A',
  faded:       '#8A8A8A',
  border:      '#DDD5C8',
},
fontFamily: {
  serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  sans:  ['"Outfit"', 'system-ui', 'sans-serif'],
  mono:  ['"JetBrains Mono"', 'monospace'],
},
```

---

## Pairing rules

- **Forest on cream** — workhorse pairing; headings, CTAs, brand mark
- **Earth on cream** — italic accents, tagline, decorative serif
- **Cream on forest** — reversed contexts, dark backgrounds
- **Forest on warm white** — cards, panels, raised surfaces
- **Ink on cream** — body text
- **Muted on cream** — secondary text, captions
- Avoid forest light directly adjacent to forest — contrast is too low to read as intentional
