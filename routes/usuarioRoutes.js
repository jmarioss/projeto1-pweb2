const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const validaAdmin = require("../Middleware/usuarioMiddleware")

router.post("/cadastrar", validaAdmin, usuarioControllers.cadastrar)