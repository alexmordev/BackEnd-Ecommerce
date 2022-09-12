const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();
const categoryId = Joi.number().integer();
const limit = Joi.number().integer();
const offset = Joi.number().integer();
const priceMax = Joi.number().integer();
const priceMin = Joi.number().integer();

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  image: image.required(),
  categoryId,
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  categoryId
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
  priceMin,
  priceMax: priceMax.when('priceMin', {
    is: Joi.number().integer(),
    then: Joi.required()
  })
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema }
