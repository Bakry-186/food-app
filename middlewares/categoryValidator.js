const Joi = require('joi');

const categoryValidator = Joi.object({
  title: Joi.string().required(),
  imageURL: Joi.string()
    .uri()
    .default('https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png')
    .optional(),
});

module.exports = categoryValidator;
