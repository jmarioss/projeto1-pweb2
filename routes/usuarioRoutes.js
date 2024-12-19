const express = require("express")
const router = express.Router()
const usuarioControllers = require("../controllers/usuarioControllers") 
const authenticator = require("../Middleware/usuarioMiddleware")

router.post("/entrar", usuarioControllers.login)
router.post("/cadastrar/create", /*authenticator.validaAdmin,*/ usuarioControllers.cadastrar)
router.get("/:id_usuario", /*authenticator.validaToken,*/ usuarioControllers.getUsuarioComProjetos);
router.put("/projeto/:id_projeto", /*authenticator.validaToken,*/ usuarioControllers.editarProjeto);
router.post("/:id_usuario/conhecimento", /*authenticator.validaToken,*/ usuarioControllers.adicionarConhecimento);
router.delete("/:id_usuario/conhecimento/:id_conhecimento", /*authenticator.validaToken,*/ usuarioControllers.excluirConhecimento);
router.delete(":id_usuario/projeto/:id_projeto", usuarioControllers.excluirProjeto)
router.post("/projeto/:id_projeto/add-pessoa", /*authenticator.validaToken,*/ usuarioControllers.adicionarPessoaAoProjeto);
router.get('/perfil/*', async (req, res) => {
    try {
        const urlPartes = req.originalUrl.split('/'); // Divide a URL
        const id = urlPartes[urlPartes.length - 1];  // Pega a última parte
        console.log("ID recebido:", id);

        // Passa o ID para o controlador
        const dadosUsuario = await usuarioControllers.getUsuarioComProjetos({ params: { id } });

        // Verifique se os dados foram recebidos corretamente
        if (!dadosUsuario || !dadosUsuario.usuario) {
            return res.status(404).send("Usuário não encontrado");
        }

        // Renderiza a página do perfil
        res.render('perfil', { usuario: dadosUsuario.usuario, projetos: dadosUsuario.projetos });
    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        res.status(500).send("Erro ao carregar o perfil do usuário.");
    }
});

module.exports = router