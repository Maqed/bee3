/*
  Warnings:

  - You are about to drop the column `Tags` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Ad` table. All the data in the column will be lost.
  - The `tier` column on the `Ad` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AdTokenStore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sellerProfileId` on the `AdTokenStore` table. All the data in the column will be lost.
  - You are about to drop the `SellerProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,tokenType]` on the table `AdTokenStore` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adCategoryId` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `negotiable` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tokenType` on the `AdTokenStore` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AdTiers" AS ENUM ('Free', 'Pro', 'Expert');

-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "AdTokenStore" DROP CONSTRAINT "AdTokenStore_sellerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "SellerProfile" DROP CONSTRAINT "SellerProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "Tags",
DROP COLUMN "category",
DROP COLUMN "sellerId",
ADD COLUMN     "adCategoryId" INTEGER NOT NULL,
ADD COLUMN     "negotiable" BOOLEAN NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "userId" TEXT,
DROP COLUMN "tier",
ADD COLUMN     "tier" "AdTiers" NOT NULL DEFAULT 'Free';

-- AlterTable
ALTER TABLE "AdTokenStore" DROP CONSTRAINT "AdTokenStore_pkey",
DROP COLUMN "sellerProfileId",
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "tokenType",
ADD COLUMN     "tokenType" "AdTiers" NOT NULL,
ADD CONSTRAINT "AdTokenStore_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AdTokenStore_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- DropTable
DROP TABLE "SellerProfile";

-- DropEnum
DROP TYPE "AdTier";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "parentCategoryId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_parentCategoryId_key" ON "Category"("parentCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_parentCategoryId_idx" ON "Category"("parentCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "AdTokenStore_userId_tokenType_key" ON "AdTokenStore"("userId", "tokenType");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_adCategoryId_fkey" FOREIGN KEY ("adCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdTokenStore" ADD CONSTRAINT "AdTokenStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
