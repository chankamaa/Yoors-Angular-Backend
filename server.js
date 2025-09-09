// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// If your file is ./config/database.js, change the next line to:
// const connectDB = require("./config/database");
const connectDB = require("./config/database.js");

const app = express();

// Azure/behind-proxy friendly
app.set("trust proxy", 1);

// Middlewares
app.use(cors());
app.use(express.json());

// Health + Root
app.get("/", (_req, res) => {
  res.send("✅ Backend API is running on Azure");
});
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// (Example) mount your API routes below
// app.use("/api/users", require("./routes/users"));

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

// Global error handler (avoid silent crashes)
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server on Azure's assigned port
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on ${PORT} (NODE_ENV=${process.env.NODE_ENV || "production"})`);
    });
  } catch (err) {
    console.error("❌ Failed to init server:", err);
    process.exit(1);
  }
})();

// Graceful shutdown (App Service restarts, etc.)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully.");
  process.exit(0);
});

module.exports = app;
