# Deployment Guide - PrintShoppy

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7
- Domain with DNS configured

## Environment Setup

1. Copy environment template:
```bash
cp .env.example .env
```

2. Fill in all required values:
```bash
# Critical values to set:
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)

# Payment keys from dashboards
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Cloudflare R2
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=printshoppy
R2_ACCOUNT_ID=xxx
R2_PUBLIC_URL=https://pub.your-r2-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=xxx.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Shiprocket
SHIPROCKET_EMAIL=your@email.com
SHIPROCKET_PASSWORD=xxx

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

## Database Setup

```bash
# Run migrations
cd apps/api && npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

## Local Development

```bash
# Install all dependencies
npm install

# Start infrastructure
docker-compose up postgres redis -d

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start all services in development mode
npm run dev

# APIs available at:
# Web: http://localhost:3000
# API: http://localhost:4000
# API Docs: http://localhost:4000/api/docs
```

## Production with Docker

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Scale services
docker-compose up -d --scale api=3

# Update deployment
docker-compose pull && docker-compose up -d
```

## SSL Setup with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Obtain certificates
certbot certonly --webroot \
  -w /var/www/certbot \
  -d printshoppy.com \
  -d www.printshoppy.com \
  -d api.printshoppy.com

# Auto-renewal
certbot renew --dry-run

# Add to crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

## Cloudflare R2 Setup

1. Create R2 bucket in Cloudflare dashboard
2. Create API token with R2 access
3. Configure public domain for the bucket
4. Set CORS policy:
```json
[
  {
    "AllowedOrigins": ["https://printshoppy.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## Razorpay Webhook Setup

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://api.printshoppy.com/api/v1/payments/razorpay/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to `.env`

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://api.printshoppy.com/api/v1/payments/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Shiprocket Integration

1. Create account at app.shiprocket.in
2. Add credentials to `.env`
3. Configure pickup address in Shiprocket dashboard
4. Test with sandbox credentials first

## Monitoring

```bash
# Health checks
curl https://api.printshoppy.com/api/v1/health

# Database status
docker-compose exec postgres pg_isready

# Redis status
docker-compose exec redis redis-cli ping

# API logs
docker-compose logs -f api --tail=100
```

## Backup

```bash
# Database backup
docker-compose exec postgres pg_dump -U postgres printshoppy > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U postgres printshoppy < backup_20240101.sql
```

## Performance Tuning

### PostgreSQL
```sql
-- Add indexes for common queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
```

### Redis Cache TTL
- Product lists: 5 minutes
- Individual products: 30 minutes
- Categories: 1 hour
- User sessions: 7 days

## Scaling

### Horizontal Scaling
```bash
# Scale API instances
docker-compose up -d --scale api=5

# Use load balancer (Nginx upstream)
# Already configured in nginx.conf
```

### Database Scaling
- Use read replicas for heavy read traffic
- Consider PgBouncer for connection pooling
- Add Redis cluster for high availability

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT secrets
- [ ] Configure CORS for production domains
- [ ] Enable SSL/TLS everywhere
- [ ] Set up WAF (Cloudflare recommended)
- [ ] Enable DDoS protection
- [ ] Configure rate limiting
- [ ] Set up automated backups
- [ ] Enable audit logging
- [ ] Scan dependencies: `npm audit`
