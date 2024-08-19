/*
  Warnings:

  - You are about to drop the column `adCategoryId` on the `Ad` table. All the data in the column will be lost.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Category` table. All the data in the column will be lost.
  - Added the required column `categoryPath` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `AdTokenStore` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `path` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_adCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "AdTokenStore" DROP CONSTRAINT "AdTokenStore_userId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- DropIndex
DROP INDEX "Category_parentCategoryId_idx";

-- DropIndex
DROP INDEX "Category_parentCategoryId_key";

-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "adCategoryId",
ADD COLUMN     "categoryPath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdTokenStore" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD COLUMN     "path" TEXT NOT NULL,
ALTER COLUMN "parentCategoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("path");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("path") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_categoryPath_fkey" FOREIGN KEY ("categoryPath") REFERENCES "Category"("path") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdTokenStore" ADD CONSTRAINT "AdTokenStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
