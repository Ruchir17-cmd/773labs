# 773 LABS

A React + Vite site for the 773 Labs 3D print studio, styled after the Nothing OS
aesthetic. There's no backend — every "Order" button opens WhatsApp with a
pre-filled message to +91 62604 28896.

## Pages

- `/` — Studio: who we are, what we do, process, CTA.
- `/printers` — The machines we run (FDM + resin).
- `/order` — Custom print request form (opens WhatsApp).

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

This outputs a static `dist/` folder you can upload to any static host.

## Where to make changes

- **Studio copy / capabilities / process**: `src/pages/Home.jsx`.
- **Printer list & specs**: `src/pages/Printers.jsx`.
- **Order form fields**: `src/pages/Order.jsx`.
- **WhatsApp number**: `src/data/whatsapp.js`, the `WHATSAPP_PHONE` constant.
- **Colors, fonts, spacing**: `src/lab.css` (CSS variables at the top).
- **Nav / footer**: `src/components/Navbar.jsx` and the footers in each page.
