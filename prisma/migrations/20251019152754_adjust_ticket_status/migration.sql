/*
  Warnings:

  - The values [BOOKED,CHECKED_IN,COMPLETED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `TicketID` on the `Report` table. All the data in the column will be lost.
  - Added the required column `PaymentID` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('SCHEDULED', 'CANCELLED', 'DEPARTED');
ALTER TABLE "public"."Ticket" ALTER COLUMN "TicketStatus" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "TicketStatus" TYPE "TicketStatus_new" USING ("TicketStatus"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "TicketStatus" SET DEFAULT 'SCHEDULED';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_TicketID_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "TicketID",
ADD COLUMN     "PaymentID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "TicketStatus" SET DEFAULT 'SCHEDULED';

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_PaymentID_fkey" FOREIGN KEY ("PaymentID") REFERENCES "Purchase"("PaymentID") ON DELETE RESTRICT ON UPDATE CASCADE;
