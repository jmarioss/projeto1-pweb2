const Projeto = require("../models/projetoModels")
const ProjetoPalavaChave = require("../models/projeto_palavra_chaveModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels") 
const PalavraChave = require("../models/palavra_chaveModels")

exports.criar = async ( req, res ) => {
    const { nome_projeto, resumo, link, id_palavra_chave, id_alunos } = req.body 

    try{
        if(!nome_projeto || !resumo || !link || !id_palavra_chave || !id_alunos){
            res.status(401).json({error: "Informe todos os campos"})
        }

        const palavra_chave = await PalavraChave.FindAll({
            where: {
                id: {
                    [op.in]: id_palavra_chave
                }
            },
            attributes: ['id'],
            raw: true
        })
        
    }catch(error){
        res.status(401).json({error: "Não foi possível criar projeto"})
    }
}