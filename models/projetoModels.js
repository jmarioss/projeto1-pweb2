const { DataTypes } = require("sequelize")
const database = require("../config/db")
const ProjetoDevs = require("./projeto_desenvolvedoresModels")
const ProjetoPalavraChave = require("./projeto_palavra_chaveModels")
const Usuario = require("./usuarioModels")

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
        timestamps: false,
    },
)
Projeto.associate = function(models) {
    Projeto.belongsToMany(models.Usuario, {through: models.ProjetoDevs, foreignKey: 'id_projeto'})
    Projeto.belongsToMany(models.PalavraChave, {through: models.ProjetoPalavraChave, foreignKey: 'id_projeto'})
}

module.exports = Projeto