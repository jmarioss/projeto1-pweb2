require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const routerUsuario = require("./routes/usuarioRoutes")
const routerPalavraChave = require("./routes/palavra_chaveRoutes")
const routerProjeto = require("./routes/projetoRoutes")
const routerConhecimento = require("./routes/conhecimentoRoutes")
const routerUsuarioConhecimento = require("./routes/usuario_conhecimentoController")
const bodyParser = require("body-parser")
const sequelize = require('./config/db')
const session = require('express-session')

app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}))

app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))

// Rotas públicas
app.use("/", routerProjeto)
app.use("/login", routerUsuario)

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './views/login.html'))
})

const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Rotas protegidas
app.use("/usuario", checkAuth, routerUsuario)
app.use("/projeto", checkAuth, routerProjeto)
app.use("/palavra-chave", checkAuth, routerPalavraChave)
app.use("/conhecimento", checkAuth, routerConhecimento)
app.use("/usuario-conhecimento", checkAuth, routerUsuarioConhecimento)

// Rotas administrativas
const routerAdmin = require("./routes/adminRoutes")
app.use("/admin", checkAuth, routerAdmin)

// Rotas administrativas (apenas para usuário com ID 1)
app.get('/usuarios/cadastro', checkAuth, async (req, res) => {
    if (req.session.userId !== 1) {
        return res.redirect('/login');
    }
    res.render('cadastroUsuario');
});

app.get('/conhecimentos/cadastro', checkAuth, async (req, res) => {
    if (req.session.userId !== 1) {
        return res.redirect('/login');
    }
    res.render('cadastroConhecimento');
});

app.get('/palavras-chave/cadastro', checkAuth, async (req, res) => {
    if (req.session.userId !== 1) {
        return res.redirect('/login');
    }
    res.render('cadastroPalavraChave');
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco bem-sucedida.')
    })
    .catch((error) => {
        console.error('Erro ao conectar com o banco:', error)
    })

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
})