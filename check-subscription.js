const { PrismaClient } = require("./lib/generated/prisma");

const prisma = new PrismaClient();

async function checkSubscription() {
  try {
    console.log("🔍 Checking subscription status...\n");

    const subscriptions = await prisma.subscription.findMany({
      include: {
        subscriptions: true,
        inquiry: {
          select: {
            id: true,
            serviceType: true,
            userId: true,
          },
        },
      },
    });

    subscriptions.forEach((sub) => {
      console.log(`📋 Subscription: ${sub.title}`);
      console.log(`   ID: ${sub.id}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Created: ${sub.createdAt}`);
      console.log(`   User: ${sub.inquiry.userId}`);
      console.log(`   Service: ${sub.inquiry.serviceType}`);
      console.log(`   Payments (${sub.subscriptions.length}):`);

      sub.subscriptions.forEach((payment, idx) => {
        console.log(`     ${idx + 1}. Status: ${payment.status}`);
        console.log(`        Amount: ${payment.amount} ${payment.currency}`);
        console.log(`        Created: ${payment.createdAt}`);
        console.log(
          `        Stripe Sub ID: ${payment.stripeSubscriptionId || "None"}`
        );
        console.log(
          `        Stripe Customer: ${payment.stripeCustomerId || "None"}`
        );
      });
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubscription();
