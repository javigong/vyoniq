-- ============================================================================
-- BASELINE MIGRATION: Reset and Create Complete Database Schema
-- WARNING: This will DELETE ALL existing data and schemas
-- ============================================================================

-- Drop all existing tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "BudgetItem" CASCADE;
DROP TABLE IF EXISTS "Budget" CASCADE;
DROP TABLE IF EXISTS "ServicePricing" CASCADE;
DROP TABLE IF EXISTS "BlogPostCategory" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "BlogCategory" CASCADE;
DROP TABLE IF EXISTS "BlogAuthor" CASCADE;
DROP TABLE IF EXISTS "Newsletter" CASCADE;
DROP TABLE IF EXISTS "InquiryMessage" CASCADE;
DROP TABLE IF EXISTS "Inquiry" CASCADE;
DROP TABLE IF EXISTS "ApiKey" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop Prisma migration history (will be recreated)
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

-- Drop custom types/enums
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "BudgetStatus" CASCADE;
DROP TYPE IF EXISTS "InquiryStatus" CASCADE;

-- ============================================================================
-- CREATE NEW SCHEMA
-- ============================================================================

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'PAID', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isOnWaitlist" BOOLEAN NOT NULL DEFAULT false,
    "isNewsletterSubscriber" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribeToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedKey" TEXT NOT NULL,
    "keyPreview" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY['blog:read', 'blog:write']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryMessage" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isFromAdmin" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "previewText" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogAuthor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL,
    "readTime" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tintColor" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostCategory" (
    "blogPostId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "BlogPostCategory_pkey" PRIMARY KEY ("blogPostId","categoryId")
);

-- CreateTable
CREATE TABLE "ServicePricing" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingType" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "customizable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "BudgetStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "adminNotes" TEXT,
    "clientNotes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "servicePricingId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "stripeSessionId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "stripeClientSecret" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_unsubscribeToken_key" ON "User"("unsubscribeToken");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON "ApiKey"("hashedKey");

-- CreateIndex
CREATE INDEX "ApiKey_hashedKey_idx" ON "ApiKey"("hashedKey");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "Inquiry_email_idx" ON "Inquiry"("email");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

-- CreateIndex
CREATE INDEX "InquiryMessage_inquiryId_idx" ON "InquiryMessage"("inquiryId");

-- CreateIndex
CREATE INDEX "InquiryMessage_createdAt_idx" ON "InquiryMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_name_key" ON "BlogCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");

-- CreateIndex
CREATE INDEX "BlogPost_publishDate_idx" ON "BlogPost"("publishDate");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "ServicePricing_serviceType_idx" ON "ServicePricing"("serviceType");

-- CreateIndex
CREATE INDEX "ServicePricing_isActive_idx" ON "ServicePricing"("isActive");

-- CreateIndex
CREATE INDEX "Budget_inquiryId_idx" ON "Budget"("inquiryId");

-- CreateIndex
CREATE INDEX "Budget_status_idx" ON "Budget"("status");

-- CreateIndex
CREATE INDEX "Budget_createdAt_idx" ON "Budget"("createdAt");

-- CreateIndex
CREATE INDEX "BudgetItem_budgetId_idx" ON "BudgetItem"("budgetId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentId_key" ON "Payment"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Payment_budgetId_idx" ON "Payment"("budgetId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_stripePaymentId_idx" ON "Payment"("stripePaymentId");

-- CreateIndex
CREATE INDEX "Payment_stripeSessionId_idx" ON "Payment"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryMessage" ADD CONSTRAINT "InquiryMessage_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostCategory" ADD CONSTRAINT "BlogPostCategory_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostCategory" ADD CONSTRAINT "BlogPostCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_servicePricingId_fkey" FOREIGN KEY ("servicePricingId") REFERENCES "ServicePricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO public."User" VALUES ('user_2yQbLBJukarNLRkMZ4okDc84wLh', 'jgongora@gmail.com', 'Javier Gongora', true, true, true, '2025-06-13 04:40:45.139', NULL);
INSERT INTO public."User" VALUES ('user_2zAYZ1Gsg3WQyGTJx6oLYzPSHNP', '', '', false, false, false, '2025-06-29 05:36:56.832', NULL);
INSERT INTO public."ApiKey" VALUES ('cmce1m4sa0001rqpln6tmlyy7', 'Test API Key', '$2b$12$w.wd75kAfKA/bRCdRLw/eO1BxWk/5y5eFQoHP9orXOAvHK2hiRzN.', 'vyoniq_sk_3b***', 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '{blog:read,blog:write}', true, NULL, '2025-06-26 23:57:16.859', '2025-06-26 23:57:16.859');
INSERT INTO public."ApiKey" VALUES ('cmce2uhln0001rq59al00hrm6', 'Test API Key', '$2b$12$pSKu1ckDtd64R342OJUQn.dlHShOYXFswmRaqSShn2h6Ye8XowZgG', 'vyoniq_sk_65***', 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '{blog:read,blog:write}', true, '2025-06-27 03:26:32.386', '2025-06-27 00:31:46.328', '2025-06-27 03:26:32.386');
INSERT INTO public."BlogAuthor" VALUES ('cmcdwvy800000rq02usmp8q8l', 'Javier Gongora', '/javier.jpeg', 'Founder & Software Developer', 'Founder and lead developer at Vyoniq, specializing in AI-powered applications and enterprise software solutions.', '2025-06-26 21:44:56.833', '2025-06-26 21:44:56.833');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvyc30001rq02dh0ctac3', 'Cursor & AI IDEs', 'cursor--ai-ides', '2025-06-26 21:44:56.98');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvysh0002rq028vyzi2dk', 'AI Development Tools', 'ai-development-tools', '2025-06-26 21:44:57.569');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvz2c0003rq02nagpr1hf', 'Industry Trends', 'industry-trends', '2025-06-26 21:44:57.924');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvzde0004rq02ihx2aqrx', 'MCP Servers', 'mcp-servers', '2025-06-26 21:44:58.322');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvzoa0005rq02hi0fx3vs', 'LLM Integration', 'llm-integration', '2025-06-26 21:44:58.714');
INSERT INTO public."BlogCategory" VALUES ('cmcdwvzy50006rq02osjux56m', 'Enterprise Architecture', 'enterprise-architecture', '2025-06-26 21:44:59.069');
INSERT INTO public."BlogCategory" VALUES ('cmcdww08h0007rq023w6eydu7', 'AI Agents', 'ai-agents', '2025-06-26 21:44:59.442');
INSERT INTO public."BlogCategory" VALUES ('cmcdww0ig0008rq02qawnmxwx', 'Business Automation', 'business-automation', '2025-06-26 21:44:59.801');
INSERT INTO public."BlogCategory" VALUES ('cmcdww0sd0009rq025hasoq3c', 'Case Studies', 'case-studies', '2025-06-26 21:45:00.158');

INSERT INTO public."BlogPost" VALUES ('cmcdww12x000brq028ueh8yut', 'cursor-ai-development-revolution', 'How Cursor is Revolutionizing AI-Powered Development', $$Explore how Cursor's AI-first approach is transforming the development experience with intelligent code completion, chat-driven programming, and seamless LLM integration.$$, $$
# How Cursor is Revolutionizing AI-Powered Development

Cursor is not just another code editor; it's an AI-first development environment designed to augment developer productivity. By integrating Large Language Models (LLMs) at its core, Cursor provides a suite of tools that go beyond simple autocompletion.

## Key Features

- **Chat-Driven Programming**: Interact with your codebase using natural language.
- **Intelligent Code Generation**: Generate complex code blocks from simple prompts.
- **Seamless Debugging**: AI-assisted debugging to identify and fix issues faster.
$$, '/blog/cursor-revolution.jpg', '2025-06-20 00:00:00', 6, true, NULL, true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:00.565', '2025-06-26 21:45:00.565');

INSERT INTO public."BlogPost" VALUES ('cmcdww1p6000drq02w55ae3ni', 'mcp-servers-llm-integration', 'MCP Servers: The Future of LLM Integration', $$Discover how Model Context Protocol (MCP) servers are revolutionizing LLM integration, enabling seamless data access and intelligent automation across applications.$$, $$
# MCP Servers: The Future of LLM Integration

The Model Context Protocol (MCP) provides a standardized way for applications to securely interact with various data sources. This enables LLMs to access real-time, context-aware information, leading to more accurate and relevant responses.

## Why MCP Matters

- **Standardization**: A common protocol for diverse data sources.
- **Security**: Securely expose data without compromising privacy.
- **Scalability**: Build scalable and maintainable AI integrations.
$$, '/blog/mcp-future.jpg', '2025-05-15 00:00:00', 8, true, NULL, true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:00.957', '2025-06-26 21:45:00.957');

INSERT INTO public."BlogPost" VALUES ('cmcdww21s000frq02cwt2kvml', 'ai-agents-business-automation', 'AI Agents: Transforming Business Process Automation', $$Learn how AI agents powered by LLMs are revolutionizing business automation, from customer service to complex workflow orchestration.$$, $$
# AI Agents: Transforming Business Process Automation

AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. When powered by LLMs, these agents can handle complex, multi-step tasks that were previously impossible to automate.

## Use Cases

- **Automated Customer Support**: Resolve customer inquiries without human intervention.
- **Workflow Orchestration**: Manage complex business processes across multiple systems.
- **Data Analysis**: Automatically gather, analyze, and report on business data.
$$, '/blog/ai-agents.jpg', '2025-04-10 00:00:00', 10, false, NULL, true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:01.319', '2025-06-26 21:45:01.319');

INSERT INTO public."BlogPost" VALUES ('cmcdww2dg000hrq021e3na4b6', 'llm-integration-enterprise-applications', 'Best Practices for LLM Integration in Enterprise Applications', $$A comprehensive guide to integrating Large Language Models into enterprise applications, covering security, scalability, and performance considerations.$$, $$
# Best Practices for LLM Integration in Enterprise Applications

Integrating LLMs into enterprise systems requires careful planning. This guide covers the essential best practices to ensure a successful and secure implementation.

## Key Considerations

- **Data Privacy**: Ensure sensitive data is not exposed to third-party models.
- **Model Fine-Tuning**: Fine-tune models on your own data for improved accuracy.
- **Cost Management**: Monitor and control API usage to avoid unexpected costs.
$$, '/blog/llm-enterprise.jpg', '2025-03-05 00:00:00', 7, false, NULL, true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:01.711', '2025-06-26 21:45:01.711');

INSERT INTO public."BlogPost" VALUES ('cmcdww2nl000jrq027bc748ok', 'ai-development-tools-ecosystem', 'The Modern AI Development Tools Ecosystem', $$Explore the rapidly evolving landscape of AI development tools, from code editors to deployment platforms, and how they're shaping the future of software development.$$, $$
# The Modern AI Development Tools Ecosystem

The AI development landscape is constantly evolving. This post provides an overview of the key tools and platforms that are shaping the future of AI-powered software development.

## Tools to Watch

- **Cursor**: An AI-first code editor.
- **LangChain**: A framework for building LLM-powered applications.
- **Vercel AI SDK**: A library for building AI-powered user interfaces.
$$, '/blog/ai-tools.jpg', '2025-02-01 00:00:00', 9, false, NULL, true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-26 21:45:02.115', '2025-06-26 21:45:02.115');

INSERT INTO public."BlogPost" VALUES ('cmce9396n0001rq4h5xh0eyt0', 'building-a-production-ready-mcp-server-with-nextjs-a-complete-implementation-guide', 'Building a Production-Ready MCP Server with Next.js: A Complete Implementation Guide', $$Learn how to build a robust Model Context Protocol (MCP) server using Next.js without Vercel deployment. This comprehensive guide covers everything from schema design to authentication, based on real-world implementation experience with the Vyoniq MCP server.$$, $$# Building a Production-Ready MCP Server with Next.js: A Complete Implementation Guide

This guide provides a step-by-step walkthrough of building a production-ready MCP server using Next.js.

## Topics Covered

-   Schema design with Zod
-   Authentication and authorization
-   JSON-RPC protocol implementation
-   Tool and resource management
-   Testing and debugging strategies
$$, '/blog/mcp-guide.jpg', '2025-01-15 00:00:00', 12, true, NULL, true, 'cmcdwvy800000rq02usmp8q8l', '2025-06-27 19:35:46.438', '2025-06-27 19:35:46.438');

INSERT INTO public."BlogPostCategory" VALUES ('cmcdww12x000brq028ueh8yut', 'cmcdwvyc30001rq02dh0ctac3');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww12x000brq028ueh8yut', 'cmcdwvysh0002rq028vyzi2dk');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww12x000brq028ueh8yut', 'cmcdwvz2c0003rq02nagpr1hf');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww1p6000drq02w55ae3ni', 'cmcdwvzde0004rq02ihx2aqrx');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww1p6000drq02w55ae3ni', 'cmcdwvzoa0005rq02hi0fx3vs');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww1p6000drq02w55ae3ni', 'cmcdwvzy50006rq02osjux56m');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww21s000frq02cwt2kvml', 'cmcdww08h0007rq023w6eydu7');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww21s000frq02cwt2kvml', 'cmcdww0ig0008rq02qawnmxwx');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww21s000frq02cwt2kvml', 'cmcdwvzoa0005rq02hi0fx3vs');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2dg000hrq021e3na4b6', 'cmcdwvzoa0005rq02hi0fx3vs');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2dg000hrq021e3na4b6', 'cmcdww0sd0009rq025hasoq3c');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2dg000hrq021e3na4b6', 'cmcdwvz2c0003rq02nagpr1hf');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2nl000jrq027bc748ok', 'cmcdwvysh0002rq028vyzi2dk');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2nl000jrq027bc748ok', 'cmcdwvyc30001rq02dh0ctac3');
INSERT INTO public."BlogPostCategory" VALUES ('cmcdww2nl000jrq027bc748ok', 'cmcdwvz2c0003rq02nagpr1hf');
INSERT INTO public."Inquiry" VALUES ('cmch73df00000rqnmat45gp4n', 'Test User', 'javier@vyoniq.com', 'Web & Mobile App Development', 'This is a test inquiry to check the email system.', '2025-06-29 04:53:57.804', 'IN_PROGRESS', '2025-06-29 04:57:27.857', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7k62s0000rqm51t2p3m1w', 'Test User 3', 'javier@vyoniq.com', 'AI Integrations', 'Testing inquiry system after fixing the params issue.', '2025-06-29 05:07:01.443', 'PENDING', '2025-06-29 05:07:01.443', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7ss850003rqm5ybup2ogb', 'Debug Test', 'javier@vyoniq.com', 'Web & Mobile App Development', 'Testing with detailed logging to debug email issue.', '2025-06-29 05:13:42.629', 'PENDING', '2025-06-29 05:13:42.629', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7tk1l0000rqxke8ua2mpq', 'Debug Test 2', 'javier@vyoniq.com', 'AI Integrations', 'Testing again with fresh server logs.', '2025-06-29 05:14:19.45', 'PENDING', '2025-06-29 05:14:19.45', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7ui5l0003rqxk46n7h4ci', 'Final Test', 'javier@vyoniq.com', 'Hosting Services', 'Testing with verified Resend domain to ensure email delivery.', '2025-06-29 05:15:03.584', 'PENDING', '2025-06-29 05:15:03.584', NULL);
INSERT INTO public."Inquiry" VALUES ('cmch7zb1e0006rqxkdg41tgde', 'JavierTesting', 'jgongora@gmail.com', 'hosting', 'I want hosting sercvices.', '2025-06-29 05:18:47.645', 'PENDING', '2025-06-29 06:00:26.861', 'user_2yQbLBJukarNLRkMZ4okDc84wLh');
INSERT INTO public."Inquiry" VALUES ('cmch86qqo0009rqxkdgv7tj4m', 'AnotherUserText', 'jgongora@gmail.com', 'vyoniq-apps', 'I want more info about vyoniq apps.', '2025-06-29 05:24:34.083', 'IN_PROGRESS', '2025-07-04 03:47:34.624', 'user_2yQbLBJukarNLRkMZ4okDc84wLh');
INSERT INTO public."Budget" VALUES ('cmco6hc430001rqzlfgm25ezp', 'cmch86qqo0009rqxkdgv7tj4m', 'Vyoniq App Budget Test', 'Vyoniq App Budget Test', 550.00, 'USD', 'PAID', '2025-07-31 00:00:00', '', '', 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-07-04 02:11:12.915', '2025-07-04 03:47:33.88');
INSERT INTO public."BudgetItem" VALUES ('cmco6hc430002rqzldmy0ix21', 'cmco6hc430001rqzlfgm25ezp', NULL, 'Website', '', 1, 550.00, 550.00, true, 'development', '2025-07-04 02:11:12.915');
INSERT INTO public."InquiryMessage" VALUES ('cmch73djo0002rqnml21vnead', 'cmch73df00000rqnmat45gp4n', 'This is a test inquiry to check the email system.', false, NULL, '2025-06-29 04:53:57.972');
INSERT INTO public."InquiryMessage" VALUES ('cmch77vcb0001rqjjx3ohnt5n', 'cmch73df00000rqnmat45gp4n', 'Test response from Vyoniq platform.', true, 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-06-29 04:57:27.659');
INSERT INTO public."InquiryMessage" VALUES ('cmch7k69t0002rqm56rvkabcb', 'cmch7k62s0000rqm51t2p3m1w', 'Testing inquiry system after fixing the params issue.', false, NULL, '2025-06-29 05:07:01.696');
INSERT INTO public."InquiryMessage" VALUES ('cmch7ssdg0005rqm54umkuzzx', 'cmch7ss850003rqm5ybup2ogb', 'Testing with detailed logging to debug email issue.', false, NULL, '2025-06-29 05:13:43.588');
INSERT INTO public."InquiryMessage" VALUES ('cmch7tk5s0002rqxkghw4rjl1', 'cmch7tk1l0000rqxke8ua2mpq', 'Testing again with fresh server logs.', false, NULL, '2025-06-29 05:14:19.6');
INSERT INTO public."InquiryMessage" VALUES ('cmch7ui7k0005rqxk38aa80tq', 'cmch7ui5l0003rqxk46n7h4ci', 'Testing with verified Resend domain to ensure email delivery.', false, NULL, '2025-06-29 05:15:03.728');
INSERT INTO public."InquiryMessage" VALUES ('cmch7zb3d0008rqxkurncai4w', 'cmch7zb1e0006rqxkdg41tgde', 'I want hosting sercvices.', false, NULL, '2025-06-29 05:18:47.785');
INSERT INTO public."InquiryMessage" VALUES ('cmch86qur000brqxk9yzwl7y0', 'cmch86qqo0009rqxkdgv7tj4m', 'I want more info about vyoniq apps.', false, NULL, '2025-06-29 05:24:34.803');
INSERT INTO public."InquiryMessage" VALUES ('cmch9ihcm0001rqvcx9een8p0', 'cmch86qqo0009rqxkdgv7tj4m', 'Hi, I will provide more info about vyoniq apps.', true, 'user_2yQbLBJukarNLRkMZ4okDc84wLh', '2025-06-29 06:01:41.974');
INSERT INTO public."Payment" VALUES ('cmco892u60001rq035paw3son', 'cmco6hc430001rqzlfgm25ezp', NULL, 'cs_test_a1NEJf1YG7YWgiWtEdtFQpqaQKGTDyLDSbyUycXvQPodmE0le2diCnYWJ9', 550.00, 'USD', 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-04 03:00:46.877', '2025-07-04 03:00:46.877');
INSERT INTO public."Payment" VALUES ('cmco9wej30001rq95fzesgizq', 'cmco6hc430001rqzlfgm25ezp', 'pi_3Rh0b1PeTGX8Odpe0O03tgn0', 'cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS', 550.00, 'USD', 'SUCCEEDED', 'card', '2025-07-04 03:47:33.217', NULL, NULL, NULL, NULL, '{"id": "cs_test_a1udo8HeovLwnEzE68fQxcq0OhxMor2XJV8OEKTxjZ8SECwEdBGdAiU2FS", "url": null, "mode": "payment", "locale": null, "object": "checkout.session", "status": "complete", "consent": null, "created": 1751600814, "invoice": null, "ui_mode": "hosted", "currency": "usd", "customer": null, "livemode": false, "metadata": {"userId": "user_2yQbLBJukarNLRkMZ4okDc84wLh", "budgetId": "cmco6hc430001rqzlfgm25ezp", "inquiryId": "cmch86qqo0009rqxkdgv7tj4m"}, "discounts": [], "cancel_url": "http://localhost:3000/dashboard/budgets/cmco6hc430001rqzlfgm25ezp", "expires_at": 1751687214, "custom_text": {"submit": null, "after_submit": null, "shipping_address": null, "terms_of_service_acceptance": null}, "permissions": null, "submit_type": null, "success_url": "http://localhost:3000/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}", "amount_total": 55000, "payment_link": null, "setup_intent": null, "subscription": null, "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null}, "client_secret": null, "custom_fields": [], "shipping_cost": null, "total_details": {"amount_tax": 0, "amount_discount": 0, "amount_shipping": 0}, "customer_email": "jgongora@gmail.com", "origin_context": null, "payment_intent": "pi_3Rh0b1PeTGX8Odpe0O03tgn0", "payment_status": "paid", "recovered_from": null, "wallet_options": null, "amount_subtotal": 55000, "adaptive_pricing": {"enabled": true}, "after_expiration": null, "customer_details": {"name": "424242424242", "email": "jgongora@gmail.com", "phone": null, "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}, "tax_ids": [], "tax_exempt": "none"}, "invoice_creation": {"enabled": false, "invoice_data": {"footer": null, "issuer": null, "metadata": {}, "description": null, "custom_fields": null, "account_tax_ids": null, "rendering_options": null}}, "shipping_options": [], "customer_creation": "if_required", "consent_collection": null, "client_reference_id": null, "currency_conversion": null, "payment_method_types": ["card"], "allow_promotion_codes": null, "collected_information": {"shipping_details": {"name": "424242424242", "address": {"city": "424242", "line1": "424242", "line2": "424242422", "state": "KY", "country": "US", "postal_code": "42424"}}}, "payment_method_options": {"card": {"request_three_d_secure": "automatic"}}, "phone_number_collection": {"enabled": false}, "payment_method_collection": "if_required", "billing_address_collection": "required", "shipping_address_collection": {"allowed_countries": ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT"]}, "saved_payment_method_options": null, "payment_method_configuration_details": null}', '2025-07-04 03:46:54.734', '2025-07-04 03:47:33.219');
INSERT INTO public._prisma_migrations VALUES ('75a24d4d-9133-4cd5-a732-23aa1fe92748', '71ff0f569f6301bd654a86512548eab34452e7f9026b2382e9fe3154fa005011', '2025-07-04 02:35:01.263795+00', '20250703193433_baseline', '', NULL, '2025-07-04 02:35:01.263795+00', 0);
