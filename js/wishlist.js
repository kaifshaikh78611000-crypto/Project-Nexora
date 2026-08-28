/* ============================================
   NEXORA — WISHLIST PAGE LOGIC
   ============================================ */

(function () {
  "use strict";

  const CART_KEY = "nexora_cart";
  const WISHLIST_KEY = "nexora_wishlist";
  const products = window.NEXORA_PRODUCTS || [];

  const grid = document.getElementById("wishlistGrid");
  const emptyState = document.getElementById("wishlistEmpty");
  const title = document.getElementById("wishlistTitle");
  if (!grid) return; // not on wishlist page

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"); } catch (e) { return []; }
  }
  function setWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    if (typeof updateBadges === "function") updateBadges();
  }
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (typeof updateBadges === "function") updateBadges();
  }
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function render() {
    const ids = getWishlist();
    const items = ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

    // Clean up ids that no longer match a real product
    if (items.length !== ids.length) setWishlist(items.map((p) => p.id));

    title.textContent = `Wishlist (${items.length})`;

    if (!items.length) {
      emptyState.style.display = "flex";
      grid.style.display = "none";
      return;
    }
    emptyState.style.display = "none";
    grid.style.display = "grid";

    grid.innerHTML = items
      .map(
        (p) => `
        <div class="wish-card" data-id="${p.id}">
          <a href="product.html?id=${p.id}" class="wish-media">
            <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage}'" alt="${p.name}" loading="lazy">
          </a>
          <button class="wish-remove" aria-label="Remove from wishlist">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          </button>
          <div class="wish-info">
            <span class="wish-category">${p.category}</span>
            <a href="product.html?id=${p.id}"><h3 class="wish-name">${p.name}</h3></a>
            <div class="wish-price-row">
              <span class="wish-price">₹${p.price.toLocaleString("en-IN")}</span>
              ${p.discount > 0 ? `<span class="wish-old-price">₹${p.oldPrice.toLocaleString("en-IN")}</span>` : ""}
            </div>
            <button class="wish-move-btn">MOVE TO CART</button>
          </div>
        </div>`
      )
      .join("");

    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        grid.querySelectorAll(".wish-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }
      );
    }

    wireEvents();
  }

  function wireEvents() {
    grid.querySelectorAll(".wish-card").forEach((card) => {
      const id = card.dataset.id;

      card.querySelector(".wish-remove").addEventListener("click", (e) => {
        e.preventDefault();
        removeFromWishlist(id);
      });

      card.querySelector(".wish-move-btn").addEventListener("click", (e) => {
        e.preventDefault();
        moveToCart(id);
      });
    });
  }

  function removeFromWishlist(id) {
    const list = getWishlist().filter((x) => x !== id);
    setWishlist(list);
    showToast("Removed from wishlist");
    render();
  }

  function moveToCart(id) {
    const cart = getCart();
    const existing = cart.find((c) => c.id === id && !c.key);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    setCart(cart);

    const list = getWishlist().filter((x) => x !== id);
    setWishlist(list);

    showToast("Moved to cart");
    render();
  }

  render();
})();
