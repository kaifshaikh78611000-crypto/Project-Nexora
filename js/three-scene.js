/* ============================================
   NEXORA — THREE.JS HERO SCENE
   Renders a floating aurora wireframe object with
   mouse + scroll reactivity. Fails silently if
   WebGL / Three.js is unavailable.
   ============================================ */

(function () {
  "use strict";

  function webglAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  const container = document.getElementById("webglScene");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    container.style.display = "none";
    return;
  }

  if (typeof THREE === "undefined" || !webglAvailable()) {
    // Graceful degrade: no 3D object, particle canvas + CSS gradients still work.
    container.style.display = "none";
    return;
  }

  const isMobile = window.innerWidth < 768;

  let scene, camera, renderer, cluster, particles;
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  let scrollY = 0;
  let frameId = null;
  let clusterChildren = [];

  const state = { width: 0, height: 0 };

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    resize();
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ---- Lighting ----
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const key = new THREE.PointLight(0x7c6cf6, 2.2, 20);
    key.position.set(4, 3, 5);
    scene.add(key);

    const rim = new THREE.PointLight(0x4fd1e8, 1.8, 20);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    // ---- Product showcase cluster: sneaker, headphones, watch, accessory ----
    // Tries to load a real .glb model for each first; falls back to a
    // procedural stand-in shape automatically if none is found.
    cluster = new THREE.Group();
    scene.add(cluster);

    const shapes = window.NEXORA_SHAPES;
    if (shapes) {
      const specs = [
        { category: "Sneakers", id: "sneaker-hero", color: "#7c6cf6", size: 2.7, pos: [-2.1, -0.2, 0.4], rot: [0, 0.5, 0] },
        { category: "Headphones", id: "headphones-hero", color: "#4fd1e8", size: 2.5, pos: [2.0, 0.9, -0.3], rot: [0, -0.6, 0] },
        { category: "Watches", id: "watch-hero", color: "#f5c34d", size: 1.9, pos: [0.4, -1.6, 0.9], rot: [0.3, 0, 0] },
        { category: "Accessories", id: "accessory-hero", color: "#58d68d", size: 1.8, pos: [-0.5, 1.9, -0.6], rot: [0, 0.4, 0] },
      ];

      specs.forEach((spec) => {
        shapes.loadProductModel(spec.category, spec.id, spec.color, spec.size, (model) => {
          model.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
          model.rotation.set(spec.rot[0], spec.rot[1], spec.rot[2]);
          cluster.add(model);
          clusterChildren.push({ obj: model, speed: 0.15 + Math.random() * 0.2, offset: Math.random() * Math.PI * 2 });
        });
      });
    }

    // ---- Particle system (points orbiting the cluster) ----
    const particleCount = isMobile ? 220 : 480;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 3.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xb8b8c0,
      size: 0.028,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ---- Events ----
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    animate();
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    state.width = w;
    state.height = h;
    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    if (renderer) renderer.setSize(w, h);
  }

  function onResize() {
    resize();
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = mouseX * 0.5;
    targetRotX = mouseY * 0.3;
  }

  function onScroll() {
    scrollY = window.scrollY || window.pageYOffset;
  }

  const clock = new THREE.Clock();

  function animate() {
    frameId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (cluster) {
      // Auto rotation + mouse influence on the whole cluster
      cluster.rotation.y += 0.0022;
      cluster.rotation.y += (targetRotY - cluster.rotation.y) * 0.02;
      cluster.rotation.x += (targetRotX - cluster.rotation.x) * 0.02;

      // Each product bobs and spins independently for an organic feel
      clusterChildren.forEach(({ obj, speed, offset }) => {
        obj.rotation.y += 0.003 * speed * 10;
        obj.position.y += Math.sin(t * speed + offset) * 0.0015;
      });
    }

    if (particles) {
      particles.rotation.y += 0.0006;
    }

    // Scroll-based camera dolly (cluster recedes / rotates as user scrolls hero)
    const heroHeight = window.innerHeight;
    const progress = Math.min(scrollY / heroHeight, 1);
    camera.position.z = 9 + progress * 3;
    camera.position.y = -progress * 1.2;
    if (cluster) cluster.rotation.z = progress * 0.4;

    renderer.render(scene, camera);
  }

  // Pause render loop when tab hidden (perf)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
    } else if (!frameId) {
      animate();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
