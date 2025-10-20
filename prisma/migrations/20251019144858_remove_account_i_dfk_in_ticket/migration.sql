/*
  Warnings:

  - You are about to drop the column `UserAccountID` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_UserAccountID_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "UserAccountID";
