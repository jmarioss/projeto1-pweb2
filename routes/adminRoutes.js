const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModels');
const Conhecimento = require('../models/conhecimentoModels');
const PalavraChave = require('../models/palavra_chaveModels');
const bcrypt = require('bcrypt');

// Middleware para verificar se é admin
const isAdmin = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.session.userId);
        if (!usuario || usuario.tipo !== 'administrador') {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.error('Erro ao verificar permissão de admin:', error);
        return res.redirect('/login');
    }
};

// Rotas para página de cadastro
router.get('/usuarios/cadastro', isAdmin, (req, res) => {
    res.render('cadastroUsuario', { error: req.query.error, success: req.query.success });
});

router.get('/conhecimentos/cadastro', isAdmin, (req, res) => {
    res.render('cadastroConhecimento', { error: req.query.error, success: req.query.success });
});

router.get('/palavras-chave/cadastro', isAdmin, (req, res) => {
    res.render('cadastroPalavraChave', { error: req.query.error, success: req.query.success });
});

// Rotas POST para cadastro
router.post('/usuarios', isAdmin, async (req, res) => {
    try {
        const { nome_usuario, email, senha } = req.body;
        
        // Gera o hash da senha
        const saltRounds = 10;
        const senha_hash = await bcrypt.hash(senha, saltRounds);

        const novoUsuario = await Usuario.create({
            nome_usuario,
            email,
            senha_hash,
            tipo: 'aluno' // Define o tipo padrão como aluno
        });

        // Redireciona de volta para a página de cadastro com mensagem de sucesso
        res.redirect('/admin/usuarios/cadastro?success=true');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.redirect('/admin/usuarios/cadastro?error=' + encodeURIComponent(error.message));
    }
});

router.post('/conhecimentos', isAdmin, async (req, res) => {
    try {
        const { nome_conhecimento } = req.body;
        await Conhecimento.create({
            nome: nome_conhecimento
        });
        res.redirect('/admin/conhecimentos/cadastro?success=true');
    } catch (error) {
        res.redirect('/admin/conhecimentos/cadastro?error=' + encodeURIComponent(error.message));
    }
});

router.post('/palavras-chave', isAdmin, async (req, res) => {
    try {
        const { nome_palavra_chave } = req.body;
        await PalavraChave.create({
            nome: nome_palavra_chave
        });
        res.redirect('/admin/palavras-chave/cadastro?success=true');
    } catch (error) {
        res.redirect('/admin/palavras-chave/cadastro?error=' + encodeURIComponent(error.message));
    }
});

module.exports = router;
