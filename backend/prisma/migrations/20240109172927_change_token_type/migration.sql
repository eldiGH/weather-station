/*
  Warnings:

  - You are about to alter the column `token` on the `RefreshToken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(300)` to `Char(36)`.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "token" SET DATA TYPE CHAR(36);
