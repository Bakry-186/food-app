const Joi = require('joi');

const coordsSchema = Joi.object({
  id: Joi.string(),
  latitude: Joi.number(),
  latitudeDelta: Joi.number(),
  longitude: Joi.number(),
  longitudeDelta: Joi.number(),
  address: Joi.string(),
  title: Joi.string(),
});

const resturantValidator = Joi.object({
  title: Joi.string().required(),
  imageUrl: Joi.string().uri().optional(),
  foods: Joi.array().items(Joi.any()).optional(),
  time: Joi.string().optional(),
  pickup: Joi.boolean().default(true),
  delivery: Joi.boolean().default(true),
  isOpen: Joi.boolean().default(true),
  logoUrl: Joi.string().uri().optional(),
  rating: Joi.number().min(1).max(5).default(1),
  ratingCount: Joi.string().optional(),
  code: Joi.string().optional(),
  coords: coordsSchema.optional(),
});

module.exports = resturantValidator;
