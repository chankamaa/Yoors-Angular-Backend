// controllers/auth.controller.js
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // basic guard (routes will still do express-validator)
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, and password are required" });
    }

    // uniqueness
    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // create user (pre-save hook hashes password)
    const user = await User.create({ name, email, password });

    // issue token
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
}

/**
 * POST /api/auth/login
 * body: { email, password }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // strip password before sending
    const safeUser = user.toJSON();

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return res.status(200).json({
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Failed to login" });
  }
}

module.exports = {
  register,
  login,
};
