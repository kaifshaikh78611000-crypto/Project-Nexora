# Adding Real 3D Models (.glb)

The site tries to load a real `.glb` model for every 3D view. If it can't find one, it automatically falls back to a simple built-in shape — nothing breaks either way.

## Where to put files

Put `.glb` files directly in this folder (`assets/models/`), named exactly like this:

**Category-level models** (used everywhere for that category):
```
assets/models/sneakers.glb
assets/models/watches.glb
assets/models/headphones.glb
assets/models/smartphones.glb
assets/models/gaming.glb
assets/models/accessories.glb
```
(lowercase, matching the category name shown on the site)

**Product-specific models** (used only for that one product, overrides the category model):
```
assets/models/sn-001.glb
assets/models/wt-002.glb
```
(the product's `id`, found in `js/products.js`)

**Homepage hero models** (the 4 objects on the homepage — optional, separate from the shop):
```
assets/models/sneaker-hero.glb
assets/models/headphones-hero.glb
assets/models/watch-hero.glb
assets/models/accessory-hero.glb
```

## Lookup order

For a product page, it checks in this order and uses the first one that exists:
1. `assets/models/<product-id>.glb`
2. `assets/models/<category>.glb`
3. Falls back to the built-in simple shape

## Where to get free .glb models

This project ships with **no** `.glb` files — I can't create real 3D scans or download from the sites that host them (my tool access is locked to code registries, not 3D-asset sites). Here are exact links to free, no-login-required, CC-licensed models for each category:

| Category | File to create | Get a model here |
|---|---|---|
| Sneakers | `assets/models/sneakers.glb` | https://poly.pizza/search/sneaker |
| Watches | `assets/models/watches.glb` | https://poly.pizza/search/watch |
| Headphones | `assets/models/headphones.glb` | https://poly.pizza/search/headphones |
| Smartphones | `assets/models/smartphones.glb` | https://poly.pizza/search/phone |
| Gaming | `assets/models/gaming.glb` | https://poly.pizza/search/controller |
| Accessories | `assets/models/accessories.glb` | https://poly.pizza/search/backpack |

On Poly Pizza: click a model → **Download** → pick **GLB** format → no account needed. Rename the downloaded file to match the table above and drop it straight into this folder. The site will pick it up automatically on the next page load — no code changes needed.

Other good sources if Poly Pizza doesn't have what you want:
- [Sketchfab](https://sketchfab.com) — filter by "Downloadable" + CC0/CC-BY license, then export as glTF/GLB
- [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) — free test models (not product-specific, but genuinely free and reliable)

Export/download as `.glb` (not `.gltf` + separate texture files — `.glb` is the single-file format this site expects), rename it to match the convention above, and drop it in this folder. No code changes needed.

## Notes

- Keep file sizes reasonable (under a few MB) or the 3D view will take a while to load.
- Draco-compressed `.glb` files are **not** supported by this setup (would need an extra decoder). If your export tool offers a Draco compression option, turn it off.
- The site automatically centers and scales whatever model it loads, so it doesn't matter what size/origin the model was exported at.
