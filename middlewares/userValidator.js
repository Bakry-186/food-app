const Joi = require("joi");

exports.profileUpdateValidator = Joi.object({
  name: Joi.string().optional(),
  address: Joi.array().optional(),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional(),
});

exports.userUpdateValidator = Joi.object({
  name: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  address: Joi.array().optional(),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional(),
  role: Joi.string().valid("client", "admin", "vendor", "driver").optional(),
});

exports.passwordChangeValidator = Joi.object({
  oldPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ),
  newPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ),
});
