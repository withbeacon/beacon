/*
  Warnings:

  - Added the required column `website_id` to the `PageView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageView" ADD COLUMN     "website_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
