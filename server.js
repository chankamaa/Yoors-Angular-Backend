// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const docRoutes = require("./routes/doc.routes");

const app = express();

/** ---- Core middleware ---- **/
app.set("trust proxy", 1);
app.use(cors()); // allow all origins
app.use(express.json({ limit: "1mb" }));

/** ---- Health & root ---- **/
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/", (_req, res) => res.type("text/plain").send("Backend API is running on Azure"));
app.get("/favicon.ico", (_req, res) => res.status(204).end());

/** ---- API routes ---- **/
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/** ---- docs ---- **/
app.use("/doc", docRoutes);

/** ---- 404 handler ---- **/
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

/** ---- Global error handler ---- **/
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

/** ---- Boot ---- **/
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is missing from environment variables");

    await connectDB();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "production"})`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();

/** ---- Graceful shutdown ---- **/
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully.");
  process.exit(0);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});
