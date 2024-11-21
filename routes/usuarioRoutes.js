const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const validaAdmin = require("../Middleware/usuarioMiddleware")

router.get("/", usuarioControllers.login)
router.post("/", /*validaAdmin,*/ usuarioControllers.cadastrar)

module.exports = router