const { Model, DataTypes, Sequelize } = require('sequelize');
const PRODUCT_TABLE = 'products'; //definir nombre tabla;
const ProductSchema = {
    id:{
        allowNull:false, //no puede ser falso
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    price:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    image:{
        allowNull: false,
        type: DataTypes.STRING
    },
    createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
    },
    categoryId:{
        field:"category_id",
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
class Product extends Model{
    static associciate(models){
        this.belongsTo( models.Category, 
            {
                as:'category'
            }
        );   
    }
    static config(sequelize){
        return{
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: 'Product',
            timestamps: false 
        }
    }
}
module.exports= {PRODUCT_TABLE,ProductSchema,Product };