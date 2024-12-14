const { DataTypes } = require("sequelize")
const database = require("../config/db")

const ProjetoPalavraChave = database.define('ProjetoPalavraChave',
    {
        id_projeto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projeto',
                key: 'id_projeto',
            },
            primaryKey: true
        },
        id_palavra_chave: {
            type: DataTypes.INTEGER,
            references: {
                model: 'PalavraChave',
                key: 'id_palavra_chave'
            },
            primaryKey: true
        },
    },
    {
        tableName: 'projetos_palavras_chave',
        timestamps: false,
    },
)

module.exports = ProjetoPalavraChave