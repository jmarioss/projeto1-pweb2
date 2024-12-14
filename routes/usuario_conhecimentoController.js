const express = require("express")
const router = express.Router()
const UsuarioConhecimento = require("../controllers/usuario_conhecimentoController")
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/criar", /*authenticator.validaToken,*/ UsuarioConhecimento.criar)
router.get("/listar", UsuarioConhecimento.listar)

module.exports = router