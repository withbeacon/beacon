/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_page_view_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_websiteId_fkey";

-- AlterTable
ALTER TABLE "PageView" ADD COLUMN     "events" JSONB;

-- DropTable
DROP TABLE "Event";
