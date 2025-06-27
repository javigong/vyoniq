import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export interface ApiKeyCreateData {
  name: string;
  userId: string;
  scopes?: string[];
}

export interface ApiKeyValidationResult {
  isValid: boolean;
  userId?: string;
  keyId?: string;
  scopes?: string[];
}

/**
 * Generate a secure API key with the format: vyoniq_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
export function generateApiKey(): string {
  const prefix = "vyoniq_sk_";
  const randomBytes = crypto.randomBytes(32);
  const randomString = randomBytes.toString("hex");
  return `${prefix}${randomString}`;
}

/**
 * Create a preview version of the API key (first 8 chars + ***)
 */
export function createKeyPreview(fullKey: string): string {
  return `${fullKey.substring(0, 12)}***`;
}

/**
 * Hash an API key for secure storage
 */
export async function hashApiKey(key: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(key, saltRounds);
}

/**
 * Verify an API key against its hash
 */
export async function verifyApiKey(
  key: string,
  hashedKey: string
): Promise<boolean> {
  return bcrypt.compare(key, hashedKey);
}

/**
 * Create a new API key in the database
 */
export async function createApiKey(data: ApiKeyCreateData): Promise<{
  id: string;
  name: string;
  fullKey: string;
  keyPreview: string;
  scopes: string[];
  createdAt: Date;
}> {
  const fullKey = generateApiKey();
  const hashedKey = await hashApiKey(fullKey);
  const keyPreview = createKeyPreview(fullKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      name: data.name,
      hashedKey,
      keyPreview,
      userId: data.userId,
      scopes: data.scopes || ["blog:read", "blog:write"],
    },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    fullKey, // Only returned once!
    keyPreview: apiKey.keyPreview,
    scopes: apiKey.scopes,
    createdAt: apiKey.createdAt,
  };
}

/**
 * Validate an API key and return user information
 */
export async function validateApiKey(
  key: string
): Promise<ApiKeyValidationResult> {
  if (!key || !key.startsWith("vyoniq_sk_")) {
    return { isValid: false };
  }

  try {
    // Find all active API keys and check each one
    const apiKeys = await prisma.apiKey.findMany({
      where: { active: true },
      include: { user: true },
    });

    for (const apiKey of apiKeys) {
      const isValid = await verifyApiKey(key, apiKey.hashedKey);
      if (isValid) {
        // Update last used timestamp
        await prisma.apiKey.update({
          where: { id: apiKey.id },
          data: { lastUsedAt: new Date() },
        });

        return {
          isValid: true,
          userId: apiKey.userId,
          keyId: apiKey.id,
          scopes: apiKey.scopes,
        };
      }
    }

    return { isValid: false };
  } catch (error) {
    console.error("Error validating API key:", error);
    return { isValid: false };
  }
}

/**
 * List API keys for a user (without sensitive data)
 */
export async function listApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      keyPreview: true,
      active: true,
      lastUsedAt: true,
      createdAt: true,
      scopes: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeApiKey(
  keyId: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await prisma.apiKey.updateMany({
      where: {
        id: keyId,
        userId: userId, // Ensure user can only revoke their own keys
      },
      data: { active: false },
    });

    return result.count > 0;
  } catch (error) {
    console.error("Error revoking API key:", error);
    return false;
  }
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(
  keyId: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await prisma.apiKey.deleteMany({
      where: {
        id: keyId,
        userId: userId, // Ensure user can only delete their own keys
      },
    });

    return result.count > 0;
  } catch (error) {
    console.error("Error deleting API key:", error);
    return false;
  }
}

/**
 * Update an API key's name
 */
export async function updateApiKeyName(
  keyId: string,
  userId: string,
  newName: string
): Promise<boolean> {
  try {
    const result = await prisma.apiKey.updateMany({
      where: {
        id: keyId,
        userId: userId,
      },
      data: { name: newName },
    });

    return result.count > 0;
  } catch (error) {
    console.error("Error updating API key name:", error);
    return false;
  }
}
