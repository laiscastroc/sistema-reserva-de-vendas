![alt text](image.png)

---
# Bird Sales System

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![NodeJS](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![REST API](https://img.shields.io/badge/API-REST-orange)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

Sistema simples para gerenciamento de vendas de aves desenvolvido com arquitetura moderna e organização baseada em Clean Architecture.

[Demo](https://seu-projeto.vercel.app) • [API](https://api-seuprojeto.vercel.app) • [Issues](https://github.com/seu-usuario/bird-sales-system/issues)

</div>

---

# Sobre o projeto

O Bird Sales System foi criado para centralizar o gerenciamento de aves, estoque e vendas em uma única aplicação. O projeto aplica princípios modernos de desenvolvimento:

* Clean Architecture
* SOLID
* Separation of Concerns
* Componentização
* API REST
* Tipagem forte com TypeScript
* Código reutilizável

---

# Features

### Gestão de aves

* Cadastro
* Edição
* Remoção
* Busca
* Filtros

### Controle de estoque

* Quantidade disponível
* Atualização automática
* Histórico

### Vendas

* Registro de vendas
* Histórico
* Consulta

### Sistema

* Validações
* Tratamento de erros
* Rate Limiting
* Middleware global
* Toast notifications
* Rotas protegidas
* Variáveis de ambiente
* Organização modular

---

# Arquitetura

Fluxo:

```text id="6hj2kf"
Client
   ↓
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```
---

# Estrutura de pastas

```bash id="1h73qa"
bird-sales-system
│
├── frontend
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   └── ui/
│   │   │
│   │   ├── composables/
│   │   ├── constants/
│   │   ├── router/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── views/
│   │   │
│   │   ├── App.vue
│   │   └── main.ts
│   │
│   └── package.json
│
│
├── backend
│   │
│   ├── database/
│   │   │
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── migrate.js
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── .env
├── .gitignore
└── package.json
```

---

# Tecnologias

## Frontend

* Vue 3, Vite, Vue Router
* TypeScript
* Composition API

## Backend

* Node.js
* Express
* JavaScript

## Banco

* PostgreSQL, Neon Database

## Deploy

* Vercel

## Qualidade

* ESLint
* Prettier
* Git
* GitHub

---

# Instalação

### Clonar projeto

```bash id="skzw2v"
git clone https://github.com/laiscastroc/bird-sales-system.git
```

Entrar na pasta:

```bash id="v7k1na"
cd bird-sales-system
```

---

## Frontend

Instalar dependências:

```bash id="8k2fvd"
cd frontend

npm install
```

Executar:

```bash id="8dyg9e"
npm run dev
```

Aplicação:

```bash id="rr4l55"
http://localhost:5173
```

---

## Backend

Instalar dependências:

```bash id="7m8r2x"
cd backend

npm install
```

Executar:

```bash id="by9rll"
npm run dev
```

Servidor:

```bash id="sljdz1"
http://localhost:3000
```

---

# Variáveis de ambiente

### Frontend

```env id="pz26yf"
VITE_API_URL=http://localhost:3000/api
```

### Backend

```env id="g3yz53"
PORT=3000

DATABASE_URL=sua_connection_string_neon

NODE_ENV=development
```

---

# API Endpoints

## Birds

| Método | Endpoint       |
| ------ | -------------- |
| GET    | /api/birds     |
| GET    | /api/birds/:id |
| POST   | /api/birds     |
| PUT    | /api/birds/:id |
| DELETE | /api/birds/:id |

---

## Sales

| Método | Endpoint   |
| ------ | ---------- |
| GET    | /api/sales |
| POST   | /api/sales |

---

# Deploy

Deploy automatizado utilizando:

* Vercel
* Neon PostgreSQL

Fluxo:

```text id="f08jig"
Push GitHub
     ↓

Vercel Build
     ↓

Deploy automático
     ↓

Produção
```

---

# Futuras implementações

* JWT Authentication
* Dashboard analítico
* Docker
* Testes unitários e integração
* Swagger
* CI/CD
* Logs estruturados
* Upload de imagens
* Redis cache

---

# Licença

Distribuído sob licença MIT.

---

# Desenvolvedor

Laís Castro

GitHub:

https://github.com/laiscastroc

LinkedIn:

https://www.linkedin.com/in/la%C3%ADs-castro/

Email:

laisccastroc2023@gmail.com

