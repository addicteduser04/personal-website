import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("../", import.meta.url);
const rootPath = fileURLToPath(rootUrl);
const read = (name) => fs.readFileSync(new URL(name, rootUrl), "utf8");
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const html = read("index.html");
const script = read("script.js");
const css = read("styles.css");
const context = { window: {} };
vm.runInNewContext(read("projects.js"), context);
const { projects } = context.window.PORTFOLIO_DATA;

test("project catalogue is complete, unique, and case-study ready", () => {
  assert.equal(projects.length, 15);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) {
    for (const field of ["slug", "title", "date", "status", "tagline", "summary", "github", "problem", "solution", "challenge", "impact"]) {
      assert.ok(project[field], `${project.slug}.${field}`);
    }
    assert.ok(project.stack.length >= 4, `${project.slug} has a meaningful stack`);
    assert.ok(project.features.length >= 4, `${project.slug} explains key features`);
    assert.ok(project.architecture.length >= 1, `${project.slug} explains architecture`);
    assert.match(project.github, /^https:\/\/github\.com\/addicteduser04\//);
  }
});

test("the homepage is unified and the tailor view is fully removed", () => {
  const source = html + script + css;
  assert.doesNotMatch(source, /Explore my work, your way|Who are you exploring for|Choose a discipline|Change view|Tailored view|entry-dialog|profile-switcher|personalization/i);
  assert.doesNotMatch(script, /lenses|audience-switch|lens-switch|localStorage|sessionStorage/);
  for (const section of ["top", "experience", "work", "profiles", "skills", "contact"]) {
    assert.match(html, new RegExp(`id=["']${section}["']`), `#${section} exists`);
  }
  const order = ["top", "experience", "work", "profiles", "skills", "contact"].map((id) => html.indexOf(`id="${id}"`));
  assert.deepEqual(order, [...order].sort((a, b) => a - b), "homepage follows the intended recruiter flow");
  assert.doesNotMatch(source, /project-dialog|data-project=/, "project overlays are fully removed");
});

test("the supplied video and authentic poster are wired for efficient playback", () => {
  assert.match(html, /<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline[^>]*preload="metadata"/);
  assert.match(html, /hero-office-540\.mp4/);
  assert.match(html, /hero-office-720\.mp4/);
  assert.match(html, /hero-poster\.webp/);
  for (const asset of ["assets/media/hero-office-540.mp4", "assets/media/hero-office-720.mp4", "assets/media/hero-poster.webp", "assets/media/hero-poster.jpg"]) {
    const stat = fs.statSync(new URL(asset, rootUrl));
    assert.ok(stat.size > 20_000, `${asset} is non-empty`);
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(script, /prefers-reduced-motion/);
});

test("all local media referenced by the HTML exists", () => {
  const paths = [...html.matchAll(/(?:src|poster)="(\/assets\/[^"?#]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length >= 9);
  for (const path of new Set(paths)) {
    assert.ok(fs.existsSync(`${rootPath}${path}`), `missing ${path}`);
  }
});

test("internal navigation anchors resolve to real sections", () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(anchors.length >= 9);
  for (const anchor of anchors) assert.ok(ids.has(anchor), `missing target #${anchor}`);
});

test("featured projects link to real case-study documents", () => {
  const slugs = new Set(projects.map((project) => project.slug));
  const links = [...html.matchAll(/href="\/projects\/([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(links).size, 6);
  for (const slug of links) assert.ok(slugs.has(slug), `unknown featured project ${slug}`);
});

test("all 15 projects have static, indexable, revision-pinned case studies", () => {
  for (const project of projects) {
    const route = `projects/${project.slug}/index.html`;
    assert.ok(fs.existsSync(new URL(route, rootUrl)), `missing ${route}`);
    const page = read(route);
    assert.ok(page.includes(`<h1>${escapeHtml(project.title)}</h1>`), `${project.slug} has the correct h1`);
    assert.match(page, new RegExp(`canonical[^>]+/projects/${project.slug}`));
    assert.match(page, /Evidence revision/);
    assert.match(page, /Pinned revision/);
    assert.match(page, /MISSING EVIDENCE/);
  }
  assert.match(read("PROJECT_AUDIT.md"), /\| Project \| GitHub Repository \| README Found \| Case Study Route \| Missing Evidence \|/);
});

test("featured internships have dedicated disclosure-safe routes", () => {
  for (const slug of ["sterling-asset-management", "akwa-group"]) {
    const page = read(`experience/${slug}/index.html`);
    assert.match(html, new RegExp(`href="/experience/${slug}"`));
    assert.match(page, new RegExp(`canonical[^>]+/experience/${slug}`));
    assert.match(page, /non-confidential|intentionally not published/i);
  }
});

test("unconfirmed internship metrics are not presented", () => {
  const publicCopy = html + script;
  for (const claim of ["98%", "85% F1", "6M+", "47%", "2004–26"]) {
    assert.ok(!publicCopy.includes(claim), `${claim} must remain unpublished pending confirmation`);
  }
});

test("contact details and the honest CV fallback are intact", () => {
  assert.match(html, /elkadirisifeddine@gmail\.com/);
  assert.match(html, /github\.com\/addicteduser04/);
  assert.match(html, /linkedin\.com\/in\/sifeddine-el-kadiri-097235390/);
  assert.match(html, /Request (?:my )?CV/i);
  assert.doesNotMatch(html, /href="[^"]+\.pdf"|download(?:=|>)/i);
});

test("SEO points to the custom domain and exposes a social image", () => {
  assert.match(html, /https:\/\/www\.sifeddineelkadiri\.online\//);
  assert.match(html, /property="og:image"/);
  assert.doesNotMatch(html, /personal-website-xi-hazel-44\.vercel\.app/);
  assert.match(read("robots.txt"), /www\.sifeddineelkadiri\.online\/sitemap\.xml/);
  assert.match(read("sitemap.xml"), /www\.sifeddineelkadiri\.online/);
});
