/*
  Warnings:

  - You are about to alter the column `secret` on the `Sensor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - Made the column `ownerId` on table `Sensor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_ownerId_fkey";

-- AlterTable
ALTER TABLE "Sensor" ALTER COLUMN "secret" SET DATA TYPE CHAR(36),
ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
