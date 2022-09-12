const boom = require('@hapi/boom');
const {models} = require('../libs/sequelize');
class OrderService {

  constructor(){
  }
  async create(data) {
    const order = await models.Order.create(data);
    return order;
  }

  async addItem(data) {
    const item = await models.OrderProduct.create(data);
    return item;
  }

  async find() {
    const orders = await models.Order.findAll({
      include:['costumer']
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id,
      {
        include:[
          {
            association: 'costumer',
            include: ['user']
          },
          'items' 
        ]
      }
    );
    if (!order) {
      throw boom.notFound('order not found');
    }
    if (order.isBlock) {
      throw boom.conflict('order is block');
    }
    return order;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return {id};
  }

}

module.exports = OrderService;
