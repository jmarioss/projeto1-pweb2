const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/entrar", usuarioControllers.login)
router.post("/cadastrar/create", authenticator.validaAdmin, usuarioControllers.cadastrar)

module.exports = router