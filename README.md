## Drew's 3D Printing — MVP Web App

This repo contains the MVP front-end for a 3D printing shop built with Vite + React + TypeScript, Tailwind CSS, and placeholders for Firebase/Firestore and Stripe integrations.

### Stack
- React + TypeScript (Vite)
- Tailwind CSS
- Firebase (Auth/Firestore) — optional in dev
- Zustand for cart state

### Quick Start

Prereqs: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173).

For local function testing, use a platform dev CLI (optional):

- Vercel: `vercel dev` (requires Vercel CLI) serves `/api/*` from `api/*` functions.
- Netlify: `netlify dev` (requires Netlify CLI) serves `/.netlify/functions/*` and honors `netlify.toml` redirects from `/api/*`.

### Environment Variables

Copy `.env.example` to `.env` and fill values to enable Firebase and Stripe in the future.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_STRIPE_PUBLIC_KEY=
### Stripe Elements (Test)
- Set `VITE_STRIPE_PUBLIC_KEY` to your Stripe publishable key (test).
- Set `STRIPE_SECRET_KEY` in Vercel/Netlify project envs.
- Test card: `4242 4242 4242 4242`, any future date, any CVC/ZIP.

```

If omitted, the app uses local sample data for products and disables remote calls.

### Scripts
- `npm run dev` — start dev server
- `npm run build` — typecheck and build for production
- `npm run preview` — preview built app
// Server scripts removed — serverless functions are used for API in deploys.

### Project Structure (key files)
- `index.html` — entry HTML
- `src/main.tsx` — app bootstrap
- `src/App.tsx` — routes
- `src/pages/*` — pages (Home, Categories, ProductList, ProductDetail, Cart, Auth, CustomOrder)
- `src/components/*` — UI components
- `src/store/cart.ts` — Zustand cart with persistence
- `src/services/*` — product data + stripe placeholder
- `src/lib/firebase.ts` — Firebase client (safe if env missing)
- `src/data/sampleProducts.json` — dev products
- `firestore_data_model.md` — Firestore collections and examples

### Branding
Tailwind brand colors are configured:
- Blue `#0077B6` (primary)
- Green `#00B4B4` (secondary)
- Red `#E63946` (accent)
- Light `#F4F4F9` (background)
- Dark `#1E1E24` (text)

Utility button classes:
- `.btn-primary` (blue), `.btn-secondary` (green), `.btn-accent` (red)

### Roadmap
- Wire Firebase Auth and Firestore reads
- Add checkout flow with Stripe backend
- Admin dashboard for inventory/orders

### Deployment (Preview)
- Netlify or Vercel can host the frontend; use platform functions for Stripe.

#### Vercel
- API: `api/create-payment-intent.js` is ready. Vercel auto-detects it.
- SPA fallback: `vercel.json` rewrites all routes to `index.html`.
- Env vars (Vercel Project Settings → Environment Variables):
	- `STRIPE_SECRET_KEY=sk_test_...`
	- `VITE_FIREBASE_API_KEY=...`
	- `VITE_FIREBASE_AUTH_DOMAIN=...`
	- `VITE_FIREBASE_PROJECT_ID=...`
	- `VITE_FIREBASE_STORAGE_BUCKET=...`
	- `VITE_FIREBASE_MESSAGING_SENDER_ID=...`
	- `VITE_FIREBASE_APP_ID=...`

#### Netlify
- Functions: `netlify/functions/create-payment-intent.js`
- Config: `netlify.toml` includes SPA fallback and `/api/*` to functions.
- Redirects: `public/_redirects` added for SPA + API routing.
- Env vars (Netlify Site Settings → Environment Variables):
	- `STRIPE_SECRET_KEY=sk_test_...`
	- `VITE_FIREBASE_*` as above

After setting envs, trigger a new deploy.
# drews3dprinting