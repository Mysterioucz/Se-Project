/*
  Warnings:

  - The primary key for the `Seat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ArrivalTIme` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `ArrivalTime` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Seat" DROP CONSTRAINT "Seat_FlightNo_DepartTime_ArrivalTIme_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_FlightNo_DepartTime_ArrivalTime_SeatNo_fkey";

-- AlterTable
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_pkey",
DROP COLUMN "ArrivalTIme",
ADD COLUMN     "ArrivalTime" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Seat_pkey" PRIMARY KEY ("FlightNo", "DepartTime", "ArrivalTime", "SeatNo");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_FlightNo_DepartTime_ArrivalTime_SeatNo_fkey" FOREIGN KEY ("FlightNo", "DepartTime", "ArrivalTime", "SeatNo") REFERENCES "Seat"("FlightNo", "DepartTime", "ArrivalTime", "SeatNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_FlightNo_DepartTime_ArrivalTime_fkey" FOREIGN KEY ("FlightNo", "DepartTime", "ArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;
