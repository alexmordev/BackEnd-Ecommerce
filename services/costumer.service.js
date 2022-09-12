const boom = require('@hapi/boom');
const {models} = require('../libs/sequelize');
// const {Sequelize} = require('sequelize');

class CostumerService {
  constructor() {}

  async create(data) {
    const newCostumer =  await models.Costumer.create( data, 
      {
        include:['user']
      }
    ) //crear
    return newCostumer;
  }
  // async find() {
  //   const res = await models.Costumer.findAll({
  //     include:['user']
  //   });
  //   return res;
  // }


  /**
   * Hacer asociaciones y traer elementos especificos de la segunda tabla 
   * Sequelize te devuelve los elementos asociados incluyendolos en un objeto
   * Pero puedes recorer la respuesta que fue devuelta y limpiarla
   * dejandola de una manera diferente.
   */
  
  async find() {
    const res = []
    const queryRes = await models.Costumer.findAll(
      {
        attributes:[
          'id',
          'name',
          'lastName'
        ],
        include:[
          {model:models.User, as:'user', attributes:['email', 'role'] }
        ]
      }
    );
    queryRes.map(el=>res.push({id:el.id,name:el.name,lastName:el.lastName,email:el.user.email, role:el.user.role}))
    return res;
  }

  async findAllOrders(id) {
    // const ordersArray = []
    const orders = await  models.Costumer.findByPk(id,{
      attributes:[
        'id',
        'name',
        'lastName'

      ],
      include:[
        {model:models.Order , as:'orders', attributes:['id', 'createdAt']},
        {model:models.User, as:'user', attributes:['email', 'role']}

      ]
    });
    // orders.map(el=>ordersArray.push({id:el.id,name:el.name,lastName:el.lastName,email:el.user.email, role:el.user.role}))
    return orders;
  }


  async findOne(id) {
    const res  =  await models.Costumer.findByPk(id);// buscar con id
    if(!res){
      boom.notFound('User Not Found');
    }
    return res;
  }

  async update(id, changes) {
    // const user = await models.User.findByPk(id); 
    const costumer = await this.findOne(id);
    const res = await costumer.update(changes);
    return res;
  }

  async delete(id) {
    // const user =  await models.User.findByPk(id);
    const costumer = await this.findOne(id);
    await costumer.destroy()
    return {id};
  }
}

module.exports = CostumerService;
