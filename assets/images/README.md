# Adding Real Product Photos

Right now, `js/products.js` automatically pulls a **real, category-matching photo** for every product from a live photo service (a real photo of a sneaker for sneakers, a real watch for watches, etc). If a photo fails to load, the site automatically falls back to a simple SVG icon — nothing breaks either way.

## To use your own photo for a product

1. Put your image file in this folder — e.g. `assets/images/sn-001.jpg`.
2. Open `js/products.js`, find that product by its `id`, and add an `image` line to it:

```js
{
  id: "sn-001",
  name: "Aero Runner X1",
  category: "Sneakers",
  ...
  image: "assets/images/sn-001.jpg",   // <-- add this line
  ...
},
```

That's it — because the auto-photo code at the bottom of the file only fills in an `image` for products that **don't already have one**, your real photo will always be used for that product instead.

## Where to get real, free-to-use product photos

- [Unsplash](https://unsplash.com) — free stock photos, no attribution required
- [Pexels](https://pexels.com) — same idea, also free
- Or your own photography, if this is for an actual product

Keep images reasonably sized (under ~500KB each) so pages load quickly.
