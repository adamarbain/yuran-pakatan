const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const PDFDocument = require("pdfkit");

// Admin: Get all invoices
router.get("/", async (req, res) => {
  const invoices = await prisma.yuran.findMany();
  res.json(invoices);
});

// Basic User: Get their own invoices
router.get("/:ic", async (req, res) => {
  const invoices = await prisma.yuran.findMany({
    where: { noKadPengenalan: req.params.ic },
  });
  res.json(invoices);
});

// post new invoice
router.post("/", async (req, res) => {
  const { noKadPengenalan, namaAhli, noAhli, kawasan, noTel, alamat } = req.body;
  const invoice = await prisma.yuran.create({
    data: {
      noKadPengenalan,
      namaAhli,
      noAhli,
      kawasan,
      noTel,
      alamat,
    },
  });

  const user = await prisma.user.create({
    data: {
      username: namaAhli,
      password: password,
      role: "user",
      icNumber: noKadPengenalan,
    },
  });

  // return success message and both invoice and user data
  res.json({ message: "Invoice created", invoice, user });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { year, amount } = req.body; // year is like "yuran2024
  
  console.log("Updating Yuran:", { id, year, amount });

  try {
    const existingYuran = await prisma.yuran.findUnique({
      where: { id: Number(id) },
    });

    if (!existingYuran) {
      return res.status(404).json({ error: "Yuran record not found" });
    }

    await prisma.yuran.update({
      where: { id: Number(id) },
      data: { [year]: Number(amount) },
    });

    res.json({ message: "Invoice updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating invoice" });
  }
});

router.post("/generate-invoice", async (req, res) => {
  try {
    const { namaAhli, noAhli, alamat, tarikh, jumlah, tahun } = req.body;

    if (!namaAhli || !noAhli || !alamat || !tarikh || !jumlah || !tahun) {
      return res.status(400).json({ error: "Missing required invoice fields" });
    }

    // Create PDF
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${noAhli}-${tahun}.pdf`,
      });
      res.send(pdfData);
    });

    // Invoice content
    doc.fontSize(16).text("RESIT YURAN PAKATAN", { align: "center" }).moveDown(2);
    doc.fontSize(12).text(`Nama Ahli: ${namaAhli}`);
    doc.text(`No Ahli: ${noAhli}`);
    doc.text(`Alamat: ${alamat}`);
    doc.text(`Tarikh: ${tarikh}`);
    doc.text(`Tahun: ${tahun}`);
    doc.text(`Jumlah: RM ${jumlah.toFixed(2)}`).moveDown(2);
    doc.text("Terima kasih atas pembayaran anda!", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice PDF" });
  }
});

module.exports = router;
