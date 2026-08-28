/* ============================================
   NEXORA — ADMIN DASHBOARD LOGIC
   All data lives in localStorage for this demo:
   - nexora_orders          (shared with checkout/orders pages)
   - nexora_users           (shared with auth.js)
   - nexora_admin_catalog   (admin-added/edited products, admin-only)
   - nexora_deleted_ids     (base product ids hidden by admin)
   ============================================ */

(function () {
  "use strict";

  const ORDERS_KEY = "nexora_orders";
  const USERS_KEY = "nexora_users";
  const CATALOG_KEY = "nexora_admin_catalog";
  const DELETED_KEY = "nexora_deleted_ids";

  const baseProducts = window.NEXORA_PRODUCTS || [];

  /* ---------- STORAGE HELPERS ---------- */
  function getJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }
  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCatalogOverrides() { return getJSON(CATALOG_KEY, []); } // array of full product objects (new or edited)
  function getDeletedIds() { return getJSON(DELETED_KEY, []); }

  function getAllProducts() {
    const overrides = getCatalogOverrides();
    const deleted = getDeletedIds();
    const overrideIds = new Set(overrides.map((p) => p.id));

    const merged = baseProducts
      .filter((p) => !deleted.includes(p.id) && !overrideIds.has(p.id))
      .concat(overrides.filter((p) => !deleted.includes(p.id)));

    return merged;
  }

  function getOrders() { return getJSON(ORDERS_KEY, []); }
  function setOrders(orders) { setJSON(ORDERS_KEY, orders); }
  function getUsers() { return getJSON(USERS_KEY, []); }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ---------- SIDEBAR NAVIGATION ---------- */
  const navLinks = document.querySelectorAll(".admin-nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      document.querySelectorAll(".admin-section").forEach((s) => s.classList.remove("active"));
      document.getElementById("section-" + link.dataset.section).classList.add("active");

      if (link.dataset.section === "analytics") renderAnalytics();
    });
  });

  /* ---------- DASHBOARD ---------- */
  function renderDashboard() {
    const orders = getOrders();
    const users = getUsers();
    const products = getAllProducts();

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    document.getElementById("cardSales").textContent = "₹" + totalSales.toLocaleString("en-IN");
    document.getElementById("cardOrders").textContent = orders.length;
    document.getElementById("cardUsers").textContent = users.length;
    document.getElementById("cardProducts").textContent = products.length;

    const tbody = document.querySelector("#recentOrdersTable tbody");
    const recent = orders.slice(0, 6);
    if (!recent.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No orders yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = recent
      .map(
        (o) => `
      <tr>
        <td class="strong">${o.id}</td>
        <td>${o.delivery ? o.delivery.name : "—"}</td>
        <td>${formatDate(o.date)}</td>
        <td>₹${o.total.toLocaleString("en-IN")}</td>
        <td><span class="status-pill status-${o.status.replace(/\s/g, "-")}">${o.status}</span></td>
      </tr>`
      )
      .join("");
  }

  /* ---------- PRODUCTS ---------- */
  function renderProducts() {
    const products = getAllProducts();
    document.getElementById("productCount").textContent = `${products.length} products`;

    const tbody = document.querySelector("#productsTable tbody");
    if (!products.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No products.</td></tr>`;
      return;
    }
    tbody.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td><img class="table-thumb" src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage}'" alt="${p.name}"></td>
        <td class="strong">${p.name}</td>
        <td>${p.category}</td>
        <td>${p.brand}</td>
        <td>₹${p.price.toLocaleString("en-IN")}</td>
        <td>${p.rating.toFixed(1)}</td>
        <td>
          <div class="table-actions">
            <button class="table-btn" data-edit="${p.id}">Edit</button>
            <button class="table-btn danger" data-delete="${p.id}">Delete</button>
          </div>
        </td>
      </tr>`
      )
      .join("");

    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => openProductModal(btn.dataset.edit));
    });
    tbody.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => deleteProduct(btn.dataset.delete));
    });
  }

  function deleteProduct(id) {
    if (!confirm("Delete this product? This only affects your browser's demo data.")) return;
    const deleted = getDeletedIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      setJSON(DELETED_KEY, deleted);
    }
    showToast("Product deleted");
    renderProducts();
    renderDashboard();
  }

  /* ---------- PRODUCT MODAL (ADD / EDIT) ---------- */
  const modalOverlay = document.getElementById("productModalOverlay");
  const productForm = document.getElementById("productForm");
  const modalTitle = document.getElementById("productModalTitle");
  const submitLabel = document.getElementById("pfSubmitLabel");

  function openProductModal(editId) {
    productForm.reset();
    document.getElementById("pfId").value = "";

    if (editId) {
      const p = getAllProducts().find((prod) => prod.id === editId);
      if (!p) return;
      modalTitle.textContent = "Edit Product";
      submitLabel.textContent = "SAVE CHANGES";
      document.getElementById("pfId").value = p.id;
      document.getElementById("pfName").value = p.name;
      document.getElementById("pfCategory").value = p.category;
      document.getElementById("pfBrand").value = p.brand;
      document.getElementById("pfPrice").value = p.price;
      document.getElementById("pfOldPrice").value = p.oldPrice || "";
      document.getElementById("pfImage").value = p.image;
      document.getElementById("pfDescription").value = p.description;
    } else {
      modalTitle.textContent = "Add Product";
      submitLabel.textContent = "SAVE PRODUCT";
    }

    modalOverlay.classList.add("show");
  }

  function closeProductModal() { modalOverlay.classList.remove("show"); }

  document.getElementById("addProductBtn").addEventListener("click", () => openProductModal(null));
  document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
  document.getElementById("cancelProductModal").addEventListener("click", closeProductModal);
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeProductModal(); });

  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("pfId").value || "custom-" + Date.now();
    const price = parseFloat(document.getElementById("pfPrice").value) || 0;
    const oldPriceInput = document.getElementById("pfOldPrice").value;
    const oldPrice = oldPriceInput ? parseFloat(oldPriceInput) : price;
    const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    const existing = getAllProducts().find((p) => p.id === id);

    const product = {
      id,
      name: document.getElementById("pfName").value.trim(),
      category: document.getElementById("pfCategory").value,
      brand: document.getElementById("pfBrand").value.trim() || "NEXORA",
      price,
      oldPrice,
      discount,
      rating: existing ? existing.rating : 4.0,
      reviews: existing ? existing.reviews : 0,
      description: document.getElementById("pfDescription").value.trim() || "No description provided.",
      image: document.getElementById("pfImage").value.trim() || (typeof photoUrl === "function" ? photoUrl(document.getElementById("pfCategory").value, id) : ""),
      fallbackImage: typeof productImage === "function" ? productImage(document.getElementById("pfCategory").value) : "",
      colors: existing ? existing.colors : [],
      sizes: existing ? existing.sizes : [],
      featured: existing ? existing.featured : false,
    };

    const overrides = getCatalogOverrides().filter((p) => p.id !== id);
    overrides.push(product);
    setJSON(CATALOG_KEY, overrides);

    showToast(existing ? "Product updated" : "Product added");
    closeProductModal();
    renderProducts();
    renderDashboard();
  });

  /* ---------- ORDERS ---------- */
  const STATUS_OPTIONS = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

  function renderOrders() {
    const orders = getOrders();
    const tbody = document.querySelector("#ordersTable tbody");

    if (!orders.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No orders yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders
      .map((o) => {
        const itemCount = o.items.reduce((s, it) => s + it.qty, 0);
        const options = STATUS_OPTIONS.map(
          (s) => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`
        ).join("");

        return `
        <tr>
          <td class="strong">${o.id}</td>
          <td>${o.delivery ? o.delivery.name : "—"}</td>
          <td>${formatDate(o.date)}</td>
          <td>${itemCount}</td>
          <td>₹${o.total.toLocaleString("en-IN")}</td>
          <td>${o.paymentMethod}</td>
          <td><select class="status-select" data-order="${o.id}">${options}</select></td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", () => {
        const orders = getOrders();
        const order = orders.find((o) => o.id === select.dataset.order);
        if (order) {
          order.status = select.value;
          setOrders(orders);
          showToast("Order status updated");
          renderDashboard();
        }
      });
    });
  }

  /* ---------- USERS ---------- */
  function renderUsers() {
    const users = getUsers();
    const orders = getOrders();
    const tbody = document.querySelector("#usersTable tbody");

    if (!users.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No registered users yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = users
      .map((u) => {
        const orderCount = orders.filter(
          (o) => o.delivery && o.delivery.name && o.delivery.name.toLowerCase() === u.name.toLowerCase()
        ).length;
        return `
        <tr>
          <td class="strong">${u.name}</td>
          <td>${u.email}</td>
          <td>${formatDate(u.createdAt)}</td>
          <td>${orderCount}</td>
        </tr>`;
      })
      .join("");
  }

  /* ---------- ANALYTICS ---------- */
  function renderAnalytics() {
    const orders = getOrders();
    const products = getAllProducts();

    // Units sold by category
    const categoryUnits = {};
    const productUnits = {};

    orders.forEach((o) => {
      o.items.forEach((it) => {
        const p = products.find((pr) => pr.id === it.id);
        const category = p ? p.category : "Other";
        categoryUnits[category] = (categoryUnits[category] || 0) + it.qty;
        productUnits[it.name] = (productUnits[it.name] || 0) + it.qty;
      });
    });

    renderBarChart("categoryChart", categoryUnits);

    const topProducts = Object.entries(productUnits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    renderBarChart("topProductsChart", Object.fromEntries(topProducts));
  }

  function renderBarChart(containerId, dataObj) {
    const container = document.getElementById(containerId);
    const entries = Object.entries(dataObj);

    if (!entries.length) {
      container.innerHTML = `<p style="color:var(--text-faint);font-size:13px;">No sales data yet — place a demo order to see this fill in.</p>`;
      return;
    }

    const max = Math.max(...entries.map(([, v]) => v));
    container.innerHTML = entries
      .map(
        ([label, value]) => `
      <div class="bar-row">
        <div class="bar-row-head"><span>${label}</span><span>${value} unit${value === 1 ? "" : "s"}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${(value / max) * 100}%"></div></div>
      </div>`
      )
      .join("");
  }

  /* ---------- INIT ---------- */
  renderDashboard();
  renderProducts();
  renderOrders();
  renderUsers();
})();
