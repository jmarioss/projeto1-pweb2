const express = require("express")
const app = express()
const port = 8081
const usuarioRoutes = require("./routes/usuarioRoutes")
require('dotenv').config

app.use(express.json())

app.use("/login", usuarioRoutes)
app.use("/cadastrar", usuarioRoutes)

app.get("/", function(req, res){
    res.write("Test")
})

app.listen(port, function(){})