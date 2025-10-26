/*
  Warnings:

  - You are about to drop the column `DepartFlightArrivalTime` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `DepartFlightCabinClass` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `DepartFlightDepartTime` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `DepartFlightNo` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `FlightType` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `ReturnFlightArrivalTime` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `ReturnFlightDepartTime` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `ReturnFlightNo` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `ReurnFlightCabinClass` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_DepartFlightNo_DepartFlightDepartTime_DepartFlight_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_ReturnFlightNo_ReturnFlightDepartTime_ReturnFlight_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "DepartFlightArrivalTime",
DROP COLUMN "DepartFlightCabinClass",
DROP COLUMN "DepartFlightDepartTime",
DROP COLUMN "DepartFlightNo",
DROP COLUMN "FlightType",
DROP COLUMN "ReturnFlightArrivalTime",
DROP COLUMN "ReturnFlightDepartTime",
DROP COLUMN "ReturnFlightNo",
DROP COLUMN "ReurnFlightCabinClass",
DROP COLUMN "createdAt";
