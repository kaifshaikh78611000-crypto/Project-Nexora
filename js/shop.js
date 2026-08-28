/* ============================================
   NEXORA — SHOP PAGE LOGIC
   Renders products, applies filters/sort/search,
   and wires add-to-cart / wishlist buttons.
   Reads/writes the same localStorage keys used
   across the whole site: nexora_cart, nexora_wishlist
   ============================================ */

(function () {
  "use strict";

  const CART_KEY = "nexora_cart";
  const WISHLIST_KEY = "nexora_wishlist";

  const products = window.NEXORA_PRODUCTS || [];

  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  const sortSelect = document.getElementById("sortSelect");
  const categoryFilters = document.getElementById("categoryFilters");
  const brandFilters = document.getElementById("brandFilters");
  const ratingFilters = document.getElementById("ratingFilters");
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const priceSlider = document.getElementById("priceSlider");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const emptyClearBtn = document.getElementById("emptyClear");
  const filterToggle = document.getElementById("filterToggle");
  const filterSidebar = document.getElementById("filterSidebar");
  const toast = document.getElementById("toast");

  if (!grid) return; // not on shop page

  /* ---------- STORAGE HELPERS ---------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    refreshBadges();
  }
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function setWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    refreshBadges();
  }
  function refreshBadges() {
    if (typeof updateBadges === "function") updateBadges();
  }

  function addToCart(id) {
    const cart = getCart();
    const existing = cart.find((c) => c.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    setCart(cart);
    showToast("Added to cart");
  }

  function toggleWishlist(id, btn) {
    let list = getWishlist();
    const has = list.includes(id);
    if (has) list = list.filter((x) => x !== id);
    else list.push(id);
    setWishlist(list);
    if (btn) btn.classList.toggle("active", !has);
    showToast(has ? "Removed from wishlist" : "Added to wishlist");
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  /* ---------- BUILD BRAND FILTER LIST ---------- */
  function buildBrandFilters() {
    const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
    brandFilters.innerHTML = brands
      .map(
        (b) =>
          `<label class="checkbox-row"><input type="checkbox" value="${b}"><span>${b}</span></label>`
      )
      .join("");
  }

  /* ---------- READ URL PARAMS ---------- */
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category");
  const initialSearch = urlParams.get("search");

  if (initialCategory) {
    const cb = categoryFilters.querySelector(`input[value="${initialCategory}"]`);
    if (cb) cb.checked = true;
  }
  if (initialSearch) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = initialSearch;
  }

  /* ---------- FILTER STATE ---------- */
  function getActiveFilters() {
    const categories = Array.from(categoryFilters.querySelectorAll("input:checked")).map((i) => i.value);
    const brands = Array.from(brandFilters.querySelectorAll("input:checked")).map((i) => i.value);
    const minRatingInput = ratingFilters.querySelector("input:checked");
    const minRating = minRatingInput ? parseFloat(minRatingInput.value) : 0;
    const min = priceMin.value ? parseFloat(priceMin.value) : 0;
    const max = priceMax.value ? parseFloat(priceMax.value) : Infinity;
    const search = (urlParams.get("search") || "").toLowerCase();
    return { categories, brands, minRating, min, max, search };
  }

  function applyFilters() {
    const f = getActiveFilters();
    let list = products.filter((p) => {
      if (f.categories.length && !f.categories.includes(p.category)) return false;
      if (f.brands.length && !f.brands.includes(p.brand)) return false;
      if (p.rating < f.minRating) return false;
      if (p.price < f.min || p.price > f.max) return false;
      if (f.search && !p.name.toLowerCase().includes(f.search) && !p.category.toLowerCase().includes(f.search)) return false;
      return true;
    });

    list = sortProducts(list, sortSelect.value);
    render(list);
  }

  function sortProducts(list, mode) {
    const copy = [...list];
    switch (mode) {
      case "price-asc":
        return copy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return copy.sort((a, b) => b.price - a.price);
      case "rating":
        return copy.sort((a, b) => b.rating - a.rating);
      case "newest":
        return copy.sort((a, b) => (a.id < b.id ? 1 : -1));
      case "featured":
      default:
        return copy.sort((a, b) => (b.featured === true) - (a.featured === true));
    }
  }

  /* ---------- RENDER ---------- */
  function render(list) {
    const wishlist = getWishlist();
    resultCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;

    if (!list.length) {
      grid.innerHTML = "";
      emptyState.style.display = "flex";
      return;
    }
    emptyState.style.display = "none";

    grid.innerHTML = list
      .map((p) => {
        const inWishlist = wishlist.includes(p.id);
        return `
        <article class="product-card" data-id="${p.id}">
          <a href="product.html?id=${p.id}" class="product-media">
            <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage}'" alt="${p.name}" loading="lazy">
            <div class="product-badges">
              ${p.discount > 0 ? `<span class="badge-pill discount">-${p.discount}%</span>` : ""}
              ${p.featured ? `<span class="badge-pill featured">Featured</span>` : ""}
            </div>
          </a>
          <button class="wishlist-toggle ${inWishlist ? "active" : ""}" data-id="${p.id}" aria-label="Toggle wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWishlist ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          </button>
          <button class="quick-add" data-id="${p.id}">ADD TO CART</button>
          <div class="product-info">
            <span class="product-category">${p.category}</span>
            <a href="product.html?id=${p.id}"><h3 class="product-name">${p.name}</h3></a>
            <div class="product-rating">
              <span class="stars">★</span>
              <span>${p.rating.toFixed(1)} (${p.reviews})</span>
            </div>
            <div class="product-price-row">
              <span class="price-current">₹${p.price.toLocaleString("en-IN")}</span>
              ${p.discount > 0 ? `<span class="price-old">₹${p.oldPrice.toLocaleString("en-IN")}</span>` : ""}
            </div>
          </div>
        </article>`;
      })
      .join("");

    // Reveal animation for freshly rendered cards
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        grid.querySelectorAll(".product-card"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power3.out" }
      );
    }

    wireCardEvents();
  }

  function wireCardEvents() {
    grid.querySelectorAll(".wishlist-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleWishlist(btn.dataset.id, btn);
      });
    });
    grid.querySelectorAll(".quick-add").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        addToCart(btn.dataset.id);
      });
    });
  }

  /* ---------- EVENTS ---------- */
  categoryFilters.addEventListener("change", applyFilters);
  brandFilters.addEventListener("change", applyFilters);
  ratingFilters.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  [priceMin, priceMax].forEach((el) => {
    el.addEventListener("input", debounce(applyFilters, 300));
  });
  priceSlider.addEventListener("input", () => {
    priceMax.value = priceSlider.value;
    applyFilters();
  });

  clearFiltersBtn.addEventListener("click", clearAll);
  emptyClearBtn.addEventListener("click", clearAll);

  function clearAll() {
    categoryFilters.querySelectorAll("input").forEach((i) => (i.checked = false));
    brandFilters.querySelectorAll("input").forEach((i) => (i.checked = false));
    ratingFilters.querySelector('input[value="0"]').checked = true;
    priceMin.value = "";
    priceMax.value = "";
    priceSlider.value = priceSlider.max;
    urlParams.delete("search");
    urlParams.delete("category");
    window.history.replaceState({}, "", window.location.pathname);
    applyFilters();
  }

  // Mobile filter drawer
  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener("click", () => filterSidebar.classList.add("open"));
    document.addEventListener("click", (e) => {
      if (
        filterSidebar.classList.contains("open") &&
        !filterSidebar.contains(e.target) &&
        e.target !== filterToggle &&
        !filterToggle.contains(e.target)
      ) {
        filterSidebar.classList.remove("open");
      }
    });
  }

  function debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  /* ---------- INIT ---------- */
  buildBrandFilters();
  applyFilters();
})();
