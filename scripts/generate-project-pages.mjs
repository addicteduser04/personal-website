import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import content from "../content/project-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "projects.js"), "utf8"), context);
const projects = context.window.PORTFOLIO_DATA.projects;
const bySlug = new Map(projects.map((project) => [project.slug, project]));
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const list = (items = []) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
const tags = (items = []) => `<ul class="case-tags" aria-label="Technologies">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
const revisionUrl = (project, revision) => `${project.github}/tree/${revision}`;

function metricTable(metrics) {
  if (!metrics?.headers?.length || !metrics?.rows?.length) return "";
  return `<div class="evidence-table-wrap"><table class="evidence-table"><caption>${escapeHtml(metrics.caption)}</caption><thead><tr>${metrics.headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${metrics.rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function architecture(project, details) {
  const nodes = (project.architecture || []).slice(0, 6);
  return `<figure class="architecture-map" aria-labelledby="architecture-caption">
    <figcaption id="architecture-caption">Documented component map</figcaption>
    <div>${nodes.map((node, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(node)}</p></article>`).join("")}</div>
    <small>Diagram synthesized from the pinned repository documentation; it is explanatory, not a runtime topology capture.</small>
  </figure>`;
}

function media(project) {
  const source = project.cardImage || project.image;
  if (!source) return `<div class="case-abstract" aria-hidden="true"><span>PROBLEM</span><i>→</i><span>METHOD</span><i>→</i><span>EVIDENCE</span></div>`;
  return `<figure class="case-cover"><img src="${escapeHtml(source)}" alt="${escapeHtml(project.imageAlt || `${project.title} project visualization`)}" width="1400" height="850"><figcaption>Repository-linked project visual</figcaption></figure>`;
}

function links(project) {
  return `<div class="case-actions"><a class="case-button primary" href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">View source <span>↗</span></a>${project.demo ? `<a class="case-button" href="${escapeHtml(project.demo)}" target="_blank" rel="noreferrer">Open live project <span>↗</span></a>` : ""}</div>`;
}

function related(project) {
  const items = (project.related || []).map((slug) => bySlug.get(slug)).filter(Boolean).slice(0, 3);
  return items.map((item) => `<a href="/projects/${escapeHtml(item.slug)}"><span>${escapeHtml(item.categories[0] || "engineering")}</span><strong>${escapeHtml(item.title)}</strong><i>→</i></a>`).join("");
}

function page(project) {
  const details = content[project.slug];
  if (!details) throw new Error(`Missing audited content for ${project.slug}`);
  const canonical = `https://www.sifeddineelkadiri.online/projects/${project.slug}`;
  const description = project.summary.slice(0, 155);
  const formula = details.formula?.length ? `<section class="case-section formula-section" id="formula"><p class="case-index">04B / MODEL</p><h2>Mathematical specification</h2><div class="formula-grid">${details.formula.map((line) => `<code>${escapeHtml(line)}</code>`).join("")}</div></section>` : "";
  const tocFormula = details.formula?.length ? `<a href="#formula">Model</a>` : "";
  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.summary, url: canonical, author: { "@type": "Person", name: "Sifeddine El Kadiri" }, codeRepository: project.github, dateCreated: project.date });
  return `<!doctype html>
<html lang="en" class="has-js">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#060b12"><meta name="color-scheme" content="dark">
  <meta name="description" content="${escapeHtml(description)}"><meta name="author" content="Sifeddine El Kadiri"><meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(project.title)} — Technical Case Study"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.sifeddineelkadiri.online/assets/media/hero-poster.jpg">
  <link rel="canonical" href="${canonical}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/case-study.css">
  <title>${escapeHtml(project.title)} — Technical Case Study</title><script type="application/ld+json">${jsonLd}</script><script src="/case-study.js" defer></script>
</head>
<body class="case-page">
  <a class="skip-link" href="#case-main">Skip to case study</a>
  <header class="case-header"><a class="case-brand" href="/">SEK<span>·</span></a><button class="case-menu" type="button" aria-expanded="false" aria-controls="case-nav">Menu</button><nav id="case-nav" aria-label="Case study navigation"><a href="/">Overview</a><a href="/quant">Quant</a><a href="/data-ai">Data &amp; AI</a><a href="/digital-transformation">IT &amp; Digital</a></nav><a class="case-index-link" href="/#work">All projects <span>↗</span></a></header>
  <main id="case-main">
    <section class="case-page-hero">
      <div class="case-hero-copy"><p class="case-eyebrow">${escapeHtml(project.date)} / ${escapeHtml(project.categories.join(" · "))}</p><h1>${escapeHtml(project.title)}</h1><p class="case-deck">${escapeHtml(project.tagline)}</p><p>${escapeHtml(project.summary)}</p>${tags(project.stack)}${links(project)}</div>
      <aside class="case-facts"><div><span>Status</span><strong>${escapeHtml(project.status)}</strong></div><div><span>Repository</span><strong>${escapeHtml(project.repo)}</strong></div><div><span>Evidence revision</span><a href="${revisionUrl(project, details.revision)}" target="_blank" rel="noreferrer"><code>${details.revision.slice(0, 7)}</code> ↗</a></div><div><span>README</span><strong>Verified</strong></div></aside>
      ${media(project)}
    </section>
    <div class="case-layout">
      <aside class="case-toc"><p>ON THIS PAGE</p><nav><a href="#problem">Problem</a><a href="#contribution">My contribution</a><a href="#approach">Technical approach</a><a href="#methodology">Methodology</a>${tocFormula}<a href="#results">Results</a><a href="#limitations">Limitations</a><a href="#demonstrates">Demonstrates</a><a href="#sources">Sources</a></nav></aside>
      <article class="case-article">
        <section class="case-section" id="problem"><p class="case-index">01 / PROBLEM STATEMENT</p><h2>Why this work exists</h2><p class="case-lead">${escapeHtml(details.motivation)}</p><h3>Data and source material</h3>${list(details.data)}</section>
        <section class="case-section contribution-section" id="contribution"><p class="case-index">02 / MY CONTRIBUTION</p><h2>What I implemented</h2><p class="case-lead">${escapeHtml(project.solution)}</p><div class="implementation-notes"><h3>Implemented capabilities</h3>${list(project.features)}</div></section>
        <section class="case-section" id="approach"><p class="case-index">03 / TECHNICAL APPROACH</p><h2>From input to usable output</h2><ol class="workflow">${details.workflow.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(item)}</p></li>`).join("")}</ol>${architecture(project, details)}</section>
        <section class="case-section" id="methodology"><p class="case-index">04 / METHODOLOGY &amp; IMPLEMENTATION</p><h2>Decisions that shape the system</h2>${list(details.methodology)}</section>
        ${formula}
        <section class="case-section results-section" id="results"><p class="case-index">05 / RESULTS &amp; EVIDENCE</p><h2>What the source supports</h2>${metricTable(details.metrics)}${list(details.results)}<p class="evidence-rule">Results preserve the repository’s units, evaluation framing, and stated limitations. Missing evidence is not converted into a claim.</p></section>
        <section class="case-section" id="limitations"><p class="case-index">06 / CHALLENGES &amp; LIMITATIONS</p><h2>Where the evidence stops</h2>${list(details.limitations)}<aside class="missing-evidence"><span>MISSING EVIDENCE</span><p>${escapeHtml(details.missing)}</p></aside></section>
        <section class="case-section demonstrates-section" id="demonstrates"><p class="case-index">07 / WHAT THIS DEMONSTRATES</p><h2>Engineering signal</h2><p class="case-lead">${escapeHtml(details.demonstrates)}</p></section>
        <section class="case-section" id="sources"><p class="case-index">08 / SOURCE &amp; RELATED WORK</p><h2>Trace the evidence</h2><div class="source-card"><div><span>Repository</span><a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">${escapeHtml(project.repo)} ↗</a></div><div><span>Pinned revision</span><a href="${revisionUrl(project, details.revision)}" target="_blank" rel="noreferrer"><code>${details.revision}</code> ↗</a></div><div><span>Audited files</span><p>${details.sources.map(escapeHtml).join(" · ")}</p></div></div><div class="related-grid">${related(project)}</div></section>
      </article>
    </div>
  </main>
  <footer class="case-footer"><span>© ${new Date().getFullYear()} Sifeddine El Kadiri</span><a href="mailto:elkadirisifeddine@gmail.com?subject=${encodeURIComponent(`${project.title} — portfolio inquiry`)}">Discuss this work ↗</a><a href="#case-main">Back to top ↑</a></footer>
</body></html>`;
}

for (const project of projects) {
  const directory = path.join(root, "projects", project.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), page(project));
}

const staticRoutes = ["", "quant", "data-ai", "digital-transformation", "experience/sterling-asset-management", "experience/akwa-group"];
const sitemapRoutes = [...staticRoutes, ...projects.map((project) => `projects/${project.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route, index) => `  <url>\n    <loc>https://www.sifeddineelkadiri.online/${route}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${index === 0 ? "1.0" : route.startsWith("projects/") ? "0.8" : "0.9"}</priority>\n  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const auditRows = projects.map((project) => {
  const details = content[project.slug];
  return `| ${project.title} | [${project.repo}](${project.github}) @ \`${details.revision.slice(0, 7)}\` | Yes | [\`/projects/${project.slug}\`](https://www.sifeddineelkadiri.online/projects/${project.slug}) | ${details.missing} |`;
});
const audit = `# Project Content Audit\n\nRepository evidence inspected and pinned on 2026-10-19. “README found” means a public README was available; supporting code, docs, notebooks, reports, and tracked visuals were inspected where listed in \`content/project-content.mjs\`.\n\n| Project | GitHub Repository | README Found | Case Study Route | Missing Evidence |\n| --- | --- | --- | --- | --- |\n${auditRows.join("\n")}\n`;
fs.writeFileSync(path.join(root, "PROJECT_AUDIT.md"), audit);
console.log(`Generated ${projects.length} project case-study routes, sitemap.xml, and PROJECT_AUDIT.md.`);
