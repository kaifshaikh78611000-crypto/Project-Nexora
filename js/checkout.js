/* ============================================
   NEXORA — CHECKOUT PAGE LOGIC
   ============================================ */

(function () {
  "use strict";

  const CART_KEY = "nexora_cart";
  const ORDERS_KEY = "nexora_orders";
  const products = window.NEXORA_PRODUCTS || [];
  const FREE_SHIPPING_THRESHOLD = 2000;
  const SHIPPING_FEE = 99;

  const checkoutEmpty = document.getElementById("checkoutEmpty");
  const checkoutLayout = document.getElementById("checkoutLayout");
  const form = document.getElementById("checkoutForm");
  if (!form) return; // not on checkout page

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (typeof updateBadges === "function") updateBadges();
  }
  function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order); // newest first
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  const cart = getCart().filter((item) => products.find((p) => p.id === item.id));

  if (!cart.length) {
    checkoutEmpty.style.display = "flex";
    checkoutLayout.style.display = "none";
    return;
  }
  checkoutEmpty.style.display = "none";
  checkoutLayout.style.display = "grid";

  /* ---------- RENDER SUMMARY ---------- */
  let subtotal = 0;
  let savedTotal = 0;
  const lineItems = cart.map((item) => {
    const p = products.find((pr) => pr.id === item.id);
    const lineTotal = p.price * item.qty;
    subtotal += lineTotal;
    if (p.discount > 0) savedTotal += (p.oldPrice - p.price) * item.qty;
    return { product: p, qty: item.qty, color: item.color, size: item.size, lineTotal };
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  document.getElementById("summaryItems").innerHTML = lineItems
    .map((li) => {
      const metaBits = [`Qty ${li.qty}`];
      if (li.size) metaBits.push(li.size);
      return `
      <div class="summary-item">
        <img src="${li.product.image}" onerror="this.onerror=null;this.src='${li.product.fallbackImage}'" alt="${li.product.name}" loading="lazy">
        <div class="summary-item-info">
          <div class="summary-item-name">${li.product.name}</div>
          <div class="summary-item-meta">${metaBits.join(" · ")}</div>
        </div>
        <div class="summary-item-price">₹${li.lineTotal.toLocaleString("en-IN")}</div>
      </div>`;
    })
    .join("");

  document.getElementById("sumSubtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
  document.getElementById("sumDiscount").textContent = "-₹" + savedTotal.toLocaleString("en-IN");
  document.getElementById("sumShipping").textContent = shipping === 0 ? "Free" : "₹" + shipping;
  document.getElementById("sumTotal").textContent = "₹" + total.toLocaleString("en-IN");

  /* ---------- PAYMENT METHOD TOGGLE ---------- */
  const upiFields = document.getElementById("upiFields");
  const cardFields = document.getElementById("cardFields");
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      upiFields.style.display = radio.value === "UPI" ? "block" : "none";
      cardFields.style.display = radio.value === "Card" ? "block" : "none";
    });
  });

  /* ---------- VALIDATION HELPERS ---------- */
  function showError(id, msg) {
    const errorEl = document.getElementById(id + "Error");
    const inputEl = document.getElementById(id);
    if (errorEl) errorEl.textContent = msg || "";
    if (inputEl) inputEl.classList.toggle("invalid", !!msg);
  }

  function validate() {
    let valid = true;
    const fields = {
      fullName: (v) => (v.trim() ? "" : "Required."),
      phone: (v) => (/^\d{10}$/.test(v.trim()) ? "" : "Enter a valid 10-digit number."),
      address: (v) => (v.trim() ? "" : "Required."),
      city: (v) => (v.trim() ? "" : "Required."),
      state: (v) => (v.trim() ? "" : "Required."),
      pincode: (v) => (/^\d{6}$/.test(v.trim()) ? "" : "Enter a valid 6-digit pincode."),
    };

    Object.entries(fields).forEach(([id, validator]) => {
      const val = document.getElementById(id).value;
      const msg = validator(val);
      showError(id, msg);
      if (msg) valid = false;
    });

    return valid;
  }

  /* ---------- PLACE ORDER ---------- */
  function generateOrderId() {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return "NEXORA-" + rand;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "Processing",
      paymentMethod,
      delivery: {
        name: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value.trim(),
        pincode: document.getElementById("pincode").value.trim(),
      },
      items: lineItems.map((li) => ({
        id: li.product.id,
        name: li.product.name,
        image: li.product.image,
        fallbackImage: li.product.fallbackImage,
        qty: li.qty,
        price: li.product.price,
        color: li.color,
        size: li.size,
      })),
      subtotal,
      savedTotal,
      shipping,
      total,
    };

    saveOrder(order);
    setCart([]);

    document.getElementById("confirmOrderId").textContent = order.id;
    document.getElementById("confirmOverlay").classList.add("show");

    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        ".confirm-card",
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }
      );
      gsap.fromTo(
        ".confirm-check",
        { scale: 0 },
        { scale: 1, duration: 0.5, delay: 0.15, ease: "back.out(2)" }
      );
    }
  });
})();
