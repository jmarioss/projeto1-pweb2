const { DataTypes } = require("sequelize")
const database = require("../config/db")

const Conhecimento = database.define('Conhecimento',
    {
        id_conhecimento: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        }
    },
    {
        tableName: 'conhecimentos',
        timestamps: false,
    },
)

module.exports = Conhecimento