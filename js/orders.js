/* ============================================
   NEXORA — ORDERS PAGE LOGIC
   ============================================ */

(function () {
  "use strict";

  const ORDERS_KEY = "nexora_orders";
  const STATUS_STEPS = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

  const list = document.getElementById("ordersList");
  const emptyState = document.getElementById("ordersEmpty");
  const title = document.getElementById("ordersTitle");
  if (!list) return; // not on orders page

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch (e) { return []; }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function renderTimeline(status) {
    const currentIndex = STATUS_STEPS.indexOf(status);
    return STATUS_STEPS.map((step, i) => {
      let cls = "";
      if (i < currentIndex) cls = "done";
      else if (i === currentIndex) cls = "current";
      return `
        <div class="timeline-step ${cls}">
          <div class="timeline-line"></div>
          <div class="timeline-dot"></div>
          <div class="timeline-label">${step}</div>
        </div>`;
    }).join("");
  }

  function render() {
    const orders = getOrders();
    title.textContent = `Your Orders (${orders.length})`;

    if (!orders.length) {
      emptyState.style.display = "flex";
      list.style.display = "none";
      return;
    }
    emptyState.style.display = "none";
    list.style.display = "flex";

    list.innerHTML = orders
      .map((order) => {
        const itemsHtml = order.items
          .map((it) => {
            const metaBits = [`Qty ${it.qty}`];
            if (it.size) metaBits.push(it.size);
            return `
            <div class="order-item-row">
              <img src="${it.image}" onerror="this.onerror=null;this.src='${it.fallbackImage || ""}'" alt="${it.name}" loading="lazy">
              <div class="order-item-info">
                <div class="order-item-name">${it.name}</div>
                <div class="order-item-meta">${metaBits.join(" · ")}</div>
              </div>
              <div class="order-item-price">₹${(it.price * it.qty).toLocaleString("en-IN")}</div>
            </div>`;
          })
          .join("");

        return `
        <div class="order-card">
          <div class="order-top">
            <div>
              <div class="order-id">${order.id}</div>
              <div class="order-date">Placed on ${formatDate(order.date)} · ${order.paymentMethod}</div>
            </div>
            <div>
              <div class="order-total">₹${order.total.toLocaleString("en-IN")}</div>
              <div class="order-total-label">${order.items.reduce((s, it) => s + it.qty, 0)} item(s)</div>
            </div>
          </div>
          <div class="order-timeline">${renderTimeline(order.status)}</div>
          <div class="order-items">${itemsHtml}</div>
        </div>`;
      })
      .join("");
  }

  render();
})();
