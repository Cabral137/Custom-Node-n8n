# Custom Node n8n

Esse repositório contém os arquivos necessários para a execução de um node customizado para a plataforma de automação n8n. O nó customizado Random se conecta à API do random.org para gerar um número aleatório com base em um valor mínimo e máximo fornecido pelo usuário. 

O projeto inclui o código-fonte do nó e toda a configuração de ambiente necessária para executá-lo localmente usando Docker e Docker Compose.

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração das Ferramentas](#instalação-e-configuração-das-ferramentas)
- [Funcionamento da Aplicação](#funcionamento-da-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)

---
## Pré-requisitos
Antes de começar, garanta que você tenha as seguintes ferramentas instaladas em seu sistema:

- **Node.js (versão 22):** É recomendado usar um gerenciador de versões como o nvm.

- **Docker e Docker Compose:** Essencial para criar e gerenciar o ambiente de execução do n8n.

## Instalação e Configuração das Ferramentas


**1. Clone este repositório**
```
git clone https://github.com/Cabral137/Custom-Node-n8n.git
cd Custom-Node-n8n
```
**2. Configure a versão correta do Node.js**
```
// O arquivo .nvmrc já está no projeto.
nvm use
```
**3. Instale as dependências do projeto**
```
npm install
```
**4. Configure as variáveis de ambiente**
```
// Copie o arquivo de exemplo para criar seu arquivo de ambiente local.
cp .env.example .env
```
**5. Compile o código do nó customizado**
```
// Este comando transforma o código TypeScript em JavaScript na pasta `dist/`.
npm run build
```
**6. Inicie o ambiente n8n com Docker**
```
// Este comando irá baixar as imagens e iniciar os contêineres do n8n e do banco de dados.
docker compose up -d
```

Após a execução desses comandos, o ambiente n8n estará rodando e acessível no seu navegador na porta 5678.

---

## Funcionamento da Aplicação

1. A função execute no arquivo nodes/Random/Random.node.ts é acionada.

2. Ela captura os valores de Mínimo e Máximo inseridos pelo usuário na interface.

3. Constrói a URL de requisição para a API do random.org, por exemplo: https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new.

4. Faz uma requisição GET e recebe como resposta um número em formato de texto.

5. O número é convertido e retornado como uma saída JSON, que pode ser usada por outros nós no workflow do n8n.

---

## Estrutura do projeto
```
|
├── nodes/
│   └── Random/
│       ├── Random.node.ts  // O código-fonte principal do nó em TypeScript.
│       └── random.svg      // O ícone do nó que aparece na interface do n8n.
├── .env.example            // Molde para o arquivo .env, seguro para ir ao Git.
├── .gitignore              // Define quais arquivos e pastas o Git deve ignorar.
├── .nvmrc                  // Especifica a versão do Node.js para o projeto.
├── docker-compose.yaml     // Configura os serviços Docker (n8n + Postgres).
├── gulpfile.js             // Automatiza tarefas de build.
├── package.json            // Gerencia as dependências e scripts do projeto (npm install, npm run build).
├── package-lock.json       // Trava as versões exatas das dependências.
├── tsconfig.json           // Define as regras para o compilador TypeScript.
│
├── dist/                   // (Gerado ao executar) Contém o código JavaScript compilado.
└── node_modules/           // (Gerado ao executar) Armazena os pacotes das dependências.

```
---

