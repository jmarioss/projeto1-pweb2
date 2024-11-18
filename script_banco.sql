CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
	tipo VARCHAR(20) CHECK (tipo IN ('aluno', 'administrador')) NOT NULL
);

CREATE TABLE projetos (
    id_projeto SERIAL PRIMARY KEY,
    nome_projeto VARCHAR(150) NOT NULL,
    resumo_projeto TEXT NOT NULL,
    link_externo VARCHAR(255)
);

CREATE TABLE palavras_chave (
    id_palavra_chave SERIAL PRIMARY KEY,
    nome_palavra_chave VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE projetos_palavras_chave (
    id_projeto INT NOT NULL,
    id_palavra_chave INT NOT NULL,
    PRIMARY KEY (id_projeto, id_palavra_chave),
    FOREIGN KEY (id_projeto) REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    FOREIGN KEY (id_palavra_chave) REFERENCES palavras_chave(id_palavra_chave) ON DELETE CASCADE
);


CREATE TABLE projetos_desenvolvedores (
    id_projeto INT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_projeto, id_usuario),
    FOREIGN KEY (id_projeto) REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


CREATE TABLE conhecimentos (
    id_conhecimento SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE usuarios_conhecimentos (
    id_usuario INT NOT NULL,
    id_conhecimento INT NOT NULL,
    nivel INT CHECK (nivel BETWEEN 0 AND 10),
    PRIMARY KEY (id_usuario, id_conhecimento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_conhecimento) REFERENCES conhecimentos(id_conhecimento) ON DELETE CASCADE
);
