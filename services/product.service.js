const boom = require('@hapi/boom');
const {models} = require('../libs/sequelize');
const { Op } = require("sequelize");

class ProductsService {
  constructor(){
  }
  async create(data) {
    const product = await models.Product.create(data)
    return product;
  }

  async find(query) {
    const options = {
      include:['category'],
      where:{}
    }
    const {limit, offset} = query;
    if(limit && offset){
      options.limit = limit;
      options.offset = offset;
    }
    const{priceMax, priceMin } = query;
    if(priceMax && priceMin){
      options.where.price={
        [Op.gte]: priceMin,
        [Op.lte]: priceMax
      }
    }

    const {price} = query;
    if( price ){
      options.where.price = price;
    }

    const products = await models.Product.findAll(options);
    return products;
  }

  async findOne(id) {
    const product  =  await models.Product.findByPk(id);// buscar con id
    if (!product) {
      throw boom.notFound('product not found');
    }
    if (product.isBlock) {
      throw boom.conflict('product is block');
    }
    return product;
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    const res = await product.update(changes);
    return res;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }
}
module.exports = ProductsService;