// middleware/auth.middleware.js
const { verifyToken } = require("../utils/jwt");

/**
 * Require a valid JWT in Authorization header: "Bearer <token>"
 * Attaches decoded payload to req.user
 */
function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Unauthorized: missing or invalid Authorization header" });
    }

    const decoded = verifyToken(token); // throws if invalid/expired
    req.user = decoded; // e.g., { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: invalid or expired token" });
  }
}

module.exports = { requireAuth };
