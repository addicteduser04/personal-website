// Content-integrity checks for the tailored landing views. Run with: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("projects.js", root), "utf8"), context);
const { lenses, projects, profiles, pendingConfirmation } = context.window.PORTFOLIO_DATA;
const slugs = new Set(projects.map(p => p.slug));
const html = fs.readFileSync(new URL("index.html", root), "utf8");
const script = fs.readFileSync(new URL("script.js", root), "utf8");

test("exactly the three finished specializations are exposed, in order", () => {
  assert.deepEqual(Object.keys(lenses), ["quant", "data", "consulting"]);
  assert.equal(lenses.consulting.label, "AI & Digital Transformation Consulting");
  assert.doesNotMatch(JSON.stringify(lenses), /Software Engineer/, "no lens markets a Software Engineer profile");
  assert.doesNotMatch(html + script, /data-focus="(strategy|software)"|lenses\.software/);
});

test("every lens is complete", () => {
  for (const [key, l] of Object.entries(lenses)) {
    for (const field of ["label", "short", "selector", "eyebrow", "title", "intro", "demoLabel", "experienceTitle"]) assert.ok(l[field], `${key}.${field}`);
    assert.ok(profiles[l.profile], `${key} maps to a known profile`);
    assert.equal(l.evidence.length, 4, `${key} evidence`);
    assert.ok(l.positioning.length >= 5, `${key} positioning`);
    assert.ok(l.experience.length >= 2 && l.experience.every(e => e.org && e.role && e.period && e.points.length), `${key} experience`);
    assert.ok(l.skills.length >= 4, `${key} skills`);
    for (const audience of ["recruiter", "visitor"]) {
      assert.ok(l.cta[audience].title && l.cta[audience].copy && l.cta[audience].subject, `${key} ${audience} CTA`);
      assert.ok(l.projects[audience].length % 2 === 0, `${key} ${audience} fills the two-column grid`);
      for (const s of l.projects[audience]) assert.ok(slugs.has(s), `${key} references unknown project ${s}`);
    }
    assert.notDeepEqual(l.projects.recruiter, l.projects.visitor, `${key} audiences differ`);
  }
});

test("each lens leads with the experience and project the brief calls for", () => {
  assert.equal(lenses.quant.experience[0].org, "Sterling Asset Management");
  assert.equal(lenses.quant.projects.recruiter[0], "nelson-siegel");
  assert.equal(lenses.data.experience[0].org, "AKWA GROUP");
  assert.equal(lenses.consulting.experience[0].org, "AKWA GROUP");
  assert.equal(lenses.consulting.projects.recruiter[0], "saifinvest");
  assert.match(lenses.consulting.title, /Where business.*challenges meet.*technology/);
  assert.ok(lenses.consulting.system.length >= 4);
  assert.equal(lenses.consulting.cases.map(c => c.id).slice(0, 2).join(), "akwa,saifinvest");
  assert.ok(lenses.consulting.cases.every(c => c.stages.length === 4), "each case maps challenge → data → solution → decision");
  const softwareOnly = ["digital-mind", "parfum-house", "rental-car"];
  const ranked = lenses.consulting.projects.visitor;
  assert.ok(softwareOnly.every(s => !ranked.includes(s) || ranked.indexOf(s) >= ranked.length - 2), "pure software projects rank last");
});

test("data lens makes no RAG, MCP, agent or GenAI claims", () => {
  const { projects: p, ...copy } = lenses.data;
  assert.doesNotMatch(JSON.stringify(copy), /\bRAG\b|\bMCP\b|agent|generative|GenAI|LLM/i);
  assert.ok(!p.recruiter.includes("financial-rag") && !p.visitor.includes("financial-rag"));
});

test("consulting and data pages tell different stories", () => {
  const { consulting: c, data: d } = lenses;
  assert.notEqual(c.intro, d.intro); assert.notEqual(c.experienceTitle, d.experienceTitle);
  assert.notDeepEqual(c.evidence.map(e => e[1]), d.evidence.map(e => e[1]));
  assert.notDeepEqual(c.experience[0].points, d.experience[0].points);
});

test("factual corrections hold", () => {
  for (const l of Object.values(lenses)) for (const e of l.experience) if (e.org === "AKWA GROUP") assert.equal(e.role, "Data Scientist Intern");
  const saif = projects.find(p => p.slug === "saifinvest");
  assert.ok(!saif.stack.includes("FastAPI") || saif.architecture.some(a => /FastAPI/.test(a) && /v1/.test(a)), "FastAPI claim must name the verified v1 implementation");
  for (const l of Object.values(lenses)) assert.equal(l.cv, null, "CVs stay unpublished until approved");
});

test("provisional internship metrics are flagged for confirmation", () => {
  assert.ok(pendingConfirmation.length >= 5);
  const flagged = Object.values(lenses).flatMap(l => l.evidence.filter(e => e[2]).map(e => e[0]));
  for (const figure of ["98%", "6M+", "47%"]) assert.ok(flagged.includes(figure), `${figure} flagged`);
  console.log("Pending documentary confirmation before deployment:\n - " + pendingConfirmation.join("\n - "));
});

test("selector state is never persisted or transmitted", () => {
  assert.doesNotMatch(script, /localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|sendBeacon|XMLHttpRequest/);
});
