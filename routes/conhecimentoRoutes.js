const express = require("express")
const router = express.Router()
const Conhecimento = require("../controllers/conhecimentoController")
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/criar", authenticator.validaToken, Conhecimento.criar)
router.get("/listar", Conhecimento.listar)

module.exports = router