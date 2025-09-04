# Production Deployment Guide

## Database Migrations for Production

### Current Migration Status ✅

Your Prisma migrations are now **production-ready**! Here's what has been resolved:

#### Migration Files:

1. **`20250703193433_baseline`** - Complete database schema baseline
2. **`20250711080826_remove_waitlist_feature`** - Removed waitlist column
3. **`20250112000000_add_subscription_system`** - Complete subscription system

### Pre-Deployment Checklist

#### ✅ **Migration Files Verified**

- [x] All migration files are present in `prisma/migrations/`
- [x] `migration_lock.toml` exists and specifies PostgreSQL provider
- [x] Development database is in sync with migrations
- [x] Prisma client generates successfully

#### 🔧 **Environment Variables Required**

```bash
# Production database URL
POSTGRES_URL="postgresql://username:password@host:port/database"

# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."

# Stripe payments
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Email service
RESEND_API_KEY="..."

# Other environment variables
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Production Deployment Steps

#### 1. **Prepare Production Database**

```bash
# In production environment, run migrations
npx prisma migrate deploy
```

#### 2. **Generate Prisma Client**

```bash
npx prisma generate
```

#### 3. **Build Application**

```bash
npm run build
# or
pnpm build
```

#### 4. **Start Production Server**

```bash
npm start
# or
pnpm start
```

### Migration Safety ⚠️

#### **Safe Operations** ✅

- Adding new tables (like Subscription system)
- Adding new columns with default values
- Adding indexes
- Adding foreign key constraints to new tables

#### **Potentially Unsafe Operations** ⚠️

- Dropping columns or tables
- Changing column types
- Adding NOT NULL columns without defaults
- Renaming tables or columns

### Current Subscription System Features

The following features are included in the latest migration:

#### **New Tables:**

- `Subscription` - Main subscription records
- `SubscriptionItem` - Line items for subscriptions
- `SubscriptionPayment` - Payment tracking for subscriptions

#### **New Enums:**

- `SubscriptionStatus` - DRAFT, SENT, APPROVED, REJECTED, etc.
- `SubscriptionPaymentStatus` - PENDING, ACTIVE, PAST_DUE, etc.

#### **Features Included:**

- ✅ Multi-currency support (USD/CAD)
- ✅ Flexible billing intervals (monthly/yearly)
- ✅ Trial period support
- ✅ Stripe integration
- ✅ Auto user creation for standalone subscriptions
- ✅ Email notifications
- ✅ Webhook handling

### Rollback Strategy

If you need to rollback the subscription system:

```bash
# Reset to previous migration (removes subscription system)
npx prisma migrate reset --skip-seed

# Apply only the first two migrations
npx prisma migrate deploy
```

### Monitoring Production Migrations

After deployment, verify everything is working:

```bash
# Check migration status
npx prisma migrate status

# Verify database connectivity
npx prisma db ping

# Check that all tables exist
npx prisma db pull --print | grep "CREATE TABLE"
```

### Common Production Issues & Solutions

#### **Issue**: Migration fails on production

**Solution**: Check that the production database user has sufficient permissions

#### **Issue**: Environment variables not loaded

**Solution**: Verify `.env` files are properly configured for production

#### **Issue**: Prisma client errors

**Solution**: Ensure `npx prisma generate` runs during build process

### Next.js Deployment Considerations

#### **Build Configuration**

Ensure your `package.json` includes proper build scripts:

```json
{
  "scripts": {
    "build": "prisma migrate deploy && prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

#### **Vercel Deployment**

If deploying to Vercel, add these settings:

- Build Command: `prisma migrate deploy && prisma generate && next build`
- Install Command: `pnpm install`

#### **Railway/Render Deployment**

For Railway or Render:

- Ensure database environment variables are set
- Add build command to run migrations before build

### Database Backup Recommendation

Before running migrations in production:

```bash
# Create backup (adjust for your database provider)
pg_dump $DATABASE_URL > backup_before_migration.sql
```

### Auto User Creation Feature

The latest migration includes support for:

- ✅ Standalone budget/subscription creation
- ✅ Automatic user account generation
- ✅ Welcome email with credentials
- ✅ Professional email templates

### Success Criteria

After deployment, verify these features work:

- [ ] Admin can create budgets for existing inquiries
- [ ] Admin can create standalone budgets (auto-creates users)
- [ ] Admin can create subscriptions for existing inquiries
- [ ] Admin can create standalone subscriptions (auto-creates users)
- [ ] Users receive welcome emails with credentials
- [ ] Stripe payments work for both budgets and subscriptions
- [ ] Multi-currency support (USD/CAD) functions correctly
- [ ] Email notifications are sent when budgets/subscriptions are sent

---

**🚀 Your database migrations are production-ready!**

The subscription system with auto user creation is fully implemented and will deploy successfully to production.
