# Shivesh.3D

A React + Vite storefront for browsing 3D printed designs. There's no backend —
every "order" and "quote" button opens WhatsApp with a pre-filled message to
+91 62604 28896.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

This outputs a static `dist/` folder you can upload to any static host
(Netlify, Vercel, GitHub Pages, cPanel, etc.) — no server or database needed.

## Where to make changes

- **Add or edit designs**: `src/data/products.js`. Each entry is one product
  card. Add as many as you like — the shop page's search, filters, and
  "show more" pagination all work automatically.
- **Change the WhatsApp number**: `src/data/whatsapp.js`, the `WHATSAPP_PHONE`
  constant (digits only, country code first, no `+` or spaces).
- **Which 2 designs show on the homepage**: `FEATURED_IDS` at the bottom of
  `src/data/products.js`.
- **Copy and sections**: `src/pages/Home.jsx`, `src/pages/Shop.jsx`,
  `src/pages/Quote.jsx`.
- **Colors, fonts, spacing**: `src/index.css` (CSS variables at the top).
- **Icons on product cards**: `src/components/Icon.jsx` — there are 8 line-art
  icons (gear, drone, helmet, building, grip, vase, bracket, mini). Assign one
  per product via the `icon` field in `products.js`, or add new ones here.

## Notes

- Testimonials, prices, and printer materials are placeholders — replace them
  with real client feedback and Shivesh's actual pricing.
- The product images are simple line-art icons, not real photos. Swapping in
  real photos would mean replacing `<Icon name="..." />` in
  `src/components/ProductCard.jsx` with an `<img>` tag once photos exist.
