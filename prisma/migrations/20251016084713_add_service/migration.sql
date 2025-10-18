/*
  Warnings:

  - Added the required column `PaymentEmail` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PaymentTelNo` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "PaymentEmail" TEXT NOT NULL,
ADD COLUMN     "PaymentTelNo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "ServiceFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FlightService" (
    "FlightNo" VARCHAR(10) NOT NULL,
    "DepartTime" TIMESTAMP(3) NOT NULL,
    "ArrivalTime" TIMESTAMP(3) NOT NULL,
    "ServiceID" VARCHAR(50) NOT NULL,

    CONSTRAINT "FlightService_pkey" PRIMARY KEY ("FlightNo","DepartTime","ArrivalTime","ServiceID")
);

-- CreateTable
CREATE TABLE "Service" (
    "ServiceID" VARCHAR(50) NOT NULL,
    "ServiceName" VARCHAR(100) NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("ServiceID")
);

-- CreateTable
CREATE TABLE "TicketService" (
    "TicketID" VARCHAR(50) NOT NULL,
    "ServiceID" VARCHAR(50) NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TicketService_pkey" PRIMARY KEY ("TicketID","ServiceID")
);

-- AddForeignKey
ALTER TABLE "FlightService" ADD CONSTRAINT "FlightService_FlightNo_DepartTime_ArrivalTime_fkey" FOREIGN KEY ("FlightNo", "DepartTime", "ArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightService" ADD CONSTRAINT "FlightService_ServiceID_fkey" FOREIGN KEY ("ServiceID") REFERENCES "Service"("ServiceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketService" ADD CONSTRAINT "TicketService_TicketID_fkey" FOREIGN KEY ("TicketID") REFERENCES "Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketService" ADD CONSTRAINT "TicketService_ServiceID_fkey" FOREIGN KEY ("ServiceID") REFERENCES "Service"("ServiceID") ON DELETE RESTRICT ON UPDATE CASCADE;
