# PrintShoppy - System Architecture

## Overview

PrintShoppy is a full-stack print-on-demand platform built with a modern monorepo architecture.

```
printshoppy/
├── apps/
│   ├── api/              # NestJS Backend (Port 4000)
│   └── web/              # Next.js 14 Frontend (Port 3000)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configs
│   └── types/            # Shared TypeScript types
├── infrastructure/
│   ├── docker/           # Docker configs
│   ├── nginx/            # Nginx configs
│   └── k8s/              # Kubernetes manifests
└── docs/                 # Documentation
```

## Tech Stack

### Frontend (apps/web)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Canvas Editor**: Fabric.js 6.x
- **3D Preview**: Three.js + @react-three/fiber
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend (apps/api)
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Cache**: Redis + NestJS Cache Manager
- **Auth**: JWT + Passport.js + Google OAuth
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Payments**: Razorpay + Stripe
- **Shipping**: Shiprocket API
- **Email**: Nodemailer
- **PDF**: Puppeteer + pdf-lib
- **WebSocket**: Socket.IO (design collaboration)
- **API Docs**: Swagger/OpenAPI

### Infrastructure
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx
- **Containerization**: Docker + Docker Compose
- **Storage**: Cloudflare R2

## Database Schema

### Core Entities
```
User → Order → OrderItem → Product → ProductVariant
User → Design → Template
Order → Payment
Order → Shipment
Order → PrintJob
```

## API Routes

### Authentication
```
POST /api/v1/auth/register    - Register new user
POST /api/v1/auth/login       - Login
POST /api/v1/auth/refresh     - Refresh token
POST /api/v1/auth/logout      - Logout
GET  /api/v1/auth/google      - Google OAuth
GET  /api/v1/auth/me          - Get current user
```

### Products
```
GET  /api/v1/products         - List products (with filters)
GET  /api/v1/products/featured - Featured products
GET  /api/v1/products/:slug   - Get product detail
GET  /api/v1/products/:id/price - Calculate price
POST /api/v1/products         - Create product (Admin)
PUT  /api/v1/products/:id     - Update product (Admin)
```

### Orders
```
POST /api/v1/orders           - Create order from cart
GET  /api/v1/orders           - List my orders
GET  /api/v1/orders/:id       - Get order detail
POST /api/v1/orders/:id/cancel - Cancel order
POST /api/v1/orders/:id/reorder - Reorder
```

### Designs
```
POST /api/v1/designs          - Create design
GET  /api/v1/designs          - My designs
GET  /api/v1/designs/:id      - Get design
PUT  /api/v1/designs/:id      - Update design
POST /api/v1/designs/:id/save - Save design
POST /api/v1/designs/:id/preview - Generate preview
POST /api/v1/designs/:id/duplicate - Duplicate
DELETE /api/v1/designs/:id    - Delete
```

### Payments
```
POST /api/v1/payments/razorpay/create/:orderId - Create Razorpay order
POST /api/v1/payments/razorpay/verify - Verify payment
POST /api/v1/payments/stripe/create/:orderId - Create Stripe intent
POST /api/v1/payments/stripe/webhook - Stripe webhook
```

### Admin
```
GET  /api/v1/admin/orders     - All orders
PUT  /api/v1/admin/orders/:id/status - Update order status
GET  /api/v1/admin/customers  - All customers
PUT  /api/v1/admin/customers/:id/toggle-status
```

### Production
```
GET  /api/v1/production/queue - Print queue
GET  /api/v1/production/stats - Production stats
POST /api/v1/production/:orderId/generate-file - Generate PDF
PUT  /api/v1/production/jobs/:jobId/assign - Assign job
PUT  /api/v1/production/jobs/:jobId/status - Update status
```

## WebSocket Events (Design Collaboration)

### Client → Server
- `join-design` - Join a design session
- `canvas-update` - Send canvas changes
- `cursor-move` - Send cursor position

### Server → Client
- `canvas-updated` - Receive canvas updates
- `cursor-moved` - Receive cursor positions
- `collaborator-count` - Number of active collaborators

## Order Flow

```
Customer → Cart → Checkout → Create Order → Payment (Razorpay/Stripe)
        → Order Confirmed → Generate Print File (PDF)
        → Print Queue → Assigned to Staff
        → Printing → Quality Check
        → Dispatch → Shiprocket API
        → Shipping → Delivered
```

## Design Flow

```
Customer → Select Product → Load Canvas (Fabric.js)
        → Add Text/Images/Shapes
        → Customize (colors, fonts, size)
        → Preview on 3D Mockup (Three.js)
        → Save Design → Add to Cart
        → Checkout
```

## Security

- JWT tokens with short expiry (15 min) + refresh tokens (7 days)
- Rate limiting per endpoint
- Input validation with class-validator
- Helmet.js for security headers
- CORS configured for specific origins
- File upload validation (type, size)
- SQL injection prevention via Prisma ORM
- XSS prevention via input sanitization

## Performance

- Redis caching for products, categories
- Next.js ISR for product pages
- Image optimization via Next.js Image
- CDN via Cloudflare R2 public URLs
- Lazy loading for images
- Code splitting via Next.js
- WebSocket for real-time updates

## Deployment

### Development
```bash
# Install dependencies
npm install

# Start services
docker-compose up postgres redis -d

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start dev servers
npm run dev
```

### Production
```bash
# Build all apps
npm run build

# Start with Docker
docker-compose up -d

# SSL with Let's Encrypt
certbot certonly --webroot -w /var/www/certbot -d printshoppy.com
```
