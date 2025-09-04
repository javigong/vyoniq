import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { getBaseUrl } from "@/lib/utils";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 12): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }

  return password;
}

/**
 * Create a user account in Clerk and our database
 */
export async function createUserAccount(
  email: string,
  name: string
): Promise<{
  userId: string;
  password: string;
  user: any;
}> {
  try {
    // Generate a secure password
    const password = generateSecurePassword();

    // First, create user in our database with a temporary ID
    // We'll update it with the Clerk ID once created
    const tempUserId = `temp_${crypto.randomUUID()}`;

    const user = await prisma.user.create({
      data: {
        id: tempUserId,
        email,
        name,
        isAdmin: false,
        isNewsletterSubscriber: false,
      },
    });

    // For now, we'll use the temp ID as the final user ID
    // In a full Clerk integration, you would create the user in Clerk first
    // and get the real Clerk user ID to use here
    const finalUserId = tempUserId;

    console.log(`Created user account for ${email} with ID: ${finalUserId}`);

    return {
      userId: finalUserId,
      password,
      user,
    };
  } catch (error) {
    console.error("Error creating user account:", error);
    throw new Error(
      `Failed to create user account: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create an inquiry for the new user
 */
export async function createInquiryForUser(
  userId: string,
  email: string,
  name: string,
  serviceType: string,
  message?: string
): Promise<any> {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        serviceType,
        message:
          message || `Auto-generated inquiry for ${serviceType} services`,
        userId,
        status: "PENDING",
      },
    });

    console.log(`Created inquiry ${inquiry.id} for user ${userId}`);
    return inquiry;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    throw new Error(
      `Failed to create inquiry: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Send welcome email with login credentials
 */
export async function sendWelcomeEmailWithCredentials(
  email: string,
  name: string,
  password: string,
  purpose: "budget" | "subscription",
  itemTitle: string
): Promise<void> {
  try {
    const baseUrl = getBaseUrl();

    await resend.emails.send({
      from: "Vyoniq <noreply@vyoniq.com>",
      to: email,
      subject: `Welcome to Vyoniq - Your ${
        purpose === "budget" ? "Budget" : "Subscription"
      } is Ready`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; padding: 30px 0; border-bottom: 3px solid #00C7B7;">
            <h1 style="color: #0F1729; margin: 0; font-size: 32px; font-weight: bold;">
              Welcome to Vyoniq
            </h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">
              Your account has been created
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 0;">
            <h2 style="color: #0F1729; margin: 0 0 20px 0; font-size: 24px;">
              Hello ${name},
            </h2>
            
            <p style="color: #333; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
              We've created a Vyoniq account for you and prepared a ${purpose} proposal: 
              <strong>"${itemTitle}"</strong>
            </p>
            
            <!-- Credentials Box -->
            <div style="background: #f8f9fa; border: 2px solid #00C7B7; border-radius: 8px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #0F1729; margin: 0 0 15px 0; font-size: 18px;">
                🔐 Your Login Credentials
              </h3>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">Email:</strong>
                <span style="color: #0F1729; font-family: monospace; background: #fff; padding: 4px 8px; border-radius: 4px; margin-left: 10px;">
                  ${email}
                </span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">Password:</strong>
                <span style="color: #0F1729; font-family: monospace; background: #fff; padding: 4px 8px; border-radius: 4px; margin-left: 10px;">
                  ${password}
                </span>
              </div>
              <p style="color: #666; font-size: 14px; margin: 15px 0 0 0;">
                ⚠️ Please change your password after your first login for security.
              </p>
            </div>
            
            <h3 style="color: #0F1729; margin: 30px 0 15px 0; font-size: 18px;">
              What's Next?
            </h3>
            <ol style="color: #333; line-height: 1.8; margin-bottom: 30px; padding-left: 20px;">
              <li>Click the button below to access your dashboard</li>
              <li>Log in using the credentials provided above</li>
              <li>Review your ${purpose} proposal</li>
              <li>Approve or request changes as needed</li>
              <li>${
                purpose === "budget"
                  ? "Complete payment to start your project"
                  : "Set up your subscription to begin services"
              }</li>
            </ol>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${baseUrl}/dashboard" 
                 style="background: #6E56CF; color: white; padding: 18px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                Access Your Dashboard
              </a>
            </div>
            
            <div style="background: #f0f9ff; border-left: 4px solid #00C7B7; padding: 20px; margin: 30px 0;">
              <h4 style="color: #0F1729; margin: 0 0 10px 0; font-size: 16px;">
                🚀 Why Choose Vyoniq?
              </h4>
              <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>AI-powered software development</li>
                <li>Professional project management</li>
                <li>Transparent pricing and progress tracking</li>
                <li>Ongoing support and maintenance</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 30px; font-size: 14px;">
              Questions? Reply to this email or contact us at 
              <a href="mailto:support@vyoniq.com" style="color: #00C7B7; text-decoration: none;">
                support@vyoniq.com
              </a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; margin-top: 40px; border-radius: 8px;">
            <p style="margin: 0 0 10px 0;">
              Welcome to the Vyoniq family! 🎉
            </p>
            <p style="margin: 0;">
              <strong style="color: #0F1729;">The Vyoniq Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(
      `Failed to send welcome email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Main function to create user account and inquiry for standalone budget/subscription
 */
export async function createUserAccountForStandalone(
  email: string,
  name: string,
  serviceType: string,
  purpose: "budget" | "subscription",
  itemTitle: string,
  customMessage?: string
): Promise<{
  userId: string;
  inquiryId: string;
  password: string;
}> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // User exists, just create an inquiry
      const inquiry = await createInquiryForUser(
        existingUser.id,
        email,
        name,
        serviceType,
        customMessage
      );

      return {
        userId: existingUser.id,
        inquiryId: inquiry.id,
        password: "", // No password needed for existing user
      };
    }

    // Create new user account
    const { userId, password, user } = await createUserAccount(email, name);

    // Create inquiry for the new user
    const inquiry = await createInquiryForUser(
      userId,
      email,
      name,
      serviceType,
      customMessage
    );

    // Send welcome email with credentials
    await sendWelcomeEmailWithCredentials(
      email,
      name,
      password,
      purpose,
      itemTitle
    );

    console.log(`Successfully created user account and inquiry for ${email}`);

    return {
      userId,
      inquiryId: inquiry.id,
      password,
    };
  } catch (error) {
    console.error("Error in createUserAccountForStandalone:", error);
    throw new Error(
      `Failed to create user account and inquiry: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Check if an email is already associated with a user account
 */
export async function checkUserExists(email: string): Promise<{
  exists: boolean;
  user?: any;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return {
      exists: !!user,
      user,
    };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return {
      exists: false,
    };
  }
}
