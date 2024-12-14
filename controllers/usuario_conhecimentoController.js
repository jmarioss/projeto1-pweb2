const UsuarioConhecimento = require("../models/usuario_conhecimentoModels")

exports.criar = async ( req, res ) => {
    const { id_conhecimento, id_aluno, nivel } = req.body

    try{
        if(!id_conhecimento || !id_aluno || !nivel){
            return res.status(401).json({error: "Informe os campos"})
        }

        const validaUsuarioConhecimento = await UsuarioConhecimento.findOne({
            where: {
                id_usuario: id_aluno,
                id_conhecimento: id_conhecimento,
            }
        })
        if(validaUsuarioConhecimento){
            return res.status(401).json({error: "Conhecimento já atribuido"})
        }

        const novoUsuarioConhecimento = await UsuarioConhecimento.create({
            id_usuario: id_aluno,
            id_conhecimento: id_conhecimento,
            nivel: nivel
        })
        res.status(201).json({message: "Conhecimento cadastrado", novoUsuarioConhecimento})
    }catch(error){
        return res.status(500).json({error: "Erro ao cadastrar conhecimento", details: error.message})
    }
}

exports.listar = async ( req, res ) => {
    try{
        cList = await UsuarioConhecimento.findAll()
        return res.status(201).json({cList})
    }catch(error){
        return res.status(500).json({error: "Não foi possivel listar"})
    }
}