const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
    const infaq = await prisma.infaq.findMany();
    res.json(infaq);
});

// Create New Infaq
router.post("/", async (req, res) => {
    const { userId, amount, kaedahBayaranInfaq } = req.body;
    // console.log(req.body);
    const infaq = await prisma.infaq.create({
        data: {
            user: {
                connect: { icNumber: userId },
            },
            amount,
            kaedahBayaranInfaq,
        },
    });
    res.json(infaq);
});

// Fetch a user's infaq
router.get("/:userId", async (req, res) => {
    const userwithinfaq = await prisma.user.findUnique({
        where: { icNumber: req.params.userId },
        include: {
            infaqs: true,
        },
    });
    console.log(userwithinfaq);
    res.json(userwithinfaq);
});

// fetch all user infaq
router.get("/alluser/infaq", async (req, res) => {
    const infaq = await prisma.infaq.findMany({
        include: {
            user: true,
        },
    });
    res.json(infaq);
});

module.exports = router;