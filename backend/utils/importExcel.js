const xlsx = require("xlsx");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function importExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Read as array of arrays

  // console.log("Raw Data:", data.slice(0, 5)); // ✅ Print first 5 rows for debugging

  // Extract column headers from first row
  const headers = data[0].map((h) => h.trim());
  // console.log("Headers Detected:", headers); // ✅ Log detected headers

  // Convert the array into an object-based structure
  const formattedData = data.slice(1).map((row) => {
    return {
      bil: row[1], // "ID"
      noAhli: row[3], // "NO AHLI"
      namaAhli: row[2], // "NAMA AHLI"
      noKadPengenalan: row[4], // "NO KAD PENGENALAN"
      alamat: row[5], // "ALAMAT"
      kawasan: row[6], // "Kawasan"
      noTel: row[7], // "NO TEL"
      yuran2021: row[8] || 0, // "2021"
      yuran2022: row[9] || 0, // "2022"
      yuran2023: row[10] || 0, // "2023"
      yuran2024: row[11] || 0, // "2024"
      yuran2025: row[12] || 0, // "2025"
      yuran2026: row[13] || 0, // "2026"
      yuran2027: row[14] || 0, // "2027"
      yuran2028: row[15] || 0, // "2028"
      yuran2029: row[16] || 0, // "2029"
      yuran2030: row[17] || 0, // "2030"
      yuran2031: row[18] || 0, // "2031"
      yuran2032: row[19] || 0, // "2032"
    };
  });

  // log first 5 formatted data for debugging
  // console.log("Formatted Data:", formattedData.slice(0, 5));

  // skip first 4 row and insert the rest into the database
  for (let i = 4; i < 675; i++) {
    const row = formattedData[i];

    await prisma.yuran.create({
      data: {
        namaAhli: row.namaAhli,
        noAhli: row.noAhli,
        noKadPengenalan: String(row.noKadPengenalan) || row.namaAhli,
        alamat: row.alamat,
        kawasan: row.kawasan,
        noTel: String(row.noTel),
        yuranDaftar: 0,
        yuran2021: row.yuran2021,
        yuran2022: row.yuran2022,
        yuran2023: row.yuran2023,
        yuran2024: row.yuran2024,
        yuran2025: row.yuran2025,
        yuran2026: row.yuran2026,
        yuran2027: row.yuran2027,
        yuran2028: row.yuran2028,
        yuran2029: row.yuran2029,
        yuran2030: row.yuran2030,
        yuran2031: row.yuran2031,
        yuran2032: row.yuran2032,
      },
    });

    if (row.namaAhli === "Arbain b Ramli") {
      await prisma.user.create({
        data: {
          username: "ADMIN",
          icNumber: String(row.noKadPengenalan),
          password: "$2b$10$bx2fwPnmxR8e3fDuCKDlTePAyvsUJZOhGCqrKiYzfa6zl8AkmRebG",
          role: "admin"
        },
      });
    } else {
      await prisma.user.create({
        data: {
          username: row.namaAhli,
          icNumber: String(row.noKadPengenalan),
          password: "password",
          role: "user"
        },
      });
    }

    console.log(`Row ${i + 1} inserted successfully!`);
  }

  console.log("Excel file imported successfully!");
}

importExcel("uploads/yuran_data.xlsx");
