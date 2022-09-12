const boom = require('@hapi/boom');
const {models} = require('../libs/sequelize');
// const {Sequelize} = require('sequelize');

class UserService {
  constructor() {}

  async create(data) {
    // console.log("AQUI!!", Sequelize);
    const newUser =  await models.User.create( data) //crear
    return newUser;
  }

  async find() {
    const res = await models.User.findAll({
      include:['costumer']
    });
    return res;
  }

  async findOne(id) {
    const res  =  await models.User.findByPk(id);// buscar con id
    if(!res){
      boom.notFound('User Not Found');
    }
    return res;
  }

  async update(id, changes) {
    // const user = await models.User.findByPk(id); 
    const user = await this.findOne(id);
    const res = await user.update(changes);
    return res;
  }

  async delete(id) {
    // const user =  await models.User.findByPk(id);
    const user = await this.findOne(id);
    await user.destroy()
    return {id};
  }
}

module.exports = UserService;
