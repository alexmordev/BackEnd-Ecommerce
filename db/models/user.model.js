const { Model, DataTypes, Sequelize } = require('sequelize');
const USER_TABLE = 'users'; //definir nombre tabla;
const UserSchema = {
    id:{
        allowNull:false, //no puede ser falso
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    password:{
        allowNull: false,
        type: DataTypes.STRING
    },
    role:{
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue:"costumer" 
    },
    createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
    }
}
// const UserSchema={}
class User extends Model{
    static associciate(models){
        this.hasOne( models.Costumer, 
            {
                as:'costumer', 
                foreignKey:'userId'
            }
        );   
    }
    static config(sequelize){
        return{
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: false 
        }
    }
}
module.exports= {USER_TABLE,UserSchema,User };