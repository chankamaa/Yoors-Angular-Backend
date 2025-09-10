// middleware/validate.middleware.js
const { validationResult } = require("express-validator");

/**
 * Collects express-validator results and sends 422 with field errors if any.
 * Use as the last item in a route's validation chain.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(422).json({
    error: "Validation failed",
    details: errors.array().map(e => ({
      field: e.path,
      message: e.msg,
      value: e.value,
      location: e.location,
    })),
  });
}

module.exports = { validate };
