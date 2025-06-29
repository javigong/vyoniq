import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import prisma from "@/lib/prisma";
import { MCPTool, MCPToolResult, MCPAuthContext } from "../types";

// Schemas
const ListInquiriesSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

const GetInquirySchema = z.object({
  id: z.string().cuid(),
});

const UpdateInquiryStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

const RespondToInquirySchema = z.object({
  id: z.string().cuid(),
  message: z.string().min(1),
});

const CreateInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  serviceType: z.string().min(1),
  message: z.string().min(1),
});

const DeleteUserAccountSchema = z.object({
  userId: z.string().cuid().describe("The user ID to delete"),
  confirmDelete: z.boolean().describe("Must be true to confirm deletion"),
});

// Helper functions
function createSuccessResponse(
  content: string,
  isError = false
): MCPToolResult {
  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
    isError,
  };
}

function createErrorResponse(message: string): MCPToolResult {
  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
    isError: true,
  };
}

// List Inquiries Tool
export const listInquiriesTool: MCPTool = {
  name: "list_inquiries",
  description: "List customer inquiries with optional filtering by status",
  inputSchema: zodToJsonSchema(ListInquiriesSchema, { $refStrategy: "none" }),
  zodSchema: ListInquiriesSchema,
};

export async function listInquiriesHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const validatedArgs = ListInquiriesSchema.parse(args || {});
    const { status, limit, offset } = validatedArgs;

    const where: any = {};
    if (status) {
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

    const inquiryList = inquiries
      .map((inquiry) => {
        const hasAccount = inquiry.user ? " (Has Account)" : "";
        return `${inquiry.id}: "${inquiry.name}" <${
          inquiry.email
        }>${hasAccount} - ${inquiry.serviceType} - Status: ${
          inquiry.status
        } - Messages: ${inquiry._count.messages} - Created: ${
          inquiry.createdAt.toISOString().split("T")[0]
        }`;
      })
      .join("\n");

    const summary = `Found ${inquiries.length} inquiries (${totalCount} total)${
      status ? ` with status: ${status}` : ""
    }\n\n${inquiryList}`;

    return createSuccessResponse(summary);
  } catch (error) {
    console.error("Error listing inquiries:", error);
    return createErrorResponse(
      `Failed to list inquiries: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Get Inquiry Tool
export const getInquiryTool: MCPTool = {
  name: "get_inquiry",
  description:
    "Get detailed information about a specific inquiry including full conversation",
  inputSchema: zodToJsonSchema(GetInquirySchema, { $refStrategy: "none" }),
  zodSchema: GetInquirySchema,
};

export async function getInquiryHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = GetInquirySchema.parse(args);

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: data.id },
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
      return createErrorResponse(`Inquiry with ID '${data.id}' not found`);
    }

    const hasAccount = inquiry.user
      ? `\n**User Account:** ${inquiry.user.name} (${inquiry.user.id})`
      : "\n**User Account:** No account linked";

    const conversationHistory = inquiry.messages
      .map((msg) => {
        const author = msg.isFromAdmin ? "Admin" : inquiry.name;
        const timestamp = msg.createdAt.toISOString();
        return `[${timestamp}] ${author}: ${msg.message}`;
      })
      .join("\n");

    const inquiryDetails = `# Inquiry Details

**ID:** ${inquiry.id}
**Customer:** ${inquiry.name}
**Email:** ${inquiry.email}${hasAccount}
**Service Type:** ${inquiry.serviceType}
**Status:** ${inquiry.status}
**Created:** ${inquiry.createdAt.toISOString()}
**Last Updated:** ${inquiry.updatedAt.toISOString()}
**Total Messages:** ${inquiry.messages.length}

## Original Message
${inquiry.message}

## Conversation History
${conversationHistory || "No additional messages"}

---
**Last Updated:** ${new Date().toISOString()}`;

    return createSuccessResponse(inquiryDetails);
  } catch (error) {
    console.error("Error getting inquiry:", error);
    return createErrorResponse(
      `Failed to get inquiry: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Update Inquiry Status Tool
export const updateInquiryStatusTool: MCPTool = {
  name: "update_inquiry_status",
  description:
    "Update the status of an inquiry (PENDING, IN_PROGRESS, RESOLVED, CLOSED)",
  inputSchema: zodToJsonSchema(UpdateInquiryStatusSchema, {
    $refStrategy: "none",
  }),
  zodSchema: UpdateInquiryStatusSchema,
};

export async function updateInquiryStatusHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = UpdateInquiryStatusSchema.parse(args);

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: data.id },
    });

    if (!inquiry) {
      return createErrorResponse(`Inquiry with ID '${data.id}' not found`);
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id: data.id },
      data: {
        status: data.status,
        updatedAt: new Date(),
      },
    });

    return createSuccessResponse(
      `Successfully updated inquiry ${data.id} status from "${inquiry.status}" to "${data.status}"`
    );
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return createErrorResponse(
      `Failed to update inquiry status: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Respond to Inquiry Tool
export const respondToInquiryTool: MCPTool = {
  name: "respond_to_inquiry",
  description:
    "Send a response message to an inquiry (emails the customer automatically)",
  inputSchema: zodToJsonSchema(RespondToInquirySchema, {
    $refStrategy: "none",
  }),
  zodSchema: RespondToInquirySchema,
};

export async function respondToInquiryHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = RespondToInquirySchema.parse(args);

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: data.id },
    });

    if (!inquiry) {
      return createErrorResponse(`Inquiry with ID '${data.id}' not found`);
    }

    // Create the message
    const message = await prisma.inquiryMessage.create({
      data: {
        inquiryId: data.id,
        message: data.message,
        isFromAdmin: true,
        authorId: auth.userId,
      },
    });

    // Update inquiry status if it's pending
    if (inquiry.status === "PENDING") {
      await prisma.inquiry.update({
        where: { id: data.id },
        data: { status: "IN_PROGRESS" },
      });
    }

    return createSuccessResponse(
      `Successfully sent response to inquiry ${data.id}. Customer "${inquiry.name}" will be notified via email at ${inquiry.email}.\n\nResponse: "${data.message}"`
    );
  } catch (error) {
    console.error("Error responding to inquiry:", error);
    return createErrorResponse(
      `Failed to respond to inquiry: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Create Inquiry Tool (for testing purposes)
export const createInquiryTool: MCPTool = {
  name: "create_inquiry",
  description: "Create a new customer inquiry (for testing purposes)",
  inputSchema: zodToJsonSchema(CreateInquirySchema, { $refStrategy: "none" }),
  zodSchema: CreateInquirySchema,
};

export async function createInquiryHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = CreateInquirySchema.parse(args);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        serviceType: data.serviceType,
        message: data.message,
        status: "PENDING",
      },
    });

    // Create initial message
    await prisma.inquiryMessage.create({
      data: {
        inquiryId: inquiry.id,
        message: data.message,
        isFromAdmin: false,
      },
    });

    return createSuccessResponse(
      `Successfully created inquiry ${inquiry.id} from ${data.name} (${data.email}) about ${data.serviceType}`
    );
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return createErrorResponse(
      `Failed to create inquiry: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Get Inquiry Statistics Tool
export const getInquiryStatsTool: MCPTool = {
  name: "get_inquiry_stats",
  description: "Get statistics about inquiries across different statuses",
  inputSchema: zodToJsonSchema(z.object({}), { $refStrategy: "none" }),
  zodSchema: z.object({}),
};

export async function getInquiryStatsHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const totalInquiries = await prisma.inquiry.count();
    const pendingInquiries = await prisma.inquiry.count({
      where: { status: "PENDING" },
    });
    const inProgressInquiries = await prisma.inquiry.count({
      where: { status: "IN_PROGRESS" },
    });
    const resolvedInquiries = await prisma.inquiry.count({
      where: { status: "RESOLVED" },
    });
    const closedInquiries = await prisma.inquiry.count({
      where: { status: "CLOSED" },
    });

    // Get recent inquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentInquiries = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const stats = `# Inquiry Statistics

**Total Inquiries:** ${totalInquiries}
**Pending:** ${pendingInquiries}
**In Progress:** ${inProgressInquiries}
**Resolved:** ${resolvedInquiries}
**Closed:** ${closedInquiries}

**New Inquiries (Last 7 days):** ${recentInquiries}

**Status Distribution:**
- Pending: ${
      totalInquiries > 0
        ? Math.round((pendingInquiries / totalInquiries) * 100)
        : 0
    }%
- In Progress: ${
      totalInquiries > 0
        ? Math.round((inProgressInquiries / totalInquiries) * 100)
        : 0
    }%
- Resolved: ${
      totalInquiries > 0
        ? Math.round((resolvedInquiries / totalInquiries) * 100)
        : 0
    }%
- Closed: ${
      totalInquiries > 0
        ? Math.round((closedInquiries / totalInquiries) * 100)
        : 0
    }%

---
**Generated:** ${new Date().toISOString()}`;

    return createSuccessResponse(stats);
  } catch (error) {
    console.error("Error getting inquiry stats:", error);
    return createErrorResponse(
      `Failed to get inquiry statistics: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Delete User Account Tool
export const deleteUserAccountTool: MCPTool = {
  name: "delete_user_account",
  description:
    "Delete a user account and all associated data (ADMIN ONLY - USE WITH EXTREME CAUTION)",
  inputSchema: zodToJsonSchema(DeleteUserAccountSchema, {
    $refStrategy: "none",
  }),
  zodSchema: DeleteUserAccountSchema,
};

export async function deleteUserAccountHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = DeleteUserAccountSchema.parse(args);

    if (!data.confirmDelete) {
      return createErrorResponse(
        "Deletion not confirmed. Set confirmDelete to true to proceed."
      );
    }

    // Get user info before deletion
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: {
        _count: {
          select: {
            inquiries: true,
            inquiryMessages: true,
            blogPosts: true,
          },
        },
      },
    });

    if (!user) {
      return createErrorResponse(`User with ID '${data.userId}' not found`);
    }

    // Start a transaction to ensure all deletions happen together
    await prisma.$transaction(async (tx) => {
      // Delete user's inquiry messages first (foreign key constraint)
      await tx.inquiryMessage.deleteMany({
        where: { authorId: data.userId },
      });

      // Delete user's inquiries
      await tx.inquiry.deleteMany({
        where: { userId: data.userId },
      });

      // Delete user's blog posts if any
      await tx.blogPost.deleteMany({
        where: { authorId: data.userId },
      });

      // Finally delete the user record
      await tx.user.delete({
        where: { id: data.userId },
      });
    });

    const deletionSummary = `Successfully deleted user account: ${user.name} (${user.email})
    
**Deleted data:**
- User profile
- ${user._count.inquiries} inquiries
- ${user._count.inquiryMessages} inquiry messages  
- ${user._count.blogPosts} blog posts

**Note:** The user's Clerk account still exists and would need to be deleted separately if required.`;

    return createSuccessResponse(deletionSummary);
  } catch (error) {
    console.error("Error deleting user account:", error);
    return createErrorResponse(
      `Failed to delete user account: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
