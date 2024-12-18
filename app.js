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

app.use(bodyParser.json()); 

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use("/", routerProjeto)
app.use("/projeto", routerProjeto)

app.use("/palavra-chave", routerPalavraChave)

app.use("/login", routerUsuario)
app.use("/usuario", routerUsuario)

app.use("/conhecimento", routerConhecimento)

app.use("/usuario-conhecimento", routerUsuarioConhecimento)

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './views/login.html'));
  });

app.get('/perfil/:id_usuario', (req, res) => {
    const id_usuario = req.params.id_usuario;

    // Se for necessário, você pode buscar mais informações no banco de dados sobre o usuário
    res.sendFile(path.join(__dirname,  './views/perfil.html')); // Serve o arquivo perfil.html
});

sequelize.authenticate()
    .then(() => {
        console.log('Conwxão com o banco bem-sucedida.')
        app.listen(port, () => {
            console.log(`Conectado na porta localhost:${port}`)
        })
    })
    .catch(err => {
        console.log('Erro ao conectar ao banco', err)
    })