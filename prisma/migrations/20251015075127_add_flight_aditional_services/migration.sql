-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "ExtraBaggage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "SeatSelect" BOOLEAN NOT NULL DEFAULT false;
