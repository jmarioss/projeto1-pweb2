const express = require("express")
const router = express.Router()
const projetoController = require("../controllers/projetoController")
const authenticator = require("../Middleware/usuarioMiddleware")

router.get("/", projetoController.paginaListarProjetosAll)
router.get("/new", authenticator.validaToken, projetoController.paginaCriarProjeto)
router.post("/new/create", /*authenticator.validaToken,*/ projetoController.criar)

module.exports = router