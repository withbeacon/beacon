/*
  Warnings:

  - You are about to drop the column `browser` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `live` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `screen` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `website_id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `AuthSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionToken` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthSession" DROP CONSTRAINT "AuthSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_website_id_fkey";

-- DropIndex
DROP INDEX "Session_website_id_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "browser",
DROP COLUMN "country",
DROP COLUMN "created_at",
DROP COLUMN "device",
DROP COLUMN "live",
DROP COLUMN "os",
DROP COLUMN "screen",
DROP COLUMN "updated_at",
DROP COLUMN "website_id",
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AuthSession";

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "country" TEXT,
    "device" TEXT,
    "os" TEXT NOT NULL,
    "browser" TEXT,
    "screen" TEXT NOT NULL,
    "live" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "website_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_website_id_key" ON "UserSession"("website_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "UserSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
