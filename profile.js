(() => {
  "use strict";

  const profiles = {
    quant: {
      label: "Quant Finance",
      code: "QF / 01",
      thesis: "A quantitative engineer who treats assumptions, chronology, and model limits as part of the result.",
      projectIntro: "Research selected for fixed-income modelling, portfolio construction, derivatives, and risk analytics.",
      projects: ["nelson-siegel", "market-regimes", "black-scholes", "equity-crash", "portfolio-optimization", "saifinvest"],
      experience: [
        { period: "Jun — Aug 2026", role: "Quantitative Research Intern — Fixed Income", org: "Sterling Asset Management", place: "Casablanca", href: "/experience/sterling-asset-management", points: ["Worked with the Fixed Income Portfolio Manager on bond-market analysis, portfolio construction, and investment decisions.", "Managed a virtual bond-portfolio case study from security selection through allocation and monitoring.", "Researched Moroccan yield-curve forecasting with Dynamic Nelson–Siegel and time-series / machine-learning models using walk-forward validation."] },
        { period: "Expected Jun 2027", role: "Engineering Degree — Data & Finance", org: "ENSIAS", place: "Rabat", points: ["Academic foundation spanning stochastic calculus, derivatives pricing, time series, numerical methods, econometrics, probability, and statistics."] }
      ],
      skills: [
        ["Fixed income", "Term structures · Nelson–Siegel · bond selection · portfolio construction"],
        ["Risk & allocation", "VaR / CVaR · drawdown · HMM regimes · Markowitz · Black–Litterman"],
        ["Research discipline", "Walk-forward validation · backtesting · leakage control · benchmark comparison"],
        ["Tools", "Python · pandas · NumPy · SciPy · statsmodels · scikit-learn · SQL"]
      ],
      contactTitle: "Build financial models that survive contact with the data.",
      contactCopy: "For quantitative research, fixed-income, risk, systematic investing, or quant-development opportunities."
    },
    data: {
      label: "Data & AI",
      code: "DA / 02",
      thesis: "A data engineer and applied-ML practitioner who turns difficult information into traceable decision systems.",
      projectIntro: "Work selected for machine learning, NLP, anomaly detection, predictive analytics, and dependable data flows.",
      projects: ["equity-crash", "stocktwits", "audit-intelligent", "financial-rag", "market-regimes", "trading-lab"],
      experience: [
        { period: "Jun — Sep 2025", role: "Data Scientist Intern", org: "AKWA GROUP", place: "Casablanca", href: "/experience/akwa-group", points: ["Built an end-to-end machine-learning pipeline to detect and classify missing transaction records.", "Handled preprocessing, feature engineering, model comparison, evaluation, and the path into an ERP data workflow."] },
        { period: "Jun — Aug 2026", role: "Quantitative Research Intern — Fixed Income", org: "Sterling Asset Management", place: "Casablanca", href: "/experience/sterling-asset-management", points: ["Applied time-series and machine-learning methods to Moroccan yield-curve forecasting with chronological walk-forward validation."] },
        { period: "Expected Jun 2027", role: "Engineering Degree — Data & Finance", org: "ENSIAS", place: "Rabat", points: ["Academic foundation in machine learning, deep learning, econometrics, time series, probability, and statistics."] }
      ],
      skills: [
        ["Machine learning", "Classification · rare events · anomaly detection · unsupervised learning · model comparison"],
        ["Data engineering", "Feature pipelines · validation · SQL · PostgreSQL · data quality · migrations"],
        ["Applied AI", "PyTorch · BERTweet · embeddings · FAISS · RAG · grounded retrieval"],
        ["Tools", "Python · pandas · scikit-learn · XGBoost · FastAPI · Streamlit · Docker"]
      ],
      contactTitle: "Turn noisy data into a decision someone can trust.",
      contactCopy: "For data science, data engineering, machine learning, or applied-AI opportunities."
    },
    digital: {
      label: "IT & Digital Transformation",
      code: "DT / 03",
      thesis: "An IT consultant and software engineer who maps real operations, then delivers systems people can actually use.",
      projectIntro: "Production and product work selected for enterprise workflows, systems integration, automation, and full-stack delivery.",
      projects: ["dwarven-industry", "dentalmarket", "saifinvest", "audit-intelligent", "digital-mind", "parfum-house"],
      experience: [
        { period: "Dec 2025 — Feb 2026", role: "IT Consultant — Management System", org: "Dwarven Industry", place: "Production", href: "/projects/dwarven-industry", points: ["Translated commercial operations into one role-aware system covering inventory, clients, suppliers, orders, quotations, and invoicing.", "Connected the operating sequence from quote to order to invoice with dashboards and access controls."] },
        { period: "Jul — Sep 2026", role: "IT Consultant — Commerce Platform", org: "DentalMarket / DENTANOVA", place: "Production", href: "/projects/dentalmarket", points: ["Moved a WhatsApp-only sales process into a structured storefront while preserving the familiar order-confirmation channel."] },
        { period: "Jun — Sep 2025", role: "Data Scientist Intern", org: "AKWA GROUP", place: "Casablanca", href: "/experience/akwa-group", points: ["Built a machine-learning workflow around missing enterprise transaction records and their path into an ERP data process."] }
      ],
      skills: [
        ["Consulting & discovery", "Requirements · workflow design · process mapping · operational KPIs"],
        ["Business systems", "ERP-related workflows · commerce · inventory · role-based operations · automation"],
        ["Application delivery", "Next.js · React · TypeScript · APIs · responsive product interfaces"],
        ["Data & infrastructure", "PostgreSQL · Supabase · Prisma · Drizzle · Docker · Vercel"]
      ],
      contactTitle: "Replace a fragmented process with one coherent system.",
      contactCopy: "For IT consulting, enterprise technology, digital transformation, or full-stack delivery opportunities."
    }
  };

  const key = document.body.dataset.profile;
  const profile = profiles[key];
  const catalogue = window.PORTFOLIO_DATA?.projects || [];
  const bySlug = new Map(catalogue.map((project) => [project.slug, project]));
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

  if (!profile) return;

  document.querySelectorAll("[data-profile-label]").forEach((node) => { node.textContent = profile.label; });
  document.querySelectorAll("[data-profile-code]").forEach((node) => { node.textContent = profile.code; });
  const thesis = document.querySelector("[data-profile-thesis]");
  if (thesis) thesis.textContent = profile.thesis;
  const projectIntro = document.querySelector("[data-project-intro]");
  if (projectIntro) projectIntro.textContent = profile.projectIntro;

  const projectGrid = document.querySelector("[data-profile-projects]");
  if (projectGrid) {
    projectGrid.innerHTML = profile.projects.map((slug, index) => {
      const project = bySlug.get(slug);
      if (!project) return "";
      const links = [
        `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a>`,
        project.demo ? `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noreferrer">Live <span aria-hidden="true">↗</span></a>` : ""
      ].join("");
      return `<article class="profile-project reveal">
        <div class="profile-project-index"><span>${String(index + 1).padStart(2, "0")}</span><small>${escapeHtml(project.date)}</small></div>
        <div><p>${escapeHtml(project.status)}</p><h3><a href="/projects/${escapeHtml(project.slug)}">${escapeHtml(project.title)}</a></h3><strong>${escapeHtml(project.tagline)}</strong><p>${escapeHtml(project.summary)}</p><ul>${project.stack.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><div class="profile-project-links"><a href="/projects/${escapeHtml(project.slug)}">Read case study <span aria-hidden="true">→</span></a>${links}</div></div>
      </article>`;
    }).join("");
  }

  const experienceList = document.querySelector("[data-profile-experience]");
  if (experienceList) {
    experienceList.innerHTML = profile.experience.map((role) => `<article class="profile-role reveal">
      <div><span>${escapeHtml(role.period)}</span><small>${escapeHtml(role.place)}</small></div>
      <header><p>${escapeHtml(role.role)}</p><h3>${role.href ? `<a href="${escapeHtml(role.href)}">${escapeHtml(role.org)}</a>` : escapeHtml(role.org)}</h3>${role.href ? `<a class="profile-role-link" href="${escapeHtml(role.href)}">View evidence <span aria-hidden="true">→</span></a>` : ""}</header>
      <ul>${role.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    </article>`).join("");
  }

  const skillList = document.querySelector("[data-profile-skills]");
  if (skillList) {
    skillList.innerHTML = profile.skills.map(([title, items], index) => `<article class="profile-skill reveal"><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(items)}</p></article>`).join("");
  }

  const contactTitle = document.querySelector("[data-contact-title]");
  const contactCopy = document.querySelector("[data-contact-copy]");
  if (contactTitle) contactTitle.textContent = profile.contactTitle;
  if (contactCopy) contactCopy.textContent = profile.contactCopy;
  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  const menuToggle = document.querySelector(".profile-menu-toggle");
  const nav = document.querySelector(".profile-switcher");
  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
    document.body.classList.remove("profile-menu-open");
    document.querySelector("main")?.removeAttribute("inert");
  };
  menuToggle?.addEventListener("click", () => {
    const opening = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(opening));
    nav?.classList.toggle("is-open", opening);
    document.body.classList.toggle("profile-menu-open", opening);
    document.querySelector("main")?.toggleAttribute("inert", opening);
    if (opening) nav?.querySelector("a")?.focus();
  });
  nav?.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); menuToggle?.focus(); } });
  window.addEventListener("resize", () => { if (window.innerWidth > 1050) closeMenu(); }, { passive: true });

  const revealItems = [...document.querySelectorAll(".reveal")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) revealItems.forEach((item) => item.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: .1, rootMargin: "0px 0px -6%" });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
