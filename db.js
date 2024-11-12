require('dotenv').config()
const { Pool, Client } = require('pg');
const config = {
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
}
const client = new Client(config)
client.connect()
    .then(() => console.log('Conectado'))
    .catch((error) => console.error('Erro na conexão:', error))


module.exports = client;