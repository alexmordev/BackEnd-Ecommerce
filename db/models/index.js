const { User, UserSchema }= require('./user.model');
const { Costumer, CostumerSchema }= require('./costumer.model');
const { Product, ProductSchema } = require('./product.model');
const { Category, CategorySchema } = require('./category.model');
const { Order, OrderSchema } = require('./order.model');
const { OrderProduct, OrderProductSchema } = require('./order_product.model');

function setupModels(sequelize){
    User.init(UserSchema, User.config( sequelize ));
    Costumer.init(CostumerSchema, Costumer.config( sequelize ));
    Product.init(ProductSchema, Product.config( sequelize ));
    Category.init(CategorySchema, Category.config( sequelize ));
    Order.init(OrderSchema, Order.config( sequelize ));
    OrderProduct.init(OrderProductSchema, OrderProduct.config( sequelize ));
    /**
     * After to do all tables, you must to define the relations
     */
    User.associciate( sequelize.models );
    Costumer.associciate( sequelize.models );
    Product.associciate( sequelize.models );
    Category.associciate( sequelize.models );
    Order.associciate( sequelize.models );   
}
module.exports = setupModels