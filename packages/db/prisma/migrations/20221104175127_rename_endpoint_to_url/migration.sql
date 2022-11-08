/*
  Warnings:

  - You are about to drop the column `website_id` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `endpoint` on the `PageView` table. All the data in the column will be lost.
  - Added the required column `url` to the `PageView` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_website_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Event_website_id_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "website_id";

-- AlterTable
ALTER TABLE "PageView" DROP COLUMN "endpoint",
ADD COLUMN     "url" TEXT NOT NULL;
