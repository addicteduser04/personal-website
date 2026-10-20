import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), "utf8");
const routes = [
  ["quant", "Quant Finance", /Model markets\./],
  ["data-ai", "Data & AI", /Interrogate data\./],
  ["digital-transformation", "IT & Digital Transformation", /Map the operation\./]
];
const homepage = read("index.html");
const profileScript = read("profile.js");
const vercel = JSON.parse(read("vercel.json"));

test("homepage preserves its cinematic hero and offers three direct profile destinations", () => {
  assert.match(homepage, /hero-office-720\.mp4/);
  assert.match(homepage, /Three disciplines\. Three perspectives\. <em>One engineer\.<\/em>/i);
  for (const [route] of routes) assert.match(homepage, new RegExp(`href=["']/${route}["']`));
  assert.doesNotMatch(homepage, /entry-dialog|tailor view|choose a discipline/i);
});

test("each professional route is a distinct, indexable document", () => {
  const headings = new Set();
  for (const [route, label, heading] of routes) {
    const html = read(`${route}/index.html`);
    assert.match(html, heading);
    assert.match(html, new RegExp(`canonical[^>]+/${route}`));
    assert.match(html, new RegExp(`aria-current=["']page["'][^>]*>${label.replace(" & ", " &amp; ")}|>${label.replace(" & ", " &amp; ")}<`));
    assert.match(html, /data-profile-projects/);
    assert.match(html, /data-profile-experience/);
    assert.match(html, /data-profile-skills/);
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    assert.ok(h1 && !headings.has(h1), `${route} has a unique h1`);
    headings.add(h1);
  }
});

test("profile navigation switches directly between every destination", () => {
  for (const [route] of routes) {
    const html = read(`${route}/index.html`);
    assert.match(html, /href="\/">Overview<\/a>/);
    for (const [target] of routes) assert.match(html, new RegExp(`href=["']/${target}["']`));
  }
});

test("profile content is curated, factual, and CV-safe", () => {
  for (const key of ["quant", "data", "digital"]) assert.match(profileScript, new RegExp(`\\b${key}: \\{`));
  for (const slug of ["nelson-siegel", "equity-crash", "dwarven-industry"]) assert.match(profileScript, new RegExp(`"${slug}"`));
  const publicCopy = routes.map(([route]) => read(`${route}/index.html`)).join("") + profileScript;
  for (const claim of ["98%", "85% F1", "6M+", "47%", "2004–26"]) assert.ok(!publicCopy.includes(claim), `${claim} remains unpublished`);
  assert.doesNotMatch(publicCopy, /href="[^"]+\.pdf"|download=/i);
  assert.match(publicCopy, /Request (?:quant |data |consulting )?CV/i);
  assert.match(profileScript, /href="\/projects\/\$\{escapeHtml\(project\.slug\)\}"/);
  assert.match(profileScript, /href: "\/experience\/sterling-asset-management"/);
  assert.match(profileScript, /href: "\/experience\/akwa-group"/);
  assert.match(profileScript, /class="profile-role-link"/);
});

test("Vercel serves profiles without homepage redirects and sitemap lists them", () => {
  const redirects = JSON.stringify(vercel.redirects || []);
  const rewrites = JSON.stringify(vercel.rewrites || []);
  const sitemap = read("sitemap.xml");
  for (const [route] of routes) {
    assert.ok(!redirects.includes(`/${route}`), `${route} is not redirected`);
    assert.ok(rewrites.includes(`/${route}/index.html`), `${route} is explicitly rewritten to its document`);
    assert.match(sitemap, new RegExp(`/${route}<`));
  }
});

test("Vercel exposes every case-study and experience route as a static document", () => {
  const rewrites = JSON.stringify(vercel.rewrites || []);
  assert.ok(rewrites.includes("/projects/:slug/index.html"));
  assert.ok(rewrites.includes("/experience/:slug/index.html"));
  const sitemap = read("sitemap.xml");
  assert.equal((sitemap.match(/\/projects\//g) || []).length, 15);
  assert.match(sitemap, /\/experience\/sterling-asset-management</);
  assert.match(sitemap, /\/experience\/akwa-group</);
});
