/*
  Warnings:

  - You are about to drop the column `AccountID` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `AdminAccountID` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `PassengerName` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Report_To` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Email` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PassengerFirstName` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PassengerLastName` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProblemType` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStatusEnum" AS ENUM ('OPENED', 'IN_PROGRESS', 'CANCELLED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReportPriorityEnum" AS ENUM ('NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "ReportProblemType" AS ENUM ('PAYMENT_ISSUE', 'BOOOKING_ISSUE', 'CANCELLATION_REFUND', 'EXTRA_SERVICE_ISSUE', 'ACCOUNT_SYSTEM_ISSUE', 'FLIGHT_ROUTING_ADJUSTMENT_ISSUE');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_UserAccountID_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "Report_To" DROP CONSTRAINT "Report_To_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "Report_To" DROP CONSTRAINT "Report_To_UserAccountID_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "AccountID",
DROP COLUMN "AdminAccountID",
DROP COLUMN "PassengerName",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "PassengerFirstName" TEXT NOT NULL,
ADD COLUMN     "PassengerLastName" TEXT NOT NULL,
ADD COLUMN     "Priority" "ReportPriorityEnum" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "ProblemType" "ReportProblemType" NOT NULL,
ADD COLUMN     "Status" "ReportStatusEnum" NOT NULL DEFAULT 'OPENED',
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Report_To";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;
