const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/entrar", usuarioControllers.login)
router.post("/cadastrar/create", /*authenticator.validaAdmin,*/ usuarioControllers.cadastrar)
router.get("/perfil/:id", /*authenticator.validaToken,*/ usuarioControllers.getUsuarioComProjetos)
router.get("/:id_usuario/projeto/:id_projeto", /*authenticator.validaToken,*/ usuarioControllers.getProjeto)
router.put("/:id_usuario/projeto/:id_projeto", /*authenticator.validaToken,*/ usuarioControllers.editarProjeto)
router.post("/:id_usuario/conhecimento", /*authenticator.validaToken,*/ usuarioControllers.adicionarConhecimento)
router.put("/:id_usuario/conhecimento/:id_conhecimento", /*authenticator.validaToken,*/ usuarioControllers.atualizarNivelConhecimento)
router.delete("/:id_usuario/conhecimento/:id_conhecimento", /*authenticator.validaToken,*/ usuarioControllers.excluirConhecimento)
router.delete("/:id_usuario/projeto/:id_projeto", usuarioControllers.excluirProjeto)
router.post("/projeto/:id_projeto/add-pessoa", /*authenticator.validaToken,*/ usuarioControllers.adicionarPessoaAoProjeto)
router.post("/:id_usuario/projeto", /*authenticator.validaToken,*/ usuarioControllers.criarProjeto)

module.exports = router