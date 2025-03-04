require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoices");
const infaqRoutes = require("./routes/infaq");

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/infaq", infaqRoutes);

const PORT = process.env.PORT || 5000; // Use Render’s dynamic port

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
