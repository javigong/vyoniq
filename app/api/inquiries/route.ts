import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface InquiryData {
  name: string;
  email: string;
  serviceType: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InquiryData = await request.json();
    const { name, email, serviceType, message } = body;

    // Validate required fields
    if (!name || !email || !serviceType || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create inquiry in database
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        serviceType,
        message,
        status: "PENDING",
      },
    });

    // Create initial message
    await prisma.inquiryMessage.create({
      data: {
        inquiryId: inquiry.id,
        message: message,
        isFromAdmin: false,
      },
    });

    // Send welcome email to user
    try {
      console.log(`Attempting to send email to: ${email}`);
      const emailResult = await resend.emails.send({
        from: "Vyoniq <noreply@vyoniq.com>",
        to: email,
        subject: "Thank you for your inquiry - Welcome to Vyoniq!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Your Inquiry!</h1>
            </div>
            
            <div style="padding: 40px 20px; background: #ffffff;">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to Vyoniq! We've received your inquiry about <strong>${serviceType}</strong> and our team will review it shortly.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
                <h3 style="color: #10B981; margin: 0 0 10px 0;">Your Inquiry Details:</h3>
                <p style="margin: 5px 0; color: #666;"><strong>Service:</strong> ${serviceType}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Inquiry ID:</strong> ${
                  inquiry.id
                }</p>
                <p style="margin: 5px 0; color: #666;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <h3 style="color: #3B82F6; margin: 30px 0 15px 0;">Create Your Vyoniq Account</h3>
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                To track your inquiry status and access our exclusive dashboard where you can:
              </p>
              <ul style="color: #333; line-height: 1.6; margin-bottom: 25px;">
                <li>View all your inquiries and our responses</li>
                <li>Track project progress</li>
                <li>Access exclusive resources and updates</li>
                <li>Manage your account and preferences</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_BASE_URL || "https://vyoniq.com"
                }/sign-up?email=${encodeURIComponent(email)}" 
                   style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; transition: background 0.3s;">
                  Create Your Account
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
                We typically respond to inquiries within 24 hours. If you have any urgent questions, feel free to reply to this email.
              </p>
              
              <p style="font-size: 16px; color: #333; margin-top: 30px;">
                Best regards,<br>
                <strong>The Vyoniq Team</strong>
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0;">
                This email was sent from Vyoniq. If you have any questions, contact us at 
                <a href="mailto:support@vyoniq.com" style="color: #3B82F6;">support@vyoniq.com</a>
              </p>
            </div>
          </div>
        `,
      });
      console.log("Email sent successfully:", emailResult);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      console.error(
        "Email error details:",
        JSON.stringify(emailError, null, 2)
      );
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch inquiries (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.inquiry.count({ where });

    return NextResponse.json({
      inquiries,
      totalCount,
      hasMore: totalCount > offset + limit,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
