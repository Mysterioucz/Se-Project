/*
  Warnings:

  - A unique constraint covering the columns `[PaymentID]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_PaymentID_fkey";

-- DropIndex
DROP INDEX "public"."Purchase_PaymentID_key";

-- CreateIndex
CREATE UNIQUE INDEX "Report_PaymentID_key" ON "Report"("PaymentID");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_PaymentID_fkey" FOREIGN KEY ("PaymentID") REFERENCES "Payment"("PaymentID") ON DELETE RESTRICT ON UPDATE CASCADE;
