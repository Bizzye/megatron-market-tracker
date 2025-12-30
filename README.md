# Frontend – Histórico de Preços

Aplicação React responsável pelo fluxo de upload de notas fiscais, revisão dos produtos extraídos e visualização do histórico de preços. Este pacote faz parte do monorepo `megatron` e se comunica com o backend via `VITE_API_BASE_URL`.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (plugin de forms) para estilização
- React Hook Form + Zod para formulários e validação
- Zustand para estado local do fluxo
- React Query para requisições e cache
- Vitest + Testing Library para testes unitários

## Estrutura resumida

```
src/
  app/               # Providers globais (React Query, etc.)
  components/
    atoms/           # Button, Input, Badge, etc.
    molecules/       # UploadDropzone, ProductRow...
    organisms/       # UploadStepForm, ProductEditorList, HistoryTable
  hooks/             # useUploadFlow, useProductsApi, useDebouncedSave
  lib/               # apiClient, tipos e utilitários
  pages/             # Dashboard e Upload
  store/             # Zustand store de produtos
```

## Scripts

Execute os comandos a partir da pasta `frontend`.

```bash
pnpm dev             # Ambiente de desenvolvimento com Vite
pnpm build           # Build para produção (tsc + vite build)
pnpm preview         # Servir build local
pnpm lint            # ESLint em modo flat
pnpm test            # Vitest em modo watch
pnpm test:run        # Vitest em modo CI
pnpm test:coverage   # Relatório de cobertura (text + lcov)
```

## Variáveis de ambiente

Configure um arquivo `.env` na raiz do frontend (copie de `.env.example`):

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:4000/api
```

**IMPORTANTE:** O backend deve estar rodando na porta 4000 para que o frontend funcione corretamente.

## Conexão com Backend

O frontend se conecta automaticamente com o backend através do `apiClient.ts`:

### Endpoints utilizados:

- **POST** `/api/auth/register` - Registro de usuário
- **POST** `/api/auth/login` - Login
- **GET** `/api/products` - Listar produtos
- **POST** `/api/products` - Criar produto
- **PATCH** `/api/products/:id` - Atualizar produto
- **DELETE** `/api/products/:id` - Deletar produto
- **GET** `/api/products/:id/history` - Histórico de preços de um produto
- **GET** `/api/history` - Histórico completo
- **POST** `/api/upload` - Upload de arquivo (XML/PDF/Imagem)

### Autenticação:

O token JWT é armazenado no `localStorage` após login/registro e enviado automaticamente em todas as requisições via interceptor do Axios:

```typescript
Authorization: Bearer<token>;
```

### Iniciar o sistema completo:

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

Acesse: http://localhost:3000

## Fluxo principal

1. **Upload**: usuário envia XML, PDF ou imagem (componentes `UploadStepForm` e `UploadDropzone`).
2. **Revisão**: lista editável (`ProductEditorList`) para ajustar preços, origem e remover itens.
3. **Histórico**: tabela (`HistoryTable`) exibindo variações de preço retornadas pelo backend.

React Query fornece fallback data para desenvolvimento offline enquanto o backend não retorna valores reais.

## Qualidade

- ESLint + TypeScript estrito.
- Vitest configurado com JSDOM e Testing Library (`vitest.setup.ts`).
- Cobertura mínima (70% statements/functions/lines, 50% branches) definida em `vitest.config.ts`.

## Como iniciar

1. `pnpm install` no diretório frontend.
2. `pnpm dev`.
3. Acesse `http://localhost:3000`.

Para rodar os testes:

```bash
pnpm test:run
```

## Próximos passos

- Conectar ao backend real para upload e histórico.
- Adicionar autenticação e proteção de rotas quando o backend estiver disponível.
- Expandir cobertura de testes para componentes e hooks críticos.
