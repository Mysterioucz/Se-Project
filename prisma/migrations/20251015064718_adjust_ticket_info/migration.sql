/*
  Warnings:

  - The `TicketStatus` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('BOOKED', 'CANCELLED', 'CHECKED_IN', 'COMPLETED');

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "IsAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "TicketStatus",
ADD COLUMN     "TicketStatus" "TicketStatus" NOT NULL DEFAULT 'BOOKED';
