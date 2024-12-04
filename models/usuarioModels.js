const bcrypt = require("bcrypt")
const { DataTypes } = require("sequelize")
const database = require("../config/db")
const ProjetoDevs = require("./projeto_desenvolvedoresModels")
const UsarioConhecimento = require("./usuario_conhecimentoModels")

const Usuario = database.define('Usuario',
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome_usuario: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        senha_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                checkValidation(value){
                    if(value !== 'aluno' && value !== 'administrador'){
                        throw new Error("Informe o tipo de usuário")
                    }
                }
            }
        },
    },
    {
        tableName: 'usuarios',
        timestamps: false,
    },
)

Usuario.prototype.validaSenha = async function(senha){
    return bcrypt.compare(senha, this.senha_hash)
}

Usuario.associate = function(models){
    Usuario.belongsToMany(models.Projeto, {through: ProjetoDevs, foreignKey: 'id_usuario'})
    Usuario.belongsToMany(models.Conhecimento, {through: UsarioConhecimento, foreignKey: 'id_usuario'})
}

module.exports = Usuario