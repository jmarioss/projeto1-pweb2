require('dotenv').config
const express = require("express")
const app = express()
const port = 8081
const router = require("./routes/usuarioRoutes")
const bodyParser = require("body-parser");

app.use(bodyParser.json()); 

app.get("/", function(req, res){
    res.send("Test")
})
app.use("/login", router)
app.use("/cadastrar", router)

app.listen(port, () => {
    console.log(`Conectado na porta localhost:${port}`)
})