# Projeto 1 - Programação Web 2

Sistema de Gerenciamento de Projetos e Desenvolvedores desenvolvido para a disciplina de Programação Web 2 da UTFPR.

## 👥 Autores

### Jose Mario da Silva Santos
- GitHub: [@jmarioss](https://github.com/jmarioss)
- Email: josemario@alunos.utfpr.edu.br
- RA: 2523825

### Luis Miguel
- GitHub: [@luismiguel](https://github.com/luismiguel)
- Email: lmiguel@alunos.utfpr.com.br
- RA: 2523884## 👥 Autores

### Jose Mario da Silva Santos
- GitHub: [@jmarioss](https://github.com/jmarioss)
- Email: josemario@alunos.utfpr.edu.br
- RA: 2523825

### Luis Miguel
- GitHub: [@luismiguel](https://github.com/luismiguel)
- Email: lmiguel@alunos.utfpr.com.br
- RA: 2523884

## 🚀 Funcionalidades

- **Autenticação de Usuários**
  - Login
  - Cadastro de usuários
  - Middleware de autenticação

- **Gerenciamento de Perfil**
  - Visualização de dados do usuário
  - Gerenciamento de conhecimentos/habilidades
  - Visualização de projetos associados

- **Gerenciamento de Projetos**
  - Criação de projetos
  - Edição de projetos
  - Exclusão de projetos
  - Adição de participantes
  - Visualização de detalhes

## 🛠️ Tecnologias Utilizadas

- **Backend**
  - Node.js
  - Express.js
  - Sequelize ORM
  - PostgreSQL
  - bcrypt para criptografia

- **Frontend**
  - EJS (Embedded JavaScript)
  - Bootstrap 5
  - JavaScript

## 📋 Pré-requisitos

- Node.js
- MySQL Server
- NPM

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/jmarioss/projeto1-pweb2.git
cd projeto1-pweb2
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
   - Crie um banco de dados PostgreSQL
   - Copie o arquivo `.env.example` para `.env`
   - Configure as variáveis de ambiente no arquivo `.env` com suas credenciais

4. Inicie o servidor:
```bash
node app.js
```

## 🗄️ Estrutura do Banco de Dados

- **Usuario**: Armazena dados dos usuários
- **Projeto**: Informações dos projetos
- **Conhecimento**: Lista de conhecimentos/habilidades
- **ProjetoDevs**: Relacionamento entre projetos e desenvolvedores
- **UsuarioConhecimento**: Habilidades dos usuários

## 🔐 Rotas da API

### Autenticação
- `POST /usuario/entrar` - Login
- `POST /usuario/cadastrar/create` - Cadastro

### Usuários
- `GET /usuario/:id_usuario` - Dados do usuário e seus projetos
- `POST /usuario/:id_usuario/conhecimento` - Adicionar conhecimento
- `DELETE /usuario/:id_usuario/conhecimento/:id_conhecimento` - Remover conhecimento

### Projetos
- `POST /usuario/:id_usuario/projeto` - Criar projeto
- `PUT /usuario/:id_usuario/projeto/:id_projeto` - Editar projeto
- `DELETE /usuario/:id_usuario/projeto/:id_projeto` - Excluir projeto
- `POST /usuario/projeto/:id_projeto/add-pessoa` - Adicionar participante

## 📄 Licença

Este projeto está sob a licença Mozilla Public License 2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎓 Instituição

Universidade Tecnológica Federal do Paraná (UTFPR)
