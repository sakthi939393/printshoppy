# PrintShoppy — Custom Print-on-Demand Platform

A full-stack print-on-demand platform: online design studio, product catalogue, customer dashboard, admin panel, and print production management.

**Tech stack:** Next.js 14 · NestJS · PostgreSQL · Redis · Prisma · Fabric.js · Three.js · Razorpay/Stripe · Cloudflare R2 · Shiprocket

---

## Quick Deploy

### Frontend → Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/printshoppy&root=apps/web)

1. Click the button above (or import the repo manually in [vercel.com](https://vercel.com)).
2. Vercel auto-detects `vercel.json` — it sets the root to `apps/web` automatically.
3. Add the environment variables listed below.
4. Click **Deploy**.

#### Required Vercel environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (Railway/Render), e.g. `https://api.printshoppy.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL, e.g. `https://printshoppy.vercel.app` |
| `NEXT_PUBLIC_R2_PUBLIC_DOMAIN` | Cloudflare R2 public hostname (no `https://`) |

---

### Backend → Railway (recommended)

1. Create a new project at [railway.app](https://railway.app).
2. Add **PostgreSQL** and **Redis** plugins.
3. Connect this repo and set the root to `apps/api`.
4. Set all backend env vars from `.env.example`.
5. The start command is `node dist/main`.
6. Copy the generated Railway URL → set as `NEXT_PUBLIC_API_URL` in Vercel.

Alternatively deploy to [Render](https://render.com) using a Web Service pointing to `apps/api`.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL + Redis
docker-compose up postgres redis -d

# 3. Copy env file and fill in values
cp .env.example .env

# 4. Run database migrations & seed
npm run db:migrate
npm run db:seed

# 5. Start all services
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Swagger docs: http://localhost:4000/api/docs

**Seed credentials**
- Admin: `admin@printshoppy.com` / `Admin@123`
- Customer: `customer@example.com` / `Customer@123`

---

## Project Structure

```
printshoppy/
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   └── web/          # Next.js 14 frontend (port 3000)
├── packages/
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configs
│   └── types/        # Shared TypeScript types
├── infrastructure/   # Docker, Nginx, Kubernetes
├── vercel.json       # Vercel monorepo config (points to apps/web)
└── docker-compose.yml
```

---

## Key Features

- **Online Design Studio** — Fabric.js canvas with text, images, shapes; 3D mockup via Three.js
- **Product Catalogue** — categories, variants, pricing, stock management
- **Dual Payments** — Razorpay (India) + Stripe (international) with webhook verification
- **Shipping** — Shiprocket API integration with AWB tracking
- **Admin Panel** — orders, products, customers, production queue, analytics
- **Print Production** — PDF generation (pdf-lib), job assignment, status tracking
- **Real-time Collaboration** — Socket.IO WebSocket gateway on `/design` namespace
- **PWA** — manifest, offline support, installable

---

## Deployment Architecture

```
Browser
  │
  ├── Vercel (Next.js frontend)
  │     └── NEXT_PUBLIC_API_URL ──────────────────┐
  │                                               ▼
  └──────────────────────────── Railway/Render (NestJS API)
                                      ├── PostgreSQL (Railway plugin)
                                      ├── Redis (Railway plugin)
                                      └── Cloudflare R2 (file storage)
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full list with descriptions.
