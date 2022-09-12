const { Model, DataTypes, Sequelize } = require('sequelize');
const { ORDER_TABLE } = require('./order.model');
const { PRODUCT_TABLE } = require('./product.model');
const ORDER_PRODUCT_TABLE = 'orders_products'; //definir nombre tabla;
const OrderProductSchema = {
    id:{
        allowNull:false, //no puede ser falso
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
    },
    amount:{
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    orderId:{
        field:"order_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
            model: ORDER_TABLE, //importa tu modelo User
            key: 'id',
        },
        onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
        onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
    },
    productId:{
        field:"product_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
            model: PRODUCT_TABLE, //importa tu modelo User
            key: 'id',
        },
        onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
        onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
    }

}
class OrderProduct extends Model{
    static associciate(){
        //
    }
    static config(sequelize){
        return{
            sequelize,
            tableName: ORDER_PRODUCT_TABLE,
            modelName: 'OrderProduct',
            timestamps: false 
        }
    }
}
module.exports= {ORDER_PRODUCT_TABLE,OrderProductSchema,OrderProduct };