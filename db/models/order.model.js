const { Model, DataTypes, Sequelize } = require('sequelize');
const { COSTUMER_TABLE } = require('./costumer.model');
const ORDER_TABLE = 'orders'; //definir nombre tabla;
const OrderSchema = {
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
    costumerId:{
        field:"costumer_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        references:{
            model: COSTUMER_TABLE, //importa tu modelo User
            key: 'id',
        },
        onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
        onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
    },
    total:{
        type: DataTypes.VIRTUAL,
        get(){
            if( this.items.length > 0){
                return this.items.reduce((total, item)=>{
                    return total + ( item.price * item.OrderProduct.amount)
                },0)
            }
            return 0;
        }
    }

}
class Order extends Model{
    static associciate(models){
        this.belongsTo( models.Costumer, 
            {
                as:'costumer'
            } 
        );
        this.belongsToMany(models.Product, 
            {
                as: 'items',
                through: models.OrderProduct,
                foreignKey: 'orderId',
                otherKey: 'productId'
            }
        ); 
    }
    static config(sequelize){
        return{
            sequelize,
            tableName: ORDER_TABLE,
            modelName: 'Order',
            timestamps: false 
        }
    }
}
module.exports= {ORDER_TABLE,OrderSchema,Order };