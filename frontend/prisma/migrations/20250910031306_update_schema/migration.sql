/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminEmail` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Airline_Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminEmail` on the `Airline_Message` table. All the data in the column will be lost.
  - The primary key for the `Assigned_To` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserEmail` on the `Assigned_To` table. All the data in the column will be lost.
  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminEmail` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `UserEmail` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `AdminEmail` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `UserEmail` on the `Report` table. All the data in the column will be lost.
  - The primary key for the `Report_To` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminEmail` on the `Report_To` table. All the data in the column will be lost.
  - You are about to drop the column `UserEmail` on the `Report_To` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserEmail` on the `User` table. All the data in the column will be lost.
  - The primary key for the `User_Tel_No` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserEmail` on the `User_Tel_No` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[AccountID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `AccountID` was added to the `Account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `AdminAccountID` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminAccountID` to the `Airline_Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `Assigned_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminAccountID` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AccountID` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminAccountID` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminAccountID` to the `Report_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `Report_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AccountID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `User_Tel_No` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_AdminEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Airline_Message" DROP CONSTRAINT "Airline_Message_AdminEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assigned_To" DROP CONSTRAINT "Assigned_To_UserEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_AdminEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_UserEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_UserEmail_AdminEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report_To" DROP CONSTRAINT "Report_To_AdminEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report_To" DROP CONSTRAINT "Report_To_UserEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_UserEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."User_Tel_No" DROP CONSTRAINT "User_Tel_No_UserEmail_fkey";

-- DropIndex
DROP INDEX "public"."User_Email_key";

-- AlterTable
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_pkey",
ADD COLUMN     "AccountID" VARCHAR(50) NOT NULL,
ALTER COLUMN "Email" SET DATA TYPE TEXT,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("AccountID");

-- AlterTable
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "AdminEmail",
ADD COLUMN     "AdminAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminAccountID");

-- AlterTable
ALTER TABLE "public"."Airline_Message" DROP CONSTRAINT "Airline_Message_pkey",
DROP COLUMN "AdminEmail",
ADD COLUMN     "AdminAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Airline_Message_pkey" PRIMARY KEY ("AirlineName", "AdminAccountID", "MessageText");

-- AlterTable
ALTER TABLE "public"."Assigned_To" DROP CONSTRAINT "Assigned_To_pkey",
DROP COLUMN "UserEmail",
ADD COLUMN     "UserAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Assigned_To_pkey" PRIMARY KEY ("FlightNo", "Schedule", "UserAccountID");

-- AlterTable
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "AdminEmail",
ADD COLUMN     "AdminAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("AdminAccountID", "AirlineName");

-- AlterTable
ALTER TABLE "public"."Purchase" DROP COLUMN "UserEmail",
ADD COLUMN     "UserAccountID" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "AdminEmail",
DROP COLUMN "Email",
DROP COLUMN "UserEmail",
ADD COLUMN     "AccountID" TEXT NOT NULL,
ADD COLUMN     "AdminAccountID" VARCHAR(50) NOT NULL,
ADD COLUMN     "UserAccountID" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Report_To" DROP CONSTRAINT "Report_To_pkey",
DROP COLUMN "AdminEmail",
DROP COLUMN "UserEmail",
ADD COLUMN     "AdminAccountID" VARCHAR(50) NOT NULL,
ADD COLUMN     "UserAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Report_To_pkey" PRIMARY KEY ("UserAccountID", "AdminAccountID");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "Email",
DROP COLUMN "UserEmail",
ADD COLUMN     "AccountID" TEXT NOT NULL,
ADD COLUMN     "UserAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserAccountID");

-- AlterTable
ALTER TABLE "public"."User_Tel_No" DROP CONSTRAINT "User_Tel_No_pkey",
DROP COLUMN "UserEmail",
ADD COLUMN     "UserAccountID" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "User_Tel_No_pkey" PRIMARY KEY ("UserAccountID");

-- CreateIndex
CREATE UNIQUE INDEX "Account_Email_key" ON "public"."Account"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_AccountID_key" ON "public"."User"("AccountID");

-- AddForeignKey
ALTER TABLE "public"."Assigned_To" ADD CONSTRAINT "Assigned_To_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Admin"("AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report_To" ADD CONSTRAINT "Report_To_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Admin"("AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report_To" ADD CONSTRAINT "Report_To_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Account"("AccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Airline_Message" ADD CONSTRAINT "Airline_Message_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Admin"("AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."Account"("AccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User_Tel_No" ADD CONSTRAINT "User_Tel_No_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_UserAccountID_AdminAccountID_fkey" FOREIGN KEY ("UserAccountID", "AdminAccountID") REFERENCES "public"."Report_To"("UserAccountID", "AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;
