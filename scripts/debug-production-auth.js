#!/usr/bin/env node

/**
 * Debug script to check production authentication setup
 * Run this to diagnose Clerk authentication issues in production
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔍 Vyoniq Production Authentication Debug\n");

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), "package.json");
if (!fs.existsSync(packageJsonPath)) {
  console.log(
    "❌ Error: Please run this script from the project root directory"
  );
  process.exit(1);
}

// Read package.json to confirm we're in the right project
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (!packageJson.name || !packageJson.name.includes("vyoniq")) {
  console.log("❌ Error: This doesn't appear to be the Vyoniq project");
  process.exit(1);
}

console.log("📊 ENVIRONMENT VARIABLES CHECK:");
console.log("=".repeat(50));

// Check for required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_BASE_URL",
  "DATABASE_URL",
  "RESEND_API_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
];

let missingVars = [];
let hasClerkIssues = false;

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    missingVars.push(varName);
  } else {
    if (varName.includes("SECRET") || varName.includes("DATABASE_URL")) {
      console.log(`✅ ${varName}: Set (hidden)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }

    // Check Clerk environment
    if (varName === "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") {
      if (value.includes("_test_")) {
        console.log(
          `   ⚠️  Using TEST environment (should be LIVE for production)`
        );
        hasClerkIssues = true;
      } else if (value.includes("_live_")) {
        console.log(`   ✅ Using LIVE environment`);
      } else {
        console.log(`   ❓ Unknown Clerk environment`);
        hasClerkIssues = true;
      }
    }
  }
});

console.log("\n🔧 URL CONFIGURATION CHECK:");
console.log("=".repeat(50));

// Check production environment detection
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

console.log(`Environment: ${process.env.NODE_ENV || "undefined"}`);
console.log(`Production detected: ${isProduction}`);
console.log(`Base URL: ${process.env.NEXT_PUBLIC_BASE_URL || "undefined"}`);

// Simulate getBaseUrl function
function simulateGetBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  return isProduction ? "https://vyoniq.com" : "http://localhost:3000";
}

const simulatedBaseUrl = simulateGetBaseUrl();

console.log(`getBaseUrl(): ${simulatedBaseUrl}`);

// Check for localhost in production
if (isProduction && simulatedBaseUrl.includes("localhost")) {
  console.log(`❌ CRITICAL: getBaseUrl() returns localhost in production!`);
  console.log(`   This is why authentication redirects are failing.`);
  console.log(`   Fix: Set NEXT_PUBLIC_BASE_URL=https://vyoniq.com`);
}

console.log("\n🔍 CLERK CONFIGURATION CHECK:");
console.log("=".repeat(50));

// Check Clerk configuration
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (clerkPublishableKey) {
  console.log(`Clerk Publishable Key: ${clerkPublishableKey.slice(0, 20)}...`);

  if (clerkPublishableKey.includes("_test_")) {
    console.log(`⚠️  Using TEST keys in production!`);
    hasClerkIssues = true;
  } else if (clerkPublishableKey.includes("_live_")) {
    console.log(`✅ Using LIVE keys`);
  }
}

console.log("\n📋 SUMMARY:");
console.log("=".repeat(50));

if (missingVars.length > 0) {
  console.log(`❌ Missing environment variables: ${missingVars.join(", ")}`);
}

if (!isProduction && process.env.NODE_ENV !== "development") {
  console.log(`❌ Production environment not detected!`);
  console.log(`   🔧 Set NODE_ENV=production in your production environment`);
}

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.log(`❌ NEXT_PUBLIC_BASE_URL not set - this is likely your issue!`);
  console.log(
    `   🔧 Add to your production environment: NEXT_PUBLIC_BASE_URL=https://vyoniq.com`
  );
}

if (hasClerkIssues) {
  console.log(`❌ Clerk environment issues detected`);
  console.log(`   🔧 Make sure you're using the LIVE keys for production`);
}

console.log("\n📊 SUMMARY:");
console.log("=".repeat(50));
console.log(`Missing variables: ${missingVars.length}`);
console.log(`Production ready: ${missingVars.length === 0 && !hasClerkIssues}`);

console.log("\n🎯 NEXT STEPS:");
console.log("=".repeat(50));
console.log(`1. Fix any missing environment variables`);
console.log(`2. Ensure you're using LIVE Clerk keys in production`);
console.log(`3. Set NEXT_PUBLIC_BASE_URL=https://vyoniq.com`);
console.log(`4. Check Clerk Dashboard → Configure → Restrictions`);
console.log(`5. Add https://vyoniq.com to allowed redirect origins`);
console.log(`6. Test authentication flow after changes`);

console.log("\n📞 SUPPORT:");
console.log("=".repeat(50));
console.log(`If issues persist, check:`);
console.log(`- Clerk Dashboard restrictions`);
console.log(`- Browser cache/localStorage`);
console.log(`- Production deployment logs`);
console.log(`- Network tab in browser dev tools`);
