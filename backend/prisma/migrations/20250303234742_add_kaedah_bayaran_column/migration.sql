-- AlterTable
ALTER TABLE "Infaq" ADD COLUMN     "kaedahBayaranInfaq" TEXT;

-- AlterTable
ALTER TABLE "Yuran" ADD COLUMN     "kaedahBayaran2021" TEXT,
ADD COLUMN     "kaedahBayaran2022" TEXT,
ADD COLUMN     "kaedahBayaran2023" TEXT,
ADD COLUMN     "kaedahBayaran2024" TEXT,
ADD COLUMN     "kaedahBayaran2025" TEXT,
ADD COLUMN     "kaedahBayaran2026" TEXT,
ADD COLUMN     "kaedahBayaran2027" TEXT,
ADD COLUMN     "kaedahBayaran2028" TEXT,
ADD COLUMN     "kaedahBayaran2029" TEXT,
ADD COLUMN     "kaedahBayaran2030" TEXT,
ADD COLUMN     "kaedahBayaran2031" TEXT,
ADD COLUMN     "kaedahBayaran2032" TEXT,
ADD COLUMN     "kaedahBayaranDaftar" TEXT,
ALTER COLUMN "yuranDaftar" DROP NOT NULL;
