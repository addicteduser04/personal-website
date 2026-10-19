# Sifeddine El Kadiri — Portfolio

A dependency-free portfolio for a Data & Finance Engineer. The cinematic overview leads to three dedicated recruiter-facing profiles for Quant Finance, Data & AI, and IT & Digital Transformation.

## Local preview

Run a static server from the project root:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Architecture

- `index.html` contains the complete semantic page structure and indexable professional narrative.
- `quant/`, `data-ai/`, and `digital-transformation/` contain distinct, directly addressable professional profiles.
- `projects.js` is the source of truth for all 15 project case studies.
- `script.js` handles progressive enhancement: navigation, reveal motion, project filtering, video controls, and the accessible case-study dialog.
- `profile.js` curates evidence-based project, experience, and skill content for each profile; `profile.css` supplies their coordinated visual system.
- `styles.css` contains the responsive design system and reduced-motion treatment.
- `assets/media/` contains optimized desktop/mobile versions of the supplied hero video and poster frames extracted from that video.
- `tests/portfolio.test.mjs` checks content integrity, media wiring, factual safeguards, and SEO configuration.

## Content safeguards

The internship figures previously marked as pending documentary confirmation are intentionally not presented. Project metrics remain only where the repository catalogue records them as documented results. No public CV file is included, so every CV action opens a pre-addressed email request instead of a broken download.

## Verification

```bash
node --check script.js
node --check projects.js
node --test tests/*.test.mjs
```

## Deployment

The site remains compatible with Vercel static hosting. `/quant`, `/data-ai`, and `/digital-transformation` resolve to independent documents, while project case-study paths continue to use the homepage application shell.
