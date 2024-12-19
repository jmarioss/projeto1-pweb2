const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuario = require("../models/usuarioModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels")
const Projeto = require("../models/projetoModels")
const UsuarioConhecimento = require("../models/usuario_conhecimentoModels")
const Conhecimento = require("../models/conhecimentoModels")

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
    console.log(id);
    try {
        console.log("ID do usuário recebido:", id);

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
        if (idsProjetos.length === 0) {
            idsProjetos = []; 
        }

        const projetos = idsProjetos.length > 0 ? await Projeto.findAll({
            where: { id_projeto: idsProjetos },
            attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"],
        }) : [];

        const conhecimentosDoUsuario = await UsuarioConhecimento.findAll({
            where: { id_usuario: id },
            attributes: ["id_conhecimento", "nivel"],
        });

        let idsConhecimentos = conhecimentosDoUsuario.map(c => c.id_conhecimento);
        if (idsConhecimentos.length === 0) {
            idsConhecimentos = []; 
        }

        const conhecimentos = idsConhecimentos.length > 0 ? await Conhecimento.findAll({
            where: { id_conhecimento: idsConhecimentos },
            attributes: ["id_conhecimento", "nome"],
        }) : [];

        const conhecimentosComNivel = conhecimentos.length > 0 ? conhecimentos.map(c => {
            const relacao = conhecimentosDoUsuario.find(r => r.id_conhecimento === c.id_conhecimento);
            return {
                id_conhecimento: c.id_conhecimento,
                nome_conhecimento: c.nome,
                nivel: relacao ? relacao.nivel : null,
            };
        }) : [];

        return {
            usuario: usuario || {}, 
            projetos: projetos || [], 
            conhecimentos: conhecimentosComNivel || [], 
        };
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", {
            mensagem: error.message,
            stack: error.stack,
        });
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

exports.editarProjeto = async (req, res) => {
    const { id_projeto } = req.params;
    const { nome_projeto, resumo_projeto, link_externo } = req.body;

    try {
        const projeto = await Projeto.findOne({ where: { id_projeto } });

        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

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

exports.excluirProjeto = async (req, res) => {
    const { id_usuario, id_projeto } = req.params;

    try {
        const resultado = await ProjetoDevs.destroy({
            where: { id_usuario, id_projeto },
        });

        if (resultado === 0) {
            return res.status(404).json({ error: "Projeto não encontrado para o usuário" });
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
