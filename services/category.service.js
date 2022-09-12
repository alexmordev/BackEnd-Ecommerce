const boom = require('@hapi/boom');
const {models} = require('../libs/sequelize');
// const {Sequelize} = require('sequelize');

class CategoryService {
  constructor() {}

  async create(data) {
    // console.log("AQUI!!", Sequelize);
    const newUser =  await models.Category.create( data ) //crear
    return newUser;
  }

  async find() {
    const res = await models.Category.findAll();
    return res;
  }

  async findOne(id) {
    const res  =  await models.Category.findByPk(id,
      {
        include:['product']
      });// buscar con id
    if(!res){
      boom.notFound('Category Not Found');
    }
    return res;
  }

  async update(id, changes) {
    // const user = await models.Category.findByPk(id); 
    const user = await this.findOne(id);
    const res = await user.update(changes);
    return res;
  }

  async delete(id) {
    // const user =  await models.Category.findByPk(id);
    const user = await this.findOne(id);
    await user.destroy()
    return {id};
  }
}

module.exports = CategoryService;
