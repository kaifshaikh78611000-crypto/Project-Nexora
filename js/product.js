/* ============================================
   NEXORA — PRODUCT PAGE LOGIC
   ============================================ */

(function () {
  "use strict";

  const CART_KEY = "nexora_cart";
  const WISHLIST_KEY = "nexora_wishlist";
  const products = window.NEXORA_PRODUCTS || [];

  const detailSection = document.getElementById("productDetail");
  const notFound = document.getElementById("notFound");
  if (!detailSection) return; // not on product page

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound.style.display = "flex";
    return;
  }
  detailSection.style.display = "grid";

  let selectedColor = product.colors && product.colors[0] ? product.colors[0] : null;
  let selectedSize = product.sizes && product.sizes[0] ? product.sizes[0] : null;
  let qty = 1;

  /* ---------- STORAGE HELPERS ---------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (typeof updateBadges === "function") updateBadges();
  }
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"); } catch (e) { return []; }
  }
  function setWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
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

  /* ---------- BREADCRUMB ---------- */
  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">Home</a><span class="sep">/</span>
    <a href="shop.html?category=${encodeURIComponent(product.category)}">${product.category}</a><span class="sep">/</span>
    <span class="current">${product.name}</span>`;

  document.title = `${product.name} — NEXORA`;

  /* ---------- RENDER STATIC INFO ---------- */
  document.getElementById("productImage").src = product.image;
  document.getElementById("productImage").alt = product.name;
  document.getElementById("productImage").onerror = function () {
    this.onerror = null;
    this.src = product.fallbackImage;
  };
  document.getElementById("pdCategory").textContent = product.category;
  document.getElementById("pdName").textContent = product.name;
  document.getElementById("pdPrice").textContent = "₹" + product.price.toLocaleString("en-IN");

  const fullStars = Math.round(product.rating);
  document.getElementById("pdRating").innerHTML = `
    <span class="stars">${"★".repeat(fullStars)}${"☆".repeat(5 - fullStars)}</span>
    <span>${product.rating.toFixed(1)} · ${product.reviews} reviews</span>`;

  if (product.discount > 0) {
    document.getElementById("pdOldPrice").textContent = "₹" + product.oldPrice.toLocaleString("en-IN");
    document.getElementById("pdDiscount").textContent = "-" + product.discount + "%";
  }

  document.getElementById("pdDescription").textContent = product.description;
  document.getElementById("panelDescription").innerHTML = `<p>${product.description} Designed and tested for everyday reliability, every NEXORA product ships with a 1-year limited warranty and our standard 7-day return window.</p>`;

  // Specs table (generated from known fields — keeps it honest for a demo)
  document.getElementById("panelSpecs").innerHTML = `
    <table class="spec-table">
      <tr><td>Category</td><td>${product.category}</td></tr>
      <tr><td>Brand</td><td>${product.brand}</td></tr>
      <tr><td>Rating</td><td>${product.rating.toFixed(1)} / 5</td></tr>
      <tr><td>Available colors</td><td>${(product.colors || []).length || "Single finish"}</td></tr>
      <tr><td>Available sizes</td><td>${(product.sizes || []).join(", ") || "One size / N/A"}</td></tr>
      <tr><td>SKU</td><td>${product.id.toUpperCase()}</td></tr>
    </table>`;

  // Reviews (illustrative demo content, clearly generic)
  const demoReviews = [
    { name: "Verified Buyer", stars: Math.min(5, fullStars), text: "Exactly as described. Build quality feels premium for the price." },
    { name: "Verified Buyer", stars: Math.max(3, fullStars - 1), text: "Good product overall, delivery was quick." },
    { name: "Verified Buyer", stars: fullStars, text: "Would recommend — matches the photos closely." },
  ];
  document.getElementById("panelReviews").innerHTML = demoReviews
    .map(
      (r) => `
      <div class="review-item">
        <div class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
        <p>${r.text}</p>
        <div class="review-name">${r.name}</div>
      </div>`
    )
    .join("");

  /* ---------- COLOR SWATCHES ---------- */
  if (product.colors && product.colors.length) {
    document.getElementById("colorGroup").style.display = "block";
    const wrap = document.getElementById("colorSwatches");
    wrap.innerHTML = product.colors
      .map(
        (c, i) =>
          `<button class="swatch ${i === 0 ? "active" : ""}" style="background:${c}" data-color="${c}" aria-label="Color ${c}"></button>`
      )
      .join("");
    wrap.querySelectorAll(".swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedColor = btn.dataset.color;
      });
    });
  }

  /* ---------- SIZE OPTIONS ---------- */
  if (product.sizes && product.sizes.length) {
    document.getElementById("sizeGroup").style.display = "block";
    const wrap = document.getElementById("sizeOptions");
    wrap.innerHTML = product.sizes
      .map((s, i) => `<button class="size-chip ${i === 0 ? "active" : ""}" data-size="${s}">${s}</button>`)
      .join("");
    wrap.querySelectorAll(".size-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".size-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.dataset.size;
      });
    });
  }

  /* ---------- QUANTITY ---------- */
  const qtyValue = document.getElementById("qtyValue");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(10, qty + 1);
    qtyValue.textContent = qty;
  });

  /* ---------- CART / WISHLIST / BUY NOW ---------- */
  function addToCart() {
    if (product.sizes && product.sizes.length && !selectedSize) {
      showToast("Please select a size");
      return false;
    }
    const cart = getCart();
    const key = product.id + "|" + (selectedColor || "") + "|" + (selectedSize || "");
    const existing = cart.find((c) => c.key === key);
    if (existing) existing.qty += qty;
    else cart.push({ id: product.id, key, qty, color: selectedColor, size: selectedSize });
    setCart(cart);
    showToast("Added to cart");
    return true;
  }

  document.getElementById("addToCartBtn").addEventListener("click", addToCart);

  document.getElementById("buyNowBtn").addEventListener("click", () => {
    if (addToCart()) window.location.href = "checkout.html";
  });

  const wishlistBtn = document.getElementById("pdWishlistBtn");
  const wishlist = getWishlist();
  if (wishlist.includes(product.id)) wishlistBtn.classList.add("active");
  wishlistBtn.addEventListener("click", () => {
    let list = getWishlist();
    const has = list.includes(product.id);
    list = has ? list.filter((x) => x !== product.id) : [...list, product.id];
    setWishlist(list);
    wishlistBtn.classList.toggle("active", !has);
    showToast(has ? "Removed from wishlist" : "Added to wishlist");
  });

  /* ---------- TABS ---------- */
  document.querySelectorAll(".tab-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-header").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
    });
  });

  /* ---------- RELATED PRODUCTS ---------- */
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  document.getElementById("relatedHeading").textContent = `More in ${product.category}`;
  document.getElementById("relatedGrid").innerHTML = related
    .map(
      (p) => `
      <a class="related-card" href="product.html?id=${p.id}">
        <div class="r-media"><img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage}'" alt="${p.name}" loading="lazy"></div>
        <div class="r-info">
          <div class="r-name">${p.name}</div>
          <div class="r-price">₹${p.price.toLocaleString("en-IN")}</div>
        </div>
      </a>`
    )
    .join("");

  /* ---------- MEDIA TABS: PHOTO / 3D ---------- */
  const photoTab = document.querySelector('.media-tab[data-mode="photo"]');
  const tdTab = document.querySelector('.media-tab[data-mode="3d"]');
  const imgEl = document.getElementById("productImage");
  const webglEl = document.getElementById("pdWebgl");
  const dragHint = document.getElementById("dragHint");
  let scene3d = null;

  photoTab.addEventListener("click", () => {
    photoTab.classList.add("active");
    tdTab.classList.remove("active");
    imgEl.style.opacity = "1";
    webglEl.classList.remove("active");
    dragHint.classList.remove("show");
  });

  tdTab.addEventListener("click", () => {
    tdTab.classList.add("active");
    photoTab.classList.remove("active");
    webglEl.classList.add("active");
    dragHint.classList.add("show");
    if (!scene3d) scene3d = initProduct3D(webglEl, selectedColor || "#7c6cf6");
  });

  /* ---------- 3D PREVIEW (abstract stand-in — no real GLB model) ---------- */
  function initProduct3D(container, hexColor) {
    if (typeof THREE === "undefined") {
      container.innerHTML = '<p style="padding:40px;color:var(--text-dim);font-size:13px;">3D preview unavailable on this device.</p>';
      return null;
    }
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const light1 = new THREE.PointLight(0x7c6cf6, 2, 20);
      light1.position.set(3, 3, 4);
      scene.add(light1);
      const light2 = new THREE.PointLight(0x4fd1e8, 1.6, 20);
      light2.position.set(-3, -2, -3);
      scene.add(light2);

      let mesh = null; // set once the model (real .glb or procedural) is ready
      let usingRealModel = false;

      if (window.NEXORA_SHAPES) {
        window.NEXORA_SHAPES.loadProductModel(
          product.category,
          product.id,
          hexColor || "#7c6cf6",
          3.0,
          (model, isReal) => {
            mesh = model;
            usingRealModel = isReal;
            if (isReal) console.log("NEXORA: loaded real .glb model for", product.id);
            scene.add(mesh);
          }
        );
      } else {
        const geo = new THREE.IcosahedronGeometry(1.7, 1);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(hexColor || "#7c6cf6"),
          metalness: 0.75,
          roughness: 0.3,
          flatShading: true,
        });
        mesh = new THREE.Mesh(geo, fallbackMat);
        scene.add(mesh);
      }

      let rotY = 0, rotX = 0.3;
      let dragging = false;
      let lastX = 0, lastY = 0;
      let autoRotate = true;

      function pointerDown(x, y) {
        dragging = true;
        autoRotate = false;
        lastX = x;
        lastY = y;
      }
      function pointerMove(x, y) {
        if (!dragging) return;
        rotY += (x - lastX) * 0.008;
        rotX += (y - lastY) * 0.008;
        rotX = Math.max(-1.2, Math.min(1.2, rotX));
        lastX = x;
        lastY = y;
      }
      function pointerUp() { dragging = false; }

      container.addEventListener("mousedown", (e) => pointerDown(e.clientX, e.clientY));
      window.addEventListener("mousemove", (e) => pointerMove(e.clientX, e.clientY));
      window.addEventListener("mouseup", pointerUp);

      container.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        pointerDown(t.clientX, t.clientY);
      }, { passive: true });
      container.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        pointerMove(t.clientX, t.clientY);
      }, { passive: true });
      container.addEventListener("touchend", pointerUp);

      container.addEventListener("wheel", (e) => {
        e.preventDefault();
        camera.position.z = Math.max(3.5, Math.min(9, camera.position.z + e.deltaY * 0.01));
      }, { passive: false });

      function resize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
      window.addEventListener("resize", resize);

      let frame;
      function animate() {
        frame = requestAnimationFrame(animate);
        if (autoRotate) rotY += 0.004;
        if (mesh) {
          mesh.rotation.y = rotY;
          mesh.rotation.x = rotX;
        }
        renderer.render(scene, camera);
      }
      animate();

      return { renderer, scene, camera };
    } catch (e) {
      container.innerHTML = '<p style="padding:40px;color:var(--text-dim);font-size:13px;">3D preview unavailable on this device.</p>';
      return null;
    }
  }
})();
