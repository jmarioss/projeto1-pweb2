const jwt = require('jsonwebtoken')

const validaAdmin = async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

    if(!token){
        res.status(401).json({error: 'Token não encontrado'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        if(err){
            res.status(401).json({error: 'Token inválido'})
        }

        if(decoded.tipo !== 'administrador'){
            res.status(403).json({error: 'Você precisa ser um administrador para acessar'})
        }

        next()
    })
}

const validaToken = async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

    if(!token){
        return res.status(401).json({error: 'Token não encontrado'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        
        if(err){
            return res.status(401).json({error: 'Token inválido'})
        }

        req.user = decoded
        next()
    })
}

module.exports = { validaAdmin, validaToken }