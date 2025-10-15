/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classType` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `flightType` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `ClassType` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FlightType` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "classType",
DROP COLUMN "flightType",
DROP COLUMN "id",
ADD COLUMN     "ClassType" TEXT NOT NULL,
ADD COLUMN     "FlightType" TEXT NOT NULL,
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("ID");
