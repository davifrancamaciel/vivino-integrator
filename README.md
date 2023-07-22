
<h3 align="center">
  <img src="frontend/src/assets/favicon.png" style='height:40px'> O Integrador Vivino é um projeto desenvolvido integraçoes de vinhos com a plataforma de marketplace 
  <a href='https://www.vivino.com/BR/pt-BR' target='_blank'>Vivino</a>.
</h3>

## **:rocket: OBJETIVO**

Projeto desenvolvido inicialmente para integração de Vinhos na plataforma Vivino, gerenciar usuários por perfis definidos e posteriormente adicionadas novas funcionalidades como vendas, despesas, roamenios de entregas utilizando [AWS Lambda][aws_lambda] com [Node Js][node] no backend e [React][react] + [TypeScript][typescript] no frontend

Na segunda versão o projeto ganhou mais integrações com a Vivino sendo possível agora capturar as vendas na plataforma e atualizar o estoque gerando cadastro das vendas no app Vivino e gerando um histórico de vendas de cada vinho. Foi também desmembrado de forma que agora possam ser adicionados vários clientes que possuam o mesmo interesse de vender seus vinhos na Vivino desta forma cada empresa possuirá uma conta no integrador totalmente isolada.

Visto a necessidade de desmembramento do sistema para que cada empresa possua a sua conta e um ambiente segmentado por perfis definidos agora também é possível ter varias contas de lojas que queiram controlar suas vendas, despesas, produtos, usuários de forma digital.

Foi adicionado um dashboard para que todas as informações contidas no sistema sejam cruzadas e informadas ao usuário para que o mesmo possa ver a saúde de sua empresa.

Para que tudo isso possa acontecer agora o sistema conta com mais tecnologias como SQS, S3 Amazon EventBridge e muito mais.
-  [Demo V1](http://vivino-integrator-dev.s3-website-us-east-1.amazonaws.com) 
Credenciais
```sh
login integradorvivino
senha 1234demo
```
-  [Demo V2](http://services-integrator-dev.s3-website-us-east-1.amazonaws.com) 
Credenciais
```sh
login integradorvivino@gmail.com
senha 1234demo
```

## **:computer: TECNOLOGIAS**


#### **Frontend** ([React][react] + [TypeScript][typescript])
- **[Ant Design][ant]** 
- **[Styled Components][styled_components]**
- **[AWS Amplify][aws_amplify]**
#### **Backend** ([NodeJS][node] + [AWS][aws])

- **[Serverless][serverless]** 
- **[AWS sdk][aws_sdk]**
- **[Sequelize][sequelize]**
- **[Sequelize cli][sequelize_cli]**

## **:wine_glass: COMO UTILIZAR**

Para este projeto será necessário conhecimentos prévios em [ReactJS][react] e arquitetura [AWS][aws] com utilização de [aws cli][aws_cli] e [serverless][serverless]

Para isso será necessária a criação de uma conta na [AWS][aws] 

Feito isso deverá ser feita a configuração das chaves de acordo com o [manual][aws_manual_key]

Instale as dependências contidas nos arquivos `package.json` que se encontram nos diretórios **backend** e **frontend**. Para instalar as dependências com o comando:

```sh
$ npm install
```

Exemplos:
```sh
# Instalando as dependências do backend:
$ cd ./backend
$ npm install

# Instalando as dependências do frontend:
$ cd ./frontend
$ npm install
```

### Utilizando o backend

Antes de rodar o backend serão necessários alguns passos prévios:
copiar o arquivo `secrets-stage_example.json` criando ao menos 1 arquivo com o seguinte nome:

```sh
secrets-dev.json
```
onde o trecho `dev` é o stage onde a aplicação será rodada

Substituir os valores abaixo da seguinte forma

```sh
DB_HOST= 192.168.1.1

# Senha que será usada no banco de dados (esta deve ser preenchida antes da primeira publicação)
DB_PASSWORD = 123456789

USER_POO_ID_OFFLINE = us-east-1_XXXXXXX
# Este somente será necessario ser preenchido se o desenvolvedor necessitar rodar a aplicação em modo offline em sua maquina

```

```sh
# Abrindo o terminal no diretório do servidor:
$ cd ./backend

# Executando a aplicação em modo de desenvolvimento local:
$ npm run dev

# Publicando na AWS (este comando ira criar toda a estrutura na aws da aplicação)
# criando um ambiente de desenvolvimento (dev) para criar novos ambientes por linha de comando pode ser 
# editado o bloco scripts no package.json com o ambiente desejado ou 
# rodar diretamente o comando passando stage desejado ex.: sls deploy --stage qa
$ npm run deploy
```
### Criar tabelas no banco de dados
Para criar as tabelas foi adotada uma biblioteca chamada [Sequelize cli][sequelize_cli]. Para criar as tabelas é necessário verificar o arquivo `src/database/db-migrations.js`
para que seja apontado o `stage` desejado que é o mesmo que foi usado para criar o banco e será usado para criar as tabelas neste banco.
No ex. que o projeto possui assumimos que o `stage` usado foi o `dev` mas pode ser mudado para qualquer nomenclatura desejada.

Feitas estas configurações basta rodar o comando 
```sh
$ npm run migrate
```
Para mais comandos de manipulação do banco visite a documentação da biblioteca em [Sequelize cli][sequelize_cli]
### Utilizando o frontend

Antes de rodar o front serão necessários alguns passos prévios:
copiar o arquivo `.env.example` criando ao menos 2 arquivos com os seguintes nomes:

```sh
.env.development
.env.local
```

Substituir os valores abaixo da seguinte forma

```sh
# Url para quando a api estiver rodando local no arquivo `.env.local`
REACT_APP_BASE_URL_API= http://localhost:4000/dev

### Url para quando a api estiver rodando no cloud aws no arquivo `.env.development` (ao fazer  deploy a url será exibida no console)
REACT_APP_BASE_URL_API= https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev

# Os valores das varaiveis abaixo serão os mesmos para os 2 arquivos

# Região onde irá rodar 
REACT_APP_REGION= us-east-1
# Este valor está disponível em [Amazon Cognito][aws_cognito] -> gerenciar grupos de usuários-> vivino-integrator-api-user-pool-dev -> 
# Configurações gerais -> ID do grupo ex.: us-east-1_xxxxxxx
REACT_APP_USER_POOL_ID= us-east-1_xxxxxxx

# Este valor está disponível em [Amazon Cognito][aws_cognito] -> gerenciar grupos de usuários -> vivino-integrator-api-user-pool-dev -> 
# Clientes de aplicativo -> Obter credenciais da AWS ex.: xxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_APP_CLIENT_ID= xxxxxxxxxxxxxxxxxxxxxxx

# Este valor está disponível em [Amazon Cognito][aws_cognito] -> gerenciar grupos identidade -> vivino-integrator-api-user-pool-dev -> 
# Código de exemplo -> ID do cliente de aplicativo ex.: us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_IDENTITY_POOL_ID= us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

```sh
# Abrindo o terminal no diretório do frontend:
$ cd ./frontend

# Executando o frontend no modo de desenvolvimento apontando para a api rodando localmente:
$ npm start

# Executando o frontend no modo de desenvolvimento apontando para o cloud aws:
$ npm run start:dev

# Publicando na AWS 
# O comando abaixo ira criar toda a estrutura na aws da aplicação frontend criando um ambiente de desenvolvimento (dev)
$ npm run config:aws

# Feita a criação do ambiente basta executar o comando abaixo para fazer o deploy
$ npm run deploy:aws

# Ao rodar os comandos acima pode ser que gere algum erro por conta de existir o bucketName vivino-integrator-dev será necessario um novo nome
```

> Se o browser não abrir automaticamente, acesse: http://localhost:3000.



## **:books: REFERÊNCIAS**

- [React + TypeScript Cheat Sheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)

- [ReactJS](https://reactjs.org/docs/getting-started.html) | [ReactJS pt-BR](https://pt-br.reactjs.org/docs/getting-started.html)
- [Ant Design][ant]
- [Styled Components][styled_components]
- [AWS Amplify][aws_amplify]
- [Node Js][node]
- [AWS][aws]
- [AWS Lambda][aws_lambda]
- [AWS cli][aws_cli]
- [AWS sdk][aws_sdk]
- [AWS manual de chaves][aws_manual_key]
- [Serverless][serverless]
- [Sequelize][sequelize]
- [Sequelize cli][sequelize_cli]
- [Vivino][vivino]



<!-- Techs -->

[typescript]: https://www.typescriptlang.org/

[react]: https://reactjs.org/

[ant]: https://ant.design/

[styled_components]: https://styled-components.com/

[node]: https://nodejs.org/en/

[serverless]: https://www.serverless.com/

[aws]: https://aws.amazon.com/pt/?nc2=h_lg

[aws_manual_key]: https://docs.aws.amazon.com/pt_br/cli/latest/userguide/cli-configure-envvars.html

[aws_cli]: https://docs.aws.amazon.com/pt_br/cli/latest/userguide/install-cliv2.html

[aws_cognito]: https://console.aws.amazon.com/cognito/home?region=us-east-1#

[aws_amplify]: https://aws.amazon.com/pt/amplify/

[aws_sdk]: https://aws.amazon.com/pt/sdk-for-javascript/

[sequelize]: https://sequelize.org

[sequelize_cli]: https://www.npmjs.com/package/sequelize-cli

[vivino]: https://www.vivino.com/BR/pt-BR/

[aws_lambda]: https://aws.amazon.com/pt/lambda/
