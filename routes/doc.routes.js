// routes/doc.routes.js
const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    message: "API Documentation",
    endpoints: {
      auth: {
        register: { method: "POST", path: "/api/auth/register", body: { name: "string", email: "string", password: "string" } },
        login:    { method: "POST", path: "/api/auth/login", body: { email: "string", password: "string" } },
      },
      users: {
        list:          { method: "GET",    path: "/api/users", headers: { Authorization: "Bearer <token>" } },
        me:            { method: "GET",    path: "/api/users/me", headers: { Authorization: "Bearer <token>" } },
        updateMe:      { method: "PATCH",  path: "/api/users/me", headers: { Authorization: "Bearer <token>" }, body: { name: "string?", avatarUrl: "string?" } },
        changePassword:{ method: "PATCH",  path: "/api/users/me/password", headers: { Authorization: "Bearer <token>" }, body: { currentPassword: "string", newPassword: "string" } },
        deleteMe:      { method: "DELETE", path: "/api/users/me", headers: { Authorization: "Bearer <token>" }, note: "❌ disabled" },
        updateById:    { method: "PATCH",  path: "/api/users/:id", headers: { Authorization: "Bearer <token>" }, body: { name: "string?", avatarUrl: "string?" } },
        deleteById:    { method: "DELETE", path: "/api/users/:id", headers: { Authorization: "Bearer <token>" }, note: "forbidden to delete yourself" },
      },
    },
  });
});

module.exports = router;
