const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuario = require("../models/usuarioModels")
const UsuarioConhecimento = require("../models/usuario_conhecimentoModels")
const Conhecimento = require("../models/conhecimentoModels")
const ProjetoPalavraChave = require("../models/projeto_palavra_chaveModels")
const PalavraChave = require("../models/palavra_chaveModels")
const Projeto = require("../models/projetoModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels")

exports.login = async ( req, res ) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return res.status(401).json({ error: "Credenciais incorretas" });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ error: "Credenciais incorretas" });
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                type: usuario.tipo,
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        
        req.session.userId = usuario.id_usuario;
        
        res.status(200).json({
            message: "Login bem-sucedido",
            token: token,
            id_usuario: usuario.id_usuario 
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(401).json({ error: 'Não foi possível fazer login', details: error.message });
    }
}

exports.getUsuarioComProjetos = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const projetosUsuario = await ProjetoDevs.findAll({
            where: { id_usuario: id }
        });

        const idsProjetos = projetosUsuario.map(p => p.id_projeto);

        const projetos = await Projeto.findAll({
            where: { id_projeto: idsProjetos }
        });

        const usuarioConhecimentos = await UsuarioConhecimento.findAll({
            where: { id_usuario: id }
        });

        const idsConhecimentos = usuarioConhecimentos.map(uc => uc.id_conhecimento);

        const conhecimentos = await Conhecimento.findAll({
            where: { id_conhecimento: idsConhecimentos }
        });

        const conhecimentosComNivel = conhecimentos.map(c => {
            const uc = usuarioConhecimentos.find(uc => uc.id_conhecimento === c.id_conhecimento);
            return {
                id_conhecimento: c.id_conhecimento,
                nome: c.nome,
                nivel: uc ? uc.nivel : 0
            };
        });

        const todosConhecimentos = await Conhecimento.findAll({
            order: [['nome', 'ASC']]
        });

        res.render('perfil', {
            usuario,
            projetos,
            conhecimentos: conhecimentosComNivel,
            todosConhecimentos,
            isAdmin: usuario.id_usuario === 1
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({error: 'Erro ao buscar usuário', details: error.message});
    }
}

exports.cadastrar = async ( req, res ) => {
    const { nome, email, senha} = req.body

    try{
        const usuario = await Usuario.create({
            nome_usuario: nome,
            email,
            senha
        })

        res.redirect('/login')
    }catch(error){
        res.status(400).json({error: 'Não foi possível cadastrar usuário', details: error.message})
    }
}

exports.getProjeto = async (req, res) => {
    try {
        const { id_usuario, id_projeto } = req.params;
        
        const projeto = await Projeto.findOne({
            where: { id_projeto },
            attributes: ['id_projeto', 'nome_projeto', 'resumo_projeto', 'link_externo']
        });

        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        res.json(projeto);
    } catch (error) {
        console.error('Erro ao buscar projeto:', error);
        res.status(500).json({ error: 'Erro ao buscar projeto', details: error.message });
    }
}

exports.editarProjeto = async (req, res) => {
    try {
        const { id_usuario, id_projeto } = req.params;
        const { nome_projeto, resumo_projeto, link_externo } = req.body;

        const projeto = await Projeto.findByPk(id_projeto);

        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        await projeto.update({
            nome_projeto,
            resumo_projeto,
            link_externo
        });

        res.status(200).json({ message: 'Projeto atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao editar projeto:', error);
        res.status(500).json({ error: 'Erro ao editar projeto', details: error.message });
    }
}

exports.excluirProjeto = async (req, res) => {
    try {
        const { id_usuario, id_projeto } = req.params;

        await ProjetoPalavraChave.destroy({
            where: {
                id_projeto
            }
        })

        await Projeto.destroy({
            where: {
                id_projeto
            }
        })

        res.status(200).json({message: 'Projeto excluído com sucesso'})
    } catch (error) {
        res.status(500).json({error: 'Erro ao excluir projeto', details: error.message})
    }
}

exports.adicionarPessoaAoProjeto = async (req, res) => {
    try {
        const { id_projeto } = req.params;
        const { id_usuario } = req.body;

        await ProjetoDevs.create({
            id_projeto,
            id_usuario
        })

        res.status(200).json({message: 'Pessoa adicionada ao projeto com sucesso'})
    } catch (error) {
        res.status(500).json({error: 'Erro ao adicionar pessoa ao projeto', details: error.message})
    }
}

exports.criarProjeto = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { nome, descricao, palavrasChave } = req.body;

        const projeto = await Projeto.create({
            nome,
            descricao,
            id_usuario
        })

        const projetoPalavrasChave = palavrasChave.map(pc => ({
            id_projeto: projeto.id_projeto,
            id_palavra_chave: pc
        }))

        await ProjetoPalavraChave.bulkCreate(projetoPalavrasChave)

        res.status(201).json({message: 'Projeto criado com sucesso', projeto})
    } catch (error) {
        res.status(500).json({error: 'Erro ao criar projeto', details: error.message})
    }
}

exports.adicionarConhecimento = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { nome_conhecimento, nivel } = req.body;

        const conhecimento = await Conhecimento.findOne({
            where: { nome: nome_conhecimento }
        });

        if (!conhecimento) {
            return res.status(404).json({ error: 'Conhecimento não encontrado' });
        }

        const conhecimentoExistente = await UsuarioConhecimento.findOne({
            where: {
                id_usuario,
                id_conhecimento: conhecimento.id_conhecimento
            }
        });

        if (conhecimentoExistente) {
            return res.status(400).json({ error: 'Usuário já possui este conhecimento' });
        }

        await UsuarioConhecimento.create({
            id_usuario,
            id_conhecimento: conhecimento.id_conhecimento,
            nivel
        });

        res.status(201).json({ message: 'Conhecimento adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar conhecimento:', error);
        res.status(500).json({ error: 'Erro ao adicionar conhecimento', details: error.message });
    }
};

exports.atualizarNivelConhecimento = async (req, res) => {
    try {
        const { id_usuario, id_conhecimento } = req.params;
        const { nivel } = req.body;

        const usuarioConhecimento = await UsuarioConhecimento.findOne({
            where: { 
                id_usuario,
                id_conhecimento 
            }
        });

        if (!usuarioConhecimento) {
            return res.status(404).json({ error: 'Conhecimento não encontrado para este usuário' });
        }

        await usuarioConhecimento.update({ nivel });
        res.status(200).json({ message: 'Nível atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar nível:', error);
        res.status(500).json({ error: 'Erro ao atualizar nível', details: error.message });
    }
}

exports.excluirConhecimento = async (req, res) => {
    try {
        const { id_usuario, id_conhecimento } = req.params;

        await UsuarioConhecimento.destroy({
            where: {
                id_usuario,
                id_conhecimento
            }
        })

        res.status(200).json({message: 'Conhecimento excluído com sucesso'})
    } catch (error) {
        res.status(500).json({error: 'Erro ao excluir conhecimento', details: error.message})
    }
}
