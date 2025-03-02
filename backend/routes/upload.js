const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (const row of data) {
    const user = await prisma.user.upsert({
      where: { icNumber: row["NO KAD PENGENALAN"] },
      update: {},
      create: {
        username: row["NO AHLI"],
        icNumber: row["NO KAD PENGENALAN"],
        password: "password", // Default password (admin should change it)
        role: "user",
      },
    });

    await prisma.invoice.create({
      data: {
        userId: user.id,
        year: 2023, // Example
        amount: row["2023"],
      },
    });
  }

  res.json({ message: "Data imported successfully" });
});

module.exports = router;
