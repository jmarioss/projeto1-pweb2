const { DataTypes } = require("sequelize")
const database = require("../config/db")

const Projeto = database.define('Projeto',
    {
        id_projeto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome_projeto: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        resumo_projeto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        link_externo: {
            type: DataTypes.STRING,
            //ajustar no banco para NOT NULL
        },
    },
    {
        tableName: 'projetos',
    },
)

module.exports = Projeto