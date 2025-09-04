-- Add PAID to InquiryStatus enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'InquiryStatus'
      AND e.enumlabel = 'PAID'
  ) THEN
    ALTER TYPE "public"."InquiryStatus" ADD VALUE 'PAID';
  END IF;
END
$$;
