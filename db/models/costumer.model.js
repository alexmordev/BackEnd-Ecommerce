const { Model, DataTypes, Sequelize } = require('sequelize');
const {USER_TABLE} = require('./user.model');
const COSTUMER_TABLE = 'costumers'; //definir nombre tabla;
const CostumerSchema = {
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
    lastName:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "last_name"
    },
    phone:{
        allowNull: false,
        type: DataTypes.STRING 
    },
    createdAt:{
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
    },
    userId:{
        field:"user_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
        references:{
            model: USER_TABLE, //importa tu modelo User
            key: 'id',
        },
        onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
        onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
    }
}
class Costumer extends Model{
    static associciate(models){
        this.belongsTo( models.User, {as:'user'} ) //Costummer belongs to User, con el pseudonimo user
        this.hasMany( models.Order, 
            {
                as:'orders',
                foreignKey: "costumerId"
            } 
        )
    }
    static config(sequelize){
        return{
            sequelize,
            tableName: COSTUMER_TABLE,
            modelName: 'Costumer',
            timestamps: false 
        }
    }
}
module.exports= {COSTUMER_TABLE,CostumerSchema,Costumer };