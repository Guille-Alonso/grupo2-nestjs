/*
  Warnings:

  - You are about to drop the column `price` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductPurchase" ADD COLUMN     "uantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "price",
DROP COLUMN "quantity",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;
