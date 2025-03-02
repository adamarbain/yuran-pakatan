/*
  Warnings:

  - You are about to drop the `yuran` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "yuran";

-- CreateTable
CREATE TABLE "Yuran" (
    "id" SERIAL NOT NULL,
    "namaAhli" TEXT NOT NULL,
    "noAhli" TEXT NOT NULL,
    "noKadPengenalan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kawasan" TEXT NOT NULL,
    "noTel" TEXT NOT NULL,
    "yuran2021" INTEGER,
    "yuran2022" INTEGER,
    "yuran2023" INTEGER,
    "yuran2024" INTEGER,
    "yuran2025" INTEGER,
    "yuran2026" INTEGER,
    "yuran2027" INTEGER,

    CONSTRAINT "Yuran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Yuran_noKadPengenalan_key" ON "Yuran"("noKadPengenalan");
