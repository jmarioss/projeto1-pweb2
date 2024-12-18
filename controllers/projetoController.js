const Projeto = require("../models/projetoModels")
const ProjetoDevs = require("../models/projeto_desenvolvedoresModels") 
const ProjetoPalavraChave = require("../models/projeto_palavra_chaveModels")
const Usuario = require("../models/usuarioModels")
const PalavraChave = require("../models/palavra_chaveModels")

exports.paginaListarProjetosAll = async (req, res) => {
    try {
        const projetos = await Projeto.findAll({
            attributes: ["id_projeto", "nome_projeto", "resumo_projeto", "link_externo"], 
        });

        const idsProjetos = projetos.map(projeto => projeto.id_projeto);

        const projetosDevs = await ProjetoDevs.findAll({
            where: {
                id_projeto: idsProjetos, 
            },
        });

        const projetosPalavrasChave = await ProjetoPalavraChave.findAll({
            where: {
                id_projeto: idsProjetos,
            },
        });

        const idsUsuarios = [...new Set(projetosDevs.map(pd => pd.id_usuario))];
        const idsPalavrasChave = [...new Set(projetosPalavrasChave.map(pp => pp.id_palavra_chave))];

        const usuarios = await Usuario.findAll({
            where: {
                id_usuario: idsUsuarios, 
            },
            attributes: ["id_usuario", "nome_usuario", "email"],
        });

        const palavrasChave = await PalavraChave.findAll({
            where: {
                id_palavra_chave: idsPalavrasChave,
            },
            attributes: ["id_palavra_chave", "nome_palavra_chave"],
        });

        const usuariosMap = usuarios.reduce((map, usuario) => {
            map[usuario.id_usuario] = usuario;
            return map;
        }, {});

        const palavrasChaveMap = palavrasChave.reduce((map, palavra) => {
            map[palavra.id_palavra_chave] = palavra;
            return map;
        }, {});

        const allProject = projetos.map(projeto => {
            const usuariosRelacionados = projetosDevs
                .filter(pd => pd.id_projeto === projeto.id_projeto)
                .map(pd => usuariosMap[pd.id_usuario]);

            const palavrasRelacionadas = projetosPalavrasChave
                .filter(pp => pp.id_projeto === projeto.id_projeto)
                .map(pp => palavrasChaveMap[pp.id_palavra_chave]);

            return {
                ...projeto.dataValues,
                Usuarios: usuariosRelacionados,
                PalavrasChave: palavrasRelacionadas, 
            };
        });

        res.render("listarProjetos", {
            title: "Projetos",
            allProject,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: "Não foi possível carregar a página", details: error.message });
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

exports.criar = async ( req, res ) => {
    const { nome_projeto, resumo, link, id_palavra_chave, id_alunos } = req.body 
    if(!nome_projeto || !resumo || !link || !id_palavra_chave || !id_alunos){
        res.status(401).json({error: "Informe todos os campos"})
    }
    try{
        const novoProjeto = await Projeto.create(
            {
                nome_projeto: nome_projeto,
                resumo_projeto: resumo,
                link_externo: link,
            }
        )
        
        const  novoProjetoPalavraChave = id_palavra_chave.map((idPalavraChave) => (
            {
                id_projeto: novoProjeto.id_projeto,
                id_palavra_chave: idPalavraChave
            }
        )) 

        const novoProjetoDevs = id_alunos.map((idAluno) => (
            {
                id_projeto: novoProjeto.id_projeto,
                id_usuario: idAluno
            }
        ))

        await ProjetoPalavraChave.bulkCreate(novoProjetoPalavraChave)
        await ProjetoDevs.bulkCreate(novoProjetoDevs)

        res.status(201).json({message: "Projeto criado com sucesso", novoProjeto,})

    }catch(error){
        res.status(401).json({error: "Não foi possível criar projeto", details: error.message})
    }
}