const { DataTypes } = require("sequelize")
const database = require("../config/db")
const Projeto = require("./projetoModels")
const ProjetoPalavraChave = require("./projeto_palavra_chaveModels")

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
        timestamps: false,
    },
)

PalavraChave.belongsToMany(Projeto, {through: ProjetoPalavraChave})

module.exports = PalavraChave