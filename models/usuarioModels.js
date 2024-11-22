const { pool } = require("../config/db.js")

class Usuario {
    static async createUsuario(nome, email, senha){
        if (!nome || !email || !senha) {
            console.log("Dados não fornecidos");
        }
        const bcrypt = require("bcrypt")
        const saltRounds = 10
        const senhaHash = await bcrypt.hash(senha, saltRounds)
        
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

module.exports = Usuario