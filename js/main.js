/* ═══════════════════════════════════════════════════════════
   VIGOROUS — interaction layer
   Cursor · magnetic elements · reveals · parallax · canvas
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ─────────── preloader ─────────── */
  const preloader = document.getElementById("preloader");
  const countEl = document.getElementById("preloaderCount");
  {
    const t0 = performance.now();
    const DURATION = reduceMotion ? 1 : 1100;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      countEl.textContent = String(Math.round(eased * 100)).padStart(2, "0");
      if (p < 1) requestAnimationFrame(tick);
      else {
        preloader.classList.add("is-done");
        document.body.classList.add("is-loaded");
      }
    };
    requestAnimationFrame(tick);
  }

  /* ─────────── custom cursor ─────────── */
  if (finePointer && !reduceMotion) {
    document.body.classList.add("has-cursor");
    const cursor = document.getElementById("cursor");
    const dot = cursor.querySelector(".cursor__dot");
    const ring = cursor.querySelector(".cursor__ring");
    const label = cursor.querySelector(".cursor__label");
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function loop() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();

    const HOVER_SEL = "a, button, [data-magnetic]";
    document.addEventListener("mouseover", (e) => {
      const labelled = e.target.closest("[data-cursor]");
      if (labelled) {
        label.textContent = labelled.dataset.cursor;
        cursor.classList.add("has-label");
      } else if (e.target.closest(HOVER_SEL)) {
        cursor.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("[data-cursor]")) cursor.classList.remove("has-label");
      if (e.target.closest(HOVER_SEL)) cursor.classList.remove("is-hover");
    });
  }

  /* ─────────── magnetic elements ─────────── */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.32;
      let raf = null;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        });
      });
      el.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transition = "transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
        el.style.transform = "translate(0, 0)";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  /* ─────────── nav: glass + hide on scroll down ─────────── */
  const nav = document.getElementById("nav");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > 500 && y > lastY && !menu.classList.contains("is-open"));
    lastY = y;
  }, { passive: true });

  /* ─────────── fullscreen menu ─────────── */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ─────────── reveal on scroll ─────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal-line, .split-reveal, .project, .step")
    .forEach((el) => io.observe(el));

  // headline line reveals (hero plays after preloader, others on scroll)
  const heroTitle = document.querySelector(".hero__title");
  setTimeout(() => heroTitle.classList.add("is-in"), reduceMotion ? 0 : 1250);
  document.querySelectorAll(".cta__title").forEach((el) => io.observe(el));

  /* ─────────── counters ─────────── */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const t0 = performance.now();
      const D = reduceMotion ? 1 : 1400;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / D);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

  /* ─────────── story: word-by-word light-up ─────────── */
  const storyText = document.getElementById("storyText");
  if (storyText) {
    const wrap = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((piece) => {
            if (/^\s+$/.test(piece) || piece === "") {
              frag.appendChild(document.createTextNode(piece));
            } else {
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = piece;
              frag.appendChild(s);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrap(child);
        }
      });
    };
    wrap(storyText);
    const words = storyText.querySelectorAll(".w");

    if (!reduceMotion) {
      const onScroll = () => {
        const r = storyText.getBoundingClientRect();
        const vh = innerHeight;
        // progress: 0 when top hits 85% of viewport, 1 when bottom passes 40%
        const start = vh * 0.85;
        const end = vh * 0.35;
        const p = Math.min(1, Math.max(0, (start - r.top) / (r.height + start - end)));
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
      };
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ─────────── parallax ─────────── */
  if (!reduceMotion) {
    const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
    const parallaxImgs = [...document.querySelectorAll("[data-parallax-img]")];
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      parallaxEls.forEach((el) => {
        const speed = +el.dataset.parallax;
        el.style.transform = `translateY(${scrollY * speed * -1}px)`;
      });
      parallaxImgs.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5-ish
        el.style.translate = `0 ${p * -26}px`;
      });
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ─────────── capabilities accordion ─────────── */
  document.querySelectorAll(".cap").forEach((cap) => {
    const row = cap.querySelector(".cap__row");
    row.setAttribute("tabindex", "0");
    row.setAttribute("role", "button");
    row.setAttribute("aria-expanded", "false");
    const toggle = () => {
      const open = cap.classList.toggle("is-open");
      row.setAttribute("aria-expanded", String(open));
    };
    row.addEventListener("click", toggle);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ─────────── testimonials ─────────── */
  {
    const voices = [...document.querySelectorAll(".voice")];
    const dots = [...document.querySelectorAll(".voices__dot")];
    let idx = 0, timer = null;
    const show = (i) => {
      idx = (i + voices.length) % voices.length;
      voices.forEach((v, k) => v.classList.toggle("is-active", k === idx));
      dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
    };
    const arm = () => {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => show(idx + 1), 6000);
    };
    dots.forEach((d, k) => d.addEventListener("click", () => { show(k); arm(); }));
    arm();
  }

  /* ─────────── intelligence canvas: drifting constellation ─────────── */
  const canvas = document.getElementById("intelCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, dpr, pts = [], running = false;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor((W * H) / 22000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.4,
      }));
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const LINK = 130;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.14;
            ctx.strokeStyle = `rgba(174, 209, 55, ${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(195, 221, 102, 0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    const visIO = new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) requestAnimationFrame(draw);
    });
    visIO.observe(canvas);
    addEventListener("resize", resize, { passive: true });
    resize();
  }

  /* ─────────── footer year ─────────── */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
