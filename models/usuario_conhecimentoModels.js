const { DataTypes } = require("sequelize")
const database = require("../config/db")

const UsuarioConhecimento = database.define('UsuarioConhecimento',
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuario',
                key: 'id_usuario',
            },
        },
        id_conhecimento: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Conhecimento',
                key: 'id_conhecimento',
            },
        },
        nivel: {
            type: DataTypes.INTEGER,
            validate: {
                nivelValidate(value){
                    if(value < 0 || value > 10){
                        throw new Error("Informe um nível válido")
                    }
                },
            },
        },
    },
    {
        tableName: 'usuarios_conhecimentos',
        timestamps: false,
    },
)

module.exports = UsuarioConhecimento