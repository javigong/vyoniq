# Clerk Production Authentication Troubleshooting Guide

This guide helps you diagnose and fix Clerk authentication issues in production environments.

## Quick Diagnostic Steps

### 1. Run the Debug Script

```bash
node scripts/debug-production-auth.js
```

### 2. Check Production Debug Page

Visit `https://vyoniq.com/debug-auth` to see:

- Environment variables status
- User authentication state
- Database connection
- Expected redirect behavior

### 3. Browser Developer Tools

- **Console**: Check for JavaScript errors
- **Network**: Look for failed authentication requests
- **Application**: Check cookies and local storage

## Common Issues and Solutions

### Issue 1: "Invalid Publishable Key" Error

**Symptoms:**

- Users can't sign in
- Console shows publishable key errors
- Authentication forms don't load

**Solution:**

1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in production environment
2. Ensure you're using production keys (not test keys)
3. Check Clerk Dashboard for correct key format

### Issue 2: Domain Configuration Issues

**Symptoms:**

- Authentication works locally but not in production
- CORS errors in browser console
- Redirects to incorrect URLs

**Solution:**

1. Add your production domain to Clerk's "Authorized domains"
2. Configure proper redirect URLs in Clerk Dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`
3. Set `NEXT_PUBLIC_BASE_URL` to your production domain

### Issue 3: Allowed Redirect Origins Configuration

**Symptoms:**

- Console warning: "Redirect URL ... is not on one of the allowedRedirectOrigins"
- Redirects falling back to default URL
- Authentication flow redirecting to wrong pages

**Solution:**

1. In Clerk Dashboard, go to **Configure** → **Restrictions**
2. Under **Allowed redirect origins**, add:
   - `http://localhost:3000` (for development)
   - `https://vyoniq.com` (for production)
   - `https://www.vyoniq.com` (if using www subdomain)
3. Save the configuration
4. Test authentication flow again

### Issue 4: Middleware Authorization Issues

**Symptoms:**

- Users get redirected to sign-in repeatedly
- "Unauthorized" errors in logs
- Protected routes not working

**Solution:**

1. Verify `authorizedParties` in middleware configuration
2. Check if middleware is properly protecting routes
3. Ensure production domain is in `authorizedParties` array

### Issue 5: Cookie and Session Issues

**Symptoms:**

- Users get signed out immediately
- Session not persisting
- Authentication state inconsistent

**Solution:**

1. Check cookie settings in Clerk Dashboard
2. Verify HTTPS is enabled in production
3. Check session lifetime settings
4. Ensure proper cookie domain configuration

### Issue 6: Webhook Configuration Issues

**Symptoms:**

- User creation failing
- Database records not created
- Welcome emails not sent

**Solution:**

1. Verify webhook endpoints are accessible
2. Check webhook URL configuration in Clerk Dashboard
3. Ensure `CLERK_WEBHOOK_SECRET` is correctly set
4. Test webhook endpoints manually

### Issue 7: Deprecated Props Warnings

**Symptoms:**

- Console warnings about deprecated `afterSignInUrl` and `afterSignUpUrl`
- Warnings about prop priorities

**Solution:**

1. Replace deprecated props with new ones:
   - `afterSignInUrl` → `forceRedirectUrl`
   - `afterSignUpUrl` → `forceRedirectUrl`
   - `signInFallbackRedirectUrl` → `signInForceRedirectUrl`
   - `signUpFallbackRedirectUrl` → `signUpForceRedirectUrl`
2. Remove conflicting props from ClerkProvider
3. Use `forceRedirectUrl` for consistent redirects

## Production Checklist

### Environment Variables

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (production key)
- [ ] `CLERK_SECRET_KEY` (production key)
- [ ] `NEXT_PUBLIC_BASE_URL` (production domain)
- [ ] `CLERK_WEBHOOK_SECRET` (production webhook secret)

### Clerk Dashboard Configuration

- [ ] Authorized domains include production domain
- [ ] **Allowed redirect origins** configured:
  - [ ] `http://localhost:3000` (development)
  - [ ] `https://vyoniq.com` (production)
  - [ ] `https://www.vyoniq.com` (if using www)
- [ ] Sign-in URL: `/sign-in`
- [ ] Sign-up URL: `/sign-up`
- [ ] After sign-in URL: `/dashboard`
- [ ] After sign-up URL: `/dashboard`
- [ ] Webhook endpoints configured for production
- [ ] CORS settings include production domain
- [ ] Enhanced email matching enabled
- [ ] Session lifetime configured appropriately

### Code Configuration

- [ ] `authorizedParties` in middleware includes production domain
- [ ] `ClerkProvider` has proper configuration (no deprecated props)
- [ ] Sign-in/Sign-up pages use `forceRedirectUrl`
- [ ] Protected routes are properly configured in middleware

## Testing Steps

### 1. Basic Authentication Test

1. Visit production site in incognito mode
2. Click "Sign In"
3. Create new account or sign in with existing
4. Verify redirect to dashboard
5. Check if user data is properly stored

### 2. Session Persistence Test

1. Sign in to production site
2. Close browser
3. Open browser and visit site
4. Verify you're still signed in
5. Check session expiration behavior

### 3. Cross-Page Navigation Test

1. Sign in to production site
2. Navigate to different pages
3. Verify authentication state persists
4. Check protected routes work correctly

## Debugging Commands

### Check Environment Variables

```bash
# Local environment
cat .env.local | grep CLERK

# Production environment (varies by hosting platform)
# For Coolify, check environment variables in dashboard
```

### Test Webhook Endpoints

```bash
# Test webhook accessibility
curl -X POST https://vyoniq.com/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{"test": "payload"}'
```

### Check DNS and SSL

```bash
# Check DNS resolution
nslookup vyoniq.com

# Check SSL certificate
openssl s_client -connect vyoniq.com:443 -servername vyoniq.com
```

## Log Analysis

### Application Logs

Look for these patterns:

- `Authentication error:` - Middleware auth failures
- `Error verifying webhook:` - Webhook validation issues
- `Error creating user:` - Database creation failures

### Browser Console Errors

Common error patterns:

- `ClerkJS: Invalid publishable key` - Key configuration issue
- `CORS policy` - Domain configuration issue
- `Failed to fetch` - Network connectivity issue
- `Redirect URL ... is not on one of the allowedRedirectOrigins` - Redirect origins configuration issue

### Clerk Dashboard Logs

Check for:

- Failed authentication attempts
- Webhook delivery failures
- API request errors

## Advanced Troubleshooting

### 1. Network Connectivity

```bash
# Test connectivity to Clerk API
curl -I https://api.clerk.com/v1/

# Test your production API endpoints
curl -I https://vyoniq.com/api/webhooks/clerk
```

### 2. Database Connection

```bash
# Test database connection (adjust for your setup)
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => console.log('Users:', count));
"
```

### 3. Compare Working vs Broken Environments

1. Export working local configuration
2. Compare with production configuration
3. Identify differences in:
   - Environment variables
   - Clerk dashboard settings
   - Network configuration
   - SSL certificates

## Getting Help

If you're still experiencing issues:

1. **Check Clerk Documentation**: https://clerk.com/docs
2. **Clerk Community**: https://clerk.com/discord
3. **Check GitHub Issues**: Search for similar problems
4. **Contact Support**: Include debug information from steps above

## Prevention

To avoid future issues:

1. Use staging environment that mirrors production
2. Test authentication changes before deploying
3. Monitor application logs for authentication errors
4. Set up alerts for authentication failures
5. Keep Clerk SDK updated
6. Document your Clerk configuration

---

_Last updated: January 2025_
