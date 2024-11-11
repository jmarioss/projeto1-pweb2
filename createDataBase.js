const pool = require('./db');

const createDataBase = async () => {
    try{
        const cliente = await pool.connect();
        const dbName = 'projeto1';
        await cliente.query('CREATE DATABASE ${dbName}');
        console.log('Banco de dados "${dbName}" criado com sucesso');
        cliente.release();
    }catch(error){
        console.error('Não foi possível criar o banco de dados', error);
    }finally{
        pool.end();
    }
};

createDataBase();