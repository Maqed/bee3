/*
  Warnings:

  - You are about to drop the column `tags` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `adAnalyticsId` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialCount` to the `AdTokenStore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextRefreshTime` to the `AdTokenStore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshInDays` to the `AdTokenStore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "tags",
ADD COLUMN     "adAnalyticsId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AdTokenStore" ADD COLUMN     "initialCount" INTEGER NOT NULL,
ADD COLUMN     "nextRefreshTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refreshInDays" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "depth" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "AdAnalytics" (
    "id" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "uniqueViews" INTEGER NOT NULL,

    CONSTRAINT "AdAnalytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_adAnalyticsId_fkey" FOREIGN KEY ("adAnalyticsId") REFERENCES "AdAnalytics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
