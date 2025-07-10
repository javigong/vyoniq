#!/usr/bin/env node

/**
 * Clear Clerk Cache and Test Authentication Flow
 * Run: node scripts/clear-clerk-cache.js
 */

console.log("🧹 Clerk Cache Clearing Guide\n");
console.log("=".repeat(50));

console.log("\n📋 STEP 1: Clear Browser Cache");
console.log("1. Open DevTools (F12)");
console.log("2. Go to Application/Storage tab");
console.log("3. Clear these items:");
console.log("   - Local Storage (all clerk-related entries)");
console.log("   - Session Storage (all clerk-related entries)");
console.log("   - Cookies (all clerk-related cookies)");
console.log("   - IndexedDB (clerk entries)");

console.log("\n🔧 STEP 2: Test with JavaScript Console");
console.log("Copy and paste this in your browser console:");
console.log(`
// Clear all localStorage entries
Object.keys(localStorage).forEach(key => {
  if (key.includes('clerk') || key.includes('__client')) {
    console.log('Removing localStorage key:', key);
    localStorage.removeItem(key);
  }
});

// Clear all sessionStorage entries
Object.keys(sessionStorage).forEach(key => {
  if (key.includes('clerk') || key.includes('__client')) {
    console.log('Removing sessionStorage key:', key);
    sessionStorage.removeItem(key);
  }
});

// Check current location
console.log('Current origin:', window.location.origin);
console.log('Should be: https://vyoniq.com');

// Force reload without cache
window.location.reload(true);
`);

console.log("\n🔍 STEP 3: Test Authentication Flow");
console.log("1. Try signing in with incognito/private browsing");
console.log("2. Check the URL during redirect");
console.log("3. Look for any localhost URLs in the browser address bar");
console.log("4. Check browser console for any Clerk warnings");

console.log("\n⚠️  STEP 4: Check Clerk Dashboard");
console.log("Go to: https://dashboard.clerk.com");
console.log("Navigate to: Configure → Restrictions");
console.log("Check these settings:");
console.log("   - Allowed redirect origins: https://vyoniq.com");
console.log("   - Remove any localhost entries");
console.log("   - Save changes");

console.log("\n📊 STEP 5: Environment Check");
console.log("Verify these environment variables in production:");
console.log("   - NODE_ENV=production");
console.log("   - NEXT_PUBLIC_BASE_URL=https://vyoniq.com");
console.log("   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...");
console.log("   - CLERK_SECRET_KEY=sk_live_...");

console.log("\n🚨 STEP 6: If Still Having Issues");
console.log("1. Check: https://vyoniq.com/debug-auth");
console.log("2. Look for any localhost URLs in the debug output");
console.log("3. Try a different browser entirely");
console.log("4. Check if your DNS is resolving correctly");

console.log("\n✅ Success Check:");
console.log("After clearing cache, authentication should redirect to:");
console.log("https://vyoniq.com/dashboard (NOT localhost)");
