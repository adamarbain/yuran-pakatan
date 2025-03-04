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

app.get("/api/ping", (req, res) => {
    res.send("pong");
});

const PORT = process.env.PORT || 5000; // Use Render’s dynamic port

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const PING_INTERVAL = 30000;
const SERVER_URL = `${process.env.BACKEND_URL}/api/ping`;

setInterval(() => {
    axios.get(SERVER_URL)
        .then(() => console.log("skibidi toilet"))
        .catch((err) => console.error("Ping failed:", err.message));
}, PING_INTERVAL);
