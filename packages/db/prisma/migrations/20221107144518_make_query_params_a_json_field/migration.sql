/*
  Warnings:

  - The `query_params` column on the `PageView` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PageView" DROP COLUMN "query_params",
ADD COLUMN     "query_params" JSONB;
