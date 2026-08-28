/* ============================================
   NEXORA — CART PAGE LOGIC
   ============================================ */

(function () {
  "use strict";

  const CART_KEY = "nexora_cart";
  const products = window.NEXORA_PRODUCTS || [];
  const FREE_SHIPPING_THRESHOLD = 2000;
  const SHIPPING_FEE = 99;

  const cartEmpty = document.getElementById("cartEmpty");
  const cartLayout = document.getElementById("cartLayout");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTitle = document.getElementById("cartTitle");
  if (!cartItemsEl) return; // not on cart page

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (typeof updateBadges === "function") updateBadges();
  }
  function itemKey(item) {
    return item.key || item.id;
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
    const cart = getCart();

    // Filter out any items whose product no longer exists in the catalog
    const validCart = cart.filter((item) => products.find((p) => p.id === item.id));
    if (validCart.length !== cart.length) setCart(validCart);

    if (!validCart.length) {
      cartEmpty.style.display = "flex";
      cartLayout.style.display = "none";
      cartTitle.textContent = "Cart";
      return;
    }

    cartEmpty.style.display = "none";
    cartLayout.style.display = "grid";

    const totalQty = validCart.reduce((sum, i) => sum + i.qty, 0);
    cartTitle.textContent = `Cart (${totalQty} item${totalQty === 1 ? "" : "s"})`;

    cartItemsEl.innerHTML = validCart
      .map((item) => {
        const p = products.find((pr) => pr.id === item.id);
        const lineTotal = p.price * item.qty;
        const metaBits = [];
        if (item.color) metaBits.push(`<span class="ci-swatch" style="background:${item.color}"></span>Color`);
        if (item.size) metaBits.push(`Size: ${item.size}`);

        return `
        <div class="cart-item" data-key="${itemKey(item)}">
          <a href="product.html?id=${p.id}" class="ci-media">
            <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage}'" alt="${p.name}" loading="lazy">
          </a>
          <div class="ci-info">
            <div class="ci-category">${p.category}</div>
            <a href="product.html?id=${p.id}"><h3 class="ci-name">${p.name}</h3></a>
            ${metaBits.length ? `<div class="ci-meta">${metaBits.join(" · ")}</div>` : ""}
            <div class="ci-price-row">
              <span class="ci-price">₹${p.price.toLocaleString("en-IN")}</span>
              ${p.discount > 0 ? `<span class="ci-old-price">₹${p.oldPrice.toLocaleString("en-IN")}</span>` : ""}
            </div>
          </div>
          <div class="ci-actions">
            <div class="ci-line-total">₹${lineTotal.toLocaleString("en-IN")}</div>
            <div class="ci-qty">
              <button class="ci-minus" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button class="ci-plus" aria-label="Increase quantity">+</button>
            </div>
            <button class="ci-remove">Remove</button>
          </div>
        </div>`;
      })
      .join("");

    wireItemEvents();
    renderSummary(validCart);
  }

  function wireItemEvents() {
    cartItemsEl.querySelectorAll(".cart-item").forEach((el) => {
      const key = el.dataset.key;
      el.querySelector(".ci-plus").addEventListener("click", () => changeQty(key, 1));
      el.querySelector(".ci-minus").addEventListener("click", () => changeQty(key, -1));
      el.querySelector(".ci-remove").addEventListener("click", () => removeItem(key));
    });
  }

  function changeQty(key, delta) {
    const cart = getCart();
    const item = cart.find((i) => itemKey(i) === key);
    if (!item) return;
    item.qty = Math.max(1, Math.min(10, item.qty + delta));
    setCart(cart);
    render();
  }

  function removeItem(key) {
    let cart = getCart();
    cart = cart.filter((i) => itemKey(i) !== key);
    setCart(cart);
    showToast("Removed from cart");
    render();
  }

  function renderSummary(cart) {
    let subtotal = 0;
    let savedTotal = 0;

    cart.forEach((item) => {
      const p = products.find((pr) => pr.id === item.id);
      subtotal += p.price * item.qty;
      if (p.discount > 0) savedTotal += (p.oldPrice - p.price) * item.qty;
    });

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    document.getElementById("sumSubtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
    document.getElementById("sumDiscount").textContent = "-₹" + savedTotal.toLocaleString("en-IN");
    document.getElementById("sumShipping").textContent = shipping === 0 ? "Free" : "₹" + shipping;
    document.getElementById("sumTotal").textContent = "₹" + total.toLocaleString("en-IN");

    const note = document.getElementById("shippingNote");
    if (shipping === 0) {
      note.textContent = "You've unlocked free shipping.";
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      note.textContent = `Add ₹${remaining.toLocaleString("en-IN")} more for free shipping.`;
    }

    // Persist a snapshot for checkout.html to read
    sessionStorage.setItem(
      "nexora_cart_summary",
      JSON.stringify({ subtotal, savedTotal, shipping, total })
    );
  }

  document.getElementById("clearCartBtn").addEventListener("click", () => {
    setCart([]);
    showToast("Cart cleared");
    render();
  });

  render();
})();
