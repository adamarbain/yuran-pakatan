const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || user.role !== "admin") return res.status(401).json({ error: "Unauthorized" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token });
});

// Basic User Login
router.post("/user-login", async (req, res) => {
  const { icNumber } = req.body;
  const user = await prisma.user.findUnique({ where: { icNumber } });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ success: true, message: "Login successful", userId: user.id });
});

//  Admin User Login
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  console.log(user);

  if (!user || user.role !== 'admin') return res.status(401).json({ error: "Unauthorized" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });

  res.json({ success: true, message: "Login successful", userId: user.id, token });
});

module.exports = router;
