import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RouteParams {
  id: string;
}

// GET single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
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
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Check if user is admin or the inquiry owner
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const isAdmin = user?.isAdmin;
    const isOwner = inquiry.userId === userId || inquiry.email === user?.email;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
}

// PATCH - Update inquiry (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (
      status &&
      !["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { id } = await params;
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
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
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// POST - Add message to inquiry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const { id } = await params;

    // Get the inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isAdmin = user.isAdmin;
    const isOwner = inquiry.userId === userId || inquiry.email === user.email;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create the message
    const inquiryMessage = await prisma.inquiryMessage.create({
      data: {
        inquiryId: id,
        message,
        isFromAdmin: isAdmin,
        authorId: userId,
      },
    });

    // Update inquiry status if admin is responding
    if (isAdmin && inquiry.status === "PENDING") {
      await prisma.inquiry.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      });
    }

    // Send email notification
    try {
      if (isAdmin) {
        // Admin responding to user
        await resend.emails.send({
          from: "Vyoniq <noreply@vyoniq.com>",
          to: inquiry.email,
          subject: `Response to your inquiry - ${inquiry.serviceType}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Response to Your Inquiry</h1>
              </div>
              
              <div style="padding: 30px 20px; background: #ffffff;">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi ${
                  inquiry.name
                },</p>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                  We've responded to your inquiry about <strong>${
                    inquiry.serviceType
                  }</strong>. Here's our response:
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
                  <h3 style="color: #10B981; margin: 0 0 10px 0;">Our Response:</h3>
                  <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${
                    process.env.NEXT_PUBLIC_BASE_URL || "https://vyoniq.com"
                  }/dashboard/inquiries/${id}" 
                     style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    View Full Conversation
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666; line-height: 1.6;">
                  You can reply to this message by logging into your dashboard or replying to this email.
                </p>
                
                <p style="font-size: 16px; color: #333; margin-top: 30px;">
                  Best regards,<br>
                  <strong>The Vyoniq Team</strong>
                </p>
              </div>
            </div>
          `,
        });
      } else {
        // User responding - notify admins
        await resend.emails.send({
          from: "Vyoniq <noreply@vyoniq.com>",
          to: "admin@vyoniq.com",
          subject: `New response from ${inquiry.name} - Inquiry ${id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1E40AF; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Customer Response</h1>
              </div>
              
              <div style="padding: 20px; background: #ffffff;">
                <p><strong>Customer:</strong> ${inquiry.name} (${
            inquiry.email
          })</p>
                <p><strong>Service:</strong> ${inquiry.serviceType}</p>
                <p><strong>Inquiry ID:</strong> ${id}</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h3>New Message:</h3>
                  <p>${message}</p>
                </div>
                
                <a href="${
                  process.env.NEXT_PUBLIC_BASE_URL || "https://vyoniq.com"
                }/admin/dashboard" 
                   style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View in Admin Dashboard
                </a>
              </div>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    return NextResponse.json(inquiryMessage);
  } catch (error) {
    console.error("Error adding message to inquiry:", error);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
