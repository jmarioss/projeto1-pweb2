const Projeto = require("../models/projetoModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels") 
const ProjetoPalavraChave = require("../models/projeto_palavra_chaveModels")
const Usuario = require("../models/usuarioModels")
const PalavraChave = require("../models/palavra_chaveModels")

exports.criarPagina = async ( req, res ) => {
    try{
        const [ listPalavrasChaves, listUsuarios ] = await Promise.all([
            PalavraChave.FindAll({}),
            Usuario.FindAll({})
        ])

        res.render('criarProjeto', {
            title: 'Criar Projetto',
            listPalavrasChaves,
            listUsuarios
        })
    }catch(error){
        return res.status(500).json({error: "Não foi possível carregar a página", details: error.message})
    }
    
}

exports.criar = async ( req, res ) => {
    const { nome_projeto, resumo, link, id_palavra_chave, id_alunos } = req.body 
    if(!nome_projeto || !resumo || !link || !id_palavra_chave || !id_alunos){
        res.status(401).json({error: "Informe todos os campos"})
    }
    try{
        const novoProjeto = await Projeto.create(
            {
                nome_projeto: nome_projeto,
                resumo_projeto: resumo,
                link_externo: link,
            }
        )

        const  novoProjetoPalavraChave = id_palavra_chave.map((idPalavraChave) => (
            {
                id_projeto: novoProjeto.id,
                id_palavra_chave: idPalavraChave
            }
        )) 

        const novoProjetoDevs = id_alunos.map((idAluno) => (
            {
                id_projeto: novoProjeto.id,
                id_usuario: idAluno
            }
        ))

        await ProjetoPalavraChave.bulkCreate(novoProjetoPalavraChave)
        await ProjetoDevs.bulkCreate(novoProjetoDevs)

        res.status(201).json({message: "Projeto criado com sucesso", novoProjeto,})

    }catch(error){
        res.status(401).json({error: "Não foi possível criar projeto"})
    }
}