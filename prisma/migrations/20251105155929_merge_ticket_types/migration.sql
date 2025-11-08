/*
  Warnings:

  - You are about to drop the column `IssuedCountry` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `PassportExpiry` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `PassportNo` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "IssuedCountry",
DROP COLUMN "PassportExpiry",
DROP COLUMN "PassportNo";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "IssuedCountry" TEXT,
ADD COLUMN     "PassportExpiry" TIMESTAMP(3),
ADD COLUMN     "PassportNo" TEXT;
