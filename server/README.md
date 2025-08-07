# Speed-Banco - Projeto ONG

Este é um projeto de backend para uma ONG utilizando Node.js, TypeScript e MySQL.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MySQL Server
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd Speed-Banco/server
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   - Certifique-se de que o MySQL está rodando
   - Crie um banco de dados chamado `projeto_ONG`
   - Configure as variáveis de ambiente (veja seção de configuração)

4. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na pasta server com o seguinte conteúdo:
   ```env
   # Configurações do Banco de Dados MySQL
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui
   DB_NAME=projeto_ONG
   DB_PORT=3306

   # Configurações do Servidor
   PORT=3000
   NODE_ENV=development
   ```

## 🗄️ Configuração do Banco de Dados

1. **Crie o banco de dados:**
   ```sql
   CREATE DATABASE projeto_ONG;
   ```

2. **Teste a conexão:**
   ```bash
   npm run start
   ```

## 📁 Estrutura do Projeto

```
server/
├── server.ts          # Servidor principal
├── database.ts        # Configuração do banco de dados
├── config.ts          # Configurações centralizadas
├── package.json       # Dependências do projeto
├── tsconfig.json      # Configuração TypeScript
└── README.md         # Este arquivo
```

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot reload
- `npm run build` - Compila o projeto TypeScript

## 🔧 Funcionalidades do Banco de Dados

O arquivo `database.ts` inclui:

- **Pool de conexões** para melhor performance
- **Função de teste de conexão** para verificar se o banco está acessível
- **Função para executar queries** com tratamento de erros
- **Função para obter conexões** do pool

## 📝 Exemplo de Uso

```typescript
import { testConnection, executeQuery } from './database';

// Testar conexão
await testConnection();

// Executar uma query
const users = await executeQuery('SELECT * FROM usuarios');
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. 