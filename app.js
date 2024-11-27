require('dotenv').config
const path = require('path')
const express = require("express")
const app = express()
const port = 8081
const routerUsuario = require("./routes/usuarioRoutes")
const bodyParser = require("body-parser");

app.use(bodyParser.json()); 

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get("/", function(req, res){
    res.send("Test")
})
app.use("/login", routerUsuario)
app.use("/usuario", routerUsuario)

app.listen(port, () => {
    console.log(`Conectado na porta localhost:${port}`)
})