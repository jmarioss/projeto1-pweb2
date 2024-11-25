const { DataTypes } = require("sequelize")
const database = require("../config/db")

const PalavraChave = database.define('PalavraChave',
    {
        id_palavra_chave: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome_palavra_chave: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'palavras_chaves',
    },
)

module.exports = PalavraChave