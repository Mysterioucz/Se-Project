-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "FreeCheckedBaggageBags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "FreeCheckedBaggageWeight" INTEGER NOT NULL DEFAULT 0;
