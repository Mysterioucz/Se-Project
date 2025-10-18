/*
  Warnings:

  - You are about to drop the column `departFlightArrivalTime` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `departFlightDepartTime` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `departFlightNo` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `returnFlightArrivalTime` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `returnFlightDepartTime` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `returnFlightNo` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `DepartFlightArrivalTime` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartFlightDepartTime` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartFlightNo` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_departFlightNo_departFlightDepartTime_departFlightArr_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_returnFlightNo_returnFlightDepartTime_returnFlightArr_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "departFlightArrivalTime",
DROP COLUMN "departFlightDepartTime",
DROP COLUMN "departFlightNo",
DROP COLUMN "returnFlightArrivalTime",
DROP COLUMN "returnFlightDepartTime",
DROP COLUMN "returnFlightNo",
ADD COLUMN     "DepartFlightArrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DepartFlightDepartTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DepartFlightNo" TEXT NOT NULL,
ADD COLUMN     "ReturnFlightArrivalTime" TIMESTAMP(3),
ADD COLUMN     "ReturnFlightDepartTime" TIMESTAMP(3),
ADD COLUMN     "ReturnFlightNo" TEXT;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_DepartFlightNo_DepartFlightDepartTime_DepartFlightArr_fkey" FOREIGN KEY ("DepartFlightNo", "DepartFlightDepartTime", "DepartFlightArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_ReturnFlightNo_ReturnFlightDepartTime_ReturnFlightArr_fkey" FOREIGN KEY ("ReturnFlightNo", "ReturnFlightDepartTime", "ReturnFlightArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE SET NULL ON UPDATE CASCADE;
