(() => {
  "use strict";
  const button = document.querySelector(".case-menu");
  const nav = document.querySelector("#case-nav");
  const main = document.querySelector("main");
  const close = ({ focus = false } = {}) => {
    button?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
    document.body.classList.remove("case-menu-open");
    main?.removeAttribute("inert");
    if (focus) button?.focus();
  };
  button?.addEventListener("click", () => {
    const opening = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(opening));
    nav?.classList.toggle("is-open", opening);
    document.body.classList.toggle("case-menu-open", opening);
    main?.toggleAttribute("inert", opening);
    if (opening) nav?.querySelector("a")?.focus();
  });
  nav?.addEventListener("click", close);
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") close({ focus: true }); });
  window.addEventListener("resize", () => { if (innerWidth > 900) close(); }, { passive: true });

  const links = [...document.querySelectorAll(".case-toc a")];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) links.forEach((link) => link.classList.toggle("is-active", link.hash === `#${active.target.id}`));
    }, { rootMargin: "-20% 0px -65%", threshold: [0, .2, .6] });
    sections.forEach((section) => observer.observe(section));
  }
})();
