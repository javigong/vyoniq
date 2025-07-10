#!/usr/bin/env node

/**
 * Debug script to check production authentication setup
 * Run: node scripts/debug-production-auth.js
 */

console.log("🔍 Vyoniq Production Authentication Debug\n");
console.log("=".repeat(50));

// Check Node.js environment
console.log("\n📋 ENVIRONMENT CHECK:");
console.log(`NODE_ENV: ${process.env.NODE_ENV || "undefined"}`);
console.log(`Platform: ${process.platform}`);
console.log(`Node Version: ${process.version}`);

// Check essential environment variables
console.log("\n🔑 ENVIRONMENT VARIABLES:");
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

// Check Base URL specifically
console.log("\n🌐 BASE URL ANALYSIS:");
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if (!baseUrl) {
  console.log(`❌ NEXT_PUBLIC_BASE_URL not set`);
  console.log(`   📝 This will cause localhost fallback in production!`);
  console.log(`   🔧 Set: NEXT_PUBLIC_BASE_URL=https://vyoniq.com`);
} else if (baseUrl.includes("localhost")) {
  console.log(`❌ NEXT_PUBLIC_BASE_URL contains localhost: ${baseUrl}`);
  console.log(`   📝 This is the source of your redirect issue!`);
  console.log(`   🔧 Change to: NEXT_PUBLIC_BASE_URL=https://vyoniq.com`);
} else if (baseUrl === "https://vyoniq.com") {
  console.log(`✅ NEXT_PUBLIC_BASE_URL correctly set: ${baseUrl}`);
} else {
  console.log(`⚠️  NEXT_PUBLIC_BASE_URL set to: ${baseUrl}`);
  console.log(`   📝 Expected: https://vyoniq.com`);
}

// Simulate getBaseUrl function
console.log("\n🔍 SIMULATED getBaseUrl() FUNCTION:");
function simulateGetBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return process.env.NODE_ENV === "production"
    ? "https://vyoniq.com"
    : "http://localhost:3000";
}

const simulatedBaseUrl = simulateGetBaseUrl();
console.log(`Result: ${simulatedBaseUrl}`);
if (
  simulatedBaseUrl.includes("localhost") &&
  process.env.NODE_ENV === "production"
) {
  console.log(`❌ CRITICAL: getBaseUrl() returns localhost in production!`);
} else {
  console.log(`✅ getBaseUrl() returns correct URL`);
}

// Check Clerk configuration
console.log("\n👤 CLERK CONFIGURATION:");
console.log("Required Clerk Dashboard Settings:");
console.log("  📍 Authorized domains: vyoniq.com");
console.log("  📍 Allowed redirect origins:");
console.log("    - https://vyoniq.com");
console.log("    - https://www.vyoniq.com");
console.log("  📍 After sign-in URL: /dashboard");
console.log("  📍 After sign-up URL: /dashboard");

// Check for common issues
console.log("\n🐛 COMMON ISSUES & FIXES:");
if (missingVars.length > 0) {
  console.log(`❌ Missing environment variables: ${missingVars.join(", ")}`);
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
if (
  missingVars.length === 0 &&
  !hasClerkIssues &&
  process.env.NEXT_PUBLIC_BASE_URL === "https://vyoniq.com"
) {
  console.log("✅ All configuration looks correct!");
  console.log("   The issue might be in the Clerk Dashboard configuration.");
  console.log(
    "   Check: https://dashboard.clerk.com → Configure → Restrictions"
  );
} else {
  console.log("❌ Configuration issues found. Fix the items above.");
}

console.log("\n🎯 IMMEDIATE ACTION ITEMS:");
console.log("1. Set NEXT_PUBLIC_BASE_URL=https://vyoniq.com in production");
console.log("2. Visit https://dashboard.clerk.com → Configure → Restrictions");
console.log("3. Add https://vyoniq.com to 'Allowed redirect origins'");
console.log("4. Remove any localhost entries from production Clerk config");
console.log("5. Verify you're using LIVE Clerk keys (not TEST keys)");

console.log("\n" + "=".repeat(50));
console.log("Debug complete! 🚀");
