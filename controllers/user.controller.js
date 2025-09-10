// controllers/user.controller.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * GET /api/users/me
 * Returns the authenticated user's profile
 */
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id, { password: 0 }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
}

/**
 * PATCH /api/users/me
 * Updates allowed profile fields (not email/password here)
 * body: { name?, avatarUrl? }
 */
async function updateMe(req, res) {
  try {
    const updates = {};
    if (typeof req.body.name === "string") updates.name = req.body.name.trim();
    if (typeof req.body.avatarUrl === "string") updates.avatarUrl = req.body.avatarUrl.trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, projection: { password: 0 } }
    ).lean();

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("updateMe error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

/**
 * PATCH /api/users/me/password
 * body: { currentPassword, newPassword }
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = newPassword; // pre-save hook will hash
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ error: "Failed to change password" });
  }
}

/**
 * DELETE /api/users/me
 * Self-deletion is disabled by policy
 */
async function deleteMe(_req, res) {
  return res.status(403).json({ error: "Self-deletion is disabled for security reasons" });
}

/**
 * GET /api/users
 * List all users (safe fields only)
 */
async function listUsers(_req, res) {
  try {
    const users = await User.find({}, { password: 0 }).lean();
    return res.json({ users });
  } catch (err) {
    console.error("listUsers error:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

/**
 * PATCH /api/users/:id
 * body: { name?, avatarUrl? }
 */
async function updateUserById(req, res) {
  try {
    const updates = {};
    if (typeof req.body.name === "string") updates.name = req.body.name.trim();
    if (typeof req.body.avatarUrl === "string") updates.avatarUrl = req.body.avatarUrl.trim();

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true, projection: { password: 0 } }
    ).lean();

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("updateUserById error:", err);
    return res.status(500).json({ error: "Failed to update user" });
  }
}

/**
 * DELETE /api/users/:id
 * (Self-deletion is prevented in middleware guard)
 */
async function deleteUserById(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUserById error:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  listUsers,
  updateUserById,
  deleteUserById,
};
