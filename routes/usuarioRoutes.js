const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const validaAdmin = require("../Middleware/usuarioMiddleware")

router.post("/", usuarioControllers.login)
router.post("/cadastrar", validaAdmin, usuarioControllers.cadastrar)

module.exports = router