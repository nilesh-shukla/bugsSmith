-- Destructive migration: wipe users & refresh tokens, add firstName/lastName, drop name
BEGIN;
DELETE FROM "RefreshToken";
DELETE FROM "User";
ALTER TABLE "User" ADD COLUMN "firstName" text;
ALTER TABLE "User" ADD COLUMN "lastName" text;
ALTER TABLE "User" DROP COLUMN "name";
COMMIT;
