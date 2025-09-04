-- Add Subscription System
-- This migration adds the complete subscription system including:
-- - SubscriptionStatus and SubscriptionPaymentStatus enums
-- - Subscription, SubscriptionItem, and SubscriptionPayment tables
-- - Foreign key relationships and indexes

-- CreateEnum: SubscriptionStatus
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'ACTIVE', 'CANCELLED', 'PAST_DUE', 'COMPLETED');

-- CreateEnum: SubscriptionPaymentStatus
CREATE TYPE "public"."SubscriptionPaymentStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'UNPAID', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'PAUSED');

-- CreateTable: Subscription
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "monthlyAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "adminNotes" TEXT,
    "clientNotes" TEXT,
    "createdById" TEXT NOT NULL,
    "billingInterval" TEXT NOT NULL DEFAULT 'month',
    "trialPeriodDays" INTEGER DEFAULT 0,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SubscriptionItem
CREATE TABLE "public"."SubscriptionItem" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "servicePricingId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SubscriptionPayment
CREATE TABLE "public"."SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "public"."SubscriptionPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- Add relation to ServicePricing for SubscriptionItems
ALTER TABLE "public"."ServicePricing" ADD COLUMN IF NOT EXISTS "subscriptionItems" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create Indexes for Subscription
CREATE INDEX "Subscription_inquiryId_idx" ON "public"."Subscription"("inquiryId");
CREATE INDEX "Subscription_status_idx" ON "public"."Subscription"("status");
CREATE INDEX "Subscription_createdAt_idx" ON "public"."Subscription"("createdAt");

-- Create Indexes for SubscriptionItem
CREATE INDEX "SubscriptionItem_subscriptionId_idx" ON "public"."SubscriptionItem"("subscriptionId");

-- Create Indexes for SubscriptionPayment
CREATE UNIQUE INDEX "SubscriptionPayment_stripeSubscriptionId_key" ON "public"."SubscriptionPayment"("stripeSubscriptionId");
CREATE INDEX "SubscriptionPayment_subscriptionId_idx" ON "public"."SubscriptionPayment"("subscriptionId");
CREATE INDEX "SubscriptionPayment_status_idx" ON "public"."SubscriptionPayment"("status");
CREATE INDEX "SubscriptionPayment_stripeSubscriptionId_idx" ON "public"."SubscriptionPayment"("stripeSubscriptionId");
CREATE INDEX "SubscriptionPayment_stripeCustomerId_idx" ON "public"."SubscriptionPayment"("stripeCustomerId");

-- Add Foreign Key Constraints
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "public"."Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_servicePricingId_fkey" FOREIGN KEY ("servicePricingId") REFERENCES "public"."ServicePricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add subscription relation to Inquiry (this should already exist but adding for completeness)
-- Note: This is handled by the foreign key on Subscription.inquiryId
