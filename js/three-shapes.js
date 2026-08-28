/* ============================================
   NEXORA — SHARED 3D PRODUCT SHAPES
   Procedurally-built, stylised low-poly Three.js
   objects standing in for real per-product .glb
   scans (which this demo doesn't have). Used by
   both the homepage hero and the product page's
   "View in 3D" tab, so a sneaker product actually
   shows a sneaker-shaped object, not a generic ball.
   ============================================ */

(function () {
  "use strict";

  if (typeof THREE === "undefined") return;

  function mat(hex, metalness, roughness) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      metalness: metalness !== undefined ? metalness : 0.7,
      roughness: roughness !== undefined ? roughness : 0.3,
      flatShading: true,
    });
  }

  function buildSneaker(hex) {
    const group = new THREE.Group();
    const body = mat(hex);
    const dark = mat("#1a1a1f", 0.5, 0.5);
    const accent = mat("#e8e8ec", 0.25, 0.55);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.28, 1.0), dark);
    sole.position.set(0, -0.95, 0);
    group.add(sole);

    const heel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.9), body);
    heel.position.set(-0.9, -0.35, 0);
    group.add(heel);

    const mid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 0.95), body);
    mid.position.set(0.2, -0.45, 0);
    group.add(mid);

    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), body);
    toe.scale.set(1.3, 0.75, 0.95);
    toe.position.set(1.15, -0.55, 0);
    group.add(toe);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.14, 8, 16), accent);
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1, 1, 0.65);
    collar.position.set(-0.9, 0.25, 0);
    group.add(collar);

    for (let i = 0; i < 3; i++) {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 1.05), accent);
      lace.position.set(-0.15 + i * 0.35, 0.08, 0);
      lace.rotation.z = 0.18;
      group.add(lace);
    }

    group.position.y += 0.3;
    return group;
  }

  function buildHeadphones(hex) {
    const group = new THREE.Group();
    const body = mat(hex);
    const cushion = mat("#e8e8ec", 0.25, 0.55);

    const band = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.12, 10, 24, Math.PI), body);
    band.rotation.z = Math.PI;
    band.position.set(0, 0.3, 0);
    group.add(band);

    [-1.3, 1.3].forEach((x) => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 20), body);
      cup.rotation.z = Math.PI / 2;
      cup.position.set(x, -0.55, 0);
      group.add(cup);

      const pad = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 20), cushion);
      pad.rotation.y = Math.PI / 2;
      pad.position.set(x + (x > 0 ? 0.19 : -0.19), -0.55, 0);
      group.add(pad);

      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8), body);
      rod.position.set(x, -0.15, 0);
      group.add(rod);
    });

    return group;
  }

  function buildWatch(hex) {
    const group = new THREE.Group();
    const body = mat(hex);
    const face = mat("#0d0d10", 0.6, 0.2);
    const band = mat("#1a1a1f", 0.4, 0.5);

    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.35, 24), body);
    caseMesh.rotation.x = Math.PI / 2;
    group.add(caseMesh);

    const faceMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.05, 24), face);
    faceMesh.rotation.x = Math.PI / 2;
    faceMesh.position.z = 0.19;
    group.add(faceMesh);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 10), body);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(0.85, 0, 0);
    group.add(crown);

    [1, -1].forEach((dir) => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.4, 0.18), band);
      strap.position.set(0, dir * 1.35, 0);
      group.add(strap);
    });

    return group;
  }

  function buildSmartphone(hex) {
    const group = new THREE.Group();
    const body = mat(hex);
    const screen = mat("#0d0d10", 0.3, 0.4);
    const cam = mat("#3a3a42", 0.8, 0.2);

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.15), body);
    group.add(bodyMesh);

    const screenMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.0, 0.02), screen);
    screenMesh.position.z = 0.09;
    group.add(screenMesh);

    const camMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), cam);
    camMesh.rotation.x = Math.PI / 2;
    camMesh.position.set(0.35, 0.85, -0.1);
    group.add(camMesh);

    return group;
  }

  function buildGamingController(hex) {
    const group = new THREE.Group();
    const body = mat(hex);
    const stickMat = mat("#0d0d10", 0.5, 0.4);

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.6), body);
    group.add(bodyMesh);

    [-1, 1].forEach((side) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 0.9, 10), body);
      grip.position.set(side * 1.0, -0.6, 0);
      grip.rotation.z = side * 0.35;
      group.add(grip);
    });

    [-0.6, 0.6].forEach((x) => {
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 16), stickMat);
      stick.position.set(x, 0.15, 0.35);
      group.add(stick);
    });

    return group;
  }

  function buildAccessory(hex) {
    const group = new THREE.Group();
    const body = mat(hex);
    const dark = mat("#1a1a1f", 0.4, 0.5);

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.9, 0.9), body);
    group.add(bodyMesh);

    const flap = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.6, 0.95), dark);
    flap.position.set(0, 1.05, 0);
    group.add(flap);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 8, 16, Math.PI), body);
    handle.position.set(0, 1.7, 0);
    group.add(handle);

    return group;
  }

  function buildForCategory(category, hex) {
    const color = hex || "#7c6cf6";
    switch (category) {
      case "Sneakers": return buildSneaker(color);
      case "Headphones": return buildHeadphones(color);
      case "Watches": return buildWatch(color);
      case "Smartphones": return buildSmartphone(color);
      case "Gaming": return buildGamingController(color);
      case "Accessories": return buildAccessory(color);
      default: return buildSneaker(color);
    }
  }

  // Centers any object at the origin and uniformly scales it so its
  // largest dimension equals targetSize. Needed because a real .glb file
  // could come in at any arbitrary size/origin — this makes it drop into
  // the same camera framing as the procedural shapes without manual tuning.
  function normalizeModel(object, targetSize) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    object.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    object.scale.setScalar(scale);
    return object;
  }

  /**
   * Tries to load a REAL .glb model for this product. Looks for, in order:
   *   1. assets/models/<productId>.glb   (a model for this exact product)
   *   2. assets/models/<category>.glb    (a shared model for the category,
   *                                        e.g. assets/models/sneakers.glb)
   * If neither file exists (this demo ships with none), it automatically
   * falls back to the procedural stand-in shape — the site never breaks,
   * and it self-upgrades the moment real .glb files are added.
   *
   * @param {string} category   product.category, e.g. "Sneakers"
   * @param {string} productId  product.id, e.g. "sn-001" (optional)
   * @param {string} hexColor   used only for the procedural fallback
   * @param {number} targetSize world-unit size to normalize the model to
   * @param {function} onReady  (object3D, isRealModel) => void
   */
  function loadProductModel(category, productId, hexColor, targetSize, onReady) {
    targetSize = targetSize || 3.2;

    function finishWithProcedural() {
      const model = buildForCategory(category, hexColor);
      normalizeModel(model, targetSize);
      onReady(model, false);
    }

    if (typeof THREE.GLTFLoader === "undefined") {
      finishWithProcedural();
      return;
    }

    const candidates = [];
    if (productId) candidates.push("assets/models/" + productId + ".glb");
    const categorySlug = (category || "sneakers").toLowerCase();
    candidates.push("assets/models/" + categorySlug + ".glb");

    const loader = new THREE.GLTFLoader();
    let i = 0;

    function tryNext() {
      if (i >= candidates.length) {
        finishWithProcedural();
        return;
      }
      const path = candidates[i++];
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene || gltf.scenes[0];
          normalizeModel(model, targetSize);
          onReady(model, true);
        },
        undefined, // progress callback, unused
        () => tryNext() // on error (e.g. 404) — try the next candidate
      );
    }

    tryNext();
  }

  window.NEXORA_SHAPES = {
    buildSneaker,
    buildHeadphones,
    buildWatch,
    buildSmartphone,
    buildGamingController,
    buildAccessory,
    buildForCategory,
    normalizeModel,
    loadProductModel,
  };
})();
