const bcrypt = require("bcrypt")
const { DataTypes } = require("sequelize")
const database = require("../config/db")

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
    },
)

Usuario.prototype.validaSenha = async function(senha){
    return bcrypt.compare(senha, this.senha_hash)
}

//const { pool } = require("../config/db.js")

/*
class Usuario {
    static async createUsuario(nome, email, senha){
        
        const query = `
        INSERT INTO usuarios (nome_usuario, email, senha_hash, tipo)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `
        const values = [nome, email, senhaHash, 'aluno']

        try{
            const res = await pool.query(query, values)
            console.log("Usuário criado com sucesso")
            return res.rows[0]
        }catch(error){
            console.error("Não foi possível criar o usuário, erro: ", error.message)
            throw error
        }
    }

    static async findUsuario(email){
        const query = `SELECT * FROM usuarios WHERE email = $1`
        const value = [email]

        try{
            const res = await pool.query(query, value)
            return res.rows[0]
        }catch(error){
            console.error("Erro ao buscar usuário, erro: ", error)
            throw error;
        }
    }
}
*/
module.exports = Usuario