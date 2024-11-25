const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuario = require("../models/usuarioModels")

exports.login = async ( req, res ) => {
    const { email, senha } = req.body

    try{
        const usuario = await Usuario.findOne({where:{email: [email]}})
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
        res.status(200).json({token})
    }catch(error){
        res.status(401).json({error: 'Não foi possível fazer login'})
    }
   /* const user = await Usuario.findUsuario(email)
    try{
        if(!user){
            return res.status(404).json({error: 'Usuário não encontrado'});   
        }

        const senhaValida = await bcrypt.compare(senha, user.senha_hash)
        if(!senhaValida){
            return res.status(401).json({error: 'Credenciais inválidas'})
        }

        const token = jwt.sign(
            {
                id: user.id_usuario,
                type: user.tipo,
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        )

        res.status(200).json({token})
    }catch(error){
        res.status(401).json({error: 'Não foi possível fazer login'})
    }*/
}

exports.cadastrar = async ( req, res ) => {
    const { nome, email, senha} = req.body

    if (!nome || !email || !senha) {
        console.log("Dados não fornecidos");
    }
    const bcrypt = require("bcrypt")
    const saltRounds = 10
    const senhaHash = await bcrypt.hash(senha, saltRounds)

    try{
        const novoUsuario = await Usuario.create(
            {
                nome_usuario: nome,
                email: email,
                senha_hash: senhaHash,
                tipo: 'aluno',
            },
        )
     //   const novoUsuario = await Usuario.createUsuario(nome, email, senhaHash)
        res.status(200).json(novoUsuario)
    }catch(error){
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário', details: error.message }); 
    }
}