const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

module.exports = (sequelize, DataTypes) => {
    const ProjetoDevs = sequelize.define('ProjetoDevs',
        {
            id_projeto: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Projeto',
                    key: 'id_projeto',
                },
            },
            id_usuario: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Usuario',
                    key: 'id_usuario',
                },
            },
        },
        {
            tableName: 'projetos_desenvolvedores',
            timestamps: false,
        },
    )
}
