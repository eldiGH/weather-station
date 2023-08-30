/*
  Warnings:

  - Added the required column `batteryPercentage` to the `BME68XSensorData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BME68XSensorData" ADD COLUMN     "batteryPercentage" INTEGER NOT NULL;
