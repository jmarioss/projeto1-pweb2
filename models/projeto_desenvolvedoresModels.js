const { DataTypes } = require("sequelize")
const database = require("../config/db")

const ProjetoDevs = database.define('ProjetoDevs',
    {
        id_projeto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projeto',
                key: 'id_projeto',
            },
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuario',
                key: 'id_usuario',
            },
        },
    },
    {
        tableName: 'projetos_desenvolvedores',
        timestamps: false,
    },
)

module.exports = ProjetoDevs