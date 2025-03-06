require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoices");
const infaqRoutes = require("./routes/infaq");

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/infaq", infaqRoutes);

// ✅ API Gateway for "/" (Ping or Landing Page)
app.get("/", (req, res) => {
    console.log(`[${new Date().toISOString()}] Gateway endpoint accessed`);
    res.json({
        message: "Welcome to the Backend API Gateway!",
        status: "running",
        timestamp: new Date().toISOString(),
    });
});

// ✅ Lightweight Ping Route
app.use("/api/ping", (req, res) => {
    res.send("pong");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const PING_INTERVAL = 30000;
const SERVER_URL = `${process.env.BACKEND_URL}/api/ping`;

// ✅ Skibidi Toilet Log Randomizer
const skibidiLogs = [
    "skibidi bop mm dada!",
    "skibidi toilet activated!",
    "skibidi skibidi toilet 🧻",
    "skibidi doo wop wop!",
    "🚽 Skibidi toilet is running!",
    "camera camera! 📸",
    "skibidi toilet online 🟢",
    "doo doo check complete ✅",
    "skibidi maintenance mode 🔧",
    "toilet status: operational 🚀",
    "toilet defender activated 🛡️",
    "skibidi patrol in progress 🚨"
];

const getRandomSkibidiLog = () => skibidiLogs[Math.floor(Math.random() * skibidiLogs.length)];

// ✅ Keep-Alive Function
const pingServer = () => {
    axios.get(SERVER_URL)
        .then(() => console.log(getRandomSkibidiLog()))
        .catch((err) => console.error("Ping failed:", err.message));

    setTimeout(pingServer, PING_INTERVAL);
};

// Start the keep-alive process
// pingServer(); // Comment this line to disable the keep-alive function and save resources
// Render spins down a Free web service that goes 15 minutes without receiving inbound traffic
// So I already set up UptimeRobot to ping the server every 5 minutes to keep it alive
// If you want to enable the keep-alive function, uncomment the line above
