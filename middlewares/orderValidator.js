const Joi = require("joi");
const mongoose = require("mongoose");

exports.orderPlaceValidator = Joi.object({
  cart: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
    )
    .min(1)
    .required(),

  buyer: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .required(),

  status: Joi.string()
    .valid("preparing", "on the way", "deliverd")
    .default("preparing"),
});

exports.orderUpdateValidator = Joi.object({
  status: Joi.string()
    .valid("preparing", "on the way", "deliverd")
    .default("preparing"),
});
