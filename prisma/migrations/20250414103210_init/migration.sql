/*
  Warnings:

  - You are about to drop the column `update_at` on the `Categories` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "update_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
