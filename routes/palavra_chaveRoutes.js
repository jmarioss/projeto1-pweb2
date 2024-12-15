const express = require("express")
const router = express.Router()
const PalavraChave = require("../controllers/palavra_chaveController")
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/criar", authenticator.validaToken, PalavraChave.criar)
router.get("/list", PalavraChave.list)

module.exports = router