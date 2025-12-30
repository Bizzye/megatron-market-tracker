# Plano do Sistema de Histórico de Preços

## Visão Geral

Aplicativo web full-stack para extração e histórico de preços a partir de notas fiscais (XML ou imagem). Frontend em React para fluxo end-to-end: upload, revisão/edição de itens e exibição de histórico de preços. Backend em Node/Express com processamento (OCR para imagens e parser para XML), enriquecimento via API externa de códigos/produtos e persistência em MongoDB. Fluxo básico: usuário faz upload de um arquivo -> backend processa e retorna JSON com produtos (nome, código, descrição, valor, origem) -> frontend permite revisar/editar/remover itens e salva entradas de preço no histórico.

## Frontend

- Stack: Vite + React 18 + TypeScript, Tailwind CSS (incl. plugin forms), React Hook Form + Zod para validação.
- Arquitetura: Atomic Design
  - Atoms: Button, Input, PriceTag, FileInput, Badge.
  - Molecules: UploadDropzone, ProductSummaryCard, ProductRow.
  - Organisms: UploadStepForm, ProductEditorList, HistoryTable.
  - Pages/Templates: DashboardPage, UploadPage.
- Hooks/Estado:
  - Hooks: useUploadFlow, useProductsApi, useDebouncedSave.
  - Estado: Estado local/fluxo; React Query para cache e requisições remotas.
- Fluxo de telas:
  1. Upload: formulário com campo file (aceita XML e imagens), preview básico.
  2. Revisão: lista editável de produtos extraídos com opções de adicionar/editar/remover; validações e normalizações (moeda, códigos).
  3. Histórico: tabela listando variações de preço por produto (sem filtros iniciais).
- Qualidade: ESLint + Prettier, TypeScript estrito, testes com Vitest.

## Backend

- Stack: Node.js 20 + Express + TypeScript + Mongoose.
- Modelos principais:
  - User (autenticação).
  - Product (nome, código, descrição, metadados).
  - PriceEntry (produto, valor, data, origem).
- Serviços:
  - ProductCodeService para consultar API_KEY (enriquecer com código/descrição).
- Autenticação: JWT (rotas /auth/register e /auth/login).
- Uploads: middleware Multer limitando 1 arquivo por requisição e tamanho.
- Rotas principais:
  - POST /uploads -> recebe arquivo, processa (OCR/XML parsing + busca de códigos), retorna lista de produtos extraídos.
  - CRUD /products -> gerenciar catálogo de produtos.
  - GET /history -> retornar entradas de preço por produto (paginação simples).
- Operação inicial: processamento síncrono (sem WebSocket/SSE). Evoluir para async/filas se necessário ou POOLING.

## Configuração / Env

Variáveis esperadas:

- API_KEY

## Ações Imediatas

- Criar monorepo ou repo com pastas/packages `frontend` e `backend`.
- Inicializar boilerplate frontend (Vite + TS + Tailwind) e backend (Express + TS).
- Configurar lint, formatação e testes (ESLint, Prettier, Vitest) e CI básico.
- Prototipar endpoints críticos: POST /uploads e CRUD /products.
- Implementar UploadStepForm e fluxo de revisão mínimo no frontend.
- Definir esquema inicial de banco e modelos Mongoose.
- Priorizar proteções básicas: limites de upload, validação de arquivos e autenticação JWT.
