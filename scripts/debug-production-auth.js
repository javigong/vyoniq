#!/usr/bin/env node

/**
 * Production Authentication Debug Script
 * Run this script to check your production authentication setup
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Vyoniq Production Authentication Debug\n");

// Check environment variables
console.log("📋 Environment Variables Check:");
const requiredEnvVars = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_BASE_URL",
  "DATABASE_URL",
];

const envPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log("❌ .env.local file not found");
  console.log("   Create .env.local from .env.example");
} else {
  console.log("✅ .env.local file exists");

  const envContent = fs.readFileSync(envPath, "utf8");

  requiredEnvVars.forEach((varName) => {
    const hasVar =
      envContent.includes(`${varName}=`) &&
      !envContent.includes(`${varName}=your_`) &&
      !envContent.includes(`${varName}=`);

    if (hasVar) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is missing or using placeholder value`);
    }
  });
}

console.log("\n🔧 Clerk Configuration Checklist:");
console.log("Please verify these settings in your Clerk Dashboard:");

const clerkChecklist = [
  "Authorized domains include your production domain (vyoniq.com)",
  "Sign-in URL is set to /sign-in",
  "Sign-up URL is set to /sign-up",
  "After sign-in URL is set to /dashboard",
  "After sign-up URL is set to /dashboard",
  "Webhook endpoints are configured for production",
  "CORS settings include your production domain",
  "Enhanced email matching is enabled",
  "Session lifetime is configured appropriately",
  "Production keys are being used (not test keys)",
];

clerkChecklist.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

console.log("\n🚨 Common Production Issues:");
const commonIssues = [
  "Domain mismatch: Ensure your production domain matches Clerk configuration",
  "HTTP vs HTTPS: Production should use HTTPS",
  "Cookie settings: Check if cookies are being set correctly",
  "CORS issues: Verify allowed origins in Clerk Dashboard",
  "Webhook URLs: Ensure webhook endpoints are accessible",
  "Environment variables: Double-check all required env vars are set",
  "DNS propagation: If using a new domain, wait for DNS propagation",
];

commonIssues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue}`);
});

console.log("\n📝 Next Steps:");
console.log("1. Visit your production site and try to sign in");
console.log("2. Check browser console for JavaScript errors");
console.log("3. Check network tab for failed requests");
console.log("4. Visit /debug-auth on your production site");
console.log("5. Check your application logs for authentication errors");
console.log("6. Test with incognito/private browsing mode");

console.log("\n✅ If issues persist, check:");
console.log("- Browser developer tools (Console & Network tabs)");
console.log("- Production application logs");
console.log("- Clerk Dashboard logs");
console.log("- Domain and SSL certificate configuration");
