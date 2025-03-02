/*
  Warnings:

  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "yuran" (
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

    CONSTRAINT "yuran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "yuran_noKadPengenalan_key" ON "yuran"("noKadPengenalan");
