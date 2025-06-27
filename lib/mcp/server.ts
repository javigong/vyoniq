import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { validateApiKey } from "../api-keys";
import prisma from "../prisma";
import {
  MCPRequest,
  MCPResponse,
  MCPError,
  MCPResource,
  MCPResourceTemplate,
  MCPTool,
  MCPToolCall,
  MCPToolResult,
  MCPAuthContext,
  MCP_ERRORS,
  MCPErrorCode,
} from "./types";
import { ZodError } from "zod";

export class MCPServer {
  private resources: Map<string, MCPResource> = new Map();
  private resourceTemplates: Map<string, MCPResourceTemplate> = new Map();
  private tools: Map<string, MCPTool> = new Map();
  private toolHandlers: Map<
    string,
    (args: unknown, auth: MCPAuthContext) => Promise<MCPToolResult>
  > = new Map();

  constructor() {
    // Initialize with server information
    this.initializeServerInfo();
  }

  private initializeServerInfo() {
    // Add server information resource
    this.addResource({
      uri: "vyoniq://server/info",
      name: "Vyoniq MCP Server",
      description: "Information about the Vyoniq MCP Server capabilities",
      mimeType: "application/json",
      text: JSON.stringify(
        {
          name: "Vyoniq MCP Server",
          version: "1.0.0",
          description:
            "Model Context Protocol server for Vyoniq admin dashboard",
          capabilities: {
            resources: true,
            tools: true,
            prompts: false,
            sampling: false,
          },
          features: [
            "Blog post management",
            "Newsletter management",
            "User analytics",
            "Content generation",
            "SEO optimization",
          ],
        },
        null,
        2
      ),
    });
  }

  // Resource management
  addResource(resource: MCPResource) {
    this.resources.set(resource.uri, resource);
  }

  addResourceTemplate(template: MCPResourceTemplate) {
    this.resourceTemplates.set(template.uriTemplate, template);
  }

  getResource(uri: string): MCPResource | undefined {
    return this.resources.get(uri);
  }

  listResources(): MCPResource[] {
    return Array.from(this.resources.values());
  }

  listResourceTemplates(): MCPResourceTemplate[] {
    return Array.from(this.resourceTemplates.values());
  }

  // Tool management
  addTool(
    tool: MCPTool,
    handler: (args: unknown, auth: MCPAuthContext) => Promise<MCPToolResult>
  ) {
    this.tools.set(tool.name, tool);
    this.toolHandlers.set(tool.name, handler);
  }

  getTool(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  listTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  async callTool(
    name: string,
    args: unknown,
    auth: MCPAuthContext
  ): Promise<MCPToolResult> {
    const tool = this.tools.get(name);
    const handler = this.toolHandlers.get(name);

    if (!tool || !handler) {
      throw this.createError(
        MCP_ERRORS.METHOD_NOT_FOUND,
        `Tool '${name}' not found`
      );
    }

    try {
      // Validate arguments with the tool's Zod schema (if available)
      let validatedArgs = args;
      if (tool.zodSchema) {
        validatedArgs = tool.zodSchema.parse(args);
      }
      return await handler(validatedArgs, auth);
    } catch (error) {
      if (error instanceof ZodError) {
        throw this.createError(
          MCP_ERRORS.VALIDATION_ERROR,
          "Invalid tool arguments",
          error.errors
        );
      }
      throw error;
    }
  }

  // Authentication
  async authenticateRequest(request: NextRequest): Promise<MCPAuthContext> {
    const authHeader = request.headers.get("authorization");

    // Primary Method: Bearer Token for API clients (Cursor, etc.)
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      if (token) {
        const validation = await validateApiKey(token);

        if (validation.isValid && validation.userId) {
          const user = await prisma.user.findUnique({
            where: { id: validation.userId },
          });

          if (user && user.isAdmin) {
            // Successful API Key authentication
            return {
              userId: user.id,
              isAdmin: true,
              user: {
                id: user.id,
                email: user.email,
                name: user.name || "Admin User",
                isAdmin: user.isAdmin,
              },
              apiKeyId: validation.keyId,
              scopes: validation.scopes || [],
            };
          }
        }
      }
      // If a Bearer token is provided but it's invalid, we must fail hard.
      // Do not fall back to Clerk auth in this case.
      throw this.createError(
        MCP_ERRORS.UNAUTHORIZED,
        "Invalid API Key provided."
      );
    }

    // Fallback Method: Clerk session for the Web UI
    try {
      const { userId } = await auth();
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (user && user.isAdmin) {
          // Successful Clerk session authentication
          return {
            userId: user.id,
            isAdmin: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name || "Admin User",
              isAdmin: user.isAdmin,
            },
          };
        }
      }
    } catch (e) {
      // This will fire for non-browser requests, which is expected.
      // We'll proceed to the final error throw.
    }

    // If neither method provided a valid user, fail the request.
    throw this.createError(MCP_ERRORS.UNAUTHORIZED, "Authentication required.");
  }

  // Request handling
  async handleRequest(request: NextRequest): Promise<MCPResponse> {
    let mcpRequest: MCPRequest;
    let requestId: string | number | null = null;

    try {
      // Parse the JSON-RPC request first
      const body = await request.text();

      try {
        mcpRequest = JSON.parse(body);
        requestId = mcpRequest.id ?? null;
      } catch {
        throw this.createError(MCP_ERRORS.PARSE_ERROR, "Invalid JSON");
      }

      // Validate JSON-RPC format
      if (mcpRequest.jsonrpc !== "2.0" || !mcpRequest.method) {
        throw this.createError(
          MCP_ERRORS.INVALID_REQUEST,
          "Invalid JSON-RPC request"
        );
      }

      // Check if method requires authentication.
      // `tools/call` is now public here, but will perform its own auth.
      const publicMethods = [
        "initialize",
        "resources/list",
        "resources/templates/list",
        "resources/read",
        "tools/list",
      ];
      let auth: MCPAuthContext | null = null;

      if (!publicMethods.includes(mcpRequest.method)) {
        // Authenticate all other private methods
        auth = await this.authenticateRequest(request);
      }

      // Route the request
      const result = await this.routeRequest(mcpRequest, auth);

      return {
        jsonrpc: "2.0",
        id: requestId,
        result,
      };
    } catch (error) {
      const mcpError =
        error instanceof Error && "code" in error
          ? (error as MCPError)
          : this.createError(
              MCP_ERRORS.INTERNAL_ERROR,
              "Internal server error"
            );

      return {
        jsonrpc: "2.0",
        id: requestId,
        error: mcpError,
      };
    }
  }

  private async routeRequest(
    request: MCPRequest,
    auth: MCPAuthContext | null
  ): Promise<unknown> {
    const { method, params } = request;

    switch (method) {
      case "initialize":
        return this.handleInitialize();

      case "resources/list":
        return { resources: this.listResources() };

      case "resources/templates/list":
        return { resourceTemplates: this.listResourceTemplates() };

      case "resources/read":
        return await this.handleResourceRead(params);

      case "tools/list":
        return { tools: this.listTools() };

      case "tools/call":
        if (!auth) {
          throw this.createError(
            MCP_ERRORS.UNAUTHORIZED,
            "Authentication required for tool calls"
          );
        }
        return this.handleToolCall(params, auth);

      default:
        throw this.createError(
          MCP_ERRORS.METHOD_NOT_FOUND,
          `Method '${method}' not found`
        );
    }
  }

  private handleInitialize() {
    return {
      protocolVersion: "2024-11-05",
      capabilities: {
        resources: {
          subscribe: false,
          listChanged: false,
        },
        tools: {
          listChanged: false,
        },
      },
      serverInfo: {
        name: "Vyoniq MCP Server",
        version: "1.0.0",
      },
    };
  }

  private async handleResourceRead(params: unknown): Promise<{
    contents: Array<{
      uri: string;
      mimeType?: string;
      text?: string;
      blob?: string;
    }>;
  }> {
    try {
      if (!params || typeof params !== "object" || !("uri" in params)) {
        throw this.createError(
          MCP_ERRORS.INVALID_PARAMS,
          "Missing 'uri' parameter"
        );
      }

      const { uri } = params as { uri: string };

      // First try static resources
      let resource = this.getResource(uri);

      // If not found, try dynamic blog resources
      if (!resource && uri.startsWith("vyoniq://blog/")) {
        try {
          const { resolveBlogResource } = await import("./resources/blog");
          resource = await resolveBlogResource(uri);
        } catch (dynamicError) {
          console.error("Error resolving dynamic blog resource:", dynamicError);
          // Return a helpful error resource instead of throwing
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(
                  {
                    error: "Blog resource temporarily unavailable",
                    message:
                      "Please ensure you're authenticated and the database is accessible",
                    availableResources: this.listResources().map((r) => r.uri),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
      }

      if (!resource) {
        throw this.createError(
          MCP_ERRORS.NOT_FOUND,
          `Resource '${uri}' not found`
        );
      }

      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: resource.text,
            blob: resource.blob,
          },
        ],
      };
    } catch (error) {
      console.error("Error in handleResourceRead:", error);
      throw error;
    }
  }

  private async handleToolCall(params: unknown, auth: MCPAuthContext) {
    if (!params || typeof params !== "object" || !("name" in params)) {
      throw this.createError(
        MCP_ERRORS.INVALID_PARAMS,
        "Missing 'name' parameter"
      );
    }

    const { name, arguments: args } = params as MCPToolCall;
    const result = await this.callTool(name, args, auth);

    return result;
  }

  // Utility methods
  createError(code: MCPErrorCode, message: string, data?: unknown): MCPError {
    return { code, message, data };
  }

  createSuccessResponse(content: string, isError = false): MCPToolResult {
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

  createErrorResponse(message: string): MCPToolResult {
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
}

// Export singleton instance
export const mcpServer = new MCPServer();
