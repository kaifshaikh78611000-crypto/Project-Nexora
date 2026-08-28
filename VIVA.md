# NEXORA — Viva Questions & Answers

Prepared answers for likely examiner questions. Read these in your own words — don't recite them.

---

### General

**Q: What is this project?**
A: NEXORA is a 3D immersive e-commerce website. It's a frontend demo of an online store — browsing, cart, checkout, orders, login, and an admin panel — built with HTML, CSS, JavaScript, Three.js and GSAP, with no real backend.

**Q: Why no backend/database?**
A: The project is scoped as a frontend project. I used `localStorage` to simulate a database so all features (cart, orders, accounts) actually work and persist, without needing a server. The code is structured so real API calls could replace the `localStorage` calls later.

**Q: Why did you choose Three.js instead of just images?**
A: Three.js renders real 3D graphics in the browser using WebGL. It lets the hero object and the product preview respond to mouse movement and let the user rotate the object themselves — something a flat image can't do.

**Q: What is WebGL?**
A: A browser API that lets JavaScript render 2D/3D graphics using the device's GPU. Three.js is a library that makes WebGL much easier to use.

---

### Frontend / Design

**Q: Why not use React?**
A: The brief for this project asked for vanilla HTML/CSS/JS specifically, so anyone could read the code without knowing a framework. React adds a build step and JSX syntax that wasn't needed here.

**Q: How is the site responsive?**
A: CSS Grid and Flexbox with `@media` breakpoints at common widths (1100px, 900px, 560px). Below 900px, the desktop nav is replaced by a hamburger menu, and the custom cursor is disabled since touch devices don't have a mouse pointer.

**Q: What is glassmorphism, and where did you use it?**
A: A design style using semi-transparent, blurred backgrounds — like frosted glass — usually paired with a subtle border. I used it on the login/register card (`.auth-card` in `css/auth.css`), which sits over a gradient background.

**Q: How do the scroll animations work?**
A: GSAP's ScrollTrigger plugin watches when an element enters the viewport and animates it from a `.reveal` class (opacity 0, translated down) to its normal state.

**Q: What happens if a browser doesn't support WebGL?**
A: `three-scene.js` checks for WebGL support before creating anything. If it's unavailable, the whole 3D container is hidden and the rest of the page — particles, layout, buttons — still works normally. Nothing crashes.

---

### Functionality

**Q: How does the cart persist after a refresh?**
A: Every cart change is saved to `localStorage` under the key `nexora_cart` as JSON. On page load, the cart script reads that key back and re-renders the items.

**Q: How does login work if there's no server?**
A: `js/auth.js` keeps an array of registered users in `localStorage` (`nexora_users`). Register adds to that array; Login checks the entered email/password against it. A `nexora_session` key remembers who's currently "logged in." Passwords are lightly encoded, not securely hashed — this is clearly noted in the code as demo-only, not production security.

**Q: How does Admin update an order and have it show on the customer's Orders page?**
A: Both pages read and write the same `localStorage` key, `nexora_orders`. When Admin changes a status dropdown, it updates that order object in the array and saves it back. The Orders page reads the same array, so the next time it renders, it shows the new status.

**Q: How is the order ID generated?**
A: `checkout.js` builds it as `"NEXORA-" + a random 6-character alphanumeric string`, e.g. `NEXORA-7F3K2A`. It's just for display — there's no real order-processing system behind it.

**Q: Is the payment real?**
A: No. Checkout is simulated — selecting UPI/Card/COD and clicking "Place Order" doesn't contact any payment gateway. That was an explicit requirement for this project.

---

### Code Structure

**Q: Walk me through the file structure.**
A: One HTML file per page (11 total). `css/style.css` holds shared styles (navbar, buttons, footer); each page also has its own CSS file for page-specific styles. Similarly, `js/main.js` holds shared behavior (cursor, navbar, badges) and each page has its own JS file. `js/products.js` is the single source of product data every page reads from.

**Q: How would you add a real database to this later?**
A: Replace the `localStorage.getItem`/`setItem` calls with `fetch()` calls to a real API (e.g. Node.js + Express + MongoDB). Because the data shapes (cart items, orders, users) are already consistent objects/arrays, the rest of the rendering code wouldn't need to change much — just where the data comes from.

**Q: What would you improve if you had more time?**
A: Real backend + database, real product photography and 3D models (`.glb` files) instead of placeholder images, real payment integration, and password hashing for real security.
