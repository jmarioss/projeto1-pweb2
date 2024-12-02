const { DataTypes } = require("sequelize")
const database = require("../config/db")
const Usuario = require("./usuarioModels")
const UsuarioConhecimento = require("./usuario_conhecimentoModels")

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

Conhecimento.associate = function() {
    Conhecimento.belongsToMany(Usuario, {through: UsuarioConhecimento})
}

module.exports = Conhecimento