const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuario = require("../models/usuarioModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels")
const Projeto = require("../models/projetoModels")
const UsuarioConhecimento = require("../models/usuario_conhecimentoModels")
const Conhecimento = require("../models/conhecimentoModels")
const ProjetoPalavraChave = require("../models/projeto_palavra_chaveModels")

exports.login = async ( req, res ) => {
    const { email, senha } = req.body

    try{
        const usuario = await Usuario.findOne({where: {email}})
        const senhaValida = await usuario.validaSenha(senha)

        if(!senhaValida || !usuario){
            res.status(401).json({error: "Credênciais incorretas"})
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                type: usuario.tipo,
            }, 
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        )
        res.status(200).json({
            message: "Login bem-sucedido",
            token: token,
            id_usuario: usuario.id_usuario 
        });
    }catch(error){
        res.status(401).json({error: 'Não foi possível fazer login', details: error.message})
    }
}

exports.cadastrar = async ( req, res ) => {
    const { nome, email, senha} = req.body

    if (!nome || !email || !senha) {
        res.status(401).json({error: "Informe todos os dados"})
    }

    try{
        const validaEmail = await Usuario.findOne({where: {email: email}})
        if(validaEmail){
            return res.status(400).json({error: "Usuario já cadastrado"})
        }

        const saltRounds = 10
        const senhaHash = await bcrypt.hash(senha, saltRounds)

        const novoUsuario = await Usuario.create(
            {
                nome_usuario: nome,
                email: email,
                senha_hash: senhaHash,
                tipo: 'aluno',
            }
        )
        res.status(200).json(novoUsuario)
    }catch(error){
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário', details: error.message }); 
    }
}

exports.getUsuarioComProjetos = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id, {
            attributes: ["id_usuario", "nome_usuario", "email"],
        });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const projetosDeUsuario = await ProjetoDevs.findAll({
            where: { id_usuario: id },
            attributes: ["id_projeto"],
        });

        let idsProjetos = projetosDeUsuario.map(p => p.id_projeto);
        const projetos = idsProjetos.length > 0 ? await Projeto.findAll({
            where: { id_projeto: idsProjetos },
            attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"],
        }) : [];

        // Buscar conhecimentos do usuário
        const conhecimentosDoUsuario = await UsuarioConhecimento.findAll({
            where: { id_usuario: id },
            attributes: ["id_conhecimento", "nivel"],
            raw: true
        });

        // Buscar detalhes dos conhecimentos
        const idsConhecimentos = conhecimentosDoUsuario.map(k => k.id_conhecimento);
        const conhecimentosDetalhes = await Conhecimento.findAll({
            where: { id_conhecimento: idsConhecimentos },
            attributes: ["id_conhecimento", "nome"],
            raw: true
        });

        // Combinar os dados
        const conhecimentos = conhecimentosDoUsuario.map(uc => {
            const conhecimento = conhecimentosDetalhes.find(c => c.id_conhecimento === uc.id_conhecimento);
            return {
                id_conhecimento: uc.id_conhecimento,
                nome: conhecimento ? conhecimento.nome : '',
                nivel: uc.nivel
            };
        });

        // Buscar todos os conhecimentos disponíveis
        const todosConhecimentos = await Conhecimento.findAll({
            attributes: ["id_conhecimento", "nome"],
            order: [['nome', 'ASC']]
        });

        res.render('perfil', {
            usuario: usuario,
            projetos: projetos,
            conhecimentos: conhecimentos,
            todosConhecimentos: todosConhecimentos
        });
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        res.status(500).json({
            error: "Não foi possível buscar os dados do usuário",
            details: error.message,
        });
    }
};

exports.adicionarConhecimento = async (req, res) => {
    const { id_usuario } = req.params;
    const { nome_conhecimento, nivel } = req.body;

    try {
        let conhecimento = await Conhecimento.findOne({
            where: { nome: nome_conhecimento },
        });

        if (!conhecimento) {
            conhecimento = await Conhecimento.create({ nome_conhecimento });
        }

        await UsuarioConhecimento.create({
            id_usuario,
            id_conhecimento: conhecimento.id_conhecimento,
            nivel,
        });

        res.status(201).json({ message: "Conhecimento adicionado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar conhecimento", details: error.message });
    }
};

exports.getProjeto = async (req, res) => {
    const { id_projeto } = req.params;

    try {
        const projeto = await Projeto.findOne({ 
            where: { id_projeto },
            attributes: ['id_projeto', 'nome_projeto', 'resumo_projeto', 'link_externo']
        });

        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        res.status(200).json(projeto);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar projeto", details: error.message });
    }
};

exports.editarProjeto = async (req, res) => {
    const { id_projeto } = req.params;
    const { nome_projeto, resumo_projeto, link_externo } = req.body;

    try {
        const projeto = await Projeto.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        await projeto.update({
            nome_projeto: nome_projeto || projeto.nome_projeto,
            resumo_projeto: resumo_projeto || projeto.resumo_projeto,
            link_externo: link_externo || projeto.link_externo
        });

        res.status(200).json({ message: "Projeto atualizado com sucesso", projeto });
    } catch (error) {
        res.status(500).json({ error: "Erro ao editar projeto", details: error.message });
    }
};

exports.excluirConhecimento = async (req, res) => {
    const { id_usuario, id_conhecimento } = req.params;

    try {
        // Verifica se o conhecimento existe para este usuário
        const conhecimento = await UsuarioConhecimento.findOne({
            where: {
                id_usuario: parseInt(id_usuario),
                id_conhecimento: parseInt(id_conhecimento)
            }
        });

        if (!conhecimento) {
            return res.status(404).json({ error: "Conhecimento não encontrado para este usuário" });
        }

        // Se existe, então exclui
        await conhecimento.destroy();
        
        res.status(200).json({ message: "Conhecimento removido com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir conhecimento:", error);
        res.status(500).json({
            error: "Não foi possível excluir o conhecimento",
            details: error.message
        });
    }
};

exports.excluirProjeto = async (req, res) => {
    const { id_usuario, id_projeto } = req.params;

    try {
        await ProjetoDevs.destroy({
            where: { id_usuario, id_projeto },
        });

        await ProjetoPalavraChave.destroy({
            where: { id_projeto },
        });

        const projetoExcluido = await Projeto.destroy({
            where: { id_projeto },
        });

        if (projetoExcluido === 0) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        res.status(200).json({ message: "Projeto excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir projeto", details: error.message });
    }
};

exports.adicionarPessoaAoProjeto = async (req, res) => {
    const { id_projeto } = req.params;
    const { id_usuario } = req.body;

    try {
        const projeto = await Projeto.findOne({ where: { id_projeto } });
        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        await ProjetoDevs.create({ id_projeto, id_usuario });

        res.status(201).json({ message: "Pessoa adicionada ao projeto com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar pessoa ao projeto", details: error.message });
    }
};

exports.criarProjeto = async (req, res) => {
    const { nome_projeto, resumo_projeto, link_externo } = req.body;
    const { id_usuario } = req.params;

    try {
        const novoProjeto = await Projeto.create({
            nome_projeto,
            resumo_projeto,
            link_externo
        });

        await ProjetoDevs.create({
            id_projeto: novoProjeto.id_projeto,
            id_usuario: parseInt(id_usuario)
        });

        res.status(201).json({ 
            message: "Projeto criado com sucesso", 
            projeto: novoProjeto 
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Erro ao criar projeto", 
            details: error.message 
        });
    }
};

exports.atualizarNivelConhecimento = async (req, res) => {
    const { id_usuario, id_conhecimento } = req.params;
    const { nivel } = req.body;

    try {
        const conhecimentoUsuario = await UsuarioConhecimento.findOne({
            where: {
                id_usuario: id_usuario,
                id_conhecimento: id_conhecimento
            }
        });

        if (!conhecimentoUsuario) {
            return res.status(404).json({ error: "Conhecimento não encontrado para este usuário" });
        }

        await conhecimentoUsuario.update({ nivel: nivel });

        res.status(200).json({ message: "Nível de conhecimento atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar nível de conhecimento:", error);
        res.status(500).json({
            error: "Não foi possível atualizar o nível de conhecimento",
            details: error.message
        });
    }
};
