const Joi = require('joi');

const costumerId = Joi.number().integer();
const id = Joi.number().integer();
const orderId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);


const createOrderSchema = Joi.object({
    costumerId:costumerId.required()
});

const getOrderSchema = Joi.object({
    id: id.required(),
});

const addItemSchema = Joi.object({
    orderId: orderId.required(),
    productId: productId.required(),
    amount: amount.required()
})

module.exports = { createOrderSchema, getOrderSchema,addItemSchema }