-- CreateTable
CREATE TABLE "Kiosk" (
    "id" SERIAL NOT NULL,
    "kioskId" CHAR(36) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Kiosk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KioskToSensor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Kiosk_kioskId_key" ON "Kiosk"("kioskId");

-- CreateIndex
CREATE UNIQUE INDEX "_KioskToSensor_AB_unique" ON "_KioskToSensor"("A", "B");

-- CreateIndex
CREATE INDEX "_KioskToSensor_B_index" ON "_KioskToSensor"("B");

-- AddForeignKey
ALTER TABLE "Kiosk" ADD CONSTRAINT "Kiosk_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KioskToSensor" ADD CONSTRAINT "_KioskToSensor_A_fkey" FOREIGN KEY ("A") REFERENCES "Kiosk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KioskToSensor" ADD CONSTRAINT "_KioskToSensor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
