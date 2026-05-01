# Freyja Labs — Brand Kit

Everything you need to represent Freyja Labs in any medium. Logos, social assets, document templates, and a full brand guidelines reference.

**Tagline:** Where growth begins.
**Domain:** freyjalabs.com
**Entity:** Freyja Laboratory LLC (DBA Freyja Labs)

---

## Start here

If you're new to the kit and want a complete overview, open **`brand-guidelines.pdf`**. It's a 10-page document covering the brand story, logo system, color, typography, voice, and asset index.

If you just need a specific asset, jump to the relevant folder below.

---

## Folder structure

```
brand-kit/
├── README.md                       (this file)
├── brand-guidelines.pdf            (10-page comprehensive brand reference)
├── brand-guidelines.html           (editable HTML source for the PDF)
│
├── logos/
│   ├── svg/                        (master vector files — use these wherever possible)
│   │   ├── logo-mark.svg           (the meristem mark, full color)
│   │   ├── logo-mark-white.svg     (white reversed for dark backgrounds)
│   │   ├── logo-horizontal.svg     (mark + Freyja Labs wordmark)
│   │   ├── logo-horizontal-white.svg (reversed lockup)
│   │   └── logo-favicon.svg        (simplified for tiny rendering sizes)
│   │
│   └── png/                        (rasterized exports at standard sizes)
│       ├── logo-mark-{256,512,1024,2048}.png
│       ├── logo-mark-white-{256,512,1024,2048}.png
│       ├── logo-horizontal-h{120,240,480,960}.png      (heights for proportional widths)
│       ├── logo-horizontal-white-h{120,240,480,960}.png
│       ├── favicon-{16,32,48,64,192}.png               (browser favicon sizes)
│       ├── apple-touch-icon-180.png                    (iOS home screen)
│       └── android-chrome-{192,512}.png                (Android PWA)
│
├── social/                         (social media banners and avatars, ready to upload)
│   ├── profile-square-1024.png            (LinkedIn / X / FB / IG profile)
│   ├── profile-square-dark-1024.png       (dark variant if needed)
│   ├── linkedin-cover-1584x396.png        (LinkedIn company page banner)
│   ├── twitter-header-1500x500.png        (X / Twitter profile banner)
│   ├── og-image-1200x630.png              (Open Graph for website link sharing)
│   └── *.svg                              (editable source files for each)
│
├── templates/                      (fillable templates for daily use)
│   ├── letterhead.docx                    (Word template — formal correspondence)
│   ├── one-pager.pdf                      (capabilities sheet PDF)
│   ├── one-pager.html                     (editable HTML source)
│   ├── business-cards.pdf                 (print-ready, both founders, with crop marks)
│   ├── business-cards.html                (editable HTML source)
│   ├── email-signature.html               (Mike's email signature — copy/paste)
│   └── email-signature-andrea.html        (Andrea's email signature)
│
└── reference/                      (design tokens for designers and developers)
    ├── color-swatches.png                 (visual palette card)
    ├── color-swatches.svg                 (editable source)
    ├── design-tokens.md                   (full reference: colors, typography, CSS, Tailwind)
    └── design-tokens.json                 (programmatic access in DTCG format)
```

---

## Common workflows

### Adding the favicon to a website

1. Upload the contents of `logos/png/favicon-*.png`, `apple-touch-icon-180.png`, and `android-chrome-*.png` to your site root or `/public/` folder.
2. Add to your HTML `<head>`:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512.png">
```

### Setting your email signature

1. Open `templates/email-signature.html` in a browser.
2. Edit your name, title, and email directly in the rendered signature.
3. Click into the signature box, select all (Cmd+A), copy (Cmd+C).
4. Paste into your email client's signature settings.

The signature references `https://freyjalabs.com/logos/logo-mark-256.png` for the logo image — upload `logo-mark-256.png` to that path on your domain before using.

### Uploading social media assets

| Platform | Asset | Path |
|---|---|---|
| LinkedIn profile | Profile picture | `social/profile-square-1024.png` |
| LinkedIn cover | Banner | `social/linkedin-cover-1584x396.png` |
| X / Twitter | Profile picture | `social/profile-square-1024.png` |
| X / Twitter | Header | `social/twitter-header-1500x500.png` |
| Website Open Graph | OG image meta tag | `social/og-image-1200x630.png` |

For the OG image, add to your site `<head>`:

```html
<meta property="og:image" content="https://freyjalabs.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://freyjalabs.com/og-image.png">
```

### Printing business cards

The `templates/business-cards.pdf` is print-ready at 3.5"&times;2" trim with 0.125" bleed (full size 3.75"&times;2.25"). It contains four pages: front and back for Mike, then front and back for Andrea.

Most online printers (Moo, VistaPrint, GotPrint, Jukebox) accept this format directly. When uploading, look for "with bleed" or "3.75 x 2.25" options. If the printer asks for separate front/back files, split the PDF.

### Sending a formal letter

Open `templates/letterhead.docx` in Word, Google Docs, or Pages. The header logo and footer are pre-configured. Replace placeholder text and save as a new document.

### Building on the website

For Astro, React, Tailwind, or any web framework, use `reference/design-tokens.md` for color tokens and font specifications. The Tailwind extension snippet drops directly into a `tailwind.config.mjs` file.

---

## File format notes

- **SVG** is preferred for any digital use — it scales infinitely without quality loss and renders crisply at any pixel density. Use SVG for web, presentations, signage, and any vector workflow.
- **PNG** is for contexts that don't accept SVG: legacy tools, email clients, social media uploads, raster-only environments. Use the largest size that fits your need, then downscale if necessary.
- **PDF** is for print and document distribution. Always preferred over PNG for documents.

Fonts (Cormorant Garamond and Outfit) are licensed under SIL Open Font License — free for commercial use. Both are available on Google Fonts and via npm `@fontsource/cormorant-garamond` and `@fontsource/outfit`.

---

## Editing the source files

Most assets in this kit are HTML or SVG that can be edited directly:

- **Brand guidelines:** `brand-guidelines.html` &mdash; edit the HTML, render to PDF with WeasyPrint or wkhtmltopdf
- **One-pager:** `templates/one-pager.html` &mdash; same workflow
- **Business cards:** `templates/business-cards.html` &mdash; edit names/titles, re-render
- **Social SVGs:** all source SVG files in `social/` &mdash; edit with any vector editor or text editor

To re-render PDFs from HTML using WeasyPrint:

```bash
pip install weasyprint
python3 -c "from weasyprint import HTML; HTML(filename='file.html').write_pdf('file.pdf')"
```

To re-render PNGs from SVG using rsvg-convert (part of `librsvg2-bin` on Linux):

```bash
rsvg-convert -w 1024 input.svg -o output.png
```

---

## Contact

Questions, additions, or new asset requests:
**hello@freyjalabs.com** &nbsp;·&nbsp; **freyjalabs.com**

This kit will evolve as the brand grows. If something is missing — a deck template, a proposal template, additional social formats — write it down and request it.

---

*Brand kit version 1.0 &nbsp;·&nbsp; May 2026*
