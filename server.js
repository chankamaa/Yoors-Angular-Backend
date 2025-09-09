require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); // keep your correct path

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

// quick health that never hits DB
app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));

// root route
app.get("/", (req, res, next) => {
  try {
    res.type("text/plain").send("✅ Backend API is running on Azure");
  } catch (e) { next(e); }
});

// handle favicon gracefully so it doesn't 500
app.get("/favicon.ico", (_req, res) => res.status(204).end());

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// error logger
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// surface unhandled promise rejections
process.on("unhandledRejection", (r) => console.error("unhandledRejection:", r));

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    if (process.env.SKIP_DB !== "true") {
      if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
      await connectDB();
      console.log("✅ MongoDB connected");
    } else {
      console.log("⏭  SKIP_DB=true -> not connecting to DB");
    }
    app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
