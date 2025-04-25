const Joi = require("joi");

exports.creationValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  imageUrl: Joi.string().uri().optional(),
  foodTags: Joi.string().optional(),
  category: Joi.string().optional(),
  code: Joi.string().optional(),
  isAvailable: Joi.boolean().optional(),
  resturant: Joi.string().hex().length(24).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  ratingCount: Joi.string().optional(),
});

exports.UpdateValidator = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  imageUrl: Joi.string().uri().optional(),
  foodTags: Joi.string().optional(),
  category: Joi.string().optional(),
  code: Joi.string().optional(),
  isAvailable: Joi.boolean().optional(),
  resturant: Joi.string().hex().length(24).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  ratingCount: Joi.string().optional(),
});
