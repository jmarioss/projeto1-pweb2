const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuario = require("../models/usuarioModels")

exports.login = async ( req, res ) => {
    const { email, senha } = req.body

    try{
        const usuario = await Usuario.findOne({where: {email}})
        const senhaValida = await usuario.validaSenha(senha)

        if(!senhaValida || !usuario){
            res.status(401).json({error: "Credênciais incorretas"})
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                type: usuario.tipo,
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        )
        res.setHeader('Authorization', `Bearer ${token}`)
        res.status(200).send({message: "Login bem-sucedido"})
    }catch(error){
        res.status(401).json({error: 'Não foi possível fazer login', details: error.message})
    }
}

exports.cadastrar = async ( req, res ) => {
    const { nome, email, senha} = req.body

    if (!nome || !email || !senha) {
        res.status(401).json({error: "Informe todos os dados"})
    }

    try{
        const validaEmail = await Usuario.findOne({where: {email: email}})
        if(validaEmail){
            return res.status(400).json({error: "Usuario já cadastrado"})
        }

        const saltRounds = 10
        const senhaHash = await bcrypt.hash(senha, saltRounds)

        const novoUsuario = await Usuario.create(
            {
                nome_usuario: nome,
                email: email,
                senha_hash: senhaHash,
                tipo: 'aluno',
            }
        )
        res.status(200).json(novoUsuario)
    }catch(error){
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário', details: error.message }); 
    }
}