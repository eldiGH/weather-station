/*
  Warnings:

  - You are about to drop the column `kioskId` on the `Kiosk` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kioskUuid]` on the table `Kiosk` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kioskUuid` to the `Kiosk` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Kiosk_kioskId_key";

-- AlterTable
ALTER TABLE "Kiosk" RENAME COLUMN "kioskId" TO "kioskUuid";

-- CreateIndex
CREATE UNIQUE INDEX "Kiosk_kioskUuid_key" ON "Kiosk"("kioskUuid");
