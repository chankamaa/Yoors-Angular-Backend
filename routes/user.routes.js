// routes/user.routes.js
const express = require("express");
const { body, param } = require("express-validator");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const {
  getMe, updateMe, changePassword, deleteMe,
  listUsers, updateUserById, deleteUserById
} = require("../controllers/user.controller");
const { preventSelfDeleteParam } = require("../middleware/guard.middleware");

const router = express.Router();

/** existing self-profile routes **/
router.get("/me", requireAuth, getMe);
router.patch(
  "/me",
  requireAuth,
  [
    body("name").optional().isString().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
    body("avatarUrl").optional().isString().isLength({ max: 500 }).withMessage("avatarUrl too long"),
    validate,
  ],
  updateMe
);
router.patch(
  "/me/password",
  requireAuth,
  [
    body("currentPassword").isString().isLength({ min: 6 }).withMessage("currentPassword is required"),
    body("newPassword").isString().isLength({ min: 6 }).withMessage("newPassword must be at least 6 characters"),
    validate,
  ],
  changePassword
);
// self-delete remains disabled
router.delete("/me", requireAuth, deleteMe);

/** NEW: admin-less management by any logged-in user **/
router.get("/", requireAuth, listUsers);

router.patch(
  "/:id",
  requireAuth,
  [
    param("id").isMongoId().withMessage("invalid user id"),
    body("name").optional().isString().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
    body("avatarUrl").optional().isString().isLength({ max: 500 }).withMessage("avatarUrl too long"),
    validate,
  ],
  updateUserById
);

router.delete(
  "/:id",
  requireAuth,
  [
    param("id").isMongoId().withMessage("invalid user id"),
    validate,
  ],
  preventSelfDeleteParam, // ❗ blocks deleting yourself
  deleteUserById
);

module.exports = router;
