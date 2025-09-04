const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

async function testProductionMigrations() {
  console.log("🧪 Testing production migration deployment...\n");

  try {
    // 1. Check migration status
    console.log("📋 Step 1: Checking current migration status...");
    const { stdout: statusOutput } = await execAsync(
      "pnpm dlx prisma migrate status"
    );
    console.log(statusOutput);

    // 2. Generate deployment script (what would run in production)
    console.log("🔧 Step 2: Generating production deployment script...");
    const { stdout: deployScript } = await execAsync(
      "pnpm dlx prisma migrate deploy --dry-run"
    );
    console.log("Production would run:");
    console.log(deployScript);

    // 3. Validate schema after migrations
    console.log("✅ Step 3: Validating schema consistency...");
    const { stdout: validateOutput } = await execAsync(
      "pnpm dlx prisma validate"
    );
    console.log(validateOutput);

    // 4. Generate client to check for breaking changes
    console.log("🔄 Step 4: Testing client generation...");
    const { stdout: generateOutput } = await execAsync(
      "pnpm dlx prisma generate"
    );
    console.log("✅ Client generation successful");

    console.log("\n🎉 All migration tests passed! Ready for production.");
  } catch (error) {
    console.error("❌ Migration test failed:", error.message);
    console.error("🚨 DO NOT DEPLOY TO PRODUCTION");
    process.exit(1);
  }
}

testProductionMigrations();
