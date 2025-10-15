/*
  Warnings:

  - You are about to drop the column `AccountID` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_AccountID_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "AccountID";
