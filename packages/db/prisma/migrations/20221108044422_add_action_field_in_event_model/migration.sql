/*
  Warnings:

  - Added the required column `action` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "action" JSONB NOT NULL,
ADD COLUMN     "websiteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
