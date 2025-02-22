/*
  Warnings:

  - You are about to drop the column `uantity` on the `ProductPurchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductPurchase" DROP COLUMN "uantity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
