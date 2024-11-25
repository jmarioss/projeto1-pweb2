const Sequelize = require("sequelize")
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });
/*const { Pool } = require("pg")

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})
/*
async function conectar() {
    try{
        await pool.connect()
        console.log("Conectado")
    } catch(error){
        console.error("Não foi possível conectar com o banco, erro: ", error)
        process.exit
    }
}

async function desconectar() {
    try {
        await pool.end()
        console.log("Desconectado do banco de dados")
    } catch (error){
        console.error("Não foi possível desconectar do banco de dados, erro:", error)
    }
}



*/

module.exports = sequelize
//module.exports = { pool }