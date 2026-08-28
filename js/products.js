/* ============================================
   NEXORA — PRODUCT DATA
   24 demo products across 6 categories.
   Images are auto-assigned real, category-matching
   photos (see the bottom of this file) unless a
   product already has its own `image` set — add
   `image: "assets/images/yourfile.jpg"` to any
   product below to use a real photo for it.
   ============================================ */

/* ============================================
   CATEGORY ICON / IMAGE GENERATOR
   No real product photography is available for
   this demo, so instead of unrelated stock photos
   we generate an original, category-accurate SVG
   illustration for every product — a sneaker looks
   like a sneaker, a watch looks like a watch, etc.
   Swap `image` for a real photo path any time.
   ============================================ */

const CATEGORY_ACCENTS = {
  Sneakers: "#7c6cf6",
  Watches: "#f5c34d",
  Headphones: "#4fd1e8",
  Smartphones: "#9b8cff",
  Gaming: "#ff6b81",
  Accessories: "#58d68d",
};

// Keywords used to pull a REAL, category-matching photo from a live photo
// service (LoremFlickr — free, keyword-based, Creative Commons licensed
// photos). This is not photography of these exact fictional products —
// nobody has photographed a "Chronos Aurora" watch — but it's a genuine
// photo of a real sneaker/watch/headphone/etc, not a random unrelated image.
const CATEGORY_KEYWORDS = {
  Sneakers: "sneakers",
  Watches: "wristwatch",
  Headphones: "headphones",
  Smartphones: "smartphone",
  Gaming: "gamepad",
  Accessories: "backpack",
};

// Small deterministic hash so each product always gets the SAME photo on
// every reload (instead of a new random one each time the page loads).
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100000;
}

function photoUrl(category, id) {
  const keyword = CATEGORY_KEYWORDS[category] || "product";
  const lock = hashCode(id);
  return `https://loremflickr.com/700/800/${keyword}?lock=${lock}`;
}

// Each icon is drawn in a local 0–100 unit box, then scaled into the card.
const CATEGORY_ICONS = {
  Sneakers: (c) => `
    <g stroke="${c}" stroke-width="3" fill="${c}" fill-opacity="0.14" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 62 Q8 42 28 39 L54 30 Q70 23 86 34 L93 47 Q95 55 88 59 L12 62 Q7 62 8 62 Z"/>
      <path d="M8 62 L93 59" fill="none"/>
      <path d="M30 39 L34 51 M42 34 L46 48 M54 30 L58 45" fill="none"/>
    </g>`,
  Watches: (c) => `
    <g stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round">
      <rect x="38" y="8" width="24" height="18" rx="3"/>
      <rect x="38" y="74" width="24" height="18" rx="3"/>
      <circle cx="50" cy="50" r="23"/>
      <circle cx="50" cy="50" r="2.6" fill="${c}"/>
      <line x1="50" y1="50" x2="50" y2="35"/>
      <line x1="50" y1="50" x2="61" y2="56"/>
    </g>`,
  Headphones: (c) => `
    <g stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 56 Q18 14 50 14 Q82 14 82 56"/>
      <rect x="10" y="52" width="17" height="28" rx="7"/>
      <rect x="73" y="52" width="17" height="28" rx="7"/>
    </g>`,
  Smartphones: (c) => `
    <g stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round">
      <rect x="31" y="8" width="38" height="84" rx="9"/>
      <line x1="40" y1="19" x2="60" y2="19"/>
      <circle cx="50" cy="84" r="2.6" fill="${c}"/>
    </g>`,
  Gaming: (c) => `
    <g stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 40 Q14 60 25 71 Q35 79 40 66 L60 66 Q65 79 75 71 Q86 60 80 40 Q74 27 50 27 Q26 27 20 40 Z"/>
      <circle cx="70" cy="45" r="3" fill="${c}"/>
      <circle cx="78" cy="53" r="3" fill="${c}"/>
      <line x1="26" y1="44" x2="26" y2="54"/>
      <line x1="21" y1="49" x2="31" y2="49"/>
    </g>`,
  Accessories: (c) => `
    <g stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M34 29 Q34 13 50 13 Q66 13 66 29"/>
      <rect x="21" y="29" width="58" height="57" rx="9"/>
    </g>`,
};

function productImage(category) {
  const accent = CATEGORY_ACCENTS[category] || "#7c6cf6";
  const iconFn = CATEGORY_ICONS[category] || CATEGORY_ICONS.Sneakers;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
    <defs>
      <radialGradient id="g" cx="50%" cy="36%" r="65%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="480" height="600" fill="#131316"/>
    <rect width="480" height="600" fill="url(#g)"/>
    <g transform="translate(90,150) scale(3)">${iconFn(accent)}</g>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const NEXORA_PRODUCTS = [
  // ---------------- SNEAKERS ----------------
  {
    id: "sn-001",
    name: "New Balance 574 Classic",
    category: "Sneakers",
    brand: "New Balance",
    price: 8999,
    oldPrice: 11999,
    discount: 25,
    rating: 4.6,
    reviews: 312,
    description: "A lightweight performance sneaker with a knit upper and responsive foam sole. Built for daily wear and long runs alike.",
    colors: ["#1a1a1f", "#f2f1ed", "#7c6cf6"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    featured: true,
    image: "assets/images/sn-001.jpg",
  },
  {
    id: "sn-002",
    name: "Nike Air force 1 Low",
    category: "Sneakers",
    brand: "Nike",
    price: 7499,
    oldPrice: 8999,
    discount: 17,
    rating: 4.3,
    reviews: 158,
    description: "Clean low-top silhouette with a durable rubber outsole. An everyday sneaker that pairs with anything.",
    colors: ["#1a1a1f", "#9a9aa3"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
    featured: false,
    image: "assets/images/sn-002.jpg",

  },
  {
    id: "sn-003",
    name: "Comet Casual Sneaker",
    category: "Sneakers",
    brand: "Comet",
    price: 10499,
    oldPrice: 12999,
    discount: 19,
    rating: 4.8,
    reviews: 421,
    description: "Aggressive lug outsole and water-resistant mesh for off-road stability. Built to handle mud, rock and rain.",
    colors: ["#1a1a1f", "#4fd1e8"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    featured: true,
    image: "assets/images/sn-003.jpg",
  },
  {
    id: "sn-004",
    name: "RedTape Brown Unisex Sneaker",
    category: "Sneakers",
    brand: "RedTape",
    price: 7299,
    oldPrice: 8999,
    discount: 19,
    rating: 4.1,
    reviews: 96,
    description: "High-top silhouette with reinforced ankle support and a bold sole unit for street-ready fits.",
    colors: ["#f2f1ed", "#7c6cf6", "#1a1a1f"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
    featured: false,
    image: "assets/images/sn-004.jpg",
  },

  // ---------------- WATCHES ----------------
  {
    id: "wt-001",
    name: "Tommy Hilfiger TH1792191",
    category: "Watches",
    brand: "Tommy Hilfiger",
    price: 9200,
    oldPrice: 11000,
    discount: 17,
    rating: 4.7,
    reviews: 204,
    description: "A sapphire-crystal automatic watch with a gradient aurora dial and stainless steel case.",
    colors: ["#1a1a1f", "#b8b8c0"],
    sizes: [],
    featured: true,
    image: "assets/images/wt-001.jpg",

  },
  {
    id: "wt-002",
    name: "Garmin Fenix 7",
    category: "Watches",
    brand: "Garmin",
    price: 15999,
    oldPrice: 17999,
    discount: 11,
    rating: 4.4,
    reviews: 380,
    description: "AMOLED smartwatch with 14-day battery, GPS, and health tracking in a titanium frame.",
    colors: ["#1a1a1f", "#4fd1e8"],
    sizes: [],
    featured: true,
    image: "assets/images/wt-002.jpg",
  },
  {
    id: "wt-003",
    name: "Hamilton Khaki Field",
    category: "Watches",
    brand: "Hamilton",
    price: 9499,
    oldPrice: 9499,
    discount: 0,
    rating: 4.2,
    reviews: 77,
    description: "A rugged field watch with a matte dial and quick-release nylon strap.",
    colors: ["#1a1a1f", "#5c5c66"],
    sizes: [],
    featured: false,
    image: "assets/images/wt-003.jpg",
  },
  {
    id: "wt-004",
    name: "Daniel Wellington Classic",
    category: "Watches",
    brand: "Daniel Wellington",
    price: 12999,
    oldPrice: 15499,
    discount: 16,
    rating: 4.5,
    reviews: 132,
    description: "An ultra-thin minimalist dress watch with a brushed steel case and leather strap.",
    colors: ["#f2f1ed", "#1a1a1f"],
    sizes: [],
    featured: false,
    image: "assets/images/wt-004.jpg",
  },

  // ---------------- HEADPHONES ----------------
  {
    id: "hp-001",
    name: "Sony WH-CH520",
    category: "Headphones",
    brand: "Sony",
    price: 13999,
    oldPrice: 17999,
    discount: 22,
    rating: 4.8,
    reviews: 512,
    description: "Over-ear headphones with adaptive noise cancellation and 40-hour battery life.",
    colors: ["#1a1a1f", "#f2f1ed"],
    sizes: [],
    featured: true,
    image: "assets/images/hp-001.jpg",
  },
  {
    id: "hp-002",
    name: "Apple AirPods Pro (2nd Gen)",
    category: "Headphones",
    brand: "Apple",
    price: 6999,
    oldPrice: 8499,
    discount: 18,
    rating: 4.3,
    reviews: 289,
    description: "True wireless earbuds with spatial audio and IPX5 sweat resistance.",
    colors: ["#1a1a1f", "#7c6cf6", "#f2f1ed"],
    sizes: [],
    featured: false,
    image: "assets/images/hp-002.jpg",
  },
  {
    id: "hp-003",
    name: "Sennheiser HD 600",
    category: "Headphones",
    brand: "Sennheiser",
    price: 18999,
    oldPrice: 18999,
    discount: 0,
    rating: 4.9,
    reviews: 143,
    description: "Open-back studio headphones tuned for flat, accurate monitoring.",
    colors: ["#1a1a1f"],
    sizes: [],
    featured: true,
    image: "assets/images/hp-003.jpg",
  },
  {
    id: "hp-004",
    name: "OnePlus Bullets Wireless Z2",
    category: "Headphones",
    brand: "OnePlus",
    price: 2999,
    oldPrice: 3999,
    discount: 25,
    rating: 4.0,
    reviews: 64,
    description: "A lightweight neckband earphone with 20-hour playback and fast charging.",
    colors: ["#1a1a1f", "#4fd1e8"],
    sizes: [],
    featured: false,
    image: "assets/images/hp-004.jpg",
  },

  // ---------------- SMARTPHONES ----------------
  {
    id: "sp-001",
    name: "Apple iPhone 15",
    category: "Smartphones",
    brand: "Apple",
    price: 54999,
    oldPrice: 59999,
    discount: 8,
    rating: 4.6,
    reviews: 601,
    description: "6.7-inch AMOLED display, triple camera system, and all-day battery in a titanium frame.",
    colors: ["#1a1a1f", "#b8b8c0", "#7c6cf6"],
    sizes: ["128GB", "256GB", "512GB"],
    featured: true,
    image: "assets/images/sp-001.jpg",
  },
  {
    id: "sp-002",
    name: "Samsung Galaxy A54 5G",
    category: "Smartphones",
    brand: "Samsung",
    price: 27999,
    oldPrice: 31999,
    discount: 13,
    rating: 4.2,
    reviews: 245,
    description: "A balanced mid-range phone with 120Hz display and 5000mAh battery.",
    colors: ["#1a1a1f", "#4fd1e8"],
    sizes: ["128GB", "256GB"],
    featured: false,
    image: "assets/images/sp-002.jpg",
  },
  {
    id: "sp-003",
    name: "Apple iPhone 15 Pro",
    category: "Smartphones",
    brand: "Apple",
    price: 74999,
    oldPrice: 79999,
    discount: 6,
    rating: 4.8,
    reviews: 389,
    description: "Flagship chip, pro-grade camera system, and a 120Hz LTPO display.",
    colors: ["#1a1a1f", "#5c5c66"],
    sizes: ["256GB", "512GB", "1TB"],
    featured: true,
    image: "assets/images/sp-003.jpg",
  },
  {
    id: "sp-004",
    name: "Samsung Galaxy Z Fold 5",
    category: "Smartphones",
    brand: "Samsung",
    price: 89999,
    oldPrice: 99999,
    discount: 10,
    rating: 4.4,
    reviews: 112,
    description: "A book-style foldable with a crease-resistant hinge and dual-screen multitasking.",
    colors: ["#1a1a1f", "#f2f1ed"],
    sizes: ["256GB", "512GB"],
    featured: false,
    image: "assets/images/sp-004.jpg",
  },

  // ---------------- GAMING ----------------
  {
    id: "gm-001",
    name: "Xbox Elite Wireless Controller Series 2",
    category: "Gaming",
    brand: "Microsoft",
    price: 5999,
    oldPrice: 7499,
    discount: 20,
    rating: 4.7,
    reviews: 267,
    description: "Wireless controller with hall-effect sticks and zero stick-drift design.",
    colors: ["#1a1a1f", "#7c6cf6"],
    sizes: [],
    featured: true,
    image: "assets/images/gm-001.jpg",
  },
  {
    id: "gm-002",
    name: "Logitech G Pro X Keyboard",
    category: "Gaming",
    brand: "Logitech",
    price: 8999,
    oldPrice: 10999,
    discount: 18,
    rating: 4.6,
    reviews: 341,
    description: "Hot-swappable mechanical keyboard with per-key RGB and aluminum frame.",
    colors: ["#1a1a1f"],
    sizes: [],
    featured: false,
    image: "assets/images/gm-002.jpg",
  },
  {
    id: "gm-003",
    name: "Razer DeathAdder V3 Pro",
    category: "Gaming",
    brand: "Razer",
    price: 4499,
    oldPrice: 4499,
    discount: 0,
    rating: 4.5,
    reviews: 198,
    description: "Ultra-light gaming mouse with a 26,000 DPI optical sensor.",
    colors: ["#1a1a1f", "#f2f1ed"],
    sizes: [],
    featured: false,
    image: "assets/images/gm-003.jpg",
  },
  {
    id: "gm-004",
    name: "Meta Quest 3",
    category: "Gaming",
    brand: "Meta",
    price: 34999,
    oldPrice: 39999,
    discount: 13,
    rating: 4.3,
    reviews: 88,
    description: "Standalone VR headset with 4K-per-eye resolution and inside-out tracking.",
    colors: ["#1a1a1f", "#4fd1e8"],
    sizes: [],
    featured: true,
    image: "assets/images/gm-004.jpg",
  },

  // ---------------- ACCESSORIES ----------------
  {
    id: "ac-001",
    name: "Anker 735 Charger (65W)",
    category: "Accessories",
    brand: "Anker",
    price: 2499,
    oldPrice: 2999,
    discount: 17,
    rating: 4.4,
    reviews: 156,
    description: "GaN fast charger with dual-port output for phones, tablets and laptops.",
    colors: ["#1a1a1f", "#f2f1ed"],
    sizes: [],
    featured: false,
    image: "assets/images/ac-001.jpg",
  },
  {
    id: "ac-002",
    name: "Peak Design Everyday Backpack",
    category: "Accessories",
    brand: "Peak Design",
    price: 4999,
    oldPrice: 5999,
    discount: 17,
    rating: 4.6,
    reviews: 203,
    description: "Water-resistant tech backpack with a padded 16-inch laptop sleeve.",
    colors: ["#1a1a1f", "#5c5c66"],
    sizes: [],
    featured: true,
    image: "assets/images/ac-002.jpg",
  },
  {
    id: "ac-003",
    name: "Belkin Magnetic Phone Mount",
    category: "Accessories",
    brand: "Belkin",
    price: 1799,
    oldPrice: 1799,
    discount: 0,
    rating: 4.1,
    reviews: 91,
    description: "A magnetic folding phone stand machined from a single block of aluminum.",
    colors: ["#b8b8c0", "#1a1a1f"],
    sizes: [],
    featured: false,
    image: "assets/images/ac-003.jpg",
  },
  {
    id: "ac-004",
    name: "Anker PowerCore 20K",
    category: "Accessories",
    brand: "Anker",
    price: 3299,
    oldPrice: 3999,
    discount: 18,
    rating: 4.5,
    reviews: 174,
    description: "20,000mAh power bank with 30W pass-through fast charging.",
    colors: ["#1a1a1f", "#4fd1e8"],
    sizes: [],
    featured: false,
    image: "assets/images/ac-004.jpg",
  },
];

// Real, category-matching photo as the primary image — but ONLY for
// products that don't already have their own `image` set. This means you
// can give any single product a real photo by just adding an `image: "..."`
// line to it above, and this loop will leave it alone.
NEXORA_PRODUCTS.forEach((p) => {
  if (!p.fallbackImage) p.fallbackImage = productImage(p.category);
  if (!p.image) p.image = photoUrl(p.category, p.id);
});

// Make available to other scripts (plain <script> tags, no modules)
if (typeof window !== "undefined") {
  window.NEXORA_PRODUCTS = NEXORA_PRODUCTS;
}