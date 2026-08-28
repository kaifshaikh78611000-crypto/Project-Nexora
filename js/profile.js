/* ============================================
   NEXORA — PROFILE PAGE LOGIC
   ============================================ */

(function () {
  "use strict";

  const CART_KEY = "nexora_cart";
  const WISHLIST_KEY = "nexora_wishlist";
  const ORDERS_KEY = "nexora_orders";

  const guestView = document.getElementById("profileGuest");
  const profileView = document.getElementById("profilePage");
  if (!profileView) return; // not on profile page

  const session = window.NEXORA_AUTH ? window.NEXORA_AUTH.getSession() : null;

  if (!session) {
    guestView.style.display = "flex";
    profileView.style.display = "none";
    return;
  }
  guestView.style.display = "none";
  profileView.style.display = "block";

  function getJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; }
  }

  const orders = getJSON(ORDERS_KEY);
  const wishlist = getJSON(WISHLIST_KEY);
  const cart = getJSON(CART_KEY);

  /* ---------- HERO ---------- */
  document.getElementById("profileName").textContent = session.name;
  document.getElementById("profileEmail").textContent = session.email;
  document.getElementById("profileAvatar").textContent = session.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  /* ---------- STATS ---------- */
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  document.getElementById("statOrders").textContent = orders.length;
  document.getElementById("statWishlist").textContent = wishlist.length;
  document.getElementById("statCart").textContent = cartCount;
  document.getElementById("statSpent").textContent = "₹" + totalSpent.toLocaleString("en-IN");

  /* ---------- ACCOUNT DETAILS ---------- */
  document.getElementById("detailName").textContent = session.name;
  document.getElementById("detailEmail").textContent = session.email;

  if (orders.length) {
    const latest = orders[0]; // orders are saved newest-first
    if (latest.delivery) {
      document.getElementById("detailPhone").textContent = latest.delivery.phone || "Not added yet";
      document.getElementById("detailAddress").textContent =
        `${latest.delivery.address}, ${latest.delivery.city}, ${latest.delivery.state} - ${latest.delivery.pincode}`;
    }
  }

  /* ---------- LOGOUT ---------- */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (window.NEXORA_AUTH) window.NEXORA_AUTH.logout();
    window.location.href = "index.html";
  });
})();
