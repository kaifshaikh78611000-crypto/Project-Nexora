/* ============================================
   NEXORA — MAIN JS
   Handles: loader, custom cursor, navbar, mobile
   menu, search overlay, ambient 2D particles,
   scroll reveals (GSAP), magnetic buttons, badges.
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initCursor();
  initNavbar();
  initMobileMenu();
  initSearch();
  initParticleCanvas();
  initReveals();
  initMagneticButtons();
  initEnterStoreButton();
  updateBadges();
});

/* ---------- LOADER ---------- */
function initLoader() {
  const loader = document.getElementById("loader");
  const progress = document.getElementById("loaderProgress");
  if (!loader) return;

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 8;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      if (progress) progress.style.width = pct + "%";
      setTimeout(() => loader.classList.add("hidden"), 300);
      return;
    }
    if (progress) progress.style.width = pct + "%";
  }, 120);

  // Safety: never block the page for more than 2.5s
  setTimeout(() => loader.classList.add("hidden"), 2500);
}

/* ---------- CUSTOM CURSOR ---------- */
function initCursor() {
  if (window.matchMedia("(max-width: 900px)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(loop);
  }
  loop();

  const hoverTargets = "a, button, .cat-tile, input, .feature-card";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add("hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove("hover");
  });
}

/* ---------- NAVBAR SCROLL STATE ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!hamburger || !menu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      menu.classList.remove("open");
    });
  });
}

/* ---------- SEARCH OVERLAY ---------- */
function initSearch() {
  const btn = document.getElementById("searchBtn");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("closeSearch");
  const input = document.getElementById("searchInput");
  if (!btn || !overlay) return;

  btn.addEventListener("click", () => {
    overlay.classList.add("open");
    setTimeout(() => input && input.focus(), 300);
  });
  closeBtn && closeBtn.addEventListener("click", () => overlay.classList.remove("open"));

  input &&
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        window.location.href = "shop.html?search=" + encodeURIComponent(input.value.trim());
      }
      if (e.key === "Escape") overlay.classList.remove("open");
    });
}

/* ---------- AMBIENT 2D PARTICLE CANVAS (fallback-safe) ---------- */
function initParticleCanvas() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w, h, particles;
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 40 : 90;

  function resize() {
    w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  }

  function makeParticles() {
    particles = new Array(COUNT).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.5 + 0.15,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,184,192,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  tick();

  window.addEventListener("resize", () => {
    resize();
    makeParticles();
  });
}

/* ---------- SCROLL REVEALS ---------- */
function initReveals() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    // Fallback: just show everything (also covers pages that don't load ScrollTrigger)
    document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (no scroll trigger needed — plays on load)
  const heroTimeline = gsap.timeline({ delay: 0.3 });
  heroTimeline
    .fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
    .fromTo(".hero-title .line", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.08 }, "-=0.3")
    .fromTo(".hero-subtitle", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .fromTo(".hero-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .fromTo(".scroll-hint", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.3");

  // Generic reveal-on-scroll for anything with .reveal
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Stagger feature cards / cat tiles individually
  gsap.utils.toArray(".features-grid .feature-card").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
}

/* ---------- MAGNETIC BUTTONS ---------- */
function initMagneticButtons() {
  if (window.matchMedia("(max-width: 900px)").matches) return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

/* ---------- ENTER 3D STORE BUTTON ---------- */
function initEnterStoreButton() {
  const btn = document.getElementById("enterStoreBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.querySelector(".features")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- CART / WISHLIST BADGES ---------- */
function updateBadges() {
  try {
    const cart = JSON.parse(localStorage.getItem("nexora_cart") || "[]");
    const wishlist = JSON.parse(localStorage.getItem("nexora_wishlist") || "[]");
    const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    const cartBadge = document.getElementById("cartBadge");
    const wishlistBadge = document.getElementById("wishlistBadge");
    if (cartBadge) cartBadge.textContent = cartCount;
    if (wishlistBadge) wishlistBadge.textContent = wishlist.length;
  } catch (e) {
    /* localStorage unavailable — ignore */
  }
}
