const PalavraChave = require("../models/palavra_chaveModels")

exports.criar = async ( req, res ) => {
    const { ds_palavra_chave } = req.body
    const palavraChave = ds_palavra_chave.trim()
    

    try{
        if(!palavraChave){
            return res.status(400).json({error: "Informe a palavra-chave"})
        }

        /*const validaPalavraChave = await PalavraChave.findOne({where: {nome_palavra_chave: palavraChave}})

        if(validaPalavraChave){
            return res.status(400).json({error: "Palavra chave já cadastrada"})
        }*/
        console.log(palavraChave)
        const novaPalavraChave = await PalavraChave.create({nome_palavra_chave: palavraChave})

        res.status(201).json({message: "Palavra-chave criada", novaPalavraChave})

    }catch(error){
        return res.status(500).json({error: "Não foi possivel cadastrar palavra chave.", details: error.message})
    }
}

exports.list = async ( req, res ) => {
    try{
        pList = await PalavraChave.findAll()
        res.status(201).json({message: "Palavras-chaves:", pList})
    }catch(error){
        return res.status(401).json({error: "Não foi possivel listar as palavras-chaves", details: error.message})
    }
}