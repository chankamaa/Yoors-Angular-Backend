// routes/auth.routes.js
const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate.middleware");

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @body { name, email, password }
 */
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
    body("email").isEmail().withMessage("valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
    validate,
  ],
  register
);

/**
 * @route POST /api/auth/login
 * @body { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("password is required"),
    validate,
  ],
  login
);

module.exports = router;
