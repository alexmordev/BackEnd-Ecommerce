const { Model, DataTypes, Sequelize } = require('sequelize');
// const {USER_TABLE} = require('./user.model');
const CATEGORY_TABLE = 'category'; //definir nombre tabla;
const CategorySchema = {
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
    image:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
    }
}
class Category extends Model{
    static associciate(models){
        this.hasMany( models.Product, 
            {
                as:'product',
                foreignKey:'categoryId'

            } 
        ) 
    }
    static config(sequelize){
        return{
            sequelize,
            tableName: CATEGORY_TABLE,
            modelName: 'Category',
            timestamps: false 
        }
    }
}
module.exports= {CATEGORY_TABLE,CategorySchema,Category };