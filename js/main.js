/* Vigorous Marketing — minimal interactions */
(() => {
  "use strict";

  // mobile nav
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // gentle fade-in on scroll
  const targets = document.querySelectorAll(
    ".service, .why__item, .testimonials blockquote, .about h2, .section-title"
  );
  targets.forEach((el) => el.classList.add("fade-in"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => io.observe(el));

  // footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
