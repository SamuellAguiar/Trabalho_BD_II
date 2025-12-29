## Sistema para Registro Anônimo de Ocorrências em Ambiente Universitário

<p align="center">
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge" #vitrinedev/>
</p>

## Sobre o Projeto
O sistema tem como finalidade fornecer um canal seguro, anônimo e acessível para que membros da comunidade universitária registrem relatos relacionados à segurança no campus, como furtos, situações de risco, iluminação deficiente, assédio ou problemas estruturais. O objetivo é permitir à instituição monitorar padrões, identificar áreas críticas e melhorar a atuação preventiva. 

## Requisitos

- Permitir o registro anônimo de relatos, sem autenticação obrigatória.

- Armazenar textos de tamanhos variados, anexos opcionais (como fotos) e localizações aproximadas.

- Registrar categoria do problema, data, horário e setor da universidade.
    
- Permitir consulta filtrada por período, categoria, área do campus ou palavras-chave.
    
- Possibilitar atualização do status de cada ocorrência pela equipe responsável (pendente, analisando, resolvido).

- Permitir visualização de estatísticas gerais, como volume de relatos por região ou tipo de ocorrência.

## Modelagem Conceitual

Modelagem Conceitual do projeto com a notação ER.

Feita na ferramenta brModelo.

![Modelagem Conceitual ER](/assets/Modelo%20Conceitual%20ER.png)

## Modelagem Lógica

Mapeamento Conceitual-Lógico do sistemas.

Utilizada a abordagem de projeto lógico de alto e baixo nível.

### Modelagem de Alto Nível

![Modelagem de Alto Nível](/assets/Modelagem%20Alto%20Nível.png)

### Modelagem de Baixo Nível

- Modelagem de Ocorrência

![Documento de Ocorrência](/assets/Mod%20BN1.png)

- Modelagem de Setor

![Documento de Setor](/assets/Mod%20BN2.png)

- Modelagem de Categoria

![Documento de Categoria](/assets/Mod%20BN3.png)

## Tecnologias Utilizadas

- Back End:
    
  [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)

- Front End:

  [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#) [![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)](#) [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)

- Bando de Dados

   
  [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)


## Autores

- [Samuell Aguiar] (www.github.com/SamuellAguiar)
- [Gabriel Roberto] (www.github.com/BielCandido)
- [Albert Ofori] (www.github.com/AlbertJohnson994)
