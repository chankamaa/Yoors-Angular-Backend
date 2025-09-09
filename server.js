require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database.js"); // <-- ensure this path exists in wwwroot

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("✅ Backend API is running on Azure"));
app.get("/favicon.ico", (_req, res) => res.status(204).end());
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));

// error handler so 500s are visible in Log stream
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
