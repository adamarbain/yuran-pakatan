const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");

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
  const { noKadPengenalan, namaAhli, noAhli, kawasan, noTel, alamat, yuranDaftar, kaedahBayaranDaftar } = req.body;
  const invoice = await prisma.yuran.create({
    data: {
      noKadPengenalan,
      namaAhli,
      noAhli,
      kawasan,
      noTel,
      alamat,
      yuranDaftar: Number(yuranDaftar),
      kaedahBayaranDaftar,
    },
  });

  const user = await prisma.user.create({
    data: {
      username: namaAhli,
      password: "password",
      role: "user",
      icNumber: noKadPengenalan,
    },
  });

  // return success message and both invoice and user data
  res.json({ message: "Invoice created", invoice, user });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { year, amount, kaedahBayaran } = req.body; // year is like "yuran2024
  
  console.log("Updating Yuran:", { id, year, amount });

  try {
    const existingYuran = await prisma.yuran.findUnique({
      where: { id: Number(id) },
    });

    if (!existingYuran) {
      return res.status(404).json({ error: "Yuran record not found" });
    }

    // year is "yuran2024"
    // create a new const called tahunYuran and assign it to "2024"
    const tahunYuran = year.slice(5);

    const yearlyPaymentMethod = "kaedahBayaran" + tahunYuran;
    console.log("Tahun Kaedah Bayaran: ", { yearlyPaymentMethod });

    await prisma.yuran.update({
      where: { id: Number(id) },
      data: { 
        [year]: Number(amount),
        [yearlyPaymentMethod]: kaedahBayaran,
      },
    });

    res.json({ message: "Invoice updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating invoice" });
  }
});

router.post("/generate-invoice", async (req, res) => {
  try {
    const { namaAhli, noAhli, alamat, tarikh, jumlah, tahun, noKadPengenalan, noTel, kaedahBayaran } = req.body;

    if (!namaAhli || !noAhli || !alamat || !tarikh || !jumlah || !tahun || !noKadPengenalan || !noTel) {
      return res.status(400).json({ error: "Missing required invoice fields" });
    }

    // Create PDF Document
    const doc = new PDFDocument({ margin: 50 });
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

    // Add Logo at Top Center
    const logoPath = "logo.png"; // Update with actual logo path
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 50, 30, { width: 100 });
    }
    doc.moveDown(3); // Adjust spacing after logo
    
    // Header Section
    doc
      .fontSize(20)
      .fillColor("#333")
      .text("RESIT YURAN PAKATAN", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .fillColor("#666")
      .text("Persatuan Kebajikan Am Taman Meru (PAKATAN)", { align: "center" })
      .moveDown(2);

    // Member Details Section
    doc
      .fontSize(12)
      .fillColor("#333")
      .text("Maklumat Ahli", { underline: true })
      .moveDown(0.5);
    
    doc
      .font("Helvetica-Bold")
      .text(`Nama Ahli:`, { continued: true })
      .font("Helvetica")
      .text(` ${namaAhli}`);
    doc
      .font("Helvetica-Bold")
      .text(`No Ahli:`, { continued: true })
      .font("Helvetica")
      .text(` ${noAhli}`);

      doc
      .font("Helvetica-Bold")
      .text(`No Kad Pengenalan:`, { continued: true })
      .font("Helvetica")
      .text(` ${noKadPengenalan}`)

    doc
      .font("Helvetica-Bold")
      .text(`Alamat:`, { continued: true })
      .font("Helvetica")
      .text(` ${alamat}`)

      doc
      .font("Helvetica-Bold")
      .text(`No Telefon:`, { continued: true })
      .font("Helvetica")
      .text(` ${noTel}`)
      .moveDown(1);
    

    // Payment Details
    doc
      .fontSize(12)
      .fillColor("#333")
      .text("Maklumat Pembayaran", { underline: true })
      .moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .text(`Tarikh:`, { continued: true })
      .font("Helvetica")
      .text(` ${tarikh}`);
    doc
      .font("Helvetica-Bold")
      .text(`Tahun:`, { continued: true })
      .font("Helvetica")
      .text(` ${tahun}`);
    doc
      .font("Helvetica-Bold")
      .text(`Jumlah:`, { continued: true })
      .font("Helvetica")
      .text(` RM ${jumlah.toFixed(2)}`);
      
    if (kaedahBayaran) {
      doc
        .font("Helvetica-Bold")
        .text(`Kaedah Pembayaran:`, { continued: true })
        .font("Helvetica")
        .text(` ${kaedahBayaran}`)
        .moveDown(20);
    } else {
      doc.moveDown(21);
    }

    // Thank You Note
    doc
      .fontSize(12)
      .fillColor("#40c057") // Green color
      .text("Terima kasih atas pembayaran anda!", { align: "center" })
      .moveDown(0.5);

    // Footer
    doc
      .fontSize(10)
      .fillColor("#999")
      .text("Resit ini dijana secara automatik oleh sistem PAKATAN.", {
        align: "center",
      });

    // End PDF
    doc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice PDF" });
  }
});



module.exports = router;
