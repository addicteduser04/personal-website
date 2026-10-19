(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);

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
    return `<a class="archive-row" href="/projects/${escapeHtml(project.slug)}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHtml(project.title)}</strong>
      <p>${escapeHtml(project.tagline)}</p>
      <small>${escapeHtml(label)} · ${escapeHtml(project.date)}</small>
      <i aria-hidden="true">↗</i>
    </a>`;
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

  if (window.location.pathname === "/projects" || window.location.pathname === "/projects/") {
    window.requestAnimationFrame(() => document.querySelector("#work")?.scrollIntoView());
  }
})();
