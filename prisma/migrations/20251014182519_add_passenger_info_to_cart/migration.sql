/*
  Warnings:

  - Added the required column `Adults` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Childrens` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Infants` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "Adults" INTEGER NOT NULL,
ADD COLUMN     "Childrens" INTEGER NOT NULL,
ADD COLUMN     "Infants" INTEGER NOT NULL;
