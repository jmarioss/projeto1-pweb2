const { DataTypes } = require("sequelize")
const database = require("../config/db")
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
        tableName: 'palavras_chave',
        timestamps: false,
    },
)

PalavraChave.associate = function(models) {
    PalavraChave.belongsToMany(models.Projeto, {through: ProjetoPalavraChave, foreignKey: 'id_palavra_chave'})
}

module.exports = PalavraChave