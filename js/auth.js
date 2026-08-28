/* ============================================
   NEXORA — AUTH LOGIC (DEMO ONLY)
   Uses localStorage to fake a user database.
   ------------------------------------------------
   TO CONNECT A REAL BACKEND LATER:
   - Replace registerUser() and loginUser() bodies
     with fetch() calls to your API.
   - Keep the same function names/return shape
     ({ ok: true/false, message }) so the rest
     of this file doesn't need to change.
   ============================================ */

(function () {
  "use strict";

  const USERS_KEY = "nexora_users";
  const SESSION_KEY = "nexora_session";

  /* ---------- "DATABASE" HELPERS (localStorage) ---------- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  }

  // Very light obfuscation — NOT real security.
  // A real backend would hash passwords server-side (e.g. bcrypt).
  function encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function registerUser({ name, email, password }) {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: "An account with this email already exists." };

    users.push({ name, email, password: encode(password), createdAt: new Date().toISOString() });
    saveUsers(users);
    setSession({ name, email });
    return { ok: true };
  }

  function loginUser({ email, password }) {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, message: "No account found with this email." };
    if (user.password !== encode(password)) return { ok: false, message: "Incorrect password." };

    setSession(user);
    return { ok: true };
  }

  /* ---------- SHARED UI HELPERS ---------- */
  function showError(inputId, msg) {
    const errorEl = document.getElementById(inputId + "Error");
    const inputEl = document.getElementById(inputId);
    if (errorEl) errorEl.textContent = msg || "";
    if (inputEl) inputEl.classList.toggle("invalid", !!msg);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ---------- PASSWORD SHOW/HIDE TOGGLES ---------- */
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const show = target.type === "password";
      target.type = show ? "text" : "password";
      btn.classList.toggle("active", show);
    });
  });

  /* ---------- REGISTER FORM ---------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      showError("fullName", "");
      showError("email", "");
      showError("password", "");
      showError("confirmPassword", "");

      let valid = true;
      if (!name) { showError("fullName", "Please enter your name."); valid = false; }
      if (!isValidEmail(email)) { showError("email", "Please enter a valid email."); valid = false; }
      if (password.length < 6) { showError("password", "Use at least 6 characters."); valid = false; }
      if (confirmPassword !== password) { showError("confirmPassword", "Passwords don't match."); valid = false; }

      if (!valid) return;

      const result = registerUser({ name, email, password });
      if (!result.ok) {
        showError("email", result.message);
        return;
      }

      showToast("Account created! Redirecting...");
      setTimeout(() => (window.location.href = "profile.html"), 900);
    });
  }

  /* ---------- LOGIN FORM ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      showError("email", "");
      showError("password", "");

      let valid = true;
      if (!isValidEmail(email)) { showError("email", "Please enter a valid email."); valid = false; }
      if (!password) { showError("password", "Please enter your password."); valid = false; }

      if (!valid) return;

      const result = loginUser({ email, password });
      if (!result.ok) {
        showError("password", result.message);
        return;
      }

      showToast("Welcome back! Redirecting...");
      setTimeout(() => (window.location.href = "profile.html"), 900);
    });
  }

  // Expose for use on other pages (profile.js reads session, header could show name, etc.)
  window.NEXORA_AUTH = {
    getSession: function () {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; }
    },
    logout: function () {
      localStorage.removeItem(SESSION_KEY);
    },
  };
})();
