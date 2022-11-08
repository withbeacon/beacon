-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_website_id_fkey";

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "website_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;
