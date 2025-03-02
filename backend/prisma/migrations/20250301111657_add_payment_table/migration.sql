-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_noKadPengenalan_key" ON "Payment"("noKadPengenalan");
