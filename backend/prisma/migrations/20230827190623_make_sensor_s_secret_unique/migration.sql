/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sensor_secret_key" ON "Sensor"("secret");
