require('dotenv').config()
const path = require('path')
const express = require("express")
const app = express()
const port = 8081
const routerUsuario = require("./routes/usuarioRoutes")
const routerProjeto = require("./routes/projetoRoutes")
const routerPalavraChave = require("./routes/palavra_chaveRoutes")
const routerConhecimento = require("./routes/conhecimentoRoutes")
const routerUsuarioConhecimento = require("./routes/usuario_conhecimentoController")
const bodyParser = require("body-parser")
const sequelize = require('./config/db')

app.use(bodyParser.json())

app.use("/", routerProjeto)

app.use("/login", routerUsuario)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Rota estática para página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './views/login.html'))
})

// Rotas da API
app.use("/usuario", routerUsuario)
app.use("/projeto", routerProjeto)
app.use("/palavra-chave", routerPalavraChave)
app.use("/conhecimento", routerConhecimento)
app.use("/usuario-conhecimento", routerUsuarioConhecimento)

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco bem-sucedida.')
        app.listen(port, () => {
            console.log(`Conectado na porta localhost:${port}`)
        })
    })
    .catch(err => {
        console.log('Erro ao conectar ao banco', err)
    })