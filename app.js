const express = require("express")
const app = express()
const port = 8081
const usuarioRoutes = require("./routes/usuarioRoutes")
require('dotenv').config

app.use(express.json())

app.get("/", function(req, res){
    res.write("Test")
})

app.use("/cadastrar", usuarioRoutes)

app.listen(port, function(){})