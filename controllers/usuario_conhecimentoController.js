const UsuarioConhecimento = require("../models/usuario_conhecimentoModels")

exports.cadastrar = async ( res, res ) => {
    const { conhecimento, aluno, nivel } = req.body

    try{
        if(!conhecimento || !aluno || !nivel){
            return res.status(401).json({error: "Informe os campos"})
        }

        const validaUsuarioConhecimento = await UsuarioConhecimento.findOne({
            where: {
                id_usuario: aluno,
                id_conhecimento: conhecimento,
            }
        })
        if(validaUsuarioConhecimento){
            return res.status(401).json({error: "Conhecimento já atribuido"})
        }

        const novoUsuarioConhecimento = await UsuarioConhecimento.create({
            id_usuario: aluno,
            id_conhecimento: conhecimento,
            nivel: nivel
        })
        res.status(201).json({message: "Conhecimento cadastrado", novoUsuarioConhecimento})
    }catch(error){
        return res.status(500).json({error: "Erro ao cadastrar conhecimento"})
    }
}