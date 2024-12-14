const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const ProjetoDevs = sequelize.define('ProjetoDevs',
    {
        id_projeto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projeto',
                key: 'id_projeto',
            },
            primaryKey: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuario',
                key: 'id_usuario',
            },
            primaryKey: true
        },
    },
    {
        tableName: 'projetos_desenvolvedores',
        timestamps: false,
    },
)

module.exports = ProjetoDevs