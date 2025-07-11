import { NextRequest, NextResponse } from "next/server";
import { mcpServer } from "@/lib/mcp/server";
import "@/lib/mcp/init"; // Initialize the server with tools and resources

export async function GET(request: NextRequest) {
  // Handle GET requests for server information
  try {
    const serverInfo = {
      name: "Vyoniq MCP Server",
      version: "1.0.0",
      description: "Model Context Protocol server for Vyoniq admin dashboard",
      capabilities: {
        resources: true,
        tools: true,
        prompts: false,
        sampling: false,
      },
      features: [
        "Blog post management",
        "Category management",
        "Real-time content access",
        "Admin dashboard integration",
      ],
      endpoints: {
        mcp: "/api/mcp (POST for JSON-RPC)",
        documentation: "/admin/dashboard#mcp",
      },
      authentication: {
        required: true,
        methods: ["clerk", "bearer_token"],
        adminOnly: true,
      },
      tools: mcpServer.listTools().map((tool) => ({
        name: tool.name,
        description: tool.description,
      })),
      resourceTemplates: mcpServer.listResourceTemplates().map((template) => ({
        uriTemplate: template.uriTemplate,
        name: template.name,
        description: template.description,
      })),
    };

    return NextResponse.json(serverInfo, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error in MCP GET endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests for JSON-RPC
  try {
    const response = await mcpServer.handleRequest(request);

    return NextResponse.json(response, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error in MCP POST endpoint:", error);

    // Return proper JSON-RPC error response
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : "Unknown error",
        },
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
