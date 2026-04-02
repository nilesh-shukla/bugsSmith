-- Safe migration: add nullable column, backfill, then set NOT NULL
BEGIN;
ALTER TABLE "User" ADD COLUMN "name" TEXT;
-- Backfill existing rows from email local-part
UPDATE "User" SET "name" = split_part("email", '@', 1) WHERE "name" IS NULL;
-- Ensure no NULLs remain, then set NOT NULL
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
COMMIT;
