/*
  Warnings:

  - The primary key for the `Assigned_To` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Schedule` on the `Assigned_To` table. All the data in the column will be lost.
  - The primary key for the `Flight` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Schedule` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `ArrivalTime` to the `Assigned_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartTime` to the `Assigned_To` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ArrivalTime` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AvailableSeat` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartTime` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ArrivalTime` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartTime` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assigned_To" DROP CONSTRAINT "Assigned_To_FlightNo_Schedule_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_FlightNo_Schedule_fkey";

-- AlterTable
ALTER TABLE "public"."Assigned_To" DROP CONSTRAINT "Assigned_To_pkey",
DROP COLUMN "Schedule",
ADD COLUMN     "ArrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DepartTime" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Assigned_To_pkey" PRIMARY KEY ("FlightNo", "DepartTime", "ArrivalTime", "UserAccountID");

-- AlterTable
ALTER TABLE "public"."Flight" DROP CONSTRAINT "Flight_pkey",
DROP COLUMN "Schedule",
ADD COLUMN     "ArrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "AvailableSeat" INTEGER NOT NULL,
ADD COLUMN     "DepartTime" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Flight_pkey" PRIMARY KEY ("FlightNo", "DepartTime", "ArrivalTime");

-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "Schedule",
ADD COLUMN     "ArrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DepartTime" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Transit" (
    "FlightNo" VARCHAR(10) NOT NULL,
    "DepartTime" TIMESTAMP(3) NOT NULL,
    "ArrivalTime" TIMESTAMP(3) NOT NULL,
    "Transit" VARCHAR(20) NOT NULL,
    "durationToTransit" INTEGER NOT NULL,

    CONSTRAINT "Transit_pkey" PRIMARY KEY ("FlightNo","DepartTime","ArrivalTime")
);

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_FlightNo_DepartTime_ArrivalTime_fkey" FOREIGN KEY ("FlightNo", "DepartTime", "ArrivalTime") REFERENCES "public"."Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assigned_To" ADD CONSTRAINT "Assigned_To_FlightNo_DepartTime_ArrivalTime_fkey" FOREIGN KEY ("FlightNo", "DepartTime", "ArrivalTime") REFERENCES "public"."Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;
