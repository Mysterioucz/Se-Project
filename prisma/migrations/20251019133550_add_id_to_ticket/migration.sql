/*
  Warnings:

  - You are about to drop the column `BookingID` on the `Report` table. All the data in the column will be lost.
  - Added the required column `TicketID` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserAccountID` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "BookingID",
ADD COLUMN     "TicketID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "UserAccountID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_TicketID_fkey" FOREIGN KEY ("TicketID") REFERENCES "Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;
