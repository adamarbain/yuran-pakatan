const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
    const infaq = await prisma.infaq.findMany();
    res.json(infaq);
});

router.get("/:userId", async (req, res) => {
    const infaq = await prisma.infaq.findMany({
        where: { noKadPengenalan: req.params.userId },
    });
    res.json(infaq);
});

// Create New Infaq
router.post("/", async (req, res) => {
    const { userId, amount } = req.body;
    // console.log(req.body);
    const infaq = await prisma.infaq.create({
        data: {
            user: {
                connect: { icNumber: userId },
            },
            amount,
        },
    });
    res.json(infaq);
});

// Fetch a user's infaq
router.get("/:userId", async (req, res) => {
    const userwithinfaq = await prisma.user.findUnique({
        where: { userId: req.params.userId },
        include: {
            infaq: true,
        },
    });
    console.log(userwithinfaq);
    res.json(userwithinfaq);
});

module.exports = router;