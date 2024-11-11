const pool = require('./db');

const createTableUsers = async () => {
    const cliente = await pool.connect();
    try {
        const query = 'CREATE TABLE IF NOT EXISTS USUARIO(ID_USUARIO SERIAL PRIMARY KEY, DS_NOME VARCHAR(100) NOT NULL,DS_EMAIL VARCHAR(100) UNIQUE NOT NULL, DS_SENHA VARCHAR(250) NOT NULL), DH_INCLUSAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP;';
        await cliente.query(query);
        console.log('Tabela criada com sucesso')
    }catch (error) {
        console.error('Erro ao criar tabela', error);
    }finally{
        cliente.release();
    }
};

createTableUsers();