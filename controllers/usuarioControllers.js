const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuario = require("../models/usuarioModels")

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
            token: `Bearer ${token}`,
            id_usuario: usuario.id_usuario // Envia o ID do usuário também
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
    const { id_usuario } = req.params;

    try {
        // Buscar o usuário
        const usuario = await Usuario.findByPk(id_usuario, {
            attributes: ["id_usuario", "nome_usuario", "email"],
        });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Buscar IDs dos projetos do usuário na tabela intermediária
        const projetosDeUsuario = await ProjetoDevs.findAll({
            where: { id_usuario },
            attributes: ["id_projeto"],
        });

        const idsProjetos = projetosDeUsuario.map(p => p.id_projeto);

        // Buscar os projetos associados
        const projetos = await Projeto.findAll({
            where: { id_projeto: idsProjetos },
            attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"],
        });

        // Buscar conhecimentos do usuário na tabela intermediária
        const conhecimentosDoUsuario = await UsuarioConhecimento.findAll({
            where: { id_usuario },
            attributes: ["id_conhecimento", "nivel"],
        });

        const idsConhecimentos = conhecimentosDoUsuario.map(c => c.id_conhecimento);

        // Buscar detalhes dos conhecimentos
        const conhecimentos = await Conhecimento.findAll({
            where: { id_conhecimento: idsConhecimentos },
            attributes: ["id_conhecimento", "nome_conhecimento"],
        });

        // Associar níveis manualmente aos conhecimentos
        const conhecimentosComNivel = conhecimentos.map(c => {
            const relacao = conhecimentosDoUsuario.find(r => r.id_conhecimento === c.id_conhecimento);
            return {
                id_conhecimento: c.id_conhecimento,
                nome_conhecimento: c.nome_conhecimento,
                nivel: relacao.nivel,
            };
        });

        // Montar a resposta
        res.status(200).json({
            usuario,
            projetos,
            conhecimentos: conhecimentosComNivel,
        });
    } catch (error) {
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
        // Buscar ou criar o conhecimento
        let conhecimento = await Conhecimento.findOne({
            where: { nome_conhecimento },
        });

        if (!conhecimento) {
            conhecimento = await Conhecimento.create({ nome_conhecimento });
        }

        // Associar o conhecimento ao usuário na tabela intermediária
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

exports.editarProjeto = async (req, res) => {
    const { id_projeto } = req.params;
    const { nome_projeto, resumo_projeto, link_externo } = req.body;

    try {
        // Buscar projeto pelo ID
        const projeto = await Projeto.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        // Atualizar os campos manualmente
        projeto.nome_projeto = nome_projeto || projeto.nome_projeto;
        projeto.resumo_projeto = resumo_projeto || projeto.resumo_projeto;
        projeto.link_externo = link_externo || projeto.link_externo;

        await projeto.save();

        res.status(200).json({ message: "Projeto atualizado com sucesso", projeto });
    } catch (error) {
        res.status(500).json({ error: "Erro ao editar projeto", details: error.message });
    }
};

exports.excluirConhecimento = async (req, res) => {
    const { id_usuario, id_conhecimento } = req.params;

    try {
        // Remover a associação na tabela intermediária
        const resultado = await UsuarioConhecimento.destroy({
            where: { id_usuario, id_conhecimento },
        });

        if (resultado === 0) {
            return res.status(404).json({ error: "Conhecimento não encontrado para o usuário" });
        }

        res.status(200).json({ message: "Conhecimento excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir conhecimento", details: error.message });
    }
};

exports.adicionarPessoaAoProjeto = async (req, res) => {
    const { id_projeto } = req.params;
    const { id_usuario } = req.body;

    try {
        // Verificar se o projeto existe
        const projeto = await Projeto.findOne({ where: { id_projeto } });
        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        // Associar usuário ao projeto manualmente na tabela intermediária
        await ProjetoDevs.create({ id_projeto, id_usuario });

        res.status(201).json({ message: "Pessoa adicionada ao projeto com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar pessoa ao projeto", details: error.message });
    }
};
