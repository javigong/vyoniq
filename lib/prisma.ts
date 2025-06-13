import { PrismaClient } from "@/lib/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// This file creates a single, reusable instance of the PrismaClient.
// In a serverless environment like Next.js, this prevents the application
// from exhausting the database connection limit by creating a new client
// for every hot-reload in development.

const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// We declare a global variable to hold the prisma instance.
const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// We check if a prisma instance already exists on the global object.
// If not, we create a new one.
const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In non-production environments, we assign the prisma instance to the
// global object. This ensures that the same instance is reused across
// hot-reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
