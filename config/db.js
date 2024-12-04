const Sequelize = require("sequelize")
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db