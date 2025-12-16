-- AlterTable: Add OAuth fields to users table
-- Add googleId, authProvider, and avatar columns
-- Make password nullable for OAuth users

-- Add new columns
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "authProvider" TEXT NOT NULL DEFAULT 'local';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" TEXT;

-- Make password nullable (required for OAuth users)
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- Add unique constraint on googleId
CREATE UNIQUE INDEX IF NOT EXISTS "users_googleId_key" ON "users"("googleId");

-- Add index on authProvider for faster queries
CREATE INDEX IF NOT EXISTS "users_authProvider_idx" ON "users"("authProvider");
