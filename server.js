require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("✅ Backend API is running on Azure"));
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/favicon.ico", (_req, res) => res.status(204).end());

const PORT = process.env.PORT || 3000;

// only connect DB if not skipping
(async () => {
  try {
    if (process.env.SKIP_DB !== "true") {
      const connectDB = require("./config/database");   // keep your real path
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
