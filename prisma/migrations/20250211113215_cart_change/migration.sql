/*
  Warnings:

  - You are about to drop the column `amount` on the `CartLine` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `CartLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `CartLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `CartLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "CartLine" DROP COLUMN "amount",
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;
