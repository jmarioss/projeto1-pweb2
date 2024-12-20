const Projeto = require("../models/projetoModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels") 
const ProjetoPalavraChave = require("../models/projeto_palavra_chaveModels")
const Usuario = require("../models/usuarioModels")
const PalavraChave = require("../models/palavra_chaveModels")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.paginaListarProjetosAll = async (req, res) => {
    try {
        const { busca } = req.query;
        let projetos;

        if (busca) {
            // Buscar projetos que correspondam ao termo de busca
            const projetosPorNome = await Projeto.findAll({
                where: {
                    [Op.or]: [
                        { nome_projeto: { [Op.iLike]: `%${busca}%` } },
                        { resumo_projeto: { [Op.iLike]: `%${busca}%` } }
                    ]
                },
                attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"]
            });

            // Buscar projetos por palavras-chave
            const palavrasChave = await PalavraChave.findAll({
                where: {
                    nome_palavra_chave: { [Op.iLike]: `%${busca}%` }
                }
            });

            const idsPalavrasChave = palavrasChave.map(pc => pc.id_palavra_chave);
            const projetosPorPalavraChave = await ProjetoPalavraChave.findAll({
                where: {
                    id_palavra_chave: idsPalavrasChave
                }
            });

            const idsProjetosPorPalavraChave = projetosPorPalavraChave.map(pp => pp.id_projeto);
            const projetosPorPalavras = await Projeto.findAll({
                where: {
                    id_projeto: idsProjetosPorPalavraChave
                },
                attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"]
            });

            // Combinar resultados e remover duplicatas
            const todosIds = [...new Set([
                ...projetosPorNome.map(p => p.id_projeto),
                ...projetosPorPalavras.map(p => p.id_projeto)
            ])];

            projetos = await Projeto.findAll({
                where: {
                    id_projeto: todosIds
                },
                attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"]
            });
        } else {
            projetos = await Projeto.findAll({
                attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"]
            });
        }

        const idsProjetos = projetos.map(projeto => projeto.id_projeto);

        const projetosDevs = await ProjetoDevs.findAll({
            where: {
                id_projeto: idsProjetos
            }
        });

        const projetosPalavrasChave = await ProjetoPalavraChave.findAll({
            where: {
                id_projeto: idsProjetos
            }
        });

        const idsUsuarios = [...new Set(projetosDevs.map(pd => pd.id_usuario))];
        const idsPalavrasChave = [...new Set(projetosPalavrasChave.map(pp => pp.id_palavra_chave))];

        const usuarios = await Usuario.findAll({
            where: {
                id_usuario: idsUsuarios
            },
            attributes: ["id_usuario", "nome_usuario", "email"]
        });

        const palavrasChave = await PalavraChave.findAll({
            where: {
                id_palavra_chave: idsPalavrasChave
            },
            attributes: ["id_palavra_chave", "nome_palavra_chave"]
        });

        const usuariosMap = usuarios.reduce((map, usuario) => {
            map[usuario.id_usuario] = usuario;
            return map;
        }, {});

        const palavrasChaveMap = palavrasChave.reduce((map, palavra) => {
            map[palavra.id_palavra_chave] = palavra;
            return map;
        }, {});

        const projetosFormatados = projetos.map(projeto => {
            const desenvolvedores = projetosDevs
                .filter(pd => pd.id_projeto === projeto.id_projeto)
                .map(pd => usuariosMap[pd.id_usuario])
                .filter(Boolean);

            const palavras = projetosPalavrasChave
                .filter(pp => pp.id_projeto === projeto.id_projeto)
                .map(pp => palavrasChaveMap[pp.id_palavra_chave])
                .filter(Boolean);

            return {
                ...projeto.get(),
                desenvolvedores,
                palavrasChave: palavras
            };
        });

        res.render('listarProjetos', { projetos: projetosFormatados, termoBusca: busca || '' });
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
        res.status(500).json({ error: 'Erro ao listar projetos', details: error.message });
    }
};


exports.paginaCriarProjeto = async ( req, res ) => {
    try{
        const [ listPalavrasChaves, listUsuarios ] = await Promise.all([
            PalavraChave.findAll({}),
            Usuario.findAll({})
        ])

        res.render('criarProjeto', {
            title: 'Criar Projetto',
            listPalavrasChaves,
            listUsuarios
        })
    }catch(error){
        return res.status(500).json({error: "Não foi possível carregar a página", details: error.message})
    }
    
}

exports.criar = async (req, res) => {
    const { nome_projeto, resumo_projeto, link_externo } = req.body;
    const id_usuario = req.session.userId;

    if (!nome_projeto || !resumo_projeto) {
        return res.status(400).json({ error: "Nome e resumo do projeto são obrigatórios" });
    }

    try {
        // Criar o projeto
        const novoProjeto = await Projeto.create({
            nome_projeto,
            resumo_projeto,
            link_externo: link_externo || null
        });

        // Adicionar o usuário como desenvolvedor do projeto
        await ProjetoDevs.create({
            id_projeto: novoProjeto.id_projeto,
            id_usuario: id_usuario
        });

        res.status(201).json({
            message: "Projeto criado com sucesso",
            projeto: novoProjeto
        });
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(500).json({
            error: "Não foi possível criar o projeto",
            details: error.message
        });
    }
};