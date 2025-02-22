/*
  Warnings:

  - You are about to drop the column `price` on the `ProductPurchase` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ProductPurchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductPurchase" DROP COLUMN "price",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
