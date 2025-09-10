/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AccountID` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminAccountID` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Airline_Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminAccountID` on the `Airline_Message` table. All the data in the column will be lost.
  - The primary key for the `Assigned_To` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserAccountID` on the `Assigned_To` table. All the data in the column will be lost.
  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminAccountID` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `UserAccountID` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `AdminAccountID` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `UserAccountID` on the `Report` table. All the data in the column will be lost.
  - The primary key for the `Report_To` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminAccountID` on the `Report_To` table. All the data in the column will be lost.
  - You are about to drop the column `UserAccountID` on the `Report_To` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserAccountID` on the `User` table. All the data in the column will be lost.
  - The primary key for the `User_Tel_No` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserAccountID` on the `User_Tel_No` table. All the data in the column will be lost.
  - Added the required column `Email` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminEmail` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminEmail` to the `Airline_Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `Assigned_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminEmail` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminEmail` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminEmail` to the `Report_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `Report_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `User_Tel_No` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Airline_Message" DROP CONSTRAINT "Airline_Message_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assigned_To" DROP CONSTRAINT "Assigned_To_UserAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_UserAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_UserAccountID_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report_To" DROP CONSTRAINT "Report_To_AdminAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report_To" DROP CONSTRAINT "Report_To_UserAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_UserAccountID_fkey";

-- DropForeignKey
ALTER TABLE "public"."User_Tel_No" DROP CONSTRAINT "User_Tel_No_UserAccountID_fkey";

-- AlterTable
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "AccountID",
ADD COLUMN     "Email" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("Email");

-- AlterTable
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "AdminAccountID",
ADD COLUMN     "AdminEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminEmail");

-- AlterTable
ALTER TABLE "public"."Airline_Message" DROP CONSTRAINT "Airline_Message_pkey",
DROP COLUMN "AdminAccountID",
ADD COLUMN     "AdminEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Airline_Message_pkey" PRIMARY KEY ("AirlineName", "AdminEmail", "MessageText");

-- AlterTable
ALTER TABLE "public"."Assigned_To" DROP CONSTRAINT "Assigned_To_pkey",
DROP COLUMN "UserAccountID",
ADD COLUMN     "UserEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Assigned_To_pkey" PRIMARY KEY ("FlightNo", "Schedule", "UserEmail");

-- AlterTable
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "AdminAccountID",
ADD COLUMN     "AdminEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("AdminEmail", "AirlineName");

-- AlterTable
ALTER TABLE "public"."Purchase" DROP COLUMN "UserAccountID",
ADD COLUMN     "UserEmail" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "AdminAccountID",
DROP COLUMN "UserAccountID",
ADD COLUMN     "AdminEmail" VARCHAR(50) NOT NULL,
ADD COLUMN     "UserEmail" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Report_To" DROP CONSTRAINT "Report_To_pkey",
DROP COLUMN "AdminAccountID",
DROP COLUMN "UserAccountID",
ADD COLUMN     "AdminEmail" VARCHAR(50) NOT NULL,
ADD COLUMN     "UserEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Report_To_pkey" PRIMARY KEY ("UserEmail", "AdminEmail");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "UserAccountID",
ADD COLUMN     "UserEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserEmail");

-- AlterTable
ALTER TABLE "public"."User_Tel_No" DROP CONSTRAINT "User_Tel_No_pkey",
DROP COLUMN "UserAccountID",
ADD COLUMN     "UserEmail" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "User_Tel_No_pkey" PRIMARY KEY ("UserEmail");

-- AddForeignKey
ALTER TABLE "public"."Assigned_To" ADD CONSTRAINT "Assigned_To_UserEmail_fkey" FOREIGN KEY ("UserEmail") REFERENCES "public"."User"("UserEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_AdminEmail_fkey" FOREIGN KEY ("AdminEmail") REFERENCES "public"."Admin"("AdminEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report_To" ADD CONSTRAINT "Report_To_AdminEmail_fkey" FOREIGN KEY ("AdminEmail") REFERENCES "public"."Admin"("AdminEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report_To" ADD CONSTRAINT "Report_To_UserEmail_fkey" FOREIGN KEY ("UserEmail") REFERENCES "public"."User"("UserEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_AdminEmail_fkey" FOREIGN KEY ("AdminEmail") REFERENCES "public"."Account"("Email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Airline_Message" ADD CONSTRAINT "Airline_Message_AdminEmail_fkey" FOREIGN KEY ("AdminEmail") REFERENCES "public"."Admin"("AdminEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_UserEmail_fkey" FOREIGN KEY ("UserEmail") REFERENCES "public"."Account"("Email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User_Tel_No" ADD CONSTRAINT "User_Tel_No_UserEmail_fkey" FOREIGN KEY ("UserEmail") REFERENCES "public"."User"("UserEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_UserEmail_AdminEmail_fkey" FOREIGN KEY ("UserEmail", "AdminEmail") REFERENCES "public"."Report_To"("UserEmail", "AdminEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_UserEmail_fkey" FOREIGN KEY ("UserEmail") REFERENCES "public"."User"("UserEmail") ON DELETE RESTRICT ON UPDATE CASCADE;
