const Conhecimento = require("../models/conhecimentoModels")

exports.criar = async ( req, res ) => {
    const { ds_conhecimento } = req.body 
    const conhecimento = ds_conhecimento.trim()

    try{
        if(!conhecimento){
            return res.status(400).json({error: "Campo não informado"})
        }

        const validaConhecimento = await Conhecimento.findOne({where: {nome: conhecimento}})

        if(validaConhecimento){
            return res.status(400).json({error: "Conhecimento já cadastrada"})
        }

        const novoConhecimento = await Conhecimento.create({nome: conhecimento})

        res.status(201).json({message: "Conhecimento criado", novoConhecimento})

    }catch(error){
        return res.status(500).json({error: "Não foi possivel cadastrar palavra chave."})
    }
}