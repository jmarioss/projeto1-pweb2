const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/entrar", usuarioControllers.login)
router.post("/cadastrar/create", authenticator.validaAdmin, usuarioControllers.cadastrar)
router.get("/:id_usuario/projetos", authenticator.validaToken, usuarioControllers.getUsuarioComProjetos);
router.put("/projeto/:id_projeto", authenticator.validaToken, usuarioControllers.editarProjeto);
router.post("/:id_usuario/conhecimento", authenticator.validaToken, usuarioControllers.adicionarConhecimento);
router.delete("/:id_usuario/conhecimento/:id_conhecimento", authenticator.validaToken, usuarioControllers.excluirConhecimento);
router.post("/projeto/:id_projeto/add-pessoa", authenticator.validaToken, usuarioControllers.adicionarPessoaAoProjeto);


module.exports = router