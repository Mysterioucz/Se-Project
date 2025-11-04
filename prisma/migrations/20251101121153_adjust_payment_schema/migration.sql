/*
  Warnings:

  - Added the required column `Adults` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Childrens` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ClassType` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartFlightArrivalTime` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartFlightDepartTime` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartFlightNo` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FlightType` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Infants` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "Adults" INTEGER NOT NULL,
ADD COLUMN     "Childrens" INTEGER NOT NULL,
ADD COLUMN     "ClassType" TEXT NOT NULL,
ADD COLUMN     "DepartFlightArrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DepartFlightDepartTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DepartFlightNo" TEXT NOT NULL,
ADD COLUMN     "FlightType" TEXT NOT NULL,
ADD COLUMN     "Infants" INTEGER NOT NULL,
ADD COLUMN     "ReturnFlightArrivalTime" TIMESTAMP(3),
ADD COLUMN     "ReturnFlightDepartTime" TIMESTAMP(3),
ADD COLUMN     "ReturnFlightNo" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_DepartFlightNo_DepartFlightDepartTime_DepartFlight_fkey" FOREIGN KEY ("DepartFlightNo", "DepartFlightDepartTime", "DepartFlightArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ReturnFlightNo_ReturnFlightDepartTime_ReturnFlight_fkey" FOREIGN KEY ("ReturnFlightNo", "ReturnFlightDepartTime", "ReturnFlightArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE SET NULL ON UPDATE CASCADE;
