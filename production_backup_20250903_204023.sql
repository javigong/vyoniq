--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BudgetStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BudgetStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
    'PAID',
    'COMPLETED'
);


ALTER TYPE public."BudgetStatus" OWNER TO postgres;

--
-- Name: InquiryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InquiryStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
);


ALTER TYPE public."InquiryStatus" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SUCCEEDED',
    'FAILED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ApiKey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApiKey" (
    id text NOT NULL,
    name text NOT NULL,
    "hashedKey" text NOT NULL,
    "keyPreview" text NOT NULL,
    "userId" text NOT NULL,
    scopes text[] DEFAULT ARRAY['blog:read'::text, 'blog:write'::text],
    active boolean DEFAULT true NOT NULL,
    "lastUsedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ApiKey" OWNER TO postgres;

--
-- Name: BlogAuthor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogAuthor" (
    id text NOT NULL,
    name text NOT NULL,
    avatar text,
    title text NOT NULL,
    bio text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogAuthor" OWNER TO postgres;

--
-- Name: BlogCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BlogCategory" OWNER TO postgres;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    "coverImage" text NOT NULL,
    "publishDate" timestamp(3) without time zone NOT NULL,
    "readTime" integer NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "tintColor" text,
    published boolean DEFAULT true NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: BlogPostCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPostCategory" (
    "blogPostId" text NOT NULL,
    "categoryId" text NOT NULL
);


ALTER TABLE public."BlogPostCategory" OWNER TO postgres;

--
-- Name: Budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Budget" (
    id text NOT NULL,
    "inquiryId" text NOT NULL,
    title text NOT NULL,
    description text,
    "totalAmount" numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    status public."BudgetStatus" DEFAULT 'DRAFT'::public."BudgetStatus" NOT NULL,
    "validUntil" timestamp(3) without time zone,
    "adminNotes" text,
    "clientNotes" text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Budget" OWNER TO postgres;

--
-- Name: BudgetItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BudgetItem" (
    id text NOT NULL,
    "budgetId" text NOT NULL,
    "servicePricingId" text,
    name text NOT NULL,
    description text,
    quantity integer DEFAULT 1 NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "isCustom" boolean DEFAULT false NOT NULL,
    category text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BudgetItem" OWNER TO postgres;

--
-- Name: Inquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Inquiry" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "serviceType" text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."InquiryStatus" DEFAULT 'PENDING'::public."InquiryStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text
);


ALTER TABLE public."Inquiry" OWNER TO postgres;

--
-- Name: InquiryMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InquiryMessage" (
    id text NOT NULL,
    "inquiryId" text NOT NULL,
    message text NOT NULL,
    "isFromAdmin" boolean DEFAULT false NOT NULL,
    "authorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InquiryMessage" OWNER TO postgres;

--
-- Name: Newsletter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Newsletter" (
    id text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    "previewText" text,
    "isDraft" boolean DEFAULT true NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Newsletter" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "budgetId" text NOT NULL,
    "stripePaymentId" text,
    "stripeSessionId" text,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paymentMethod" text,
    "paidAt" timestamp(3) without time zone,
    "refundedAt" timestamp(3) without time zone,
    "failedAt" timestamp(3) without time zone,
    "failureReason" text,
    "stripeClientSecret" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: ServicePricing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServicePricing" (
    id text NOT NULL,
    "serviceType" text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "basePrice" numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    "billingType" text NOT NULL,
    features jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    customizable boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServicePricing" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "isNewsletterSubscriber" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "unsubscribeToken" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: ApiKey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApiKey" (id, name, "hashedKey", "keyPreview", "userId", scopes, active, "lastUsedAt", "createdAt", "updatedAt") FROM stdin;
cmce1m4sa0001rqpln6tmlyy7	Test API Key	$2b$12$w.wd75kAfKA/bRCdRLw/eO1BxWk/5y5eFQoHP9orXOAvHK2hiRzN.	vyoniq_sk_3b***	user_2yVeqlMcOtV5WEAws4BeMoDFYVh	{blog:read,blog:write}	t	\N	2025-06-26 23:57:16.859	2025-06-26 23:57:16.859
cmce2uhln0001rq59al00hrm6	Test API Key	$2b$12$pSKu1ckDtd64R342OJUQn.dlHShOYXFswmRaqSShn2h6Ye8XowZgG	vyoniq_sk_65***	user_2yVeqlMcOtV5WEAws4BeMoDFYVh	{blog:read,blog:write}	t	2025-09-04 03:16:45.468	2025-06-27 00:31:46.328	2025-09-04 03:16:45.47
\.


--
-- Data for Name: BlogAuthor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogAuthor" (id, name, avatar, title, bio, "createdAt", "updatedAt") FROM stdin;
cmcdwvy800000rq02usmp8q8l	Javier Gongora	/javier.jpeg	Founder & Software Developer	Founder and lead developer at Vyoniq, specializing in AI-powered applications and enterprise software solutions.	2025-06-26 21:44:56.833	2025-06-26 21:44:56.833
\.


--
-- Data for Name: BlogCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogCategory" (id, name, slug, "createdAt") FROM stdin;
cmcdwvyc30001rq02dh0ctac3	Cursor & AI IDEs	cursor--ai-ides	2025-06-26 21:44:56.98
cmcdwvysh0002rq028vyzi2dk	AI Development Tools	ai-development-tools	2025-06-26 21:44:57.569
cmcdwvz2c0003rq02nagpr1hf	Industry Trends	industry-trends	2025-06-26 21:44:57.924
cmcdwvzde0004rq02ihx2aqrx	MCP Servers	mcp-servers	2025-06-26 21:44:58.322
cmcdwvzoa0005rq02hi0fx3vs	LLM Integration	llm-integration	2025-06-26 21:44:58.714
cmcdwvzy50006rq02osjux56m	Enterprise Architecture	enterprise-architecture	2025-06-26 21:44:59.069
cmcdww08h0007rq023w6eydu7	AI Agents	ai-agents	2025-06-26 21:44:59.442
cmcdww0ig0008rq02qawnmxwx	Business Automation	business-automation	2025-06-26 21:44:59.801
cmcdww0sd0009rq025hasoq3c	Case Studies	case-studies	2025-06-26 21:45:00.158
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, slug, title, excerpt, content, "coverImage", "publishDate", "readTime", featured, "tintColor", published, "authorId", "createdAt", "updatedAt") FROM stdin;
cmcdww1p6000drq02w55ae3ni	mcp-servers-llm-integration	MCP Servers: The Future of LLM Integration	Discover how Model Context Protocol (MCP) servers are revolutionizing LLM integration, enabling seamless data access and intelligent automation across applications.	\n# MCP Servers: The Future of LLM Integration\n\nThe Model Context Protocol (MCP) provides a standardized way for applications to securely interact with various data sources. This enables LLMs to access real-time, context-aware information, leading to more accurate and relevant responses.\n\n## Why MCP Matters\n\n- **Standardization**: A common protocol for diverse data sources.\n- **Security**: Securely expose data without compromising privacy.\n- **Scalability**: Build scalable and maintainable AI integrations.\n	/llms.jpeg	2025-05-15 00:00:00	8	t	rgba(0, 199, 183, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-06-26 21:45:00.957	2025-07-11 05:24:04.82
cmcdww12x000brq028ueh8yut	cursor-ai-development-revolution	How Cursor is Revolutionizing AI-Powered Development	Explore how Cursor's AI-first approach is transforming the development experience with intelligent code completion, chat-driven programming, and seamless LLM integration.	\n# How Cursor is Revolutionizing AI-Powered Development\n\nCursor is not just another code editor; it's an AI-first development environment designed to augment developer productivity. By integrating Large Language Models (LLMs) at its core, Cursor provides a suite of tools that go beyond simple autocompletion.\n\n## Key Features\n\n- **Chat-Driven Programming**: Interact with your codebase using natural language.\n- **Intelligent Code Generation**: Generate complex code blocks from simple prompts.\n- **Seamless Debugging**: AI-assisted debugging to identify and fix issues faster.\n	/llms.jpeg	2025-06-20 00:00:00	6	t	rgba(15, 23, 41, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-06-26 21:45:00.565	2025-07-11 05:26:12.571
cmce9396n0001rq4h5xh0eyt0	building-a-production-ready-mcp-server-with-nextjs-a-complete-implementation-guide	Building a Production-Ready MCP Server with Next.js: A Complete Implementation Guide	Learn how to build a robust Model Context Protocol (MCP) server using Next.js without Vercel deployment. This comprehensive guide covers everything from schema design to authentication, based on real-world implementation experience with the Vyoniq MCP server.	# Building a Production-Ready MCP Server with Next.js: A Complete Implementation Guide\n\nThe Model Context Protocol (MCP) is revolutionizing how Large Language Models interact with external systems and data sources. While many tutorials focus on simple implementations, building a production-ready MCP server requires careful attention to schema design, authentication, error handling, and client compatibility.\n\nThis guide walks you through building a complete MCP server using Next.js, based on our experience developing the Vyoniq MCP server that successfully integrates with Cursor IDE and other MCP clients.\n\n## Why Next.js for MCP Servers?\n\nNext.js provides an excellent foundation for MCP servers due to its:\n\n- **API Routes**: Built-in support for serverless functions and API endpoints\n- **TypeScript Integration**: First-class TypeScript support for type safety\n- **Middleware Support**: Request/response processing and authentication\n- **Flexible Deployment**: Works with any hosting provider, not just Vercel\n- **Performance**: Optimized for production workloads\n\n## Project Architecture Overview\n\nOur MCP server follows a modular architecture that separates concerns and maintains scalability:\n\n```\nlib/mcp/\n├── server.ts          # Core MCP server implementation\n├── init.ts           # Server initialization and tool registration\n├── types.ts          # Zod schemas and TypeScript interfaces\n├── tools/            # Individual tool implementations\n│   ├── blog.ts       # Blog management tools\n│   └── analytics.ts  # Analytics tools\n└── resources/        # Dynamic resource handlers\n    └── blog.ts       # Blog resource providers\n```\n\nThis structure ensures clean separation of concerns and makes it easy to add new tools and resources as your MCP server grows.\n\n## The Critical Schema Design Pattern\n\nThe most important aspect of MCP server implementation is proper schema design. Many implementations fail because they don't provide proper parameter descriptions that MCP clients like Cursor need to display helpful information.\n\n### ❌ Common Mistake: Raw Schemas Without Descriptions\n\n```typescript\n// This won't show parameter descriptions in Cursor\nconst BadSchema = z.object({\n  title: z.string().min(1),\n  published: z.boolean().optional()\n});\n```\n\n### ✅ Correct Implementation: Always Use .describe()\n\n```typescript\n// This will show proper descriptions in Cursor\nconst GoodSchema = z.object({\n  title: z.string()\n    .min(1, "Title is required")\n    .describe("The title of the blog post"),\n  published: z.boolean()\n    .optional()\n    .describe("Filter posts by published status (true for published, false for drafts, omit for all posts)")\n});\n```\n\n## Schema Conversion for MCP Clients\n\nThe key to Cursor compatibility is proper JSON Schema generation:\n\n```typescript\nimport { zodToJsonSchema } from "zod-to-json-schema";\n\nexport interface MCPTool {\n  name: string;\n  description?: string;\n  inputSchema: any; // JSON Schema for MCP clients\n  zodSchema?: z.ZodSchema; // Zod schema for server validation\n}\n\nconst createBlogPostTool: MCPTool = {\n  name: "create_blog_post",\n  description: "Create a new blog post with specified content, categories, and metadata",\n  // Convert to JSON Schema for MCP clients (like Cursor)\n  inputSchema: zodToJsonSchema(CreateBlogPostSchema, { \n    $refStrategy: "none" // Critical: Use inline schemas, not $ref\n  }),\n  // Keep Zod schema for server-side validation\n  zodSchema: CreateBlogPostSchema,\n};\n```\n\nThe `$refStrategy: "none"` parameter is crucial - it ensures that complex schema references don't confuse MCP clients.\n\n## Implementing Dual Authentication\n\nProduction MCP servers need to support both API key authentication (for external clients like Cursor) and session-based authentication (for web UIs):\n\n```typescript\nexport async function authenticateRequest(\n  request: NextRequest\n): Promise<MCPAuthContext | null> {\n  // 1. Check for API key first (for external MCP clients)\n  const authHeader = request.headers.get("authorization");\n  if (authHeader?.startsWith("Bearer ")) {\n    return await authenticateApiKey(authHeader.replace("Bearer ", ""));\n  }\n\n  // 2. Fall back to Clerk session (for web UI)\n  return await authenticateClerkSession(request);\n}\n```\n\n### Secure API Key Management\n\nStore API keys securely using bcrypt hashing:\n\n```typescript\n// API Key Format: vyoniq_sk_<64_hex_characters>\nconst API_KEY_PREFIX = "vyoniq_sk_";\nconst API_KEY_LENGTH = 64;\n\n// Store hashed keys in database\nconst hashedKey = await bcrypt.hash(rawKey, 12);\n\n// Validate keys\nconst isValid = await bcrypt.compare(providedKey, storedHashedKey);\n```\n\n## Tool Implementation Pattern\n\nEach MCP tool should follow a consistent pattern for reliability and maintainability:\n\n```typescript\nexport const createBlogPostTool: MCPTool = {\n  name: "create_blog_post",\n  description: "Create a new blog post with specified content, categories, and metadata",\n  inputSchema: zodToJsonSchema(CreateBlogPostSchema, { $refStrategy: "none" }),\n  zodSchema: CreateBlogPostSchema,\n};\n\nexport async function createBlogPostHandler(\n  args: unknown,\n  auth: MCPAuthContext\n): Promise<MCPToolResult> {\n  try {\n    // 1. Validate permissions\n    if (!auth.isAdmin) {\n      return createErrorResponse("Unauthorized: Admin access required");\n    }\n\n    // 2. Validate and parse arguments using Zod schema\n    const data = CreateBlogPostSchema.parse(args);\n\n    // 3. Perform business logic\n    const post = await prisma.blogPost.create({\n      data: {\n        title: data.title,\n        excerpt: data.excerpt,\n        content: data.content,\n        authorId: auth.userId,\n      },\n    });\n\n    // 4. Return structured success response\n    return createSuccessResponse(\n      `Successfully created blog post: "${post.title}" (ID: ${post.id})`\n    );\n  } catch (error) {\n    console.error("Error creating blog post:", error);\n    return createErrorResponse(\n      `Failed to create blog post: ${\n        error instanceof Error ? error.message : "Unknown error"\n      }`\n    );\n  }\n}\n```\n\n## JSON-RPC Protocol Implementation\n\nMCP uses JSON-RPC 2.0 protocol. Your server must handle the protocol correctly:\n\n```typescript\nexport async function POST(request: NextRequest) {\n  try {\n    const body = await request.json();\n\n    // Validate JSON-RPC format\n    if (body.jsonrpc !== "2.0") {\n      return createErrorResponse(MCP_ERRORS.INVALID_REQUEST, "Invalid JSON-RPC version");\n    }\n\n    // Route to appropriate handler\n    switch (body.method) {\n      case "initialize":\n        return handleInitialize(body);\n      case "tools/list":\n        return await handleToolsList(body, request);\n      case "tools/call":\n        return await handleToolsCall(body, request);\n      case "resources/list":\n        return await handleResourcesList(body, request);\n      case "resources/read":\n        return await handleResourcesRead(body, request);\n      default:\n        return createErrorResponse(MCP_ERRORS.METHOD_NOT_FOUND, `Method not found: ${body.method}`);\n    }\n  } catch (error) {\n    console.error("MCP Server Error:", error);\n    return createErrorResponse(MCP_ERRORS.INTERNAL_ERROR, "Internal server error");\n  }\n}\n```\n\n## Server Initialization and Tool Registration\n\nProper server initialization is crucial for reliability:\n\n```typescript\nexport function initializeMCPServer() {\n  console.log("Initializing Vyoniq MCP Server...");\n\n  // Register blog management tools\n  mcpServer.addTool(createBlogPostTool, createBlogPostHandler);\n  mcpServer.addTool(updateBlogPostTool, updateBlogPostHandler);\n  mcpServer.addTool(publishBlogPostTool, publishBlogPostHandler);\n  mcpServer.addTool(deleteBlogPostTool, deleteBlogPostHandler);\n  mcpServer.addTool(createCategoryTool, createCategoryHandler);\n  mcpServer.addTool(listBlogPostsTool, listBlogPostsHandler);\n  mcpServer.addTool(listCategoriesTool, listCategoriesHandler);\n  mcpServer.addTool(getBlogPostTool, getBlogPostHandler);\n\n  console.log(`✅ Vyoniq MCP Server initialized successfully`);\n  console.log(`📊 Registered ${mcpServer.listTools().length} tools`);\n}\n```\n\n## Testing Your MCP Server\n\nCreate comprehensive tests to ensure your server works correctly:\n\n```typescript\nasync function testMCPServer() {\n  const baseUrl = 'http://localhost:3000/api/mcp';\n  const apiKey = 'your_api_key_here';\n\n  // Test 1: Initialize\n  const initResponse = await fetch(baseUrl, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${apiKey}`\n    },\n    body: JSON.stringify({\n      jsonrpc: '2.0',\n      id: 1,\n      method: 'initialize',\n      params: {\n        protocolVersion: '2024-11-05',\n        capabilities: {},\n        clientInfo: { name: 'test-client', version: '1.0.0' }\n      }\n    })\n  });\n\n  // Test 2: List tools\n  const toolsResponse = await fetch(baseUrl, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${apiKey}`\n    },\n    body: JSON.stringify({\n      jsonrpc: '2.0',\n      id: 2,\n      method: 'tools/list'\n    })\n  });\n\n  // Validate responses\n  console.log('Initialize:', await initResponse.json());\n  console.log('Tools:', await toolsResponse.json());\n}\n```\n\n## Deployment Without Vercel\n\nWhile Vercel is popular for Next.js deployment, you can deploy your MCP server anywhere:\n\n### Docker Deployment\n\n```dockerfile\nFROM node:18-alpine\n\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nCOPY . .\nRUN npm run build\n\nEXPOSE 3000\nCMD ["npm", "start"]\n```\n\n### Environment Variables\n\n```bash\n# Database\nDATABASE_URL="postgresql://..."\n\n# Authentication\nCLERK_SECRET_KEY="sk_..."\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."\n\n# MCP Server\nMCP_SERVER_PORT=3000\nMCP_API_KEY_SALT_ROUNDS=12\n```\n\n### Reverse Proxy Configuration (Nginx)\n\n```nginx\nserver {\n    listen 80;\n    server_name your-mcp-server.com;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_cache_bypass $http_upgrade;\n    }\n}\n```\n\n## Common Pitfalls and Solutions\n\n### 1. Missing Parameter Descriptions\n**Problem**: Cursor shows tools but no parameter descriptions\n**Solution**: Always use `.describe()` on every Zod schema field\n\n### 2. Complex Schema References\n**Problem**: $ref-based schemas confuse MCP clients\n**Solution**: Use `{ $refStrategy: "none" }` in `zodToJsonSchema()`\n\n### 3. Authentication Issues\n**Problem**: API key validation fails\n**Solution**: Use `bcrypt.compare()` for hashed key validation\n\n### 4. Tool Registration Errors\n**Problem**: Tools not appearing in clients\n**Solution**: Ensure proper tool registration in server initialization\n\n## Production Deployment Checklist\n\nBefore deploying your MCP server:\n\n- [ ] All tools have parameter descriptions\n- [ ] Schema conversion uses inline schemas (`$refStrategy: "none"`)\n- [ ] Authentication is properly implemented\n- [ ] JSON-RPC protocol is correctly handled\n- [ ] Error responses are structured properly\n- [ ] API keys are securely generated and stored\n- [ ] All tools are registered in server initialization\n- [ ] Comprehensive test suite passes\n- [ ] Environment variables are configured\n- [ ] Database migrations are applied\n- [ ] Monitoring and logging are set up\n\n## Real-World Results\n\nOur Vyoniq MCP server implementation successfully:\n\n- **Integrates with Cursor IDE**: All 8 tools work seamlessly with proper parameter descriptions\n- **Handles Authentication**: Dual authentication supports both API keys and web sessions\n- **Manages Blog Content**: Complete CRUD operations for blog posts and categories\n- **Provides Resources**: Dynamic resource templates for flexible data access\n- **Scales Reliably**: Handles concurrent requests and maintains performance\n\n## Conclusion\n\nBuilding a production-ready MCP server with Next.js requires attention to detail, especially around schema design and authentication. The patterns and practices outlined in this guide will help you create robust MCP servers that integrate seamlessly with Cursor and other MCP clients.\n\nThe key to success is following the established patterns for schema design, implementing proper authentication, and thoroughly testing your implementation. With these foundations in place, you can build powerful MCP servers that unlock new possibilities for LLM integration in your applications.\n\nAt Vyoniq, we've successfully implemented these patterns to create a fully functional MCP server that enhances our development workflow and provides seamless integration with modern AI development tools. The investment in proper MCP server implementation pays dividends in developer productivity and system reliability.	/llms.jpeg	2025-01-15 00:00:00	12	t	rgba(244, 114, 182, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-06-27 19:35:46.438	2025-07-11 07:11:05.018
cmcdww2dg000hrq021e3na4b6	llm-integration-enterprise-applications	Best Practices for LLM Integration in Enterprise Applications	A comprehensive guide to integrating Large Language Models into enterprise applications, covering security, scalability, and performance considerations.	\n# Best Practices for LLM Integration in Enterprise Applications\n\nIntegrating LLMs into enterprise systems requires careful planning. This guide covers the essential best practices to ensure a successful and secure implementation.\n\n## Key Considerations\n\n- **Data Privacy**: Ensure sensitive data is not exposed to third-party models.\n- **Model Fine-Tuning**: Fine-tune models on your own data for improved accuracy.\n- **Cost Management**: Monitor and control API usage to avoid unexpected costs.\n	/llms.jpeg	2025-03-05 00:00:00	7	f	rgba(16, 185, 129, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-06-26 21:45:01.711	2025-07-11 05:28:08.839
cmcdww2nl000jrq027bc748ok	ai-development-tools-ecosystem	The Modern AI Development Tools Ecosystem	Explore the rapidly evolving landscape of AI development tools, from code editors to deployment platforms, and how they're shaping the future of software development.	\n# The Modern AI Development Tools Ecosystem\n\nThe AI development landscape is constantly evolving. This post provides an overview of the key tools and platforms that are shaping the future of AI-powered software development.\n\n## Tools to Watch\n\n- **Cursor**: An AI-first code editor.\n- **LangChain**: A framework for building LLM-powered applications.\n- **Vercel AI SDK**: A library for building AI-powered user interfaces.\n	/llms.jpeg	2025-02-01 00:00:00	9	f	rgba(251, 146, 60, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-06-26 21:45:02.115	2025-07-11 05:28:36.214
cmcdww21s000frq02cwt2kvml	ai-agents-business-automation	AI Agents: Transforming Business Process Automation	Learn how AI agents powered by LLMs are revolutionizing business automation, from customer service to complex workflow orchestration.	\n# AI Agents: Transforming Business Process Automation\n\nAI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. When powered by LLMs, these agents can handle complex, multi-step tasks that were previously impossible to automate.\n\n## Use Cases\n\n- **Automated Customer Support**: Resolve customer inquiries without human intervention.\n- **Workflow Orchestration**: Manage complex business processes across multiple systems.\n- **Data Analysis**: Automatically gather, analyze, and report on business data.\n	/llms.jpeg	2025-04-10 00:00:00	10	f	 rgba(110, 86, 207, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-06-26 21:45:01.319	2025-07-11 05:28:08.839
cmd0hin950001og0kbmq9ybb7	complete-guide-to-nextjs-seo-optimization-from-zero-to-google-visibility	Complete Guide to Next.js SEO Optimization: From Zero to Google Visibility	Learn how to implement comprehensive SEO strategies for Next.js applications with real-world examples from Vyoniq's website optimization. Discover technical SEO, structured data, analytics setup, and proven techniques to improve Google rankings.	# Complete Guide to Next.js SEO Optimization: From Zero to Google Visibility\n\nWhen your website doesn't appear in Google search results for your own brand name, it's time for a comprehensive SEO overhaul. At Vyoniq, we recently faced this exact challenge and implemented a complete SEO strategy that transformed our website's visibility. This guide shares our proven approach to Next.js SEO optimization, complete with code examples and actionable strategies.\n\n## The Challenge: Invisible in Search Results\n\nDespite having a professional website built with Next.js, Vyoniq wasn't appearing in Google search results for our own brand name. This is a common problem for new websites and applications that haven't implemented proper SEO foundations. The solution required a multi-layered approach combining technical SEO, content optimization, and strategic implementation.\n\n## Our Comprehensive SEO Strategy\n\n### 1. Technical SEO Foundation\n\n#### Meta Tags and Structured Metadata\n\nThe foundation of any SEO strategy starts with proper meta tags. Here's how we implemented comprehensive metadata in our Next.js application:\n\n```typescript\n// app/layout.tsx\nexport const metadata: Metadata = {\n  metadataBase: new URL(getBaseUrl()),\n  title: "Vyoniq | AI-Powered Software Development & LLM Integration Services",\n  description: "Professional AI-powered software development company specializing in LLM integration, AI agents, web & mobile apps, MCP servers, and modern AI development tools.",\n  keywords: [\n    "AI software development",\n    "LLM integration", \n    "AI agents",\n    "web development",\n    "mobile apps",\n    "MCP servers",\n    "AI integrations",\n    "artificial intelligence",\n    "software development company"\n  ],\n  openGraph: {\n    title: "Vyoniq | AI-Powered Software Development & LLM Integration Services",\n    description: "Professional AI-powered software development company...",\n    url: getBaseUrl(),\n    siteName: "Vyoniq",\n    images: [{\n      url: "/og-image.jpg",\n      width: 1200,\n      height: 630,\n      alt: "Vyoniq - AI-Powered Software Development Services"\n    }],\n    locale: "en_US",\n    type: "website"\n  },\n  robots: {\n    index: true,\n    follow: true,\n    googleBot: {\n      index: true,\n      follow: true,\n      "max-video-preview": -1,\n      "max-image-preview": "large",\n      "max-snippet": -1\n    }\n  },\n  verification: {\n    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION\n  }\n};\n```\n\n#### Environment Variables for SEO\n\nWe created a systematic approach to managing SEO-related environment variables:\n\n```bash\n# Google Analytics 4\nNEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX\n\n# Google Search Console Verification\nNEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code_here\n```\n\n### 2. Google Analytics 4 Implementation\n\nProper analytics tracking is crucial for measuring SEO success. Here's our production-ready GA4 implementation:\n\n```typescript\n// app/layout.tsx\n{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (\n  <>\n    <script\n      async\n      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}\n    />\n    <script\n      dangerouslySetInnerHTML={{\n        __html: `\n          window.dataLayer = window.dataLayer || [];\n          function gtag(){dataLayer.push(arguments);}\n          gtag('js', new Date());\n          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {\n            page_title: document.title,\n            page_location: window.location.href,\n          });\n        `,\n      }}\n    />\n  </>\n)}\n```\n\n### 3. Advanced Structured Data Implementation\n\nStructured data helps search engines understand your content better. We implemented comprehensive JSON-LD schemas:\n\n```typescript\n// components/structured-data.tsx\nexport function OrganizationStructuredData() {\n  const organizationData = {\n    "@context": "https://schema.org",\n    "@type": "Organization",\n    name: "Vyoniq",\n    alternateName: "Vyoniq Technologies",\n    description: "Professional AI-powered software development company...",\n    url: "https://vyoniq.com",\n    logo: {\n      "@type": "ImageObject",\n      url: "https://vyoniq.com/logo.png",\n      width: 200,\n      height: 200\n    },\n    founder: {\n      "@type": "Person",\n      name: "Javier Gongora",\n      jobTitle: "Founder & Software Developer",\n      url: "https://vyoniq.com/about"\n    },\n    serviceType: [\n      "LLM Integration Services",\n      "AI Agent Development",\n      "Web Application Development",\n      "Mobile App Development"\n    ],\n    hasOfferCatalog: {\n      "@type": "OfferCatalog",\n      name: "Vyoniq AI Software Development Services",\n      itemListElement: [\n        {\n          "@type": "Offer",\n          itemOffered: {\n            "@type": "Service",\n            name: "LLM Integration Services",\n            description: "Professional Large Language Model integration and AI agent development"\n          }\n        }\n      ]\n    }\n  };\n\n  return <StructuredData type="Organization" data={organizationData} />;\n}\n```\n\n### 4. Reusable SEO Component System\n\nWe created a comprehensive SEO component system for consistent implementation across all pages:\n\n```typescript\n// components/seo.tsx\nexport function generateSEOMetadata({\n  title = "Default Title",\n  description = "Default Description",\n  keywords = [],\n  image = "/default-og-image.jpg",\n  url,\n  type = "website",\n  canonical,\n  noindex = false,\n  nofollow = false,\n}: SEOProps = {}): Metadata {\n  const baseUrl = getBaseUrl();\n  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;\n  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;\n\n  return {\n    title,\n    description,\n    keywords,\n    openGraph: {\n      title,\n      description,\n      url: fullUrl,\n      siteName: "Vyoniq",\n      images: [{\n        url: fullImageUrl,\n        width: 1200,\n        height: 630,\n        alt: title\n      }],\n      locale: "en_US",\n      type\n    },\n    robots: {\n      index: !noindex,\n      follow: !nofollow,\n      googleBot: {\n        index: !noindex,\n        follow: !nofollow,\n        "max-video-preview": -1,\n        "max-image-preview": "large",\n        "max-snippet": -1\n      }\n    },\n    alternates: {\n      canonical: canonical || fullUrl\n    }\n  };\n}\n```\n\n### 5. Content Optimization Strategy\n\n#### Heading Hierarchy\n\nProper heading structure is crucial for SEO. We implemented a clear hierarchy:\n\n```tsx\n// Proper heading structure\n<h1>Primary Page Title (One per page)</h1>\n<h2>Main Section Headings</h2>\n<h3>Subsection Headings</h3>\n```\n\n#### Image Optimization\n\nAll images include descriptive alt text and are optimized for performance:\n\n```tsx\n<Image\n  src="/ai-development-services.jpg"\n  alt="AI-powered software development services including LLM integration and AI agents"\n  width={1200}\n  height={630}\n  priority\n/>\n```\n\n### 6. Technical Implementation Details\n\n#### XML Sitemap Generation\n\nNext.js makes sitemap generation straightforward:\n\n```typescript\n// app/sitemap.ts\nexport default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n  const baseUrl = "https://vyoniq.com";\n  const currentDate = new Date().toISOString();\n\n  // Dynamic blog post entries\n  const blogPosts = await getBlogPosts();\n  const blogEntries = blogPosts.map((post) => ({\n    url: `${baseUrl}/blog/${post.slug}`,\n    lastModified: currentDate,\n    changeFrequency: "monthly" as const,\n    priority: 0.7,\n  }));\n\n  return [\n    {\n      url: baseUrl,\n      lastModified: currentDate,\n      changeFrequency: "weekly",\n      priority: 1.0,\n    },\n    // ... other static pages\n    ...blogEntries,\n  ];\n}\n```\n\n#### Robots.txt Configuration\n\n```typescript\n// app/robots.ts\nexport default function robots(): MetadataRoute.Robots {\n  return {\n    rules: {\n      userAgent: "*",\n      allow: "/",\n      disallow: ["/admin/", "/api/"],\n    },\n    sitemap: "https://vyoniq.com/sitemap.xml",\n  };\n}\n```\n\n## Implementation Checklist\n\n### Phase 1: Foundation (Week 1)\n- [ ] Set up Google Analytics 4\n- [ ] Configure Google Search Console\n- [ ] Implement basic meta tags\n- [ ] Create XML sitemap\n- [ ] Set up robots.txt\n\n### Phase 2: Content Optimization (Week 2)\n- [ ] Optimize heading hierarchy\n- [ ] Add descriptive alt text to images\n- [ ] Implement structured data\n- [ ] Create SEO-friendly URLs\n- [ ] Optimize page loading speed\n\n### Phase 3: Advanced Features (Week 3-4)\n- [ ] Implement Open Graph tags\n- [ ] Add Twitter Card metadata\n- [ ] Set up canonical URLs\n- [ ] Create comprehensive internal linking\n- [ ] Implement schema markup for services\n\n## Expected Results and Timeline\n\n### Short-term (1-3 months)\n- Improved indexing of all pages\n- Better search console data\n- Increased organic impressions\n- Brand name visibility in search results\n\n### Medium-term (3-6 months)\n- Ranking for target keywords\n- Increased organic traffic\n- Better click-through rates\n- Improved search result snippets\n\n### Long-term (6+ months)\n- Established authority in your niche\n- Consistent organic lead generation\n- Top rankings for relevant keywords\n- Sustainable organic growth\n\n## Key Takeaways\n\n1. **Start with Technical Foundation**: Proper meta tags, analytics, and search console setup are non-negotiable.\n\n2. **Implement Structured Data**: JSON-LD schemas help search engines understand your content better.\n\n3. **Create Reusable Systems**: Build SEO components that can be consistently applied across your application.\n\n4. **Monitor and Iterate**: Use analytics data to continuously improve your SEO strategy.\n\n5. **Content is King**: Technical SEO enables great content to be discovered.\n\n## Tools and Resources\n\n- **Google Analytics 4**: For tracking and measuring success\n- **Google Search Console**: For monitoring search performance\n- **Next.js Built-in SEO**: Leverage metadata API and sitemap generation\n- **Schema.org**: For structured data implementation\n- **PageSpeed Insights**: For performance optimization\n\n## Conclusion\n\nImplementing comprehensive SEO for Next.js applications requires a systematic approach combining technical optimization, content strategy, and ongoing monitoring. The strategies outlined in this guide helped Vyoniq achieve significant improvements in search visibility and organic traffic.\n\nRemember that SEO is a long-term investment. While technical implementations can be completed quickly, seeing significant results typically takes 3-6 months. Start with the foundation, implement systematically, and monitor your progress using the tools and metrics outlined in this guide.\n\nReady to transform your Next.js application's search visibility? Start with the technical foundation and work through each phase systematically. Your future organic traffic will thank you.\n\n---\n\n*Need help implementing SEO strategies for your Next.js application? Vyoniq specializes in AI-powered software development with comprehensive SEO optimization. [Contact us](https://vyoniq.com/#contact) to discuss your project.*	/llms.jpeg	2025-07-12 00:00:00	12	t	rgba(244, 114, 182, 0.3)	t	cmcdwvy800000rq02usmp8q8l	2025-07-12 16:53:23.897	2025-07-12 18:04:42.19
\.


--
-- Data for Name: BlogPostCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPostCategory" ("blogPostId", "categoryId") FROM stdin;
cmcdww12x000brq028ueh8yut	cmcdwvyc30001rq02dh0ctac3
cmcdww12x000brq028ueh8yut	cmcdwvysh0002rq028vyzi2dk
cmcdww12x000brq028ueh8yut	cmcdwvz2c0003rq02nagpr1hf
cmcdww1p6000drq02w55ae3ni	cmcdwvzde0004rq02ihx2aqrx
cmcdww1p6000drq02w55ae3ni	cmcdwvzoa0005rq02hi0fx3vs
cmcdww1p6000drq02w55ae3ni	cmcdwvzy50006rq02osjux56m
cmcdww21s000frq02cwt2kvml	cmcdww08h0007rq023w6eydu7
cmcdww21s000frq02cwt2kvml	cmcdww0ig0008rq02qawnmxwx
cmcdww21s000frq02cwt2kvml	cmcdwvzoa0005rq02hi0fx3vs
cmcdww2dg000hrq021e3na4b6	cmcdwvzoa0005rq02hi0fx3vs
cmcdww2dg000hrq021e3na4b6	cmcdww0sd0009rq025hasoq3c
cmcdww2dg000hrq021e3na4b6	cmcdwvz2c0003rq02nagpr1hf
cmcdww2nl000jrq027bc748ok	cmcdwvysh0002rq028vyzi2dk
cmcdww2nl000jrq027bc748ok	cmcdwvyc30001rq02dh0ctac3
cmcdww2nl000jrq027bc748ok	cmcdwvz2c0003rq02nagpr1hf
cmce9396n0001rq4h5xh0eyt0	cmcdwvysh0002rq028vyzi2dk
cmce9396n0001rq4h5xh0eyt0	cmcdww0ig0008rq02qawnmxwx
cmce9396n0001rq4h5xh0eyt0	cmcdww0sd0009rq025hasoq3c
cmce9396n0001rq4h5xh0eyt0	cmcdwvzde0004rq02ihx2aqrx
cmd0hin950001og0kbmq9ybb7	cmcdwvzde0004rq02ihx2aqrx
cmd0hin950001og0kbmq9ybb7	cmcdww0sd0009rq025hasoq3c
cmd0hin950001og0kbmq9ybb7	cmcdwvysh0002rq028vyzi2dk
\.


--
-- Data for Name: Budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Budget" (id, "inquiryId", title, description, "totalAmount", currency, status, "validUntil", "adminNotes", "clientNotes", "createdById", "createdAt", "updatedAt") FROM stdin;
cmco6hc430001rqzlfgm25ezp	cmch86qqo0009rqxkdgv7tj4m	Vyoniq App Budget Test	Vyoniq App Budget Test	550.00	USD	PAID	2025-07-31 00:00:00			user_2yQbLBJukarNLRkMZ4okDc84wLh	2025-07-04 02:11:12.915	2025-07-04 03:47:33.88
\.


--
-- Data for Name: BudgetItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BudgetItem" (id, "budgetId", "servicePricingId", name, description, quantity, "unitPrice", "totalPrice", "isCustom", category, "createdAt") FROM stdin;
cmco6hc430002rqzldmy0ix21	cmco6hc430001rqzlfgm25ezp	\N	Website		1	550.00	550.00	t	development	2025-07-04 02:11:12.915
\.


--
-- Data for Name: Inquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Inquiry" (id, name, email, "serviceType", message, "createdAt", status, "updatedAt", "userId") FROM stdin;
cmch73df00000rqnmat45gp4n	Test User	javier@vyoniq.com	Web & Mobile App Development	This is a test inquiry to check the email system.	2025-06-29 04:53:57.804	IN_PROGRESS	2025-06-29 04:57:27.857	\N
cmch7k62s0000rqm51t2p3m1w	Test User 3	javier@vyoniq.com	AI Integrations	Testing inquiry system after fixing the params issue.	2025-06-29 05:07:01.443	PENDING	2025-06-29 05:07:01.443	\N
cmch7ss850003rqm5ybup2ogb	Debug Test	javier@vyoniq.com	Web & Mobile App Development	Testing with detailed logging to debug email issue.	2025-06-29 05:13:42.629	PENDING	2025-06-29 05:13:42.629	\N
cmch7tk1l0000rqxke8ua2mpq	Debug Test 2	javier@vyoniq.com	AI Integrations	Testing again with fresh server logs.	2025-06-29 05:14:19.45	PENDING	2025-06-29 05:14:19.45	\N
cmch7ui5l0003rqxk46n7h4ci	Final Test	javier@vyoniq.com	Hosting Services	Testing with verified Resend domain to ensure email delivery.	2025-06-29 05:15:03.584	PENDING	2025-06-29 05:15:03.584	\N
cmch7zb1e0006rqxkdg41tgde	JavierTesting	jgongora@gmail.com	hosting	I want hosting sercvices.	2025-06-29 05:18:47.645	PENDING	2025-06-29 06:00:26.861	user_2yVeqlMcOtV5WEAws4BeMoDFYVh
cmch86qqo0009rqxkdgv7tj4m	AnotherUserText	jgongora@gmail.com	vyoniq-apps	I want more info about vyoniq apps.	2025-06-29 05:24:34.083	IN_PROGRESS	2025-07-04 03:47:34.624	user_2yVeqlMcOtV5WEAws4BeMoDFYVh
\.


--
-- Data for Name: InquiryMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InquiryMessage" (id, "inquiryId", message, "isFromAdmin", "authorId", "createdAt") FROM stdin;
cmch73djo0002rqnml21vnead	cmch73df00000rqnmat45gp4n	This is a test inquiry to check the email system.	f	\N	2025-06-29 04:53:57.972
cmch77vcb0001rqjjx3ohnt5n	cmch73df00000rqnmat45gp4n	Test response from Vyoniq platform.	t	user_2yQbLBJukarNLRkMZ4okDc84wLh	2025-06-29 04:57:27.659
cmch7k69t0002rqm56rvkabcb	cmch7k62s0000rqm51t2p3m1w	Testing inquiry system after fixing the params issue.	f	\N	2025-06-29 05:07:01.696
cmch7ssdg0005rqm54umkuzzx	cmch7ss850003rqm5ybup2ogb	Testing with detailed logging to debug email issue.	f	\N	2025-06-29 05:13:43.588
cmch7tk5s0002rqxkghw4rjl1	cmch7tk1l0000rqxke8ua2mpq	Testing again with fresh server logs.	f	\N	2025-06-29 05:14:19.6
cmch7ui7k0005rqxk38aa80tq	cmch7ui5l0003rqxk46n7h4ci	Testing with verified Resend domain to ensure email delivery.	f	\N	2025-06-29 05:15:03.728
cmch7zb3d0008rqxkurncai4w	cmch7zb1e0006rqxkdg41tgde	I want hosting sercvices.	f	\N	2025-06-29 05:18:47.785
cmch86qur000brqxk9yzwl7y0	cmch86qqo0009rqxkdgv7tj4m	I want more info about vyoniq apps.	f	\N	2025-06-29 05:24:34.803
cmch9ihcm0001rqvcx9een8p0	cmch86qqo0009rqxkdgv7tj4m	Hi, I will provide more info about vyoniq apps.	t	user_2yQbLBJukarNLRkMZ4okDc84wLh	2025-06-29 06:01:41.974
\.


--
-- Data for Name: Newsletter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Newsletter" (id, subject, content, "previewText", "isDraft", "sentAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "budgetId", "stripePaymentId", "stripeSessionId", amount, currency, status, "paymentMethod", "paidAt", "refundedAt", "failedAt", "failureReason", "stripeClientSecret", metadata, "createdAt", "updatedAt") FROM stdin;
cmco892u60001rq035paw3son	cmco6hc430001rqzlfgm25ezp	\N	cs_test_a1NEJf1YG7YWgiWtEdtFQpqaQKGTDyLDSbyUycXvQPodmE0le2diCnYWJ9	550.00	USD	PENDING	\N	\N	\N	\N	\N	\N	\N	2025-07-04 03:00:46.877	2025-07-04 03:00:46.877
cmco9wej30001rq95fzesgizq	cmco6hc430001rqzlfgm25ezp	pi_3Rh0b1PeTGX8Odpe0O03tgn0	cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS	550.00	USD	SUCCEEDED	card	2025-07-04 03:47:33.217	\N	\N	\N	\N	{"id": "cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS", "url": null, "mode": "payment", "locale": null, "object": "checkout.session", "status": "complete", "consent": null, "created": 1751600814, "invoice": null, "ui_mode": "hosted", "currency": "usd", "customer": null, "livemode": false, "metadata": {"userId": "user_2yQbLBJukarNLRkMZ4okDc84wLh", "budgetId": "cmco6hc430001rqzlfgm25ezp", "inquiryId": "cmch86qqo0009rqxkdgv7tj4m"}, "discounts": [], "cancel_url": "http://localhost:3000/dashboard/budgets/cmco6hc430001rqzlfgm25ezp", "expires_at": 1751687214, "custom_text": {"submit": null, "after_submit": null, "shipping_address": null, "terms_of_service_acceptance": null}, "permissions": null, "submit_type": null, "success_url": "http://localhost:3000/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}", "amount_total": 55000, "payment_link": null, "setup_intent": null, "subscription": null, "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null}, "client_secret": null, "custom_fields": [], "shipping_cost": null, "total_details": {"amount_tax": 0, "amount_discount": 0, "amount_shipping": 0}, "customer_email": "jgongora@gmail.com", "origin_context": null, "payment_intent": "pi_3Rh0b1PeTGX8Odpe0O03tgn0", "payment_status": "paid", "recovered_from": null, "wallet_options": null, "amount_subtotal": 55000, "adaptive_pricing": {"enabled": true}, "after_expiration": null, "customer_details": {"name": "424242424242", "email": "jgongora@gmail.com", "phone": null, "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}, "tax_ids": [], "tax_exempt": "none"}, "invoice_creation": {"enabled": false, "invoice_data": {"footer": null, "issuer": null, "metadata": {}, "description": null, "custom_fields": null, "account_tax_ids": null, "rendering_options": null}}, "shipping_options": [], "customer_creation": "if_required", "consent_collection": null, "client_reference_id": null, "currency_conversion": null, "payment_method_types": ["card"], "allow_promotion_codes": null, "collected_information": {"shipping_details": {"name": "424242424242", "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}}}, "payment_method_options": {"card": {"request_three_d_secure": "automatic"}}, "phone_number_collection": {"enabled": false}, "payment_method_collection": "if_required", "billing_address_collection": "required", "shipping_address_collection": {"allowed_countries": ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT"]}, "saved_payment_method_options": null, "payment_method_configuration_details": null}	2025-07-04 03:46:54.734	2025-07-04 03:47:33.219
\.


--
-- Data for Name: ServicePricing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServicePricing" (id, "serviceType", name, description, "basePrice", currency, "billingType", features, "isActive", customizable, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, "isAdmin", "isNewsletterSubscriber", "createdAt", "unsubscribeToken") FROM stdin;
user_2zAYZ1Gsg3WQyGTJx6oLYzPSHNP			f	f	2025-06-29 05:36:56.832	\N
user_2yVeqlMcOtV5WEAws4BeMoDFYVh	jgongora@gmail.com	Javier Gongora	t	t	2025-06-13 04:40:45.139	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
126e6bc1-c692-42bb-84f9-1298461e5b7e	568fcbb4ce59b17bf352c7153da90ddc62ad6e855e98dd8608401f133a433c9c	\N	20250703193433_baseline	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250703193433_baseline\n\nDatabase error code: 42P01\n\nDatabase error:\nERROR: relation "public._prisma_migrations" does not exist\n\nPosition:\n[1m472[0m INSERT INTO public."InquiryMessage" VALUES ('cmch7zb3d0008rqxkurncai4w', 'cmch7zb1e0006rqxkdg41tgde', 'I want hosting sercvices.', false, NULL, '2025-06-29 05:18:47.785');\n[1m473[0m INSERT INTO public."InquiryMessage" VALUES ('cmch86qur000brqxk9yzwl7y0', 'cmch86qqo0009rqxkdgv7tj4m', 'I want more info about vyoniq apps.', false, NULL, '2025-06-29 05:24:34.803');\n[1m474[0m INSERT INTO public."InquiryMessage" VALUES ('cmch9ihcm0001rqvcx9een8p0', 'cmch86qqo0009rqxkdgv7tj4m', 'Hi, I will provide more info about vyoniq apps.', true, 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-06-29 06:01:41.974');\n[1m475[0m INSERT INTO public."Payment" VALUES ('cmco892u60001rq035paw3son', 'cmco6hc430001rqzlfgm25ezp', NULL, 'cs_test_a1NEJf1YG7YWgiWtEdtFQpqaQKGTDyLDSbyUycXvQPodmE0le2diCnYWJ9', 550.00, 'USD', 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-04 03:00:46.877', '2025-07-04 03:00:46.877');\n[1m476[0m INSERT INTO public."Payment" VALUES ('cmco9wej30001rq95fzesgizq', 'cmco6hc430001rqzlfgm25ezp', 'pi_3Rh0b1PeTGX8Odpe0O03tgn0', 'cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS', 550.00, 'USD', 'SUCCEEDED', 'card', '2025-07-04 03:47:33.217', NULL, NULL, NULL, NULL, '{"id": "cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS", "url": null, "mode": "payment", "locale": null, "object": "checkout.session", "status": "complete", "consent": null, "created": 1751600814, "invoice": null, "ui_mode": "hosted", "currency": "usd", "customer": null, "livemode": false, "metadata": {"userId": "user_2yQbLBJukarNLRkMZ4okDc84wLh", "budgetId": "cmco6hc430001rqzlfgm25ezp", "inquiryId": "cmch86qqo0009rqxkdgv7tj4m"}, "discounts": [], "cancel_url": "http://localhost:3000/dashboard/budgets/cmco6hc430001rqzlfgm25ezp", "expires_at": 1751687214, "custom_text": {"submit": null, "after_submit": null, "shipping_address": null, "terms_of_service_acceptance": null}, "permissions": null, "submit_type": null, "success_url": "http://localhost:3000/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}", "amount_total": 55000, "payment_link": null, "setup_intent": null, "subscription": null, "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null}, "client_secret": null, "custom_fields": [], "shipping_cost": null, "total_details": {"amount_tax": 0, "amount_discount": 0, "amount_shipping": 0}, "customer_email": "jgongora@gmail.com", "origin_context": null, "payment_intent": "pi_3Rh0b1PeTGX8Odpe0O03tgn0", "payment_status": "paid", "recovered_from": null, "wallet_options": null, "amount_subtotal": 55000, "adaptive_pricing": {"enabled": true}, "after_expiration": null, "customer_details": {"name": "424242424242", "email": "jgongora@gmail.com", "phone": null, "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}, "tax_ids": [], "tax_exempt": "none"}, "invoice_creation": {"enabled": false, "invoice_data": {"footer": null, "issuer": null, "metadata": {}, "description": null, "custom_fields": null, "account_tax_ids": null, "rendering_options": null}}, "shipping_options": [], "customer_creation": "if_required", "consent_collection": null, "client_reference_id": null, "currency_conversion": null, "payment_method_types": ["card"], "allow_promotion_codes": null, "collected_information": {"shipping_details": {"name": "424242424242", "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}}}, "payment_method_options": {"card": {"request_three_d_secure": "automatic"}}, "phone_number_collection": {"enabled": false}, "payment_method_collection": "if_required", "billing_address_collection": "required", "shipping_address_collection": {"allowed_countries": ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT"]}, "saved_payment_method_options": null, "payment_method_configuration_details": null}', '2025-07-04 03:46:54.734', '2025-07-04 03:47:33.219');\n[1m477[1;31m INSERT INTO public._prisma_migrations VALUES ('75a24d4d-9133-4cd5-a732-23aa1fe92748', '71ff0f569f6301bd654a86512548eab34452e7f9026b2382e9fe3154fa005011', '2025-07-04 02:35:01.263795+00', '20250703193433_baseline', '', NULL, '2025-07-04 02:35:01.263795+00', 0);[0m\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42P01), message: "relation \\"public._prisma_migrations\\" does not exist", detail: None, hint: None, position: Some(Original(28898)), where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("parse_relation.c"), line: Some(1428), routine: Some("parserOpenTable") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250703193433_baseline"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20250703193433_baseline"\n             at schema-engine/commands/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:231	2025-07-11 03:03:41.785137+00	2025-07-11 03:00:56.941424+00	0
1a4185ca-5dee-4748-ad01-6b2ca6485f3c	4793f5a629192592c4b6b4a27f6ca2675acf24ea52fa4aa36fd7cd4fc1e998d5	2025-07-11 03:04:15.168374+00	20250703193433_baseline	\N	\N	2025-07-11 03:04:14.372045+00	1
d39d848c-bd3a-434e-b3e2-4b58ebb7e524	8d799ffd3a0bc3735dedf7fed73e9f22cafdbf92ea37a4997299aa80a12f3325	2025-07-11 17:31:44.445745+00	20250711080826_remove_waitlist_feature	\N	\N	2025-07-11 17:31:44.415997+00	1
\.


--
-- Name: ApiKey ApiKey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiKey"
    ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY (id);


--
-- Name: BlogAuthor BlogAuthor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogAuthor"
    ADD CONSTRAINT "BlogAuthor_pkey" PRIMARY KEY (id);


--
-- Name: BlogCategory BlogCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogCategory"
    ADD CONSTRAINT "BlogCategory_pkey" PRIMARY KEY (id);


--
-- Name: BlogPostCategory BlogPostCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPostCategory"
    ADD CONSTRAINT "BlogPostCategory_pkey" PRIMARY KEY ("blogPostId", "categoryId");


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: BudgetItem BudgetItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BudgetItem"
    ADD CONSTRAINT "BudgetItem_pkey" PRIMARY KEY (id);


--
-- Name: Budget Budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_pkey" PRIMARY KEY (id);


--
-- Name: InquiryMessage InquiryMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InquiryMessage"
    ADD CONSTRAINT "InquiryMessage_pkey" PRIMARY KEY (id);


--
-- Name: Inquiry Inquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiry"
    ADD CONSTRAINT "Inquiry_pkey" PRIMARY KEY (id);


--
-- Name: Newsletter Newsletter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Newsletter"
    ADD CONSTRAINT "Newsletter_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: ServicePricing ServicePricing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServicePricing"
    ADD CONSTRAINT "ServicePricing_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ApiKey_hashedKey_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ApiKey_hashedKey_idx" ON public."ApiKey" USING btree ("hashedKey");


--
-- Name: ApiKey_hashedKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON public."ApiKey" USING btree ("hashedKey");


--
-- Name: ApiKey_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ApiKey_userId_idx" ON public."ApiKey" USING btree ("userId");


--
-- Name: BlogCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogCategory_name_key" ON public."BlogCategory" USING btree (name);


--
-- Name: BlogCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogCategory_slug_key" ON public."BlogCategory" USING btree (slug);


--
-- Name: BlogPost_publishDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_publishDate_idx" ON public."BlogPost" USING btree ("publishDate");


--
-- Name: BlogPost_published_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_published_idx" ON public."BlogPost" USING btree (published);


--
-- Name: BlogPost_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_slug_idx" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: BudgetItem_budgetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BudgetItem_budgetId_idx" ON public."BudgetItem" USING btree ("budgetId");


--
-- Name: Budget_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Budget_createdAt_idx" ON public."Budget" USING btree ("createdAt");


--
-- Name: Budget_inquiryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Budget_inquiryId_idx" ON public."Budget" USING btree ("inquiryId");


--
-- Name: Budget_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Budget_status_idx" ON public."Budget" USING btree (status);


--
-- Name: InquiryMessage_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InquiryMessage_createdAt_idx" ON public."InquiryMessage" USING btree ("createdAt");


--
-- Name: InquiryMessage_inquiryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InquiryMessage_inquiryId_idx" ON public."InquiryMessage" USING btree ("inquiryId");


--
-- Name: Inquiry_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Inquiry_createdAt_idx" ON public."Inquiry" USING btree ("createdAt");


--
-- Name: Inquiry_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Inquiry_email_idx" ON public."Inquiry" USING btree (email);


--
-- Name: Inquiry_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Inquiry_status_idx" ON public."Inquiry" USING btree (status);


--
-- Name: Payment_budgetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_budgetId_idx" ON public."Payment" USING btree ("budgetId");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: Payment_stripePaymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_stripePaymentId_idx" ON public."Payment" USING btree ("stripePaymentId");


--
-- Name: Payment_stripePaymentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_stripePaymentId_key" ON public."Payment" USING btree ("stripePaymentId");


--
-- Name: Payment_stripeSessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_stripeSessionId_idx" ON public."Payment" USING btree ("stripeSessionId");


--
-- Name: Payment_stripeSessionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON public."Payment" USING btree ("stripeSessionId");


--
-- Name: ServicePricing_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServicePricing_isActive_idx" ON public."ServicePricing" USING btree ("isActive");


--
-- Name: ServicePricing_serviceType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServicePricing_serviceType_idx" ON public."ServicePricing" USING btree ("serviceType");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_unsubscribeToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_unsubscribeToken_key" ON public."User" USING btree ("unsubscribeToken");


--
-- Name: ApiKey ApiKey_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiKey"
    ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlogPostCategory BlogPostCategory_blogPostId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPostCategory"
    ADD CONSTRAINT "BlogPostCategory_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlogPostCategory BlogPostCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPostCategory"
    ADD CONSTRAINT "BlogPostCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."BlogCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlogPost BlogPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."BlogAuthor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BudgetItem BudgetItem_budgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BudgetItem"
    ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES public."Budget"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetItem BudgetItem_servicePricingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BudgetItem"
    ADD CONSTRAINT "BudgetItem_servicePricingId_fkey" FOREIGN KEY ("servicePricingId") REFERENCES public."ServicePricing"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Budget Budget_inquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES public."Inquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InquiryMessage InquiryMessage_inquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InquiryMessage"
    ADD CONSTRAINT "InquiryMessage_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES public."Inquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inquiry Inquiry_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiry"
    ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_budgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES public."Budget"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

