const { clerkClient } = require("@clerk/nextjs/server");

async function setClerkAdminRole(userId) {
  try {
    console.log(`🔐 Setting Clerk admin role for user: ${userId}`);

    // Get current user info
    const user = await clerkClient.users.getUser(userId);
    console.log("👤 Current user:", {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      currentRole: user.publicMetadata?.role,
    });

    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "admin",
      },
    });
    console.log("✅ Clerk metadata updated");

    // Verify the changes
    const updatedUser = await clerkClient.users.getUser(userId);
    console.log("📋 Verification Results:");
    console.log("  Clerk role:", updatedUser.publicMetadata?.role);

    if (updatedUser.publicMetadata?.role === "admin") {
      console.log("🎉 SUCCESS: Admin role set in Clerk!");
      console.log("🔄 Please refresh your browser to see the changes.");
    } else {
      console.log("❌ FAILED: Admin role not set correctly");
    }
  } catch (error) {
    console.error("💥 Error setting Clerk admin role:", error);
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.error("❌ Error: Please provide a user ID");
  console.log("Usage: node scripts/set-clerk-admin.js <user-id>");
  console.log(
    "Example: node scripts/set-clerk-admin.js user_2yQbLBJukrNLRkMZ4okDc84wLh"
  );
  process.exit(1);
}

setClerkAdminRole(userId);
