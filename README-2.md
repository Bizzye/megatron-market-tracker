# Megatron - Sistema de Histórico de Preços# Plano do Sistema de Histórico de Preços

Sistema completo de rastreamento de preços com upload de notas fiscais (XML/PDF/Imagem), extração de dados e histórico de preços.## Visão Geral

## 🏗️ ArquiteturaAplicativo web full-stack para extração e histórico de preços a partir de notas fiscais (XML ou imagem). Frontend em React para fluxo end-to-end: upload, revisão/edição de itens e exibição de histórico de preços. Backend em Node/Express com processamento (OCR para imagens e parser para XML), enriquecimento via API externa de códigos/produtos e persistência em MongoDB. Fluxo básico: usuário faz upload de um arquivo -> backend processa e retorna JSON com produtos (nome, código, descrição, valor, origem) -> frontend permite revisar/editar/remover itens e salva entradas de preço no histórico.

````## Frontend

megatron/

├── frontend/        # React + Vite + TypeScript (porta 3000/3001)- Stack: Vite + React 18 + TypeScript, Tailwind CSS (incl. plugin forms), React Hook Form + Zod para validação.

├── backend/         # Express + MongoDB + TypeScript (porta 4000)- Arquitetura: Atomic Design

└── README.md        # Este arquivo  - Atoms: Button, Input, PriceTag, FileInput, Badge.

```  - Molecules: UploadDropzone, ProductSummaryCard, ProductRow.

  - Organisms: UploadStepForm, ProductEditorList, HistoryTable.

## 🚀 Quick Start  - Pages/Templates: DashboardPage, UploadPage.

- Hooks/Estado:

### 1. Pré-requisitos  - Hooks: useUploadFlow, useProductsApi, useDebouncedSave.

  - Estado: Estado local/fluxo; React Query para cache e requisições remotas.

- Node.js 20+- Fluxo de telas:

- pnpm 10+  1. Upload: formulário com campo file (aceita XML e imagens), preview básico.

- Docker (para MongoDB)  2. Revisão: lista editável de produtos extraídos com opções de adicionar/editar/remover; validações e normalizações (moeda, códigos).

  3. Histórico: tabela listando variações de preço por produto (sem filtros iniciais).

### 2. Setup Inicial- Qualidade: ESLint + Prettier, TypeScript estrito, testes com Vitest.



```bash## Backend

# Instalar dependências do backend

cd backend- Stack: Node.js 20 + Express + TypeScript + Mongoose.

pnpm install- Modelos principais:

  - User (autenticação).

# Instalar dependências do frontend  - Product (nome, código, descrição, metadados).

cd ../frontend  - PriceEntry (produto, valor, data, origem).

pnpm install- Serviços:

```  - ProductCodeService para consultar API_KEY (enriquecer com código/descrição).

- Autenticação: JWT (rotas /auth/register e /auth/login).

### 3. Configurar MongoDB- Uploads: middleware Multer limitando 1 arquivo por requisição e tamanho.

- Rotas principais:

```bash  - POST /uploads -> recebe arquivo, processa (OCR/XML parsing + busca de códigos), retorna lista de produtos extraídos.

# Na pasta backend/  - CRUD /products -> gerenciar catálogo de produtos.

cd backend  - GET /history -> retornar entradas de preço por produto (paginação simples).

- Operação inicial: processamento síncrono (sem WebSocket/SSE). Evoluir para async/filas se necessário ou POOLING.

# Iniciar container MongoDB (porta 27018)

docker-compose up -d## Configuração / Env



# Verificar se está rodandoVariáveis esperadas:

docker ps | grep megatron-mongo

```- API_KEY



O MongoDB estará disponível em:## Ações Imediatas

- **Host:** localhost

- **Porta:** 27018- Criar monorepo ou repo com pastas/packages `frontend` e `backend`.

- **Usuário:** megatron- Inicializar boilerplate frontend (Vite + TS + Tailwind) e backend (Express + TS).

- **Senha:** megatron123- Configurar lint, formatação e testes (ESLint, Prettier, Vitest) e CI básico.

- **Database:** megatron- Prototipar endpoints críticos: POST /uploads e CRUD /products.

- Implementar UploadStepForm e fluxo de revisão mínimo no frontend.

### 4. Iniciar os Serviços- Definir esquema inicial de banco e modelos Mongoose.

- Priorizar proteções básicas: limites de upload, validação de arquivos e autenticação JWT.

#### Terminal 1 - Backend

```bash
cd backend
pnpm dev
````

Deve aparecer:

```
✅ MongoDB connected successfully
🚀 Server running on port 4000
```

#### Terminal 2 - Frontend

```bash
cd frontend
pnpm dev
```

Acesse: **http://localhost:3000**

## 📡 Sistema Funcionando

### Backend

- **URL:** http://localhost:4000
- **Health Check:** http://localhost:4000/health
- **API Base:** http://localhost:4000/api

### Frontend

- **URL:** http://localhost:3000 (ou 3001)
- **Conecta automaticamente ao backend**

## 📝 Features

### ✅ Implementadas

**Backend:**

- ✅ Autenticação JWT completa
- ✅ CRUD de produtos
- ✅ Upload de XML (NFe brasileira)
- ✅ Upload de PDF e imagens (OCR stub)
- ✅ Histórico de preços por produto
- ✅ Histórico global
- ✅ Security (Helmet, CORS, Rate Limit)
- ✅ Validação com Zod

**Frontend:**

- ✅ Dashboard com estatísticas
- ✅ Upload de arquivos (XML/PDF/Imagem)
- ✅ Revisão e edição de produtos
- ✅ Histórico de preços
- ✅ Atomic Design
- ✅ React Query para cache
- ✅ Zustand para estado local
- ✅ Formulários validados

### 🚧 Em Desenvolvimento

- OCR para PDF e imagens (implementar integração)
- Gráficos de variação de preços
- Exportação de relatórios
- Notificações de mudança de preço

## 🧪 Testando o Sistema

### 1. Registrar usuário

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","name":"Test User"}'
```

Resposta:

```json
{
  "user": { "id": "...", "email": "test@example.com", "name": "Test User" },
  "token": "eyJhbGciOiJI..."
}
```

### 2. Criar produto

```bash
TOKEN="<seu-token-aqui>"

curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Produto Teste","code":"TEST-001","description":"Descrição"}'
```

### 3. Upload de arquivo

```bash
curl -X POST http://localhost:4000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/invoice.xml"
```

## 📁 Estrutura do Projeto

### Backend (`/backend`)

```
├── src/
│   ├── config/          # Env validation, Database connection
│   ├── models/          # User, Product, PriceEntry (Mongoose)
│   ├── schemas/         # Zod validation schemas
│   ├── middlewares/     # Auth, Upload, Validation, Error
│   ├── services/        # Business logic (auth, products, upload, XML, OCR)
│   ├── routes/          # API routes
│   ├── utils/           # JWT utilities
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── uploads/             # Temporary file storage
└── docker-compose.yml   # MongoDB container
```

### Frontend (`/frontend`)

```
├── src/
│   ├── app/             # React Query provider
│   ├── components/
│   │   ├── atoms/       # Button, Input, Badge, FileInput, PriceTag
│   │   ├── molecules/   # UploadDropzone, ProductRow, ProductSummaryCard
│   │   └── organisms/   # UploadStepForm, ProductEditorList, HistoryTable
│   ├── hooks/           # useUploadFlow, useProductsApi, useDebouncedSave
│   ├── lib/             # apiClient, types, utilities
│   ├── pages/           # DashboardPage, UploadPage
│   └── store/           # Zustand store
```

## 🔧 Comandos Úteis

### Backend

```bash
pnpm dev          # Desenvolvimento com hot reload
pnpm build        # Build TypeScript
pnpm start        # Rodar build de produção
pnpm lint         # ESLint
pnpm test         # Vitest
```

### Frontend

```bash
pnpm dev          # Vite dev server (porta 3000)
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm lint         # ESLint
pnpm test         # Vitest
```

### MongoDB

```bash
# Ver logs
docker logs megatron-mongo -f

# Parar container
docker-compose down

# Resetar dados
docker-compose down -v && docker-compose up -d

# Backup
docker exec megatron-mongo mongodump \
  --username megatron --password megatron123 \
  --authenticationDatabase admin --out /data/backup
```

## 🛡️ Segurança

- JWT com expiração de 7 dias
- Senhas hasheadas com bcrypt (10 rounds)
- Helmet para security headers
- CORS configurado para localhost:3000/3001
- Rate limiting (100 req/15min por IP)
- Validação de inputs com Zod
- File upload limitado a 10MB

## 📡 API Endpoints

### Autenticação (`/api/auth`)

- **POST** `/register` - Registro de usuário
- **POST** `/login` - Login

### Produtos (`/api/products`)

- **GET** `/` - Listar produtos
- **POST** `/` - Criar produto
- **GET** `/:id` - Obter produto
- **PATCH** `/:id` - Atualizar produto
- **DELETE** `/:id` - Deletar produto
- **POST** `/:id/prices` - Adicionar preço manual
- **GET** `/:id/history` - Histórico do produto

### Upload (`/api/upload`)

- **POST** `/` - Upload de arquivo (XML/PDF/Imagem)

### Histórico (`/api/history`)

- **GET** `/` - Histórico completo de preços

**Todos os endpoints (exceto auth) requerem:**

```
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB

```bash
# Verificar se container está rodando
docker ps | grep megatron-mongo

# Ver logs do MongoDB
docker logs megatron-mongo

# Reiniciar container
cd backend && docker-compose restart
```

### Frontend não conecta ao backend

1. Verifique se o backend está rodando: `curl http://localhost:4000/health`
2. Confira o arquivo `.env` do frontend: `VITE_API_BASE_URL=http://localhost:4000/api`
3. Verifique o CORS no backend (deve aceitar localhost:3000 e 3001)

### Erro de autenticação

- Token expirado? Faça login novamente
- JWT_SECRET deve ter pelo menos 32 caracteres
- Verifique o header: `Authorization: Bearer <token>`

### Porta 3000 em uso

O Vite usa automaticamente a porta 3001 se a 3000 estiver ocupada. O backend já aceita ambas.

## 📚 Documentação Completa

- [Backend README](./backend/README.md) - API completa, troubleshooting
- [Backend Docker Guide](./backend/DOCKER.md) - MongoDB container
- [Frontend README](./frontend/README.md) - Componentes, hooks, testes

## 🔄 Fluxo de Desenvolvimento

1. Faça mudanças no código
2. Hot reload automático (backend: tsx watch, frontend: Vite)
3. Teste localmente
4. Rode `pnpm lint` antes de commitar
5. Rode `pnpm test` para garantir que não quebrou nada

## 📊 Status Atual

✅ Backend completo e funcional  
✅ Frontend completo e funcional  
✅ MongoDB configurado e rodando  
✅ Autenticação JWT implementada  
✅ API totalmente conectada  
✅ Upload de XML funcionando  
🚧 OCR para PDF/imagens (stub)

## 🤝 Próximos Passos

1. Implementar OCR real (Google Vision API ou Tesseract)
2. Adicionar gráficos de preços
3. Sistema de notificações
4. Exportação de relatórios (CSV/PDF)
5. Filtros avançados no histórico
6. Busca por texto nos produtos

## 📄 Licença

MIT
