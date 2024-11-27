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
        },
        id_palavra_chave: {
            type: DataTypes.INTEGER,
            references: {
                model: 'PalavraChave',
                key: 'id_palavra_chave'
            }
        },
    },
    {
        tableName: 'projetos_palavras_chaves',
        timestamps: false,
    },
)

module.exports = ProjetoPalavraChave