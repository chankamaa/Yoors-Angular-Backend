// middleware/guard.middleware.js

// Blocks actions where :id matches the authenticated user's id
function preventSelfDeleteParam(req, res, next) {
  if (req.params.id && req.user?.id && String(req.params.id) === String(req.user.id)) {
    return res.status(403).json({ error: "You cannot delete your own account" });
  }
  next();
}

module.exports = { preventSelfDeleteParam };
