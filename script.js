(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
  const safeUrl = (value) => {
    try {
      const url = new URL(value, window.location.origin);
      return ["https:", "http:", "mailto:"].includes(url.protocol) ? escapeHtml(url.href) : "#";
    } catch {
      return "#";
    }
  };

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const progress = document.querySelector(".page-progress span");
  const liveRegion = document.querySelector("[data-live-region]");
  const year = document.querySelector("[data-year]");
  let lastScroll = window.scrollY;
  let ticking = false;

  if (year) year.textContent = new Date().getFullYear();

  function updateScrollUi() {
    const current = window.scrollY;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    if (progress) progress.style.transform = `scaleX(${Math.min(current / max, 1)})`;
    if (header) {
      header.classList.toggle("is-scrolled", current > 20);
      const shouldHide = current > lastScroll && current > 420 && !document.body.classList.contains("menu-open");
      header.classList.toggle("is-hidden", shouldHide);
    }
    lastScroll = current;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUi);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUi();

  function closeMenu({ restoreFocus = false } = {}) {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    document.querySelector("main")?.removeAttribute("inert");
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const opening = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(opening));
      nav.classList.toggle("is-open", opening);
      document.body.classList.toggle("menu-open", opening);
      document.querySelector("main")?.toggleAttribute("inert", opening);
      header?.classList.remove("is-hidden");
      if (opening) nav.querySelector("a")?.focus();
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu({ restoreFocus: true });
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1040) closeMenu();
    }, { passive: true });
  }

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -7%" });
    revealItems.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${visible.target.id}`));
    }, { rootMargin: "-25% 0px -60%", threshold: [0, .15, .5] });
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  if (finePointer.matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
      });
    });
  }

  const video = document.querySelector(".hero-video");
  const videoControl = document.querySelector("[data-video-control]");
  function setVideoControl(playing) {
    if (!videoControl) return;
    videoControl.setAttribute("aria-label", playing ? "Pause background video" : "Play background video");
    const icon = videoControl.querySelector("span");
    if (icon) icon.textContent = playing ? "Ⅱ" : "▶";
  }
  function applyMotionPreference() {
    if (!video) return;
    if (reduceMotion.matches) {
      video.pause();
      setVideoControl(false);
    } else {
      video.play().then(() => setVideoControl(true)).catch(() => setVideoControl(false));
    }
  }
  if (video && videoControl) {
    videoControl.addEventListener("click", () => {
      if (video.paused) video.play().then(() => setVideoControl(true)).catch(() => setVideoControl(false));
      else {
        video.pause();
        setVideoControl(false);
      }
    });
    video.addEventListener("play", () => setVideoControl(true));
    video.addEventListener("pause", () => setVideoControl(false));
    applyMotionPreference();
    reduceMotion.addEventListener?.("change", applyMotionPreference);
  }

  const categoryLabels = {
    quant: "Quantitative finance",
    data: "Data & AI",
    digital: "Digital systems",
    fullstack: "Full-stack"
  };
  const archiveList = document.querySelector("[data-project-list]");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];

  function projectRow(project, index) {
    const label = categoryLabels[project.categories?.[0]] || "Engineering";
    return `<button class="archive-row" type="button" data-project="${escapeHtml(project.slug)}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHtml(project.title)}</strong>
      <p>${escapeHtml(project.tagline)}</p>
      <small>${escapeHtml(label)} · ${escapeHtml(project.date)}</small>
      <i aria-hidden="true">↗</i>
    </button>`;
  }

  function renderArchive(filter = "all") {
    if (!archiveList) return;
    const visible = filter === "all" ? projects : projects.filter((project) => project.categories?.includes(filter));
    archiveList.innerHTML = visible.map(projectRow).join("");
    if (liveRegion) liveRegion.textContent = `${visible.length} projects shown`;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      renderArchive(button.dataset.filter);
    });
  });
  renderArchive();

  const dialog = document.querySelector("#project-dialog");
  const dialogContent = document.querySelector("[data-dialog-content]");
  const dialogClose = document.querySelector("[data-dialog-close]");
  let activeProject = null;

  function listMarkup(items = []) {
    return items.length ? `<ul class="case-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
  }

  function caseStudyMarkup(project) {
    const categories = (project.categories || []).map((category) => categoryLabels[category] || category).join(" · ");
    const externalLinks = [
      project.github ? `<a href="${safeUrl(project.github)}" target="_blank" rel="noreferrer">View source on GitHub <span aria-hidden="true">↗</span></a>` : "",
      project.demo ? `<a href="${safeUrl(project.demo)}" target="_blank" rel="noreferrer">Open live application <span aria-hidden="true">↗</span></a>` : ""
    ].join("");
    return `<article class="case-study">
      <header class="case-hero">
        <div class="case-hero-copy">
          <p class="case-eyebrow">${escapeHtml(project.date)} / ${escapeHtml(categories)}</p>
          <h2 id="dialog-title">${escapeHtml(project.title)}</h2>
          <p>${escapeHtml(project.tagline)}</p>
          <div class="case-stack">${(project.stack || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </div>
        <div class="case-links">${externalLinks}</div>
      </header>
      <div class="case-body">
        <aside class="case-aside">
          <div class="case-status"><span>Project status</span><strong>${escapeHtml(project.status)}</strong></div>
          <dl>
            <div><dt>Repository</dt><dd>${escapeHtml(project.repo || "Documented project")}</dd></div>
            <div><dt>Year</dt><dd>${escapeHtml(project.date)}</dd></div>
            <div><dt>Domains</dt><dd>${escapeHtml(categories)}</dd></div>
          </dl>
        </aside>
        <div class="case-sections">
          <section class="case-section"><span>01 / PROBLEM</span><h3>Why this work exists</h3><p>${escapeHtml(project.problem)}</p></section>
          <section class="case-section"><span>02 / ENGINEERING APPROACH</span><h3>How the system responds</h3><p>${escapeHtml(project.solution)}</p>${listMarkup(project.features)}</section>
          <section class="case-section"><span>03 / ARCHITECTURE</span><h3>What makes it work</h3>${listMarkup(project.architecture)}</section>
          <section class="case-section"><span>04 / CRITICAL CONSTRAINT</span><h3>The hard part</h3><p>${escapeHtml(project.challenge)}</p></section>
          <section class="case-section"><span>05 / OUTCOME</span><h3>What the evidence supports</h3><p>${escapeHtml(project.impact)}</p></section>
        </div>
      </div>
    </article>`;
  }

  function openProject(slug) {
    const project = bySlug.get(slug);
    if (!project || !dialog || !dialogContent) return;
    activeProject = project;
    dialogContent.innerHTML = caseStudyMarkup(project);
    dialogContent.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
    if (liveRegion) liveRegion.textContent = `${project.title} case study opened`;
  }

  function closeProject() {
    if (dialog?.open) dialog.close();
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project]");
    if (!trigger) return;
    event.preventDefault();
    openProject(trigger.dataset.project);
  });

  dialogClose?.addEventListener("click", closeProject);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeProject();
  });
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (activeProject && liveRegion) liveRegion.textContent = `${activeProject.title} case study closed`;
    activeProject = null;
  });

  const deepProject = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1];
  if (deepProject && bySlug.has(deepProject)) {
    window.requestAnimationFrame(() => openProject(deepProject));
  } else if (window.location.pathname === "/projects" || window.location.pathname === "/projects/") {
    window.requestAnimationFrame(() => document.querySelector("#work")?.scrollIntoView());
  }
})();
