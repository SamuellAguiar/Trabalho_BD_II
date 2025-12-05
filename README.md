## Trabalho de Banco de Dados II

## Tema: Sistema para Registro Anônimo de Ocorrências em Ambiente Universitário

## Sobre o Projeto:
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
    
    - Java (Spring Boot)

- Front End:

    - React.JS

- Bando de Dados

    - MongoDB
