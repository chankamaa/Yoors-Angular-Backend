// utils/jwt.js
const jwt = require("jsonwebtoken");

/**
 * Generate a JWT for a given payload.
 * @param {Object} payload - Data to embed in token (e.g., { id, email }).
 * @returns {string} - Signed JWT.
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

/**
 * Verify and decode a JWT.
 * @param {string} token - The token string to verify.
 * @returns {Object} - Decoded payload if valid.
 * @throws {Error} - If token invalid or expired.
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
