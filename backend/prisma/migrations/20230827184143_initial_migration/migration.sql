-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('BME68X');

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" "SensorType" NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BME68XSensorData" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "gasResistance" DOUBLE PRECISION NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BME68XSensorData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_name_key" ON "Sensor"("name");

-- AddForeignKey
ALTER TABLE "BME68XSensorData" ADD CONSTRAINT "BME68XSensorData_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
