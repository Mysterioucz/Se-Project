/*
  Warnings:

  - You are about to drop the `Domestic_Ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `International_Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Domestic_Ticket" DROP CONSTRAINT "Domestic_Ticket_TicketID_fkey";

-- DropForeignKey
ALTER TABLE "International_Ticket" DROP CONSTRAINT "International_Ticket_TicketID_fkey";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "IssuedCountry" TEXT,
ADD COLUMN     "PassportExpiry" TIMESTAMP(3),
ADD COLUMN     "PassportNo" TEXT;

-- DropTable
DROP TABLE "Domestic_Ticket";

-- DropTable
DROP TABLE "International_Ticket";
