# Sistema de Vistorias - Fullstack Q3

Sistema completo de gerenciamento de vistorias veiculares desenvolvido com arquitetura moderna e tecnologias atuais.

## 📋 Sobre o Projeto

O Sistema de Vistorias é uma aplicação fullstack que permite o gerenciamento completo de vistorias veiculares, incluindo:

- **Gestão de Veículos**: Cadastro de veículos com informações detalhadas
- **Gestão de Vistorias**: Criação e acompanhamento de vistorias
- **Gestão de Problemas**: Catalogação de problemas encontrados nas vistorias
- **Relatórios**: Geração de relatórios e análises
- **Autenticação**: Sistema seguro de login com JWT

## 🛠️ Stack Tecnológica

### Frontend (Web)
- **Next.js 15** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

### Backend (API)
- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **JWT** - Autenticação
- **Argon2** - Hash de senhas
- **Passport** - Estratégias de autenticação

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **pnpm** - Gerenciador de pacotes
- **Turbo** - Build system e monorepo
- **ESLint** - Linting
- **Prettier** - Formatação de código

## 🏗️ Arquitetura

O projeto segue uma arquitetura de monorepo com separação clara de responsabilidades:

```
fullstack-q3/
├── apps/
│   ├── web/                 # Frontend Next.js
│   └── api/                 # Backend NestJS
├── packages/
│   ├── contracts/           # Contratos compartilhados
│   ├── config-eslint/       # Configuração ESLint
│   ├── config-typescript/   # Configuração TypeScript
│   └── jest-presets/        # Configuração Jest
├── docker-compose.dev.yml   # Orquestração de containers
├── Dockerfile.web          # Container do frontend
├── Dockerfile.server       # Container do backend
└── turbo.json              # Configuração do Turbo
```

### Estrutura do Frontend (apps/web/)
```
apps/web/src/
├── app/                    # App Router do Next.js
│   ├── (protected)/       # Rotas protegidas
│   └── (unprotected)/     # Rotas públicas
├── components/            # Componentes reutilizáveis
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e configurações
└── services/              # Serviços de API
```

### Estrutura do Backend (apps/api/)
```
apps/api/src/
├── auth/                  # Módulo de autenticação
├── invoices/              # Módulo de vistorias
│   ├── abstractions/      # Interfaces e modelos
│   ├── api/              # Controllers e presenters
│   └── infrastructure/   # Repositórios e implementações
├── surveyor/             # Módulo de vistoriadores
├── reports/              # Módulo de relatórios
├── migrations/           # Migrações do banco
├── seeds/               # Seeds e factories
└── app.module.ts        # Módulo principal
```

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- pnpm 8.15.6+

### Executando com Docker Compose (Recomendado)

1. **Clone o repositório:**
```bash
git clone https://github.com/vinicivs-rocha/invoice-flow
cd fullstack-q3
```

2. **Execute o projeto:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

3. **Acesse as aplicações:**
- **Credenciais padrão**: utilize o email `john.doe@example.com` e a senha `123456` para autenticar-se.
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Executando em Desenvolvimento Local

1. **Instale as dependências:**
```bash
pnpm install
```

2. **Execute o banco de dados:**
```bash
docker-compose -f docker-compose.dev.yml up postgres redis -d
```

3. **Execute as aplicações:**
```bash
# Terminal 1 - Backend
pnpm dev --filter=api

# Terminal 2 - Frontend
pnpm dev --filter=web
```

## 🗄️ Banco de Dados

### Entidades Principais

- **Surveyor (Vistoriador)**: Usuários que realizam vistorias
- **Vehicle (Veículo)**: Veículos a serem vistoriados
- **Invoice (Vistoria)**: Vistorias realizadas
- **Problem (Problema)**: Problemas encontrados nas vistorias

### Migrações

O sistema utiliza TypeORM para gerenciar migrações automaticamente. As migrações são executadas na inicialização da aplicação.

### Seeds

Em ambiente de desenvolvimento, o sistema popula automaticamente o banco com dados de exemplo usando factories e seeders.

## 🔧 Scripts Disponíveis

### Scripts do Monorepo
```bash
pnpm dev          # Executa todas as aplicações em modo desenvolvimento
pnpm build        # Build de todas as aplicações
pnpm lint         # Executa linting em todo o projeto
pnpm format       # Formata o código com Prettier
pnpm check-types  # Verifica tipos TypeScript
```

### Scripts da API
```bash
pnpm dev --filter=api                    # Desenvolvimento da API
pnpm build --filter=api                  # Build da API
pnpm migration:generate --filter=api     # Gerar nova migração
pnpm migration:run --filter=api          # Executar migrações
pnpm seed --filter=api                   # Executar seeds
```

### Scripts do Web
```bash
pnpm dev --filter=web        # Desenvolvimento do frontend
pnpm build --filter=web      # Build do frontend
pnpm start --filter=web      # Executar em produção
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Login**: `/auth/sign-in`
- **Refresh Token**: Implementado para renovação automática
- **Proteção de Rotas**: Middleware de autenticação no frontend

## 📊 Funcionalidades

### Para Vistoriadores
- Login e autenticação
- Visualização de faturas
- Criação de novas faturas
- Gestão de veículos
- Relatórios de vistorias

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato através dos issues do GitHub ou email: [vinicvsdev@gmail.com]()
