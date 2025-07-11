"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Trash2,
  Plus,
  ExternalLink,
  Code,
  BookOpen,
  Activity,
  Terminal,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface MCPApiKey {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
  lastUsedAt?: string;
  active: boolean;
  scopes: string[];
}

interface MCPUsageLog {
  id: string;
  timestamp: string;
  client: string;
  action: string;
  resource: string;
  status: "success" | "error";
  duration: number;
}

export function AdminMCPSection() {
  const [apiKeys, setApiKeys] = useState<MCPApiKey[]>([]);
  const [usageLogs, setUsageLogs] = useState<MCPUsageLog[]>([]);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [mcpServerUrl, setMcpServerUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set the MCP server URL based on current environment
    const currentUrl = window.location.origin;
    setMcpServerUrl(`${currentUrl}/api/mcp`);

    // Load existing API keys and usage logs
    fetchApiKeys();
    fetchUsageLogs();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/admin/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
      } else {
        console.error("Failed to fetch API keys");
        setApiKeys([]);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setApiKeys([]);
    }
  };

  const fetchUsageLogs = async () => {
    // TODO: Implement usage log fetching
    // Mock data for now
    setUsageLogs([
      {
        id: "1",
        timestamp: "2024-01-20 14:30:22",
        client: "Claude Desktop",
        action: "create_blog_post",
        resource: "blog-posts",
        status: "success",
        duration: 1200,
      },
      {
        id: "2",
        timestamp: "2024-01-20 13:15:10",
        client: "Cursor IDE",
        action: "list_resources",
        resource: "blog-posts",
        status: "success",
        duration: 200,
      },
    ]);
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName.trim(),
          scopes: ["blog:read", "blog:write"],
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Show the full API key only once
        if (data.apiKey.fullKey) {
          setShowApiKey(data.apiKey.fullKey);

          // Add to list without the full key
          const newKey = {
            id: data.apiKey.id,
            name: data.apiKey.name,
            keyPreview: data.apiKey.keyPreview,
            createdAt: new Date(data.apiKey.createdAt)
              .toISOString()
              .split("T")[0],
            active: true,
            scopes: data.apiKey.scopes,
          };

          setApiKeys([...apiKeys, newKey]);
        }

        setNewKeyName("");
        setShowCreateKey(false);
        toast.success("API key generated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to generate API key");
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/api-keys/${keyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== keyId));
        toast.success("API key revoked successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to revoke API key");
      }
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast.error("Failed to revoke API key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const cursorConfig = `{
  "mcpServers": {
    "vyoniq": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/client-stdio"],
      "env": {
        "MCP_SERVER_URL": "${mcpServerUrl}",
        "VYONIQ_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}`;

  const claudeConfig = `{
  "mcpServers": {
    "vyoniq": {
      "transport": {
        "type": "http",
        "url": "${mcpServerUrl}"
      },
      "auth": {
        "type": "bearer",
        "token": "YOUR_API_KEY_HERE"
      }
    }
  }
}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              MCP Server Management
            </CardTitle>
            <CardDescription>
              Model Context Protocol server for AI agent integration
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            ✅ Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto text-vyoniq-blue mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                MCP Server Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                Our MCP (Model Context Protocol) server will enable AI agents to
                interact with your Vyoniq admin dashboard programmatically. This
                powerful integration allows AI assistants like Claude, Cursor,
                and others to help you manage blog posts, newsletters, and other
                admin tasks automatically.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4">
                  <BookOpen className="h-8 w-8 text-vyoniq-green mx-auto mb-2" />
                  <h4 className="font-semibold">Blog Management</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    AI agents can create, edit, publish, and manage blog posts
                  </p>
                </Card>

                <Card className="p-4">
                  <Activity className="h-8 w-8 text-vyoniq-purple mx-auto mb-2" />
                  <h4 className="font-semibold">Newsletter Automation</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Automate newsletter creation and management tasks
                  </p>
                </Card>

                <Card className="p-4">
                  <Terminal className="h-8 w-8 text-vyoniq-blue mx-auto mb-2" />
                  <h4 className="font-semibold">Analytics & Insights</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Get AI-powered insights from your admin data
                  </p>
                </Card>
              </div>

              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  🎉 MCP Server is Now Live!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  The MCP server is now fully implemented and ready for use! You
                  can connect AI agents like Claude, Cursor, and others to
                  perform admin tasks automatically. Check the Connection tab
                  for setup instructions.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Connection Instructions */}
          <TabsContent value="connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Server Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>MCP Server URL (Preview)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={mcpServerUrl} readOnly />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(mcpServerUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Protocol:</strong> HTTP/WebSocket
                  </div>
                  <div>
                    <strong>Auth:</strong> Bearer Token
                  </div>
                  <div>
                    <strong>Transport:</strong> JSON-RPC 2.0
                  </div>
                  <div>
                    <strong>Version:</strong> MCP v0.1.0
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Cursor IDE Setup
                </CardTitle>
                <CardDescription>
                  Configuration for connecting Cursor to your Vyoniq MCP server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label>
                      Add to your Cursor settings file:{" "}
                      <code>.cursor/settings.json</code>
                    </Label>
                    <div className="relative mt-2">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                        <code>{cursorConfig}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(cursorConfig)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                    <strong>Ready to use:</strong> The MCP server is live!
                    Create an API key in the "API Keys" tab, then replace
                    "YOUR_API_KEY_HERE" with your actual API key.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Claude Desktop Setup
                </CardTitle>
                <CardDescription>
                  Configuration for connecting Claude Desktop to your Vyoniq MCP
                  server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label>
                      Add to Claude Desktop config:{" "}
                      <code>~/claude_desktop_config.json</code>
                    </Label>
                    <div className="relative mt-2">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                        <code>{claudeConfig}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(claudeConfig)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                    <strong>Ready to use:</strong> The MCP server is live!
                    Create an API key in the "API Keys" tab, then replace
                    "YOUR_API_KEY_HERE" with your actual API key.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Management */}
          <TabsContent value="api-keys" className="space-y-6">
            {/* Show generated API key dialog */}
            {showApiKey && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Key Generated Successfully!
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Copy this API key now - it will not be shown again for
                    security reasons.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={showApiKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={() => {
                        copyToClipboard(showApiKey);
                        setShowApiKey(null);
                        toast.success("API key copied! Dialog will close.");
                      }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy & Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">API Keys</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage API keys for external clients like Cursor, Claude
                  Desktop, and other MCP clients
                </p>
              </div>
              <Button
                onClick={() => setShowCreateKey(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            </div>

            {/* Create API Key Form */}
            {showCreateKey && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New API Key</CardTitle>
                  <CardDescription>
                    Give your API key a memorable name to identify its use case
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyName">API Key Name</Label>
                      <Input
                        id="keyName"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Cursor IDE, Claude Desktop"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={generateApiKey}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Key className="h-4 w-4" />
                        )}
                        {loading ? "Creating..." : "Create API Key"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateKey(false);
                          setNewKeyName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>
                  {apiKeys.length === 0
                    ? "No API keys created yet"
                    : `${apiKeys.length} API key${
                        apiKeys.length === 1 ? "" : "s"
                      } total`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No API keys created yet. Create your first API key to
                      connect external clients.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key Preview</TableHead>
                        <TableHead>Scopes</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            {key.name}
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {key.keyPreview}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {key.scopes.map((scope) => (
                                <Badge
                                  key={scope}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{key.createdAt}</TableCell>
                          <TableCell>
                            {key.lastUsedAt
                              ? new Date(key.lastUsedAt).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={key.active ? "default" : "secondary"}
                            >
                              {key.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeApiKey(key.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Resources */}
          <TabsContent value="resources" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Available Resources (Preview)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                These resources will be accessible to AI agents through the MCP
                server
              </p>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Blog Posts</CardTitle>
                  <CardDescription>
                    Complete blog content management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <code>vyoniq://blog-posts/</code> - List all blog posts
                    </div>
                    <div>
                      <code>vyoniq://blog-posts/{"{id}"}</code> - Individual
                      blog post
                    </div>
                    <div>
                      <code>vyoniq://blog-posts/drafts</code> - Draft posts only
                    </div>
                    <div>
                      <code>vyoniq://blog-posts/published</code> - Published
                      posts only
                    </div>
                    <div>
                      <code>vyoniq://blog-posts/featured</code> - Featured posts
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Categories</CardTitle>
                  <CardDescription>Blog category management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <code>vyoniq://categories/</code> - List all categories
                    </div>
                    <div>
                      <code>vyoniq://categories/{"{id}"}</code> - Individual
                      category
                    </div>
                    <div>
                      <code>vyoniq://categories/stats</code> - Category usage
                      statistics
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Newsletters</CardTitle>
                  <CardDescription>
                    Newsletter campaign management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <code>vyoniq://newsletters/</code> - List newsletters
                    </div>
                    <div>
                      <code>vyoniq://newsletters/{"{id}"}</code> - Individual
                      newsletter
                    </div>
                    <div>
                      <code>vyoniq://newsletters/drafts</code> - Draft
                      newsletters
                    </div>
                    <div>
                      <code>vyoniq://newsletters/sent</code> - Sent newsletters
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Users & Analytics</CardTitle>
                  <CardDescription>User data and analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <code>vyoniq://users/subscribers</code> - Newsletter
                      subscribers
                    </div>
                    <div>
                      <code>vyoniq://analytics/blog</code> - Blog analytics
                    </div>
                    <div>
                      <code>vyoniq://analytics/users</code> - User analytics
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Available Tools */}
          <TabsContent value="tools" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Available Tools (Preview)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                These functions will be executable by AI agents through the MCP
                server
              </p>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Blog Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>create_blog_post</strong>
                      <br />
                      <span className="text-gray-600">
                        Create new blog post with AI-generated content
                      </span>
                    </div>
                    <div>
                      <strong>update_blog_post</strong>
                      <br />
                      <span className="text-gray-600">
                        Update existing blog post content
                      </span>
                    </div>
                    <div>
                      <strong>publish_blog_post</strong>
                      <br />
                      <span className="text-gray-600">
                        Publish draft blog post
                      </span>
                    </div>
                    <div>
                      <strong>unpublish_blog_post</strong>
                      <br />
                      <span className="text-gray-600">
                        Unpublish published post
                      </span>
                    </div>
                    <div>
                      <strong>delete_blog_post</strong>
                      <br />
                      <span className="text-gray-600">Delete blog post</span>
                    </div>
                    <div>
                      <strong>feature_blog_post</strong>
                      <br />
                      <span className="text-gray-600">
                        Mark post as featured
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Content & SEO Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>generate_blog_content</strong>
                      <br />
                      <span className="text-gray-600">
                        AI-powered content generation
                      </span>
                    </div>
                    <div>
                      <strong>optimize_blog_seo</strong>
                      <br />
                      <span className="text-gray-600">
                        SEO optimization suggestions
                      </span>
                    </div>
                    <div>
                      <strong>suggest_categories</strong>
                      <br />
                      <span className="text-gray-600">
                        AI category recommendations
                      </span>
                    </div>
                    <div>
                      <strong>analyze_content</strong>
                      <br />
                      <span className="text-gray-600">
                        Content quality analysis
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Newsletter Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>create_newsletter</strong>
                      <br />
                      <span className="text-gray-600">
                        Create newsletter campaign
                      </span>
                    </div>
                    <div>
                      <strong>send_newsletter</strong>
                      <br />
                      <span className="text-gray-600">
                        Send newsletter to subscribers
                      </span>
                    </div>
                    <div>
                      <strong>schedule_newsletter</strong>
                      <br />
                      <span className="text-gray-600">
                        Schedule newsletter for later
                      </span>
                    </div>
                    <div>
                      <strong>get_newsletter_analytics</strong>
                      <br />
                      <span className="text-gray-600">
                        Newsletter performance metrics
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Analytics & Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>get_blog_analytics</strong>
                      <br />
                      <span className="text-gray-600">
                        Blog performance metrics
                      </span>
                    </div>
                    <div>
                      <strong>get_user_analytics</strong>
                      <br />
                      <span className="text-gray-600">
                        User engagement analytics
                      </span>
                    </div>
                    <div>
                      <strong>export_data</strong>
                      <br />
                      <span className="text-gray-600">Export admin data</span>
                    </div>
                    <div>
                      <strong>generate_reports</strong>
                      <br />
                      <span className="text-gray-600">AI-powered reports</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
