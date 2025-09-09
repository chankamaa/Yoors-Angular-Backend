require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); 

const app = express();
app.use(cors());
app.use(express.json());

// 1) Root route so hitting "/" doesn't 403
app.get("/", (req, res) => {
  res.send("✅ Backend API is running on Azure");
});

// 2) Optional health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 3) Start server on Azure's port
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });

module.exports = app;
