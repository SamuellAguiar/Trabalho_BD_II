# Sentinel - Sistema de Registro Anônimo de Ocorrências

<p align="center">
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge" #vitrinedev/>
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#modelagem">Modelagem</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#como-executar">Como Executar</a> •
  <a href="#autores">Autores</a> •
  <a href="#licença">Licença</a>
</p>

## Sobre o Projeto

O **Sentinel** é um sistema desenvolvido para fornecer um canal seguro, anônimo e acessível para que membros da comunidade universitária registrem relatos relacionados à segurança no campus. 

### Objetivo

Permitir à instituição:
- Monitorar padrões de ocorrências
- Identificar áreas críticas do campus
- Melhorar a atuação preventiva
- Proporcionar ambiente mais seguro para todos

### Tipos de Ocorrências

O sistema permite o registro de diversos tipos de incidentes, como:
- Furtos e roubos
- Situações de risco
- Iluminação deficiente
- Assédio
- Problemas estruturais
- Outras questões de segurança 

## Funcionalidades

### Para Usuários (Público)
- **Registro Anônimo**: Criar relatos sem necessidade de autenticação
- **Anexos**: Adicionar fotos e evidências às ocorrências
- **Localização**: Registrar local aproximado do incidente
- **Consulta**: Filtrar ocorrências por período, categoria ou palavras-chave
- **Visualização**: Acompanhar estatísticas gerais de segurança

### Para Administradores
- **Acesso Protegido**: Login administrativo para gestão
- **Gerenciamento**: Atualizar status das ocorrências (pendente, em análise, resolvido)
- **Dashboard**: Visualizar métricas e padrões de ocorrências
- **Categorização**: Gerenciar setores e categorias
- **Relatórios**: Analisar volume de relatos por região e tipo

## Modelagem

### Modelagem Conceitual

Modelagem Conceitual do projeto utilizando a notação ER, desenvolvida na ferramenta brModelo.

![Modelagem Conceitual ER](/assets/Modelo%20Conceitual%20ER.png)

### Modelagem Lógica

Mapeamento Conceitual-Lógico do sistema utilizando a abordagem de projeto lógico de alto e baixo nível.

#### Modelagem de Alto Nível

![Modelagem de Alto Nível](/assets/Modelagem%20Alto%20Nível.png)

#### Modelagem de Baixo Nível

**Documento de Ocorrência**

![Documento de Ocorrência](/assets/Mod%20BN1.png)

**Documento de Setor**

![Documento de Setor](/assets/Mod%20BN2.png)

**Documento de Categoria**

![Documento de Categoria](/assets/Mod%20BN3.png)

## Tecnologias

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express.js-404d59.svg?logo=express&logoColor=white)](#)

### Frontend
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](#)

### Banco de Dados
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)

### Ferramentas de Desenvolvimento
[![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)](#)

## Como Executar

### Pré-requisitos

Antes de começar, você precisará ter instalado:
- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/) (ou acesso a uma instância MongoDB)

### Clonando o Repositório

```bash
git clone https://github.com/SamuellAguiar/Trabalho_BD_II.git
cd Trabalho_BD_II
```

### Configuração do Backend

```bash
cd app/server

npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env com as configurações do MongoDB

node server.js
```

### Configuração do Frontend

```bash
cd app/client

npm install
 
npm run dev
```

### Acessando a Aplicação

Após iniciar o servidor e o cliente, acesse:
- **Frontend**: `http://localhost:5173`

- **Backend API**: `http://localhost:3000`

## Estrutura do Projeto

```
Trabalho_BD_II/
├── app/
│   ├── client/          # Aplicação React (Frontend)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   └── main.jsx
│   │   └── package.json
│   └── server/          # API Node.js (Backend)
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── repositories/
│       │   ├── routes/
│       │   ├── schemas/
│       │   ├── services/
│       │   ├── utils/
│       │   └── app.js
│       ├── package.json
│       └── server.js
├── assets/              # Imagens e recursos
└── README.md
```


## Autores

<table>
  <tr>
    <td align="center">
        <a href="https://github.com/AlbertJohnson994">
          <img src="./assets/Albert.jpg" width="100px;" alt="Albert Ofori" style="border-radius: 50%;"/><br>
          <sub>
            <b>Albert Ofori</b>
          </sub>
        </a>
    </td>
    <td align="center">
      <a href="https://github.com/BielCandido">
        <img src="./assets/Gabriel.jpg" width="100px;" alt="Gabriel Roberto" style="border-radius: 50%;"/><br>
        <sub>
          <b>Gabriel Roberto</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SamuellAguiar">
        <img src="./assets/Samuell.jpg" width="100px;" alt="Samuell Aguiar" style="border-radius: 50%;"/><br>
        <sub>
          <b>Samuell Aguiar</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## Licença

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Banco de Dados II.

