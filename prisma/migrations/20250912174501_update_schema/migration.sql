/*
  Warnings:

  - Added the required column `TransitAmount` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Flight" ADD COLUMN     "TransitAmount" INTEGER NOT NULL;
