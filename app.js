const express = require("express")
const app = express()
const port = 8081

app.get("/", function(req, res){
    res.write("Test")
})

app.listen(port, function(){})