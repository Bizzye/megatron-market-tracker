# Backend - Sistema de Histórico de Preços

## Visão Geral

API REST desenvolvida em Node.js + TypeScript + Express para processar uploads de notas fiscais (XML/imagem), extrair produtos, gerenciar histórico de preços e autenticação de usuários. Utiliza Zod para validação de schemas, JWT para autenticação e MongoDB/Mongoose para persistência.

---

## Stack Tecnológica

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Linguagem:** TypeScript (strict mode)
- **Validação:** Zod
- **Banco de Dados:** MongoDB + Mongoose
- **Autenticação:** JWT (jsonwebtoken + bcrypt)
- **Upload:** Multer (middleware para multipart/form-data)
- **OCR:** Tesseract.js ou serviço externo (para imagens)
- **Parser XML:** xml2js ou fast-xml-parser
- **Variáveis de Ambiente:** dotenv

---

## Arquitetura

### Estrutura de Pastas Sugerida

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Conexão MongoDB
│   │   └── env.ts                # Validação de variáveis de ambiente com Zod
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Verificação de JWT
│   │   ├── upload.middleware.ts  # Configuração Multer
│   │   ├── error.middleware.ts   # Tratamento global de erros
│   │   └── validation.middleware.ts # Validação com Zod
│   ├── models/
│   │   ├── User.model.ts         # Schema Mongoose para usuários
│   │   ├── Product.model.ts      # Schema para produtos
│   │   └── PriceEntry.model.ts   # Schema para histórico de preços
│   ├── routes/
│   │   ├── auth.routes.ts        # Rotas de autenticação
│   │   ├── products.routes.ts    # CRUD de produtos
│   │   ├── history.routes.ts     # Histórico de preços
│   │   └── upload.routes.ts      # Upload e processamento
│   ├── services/
│   │   ├── auth.service.ts       # Lógica de autenticação
│   │   ├── product.service.ts    # Lógica de produtos
│   │   ├── upload.service.ts     # Processamento de arquivos
│   │   ├── ocr.service.ts        # Extração de texto de imagens
│   │   ├── xml.service.ts        # Parser de XML
│   │   └── productCode.service.ts # Enriquecimento via API externa
│   ├── schemas/
│   │   ├── auth.schema.ts        # Schemas Zod para autenticação
│   │   ├── product.schema.ts     # Schemas Zod para produtos
│   │   └── upload.schema.ts      # Schemas Zod para upload
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript customizados
│   ├── utils/
│   │   ├── jwt.util.ts           # Helpers JWT
│   │   └── errors.util.ts        # Classes de erro customizadas
│   ├── app.ts                    # Configuração do Express
│   └── server.ts                 # Entry point
├── uploads/                      # Pasta temporária para arquivos
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
└── package.json
```

---

## Modelos de Dados (Mongoose)

### User
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique, lowercase),
  password: string (hashed com bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  code: string (opcional, código de barras/EAN),
  description: string (opcional),
  metadata: {
    unit?: string,
    category?: string,
    externalId?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### PriceEntry
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  price: number (decimal, em centavos ou float),
  quantity: number (opcional),
  source: string (ex: "nota_fiscal_xml", "nota_fiscal_imagem"),
  sourceFile: string (nome do arquivo original),
  date: Date (data da nota fiscal ou upload),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Rotas da API

**Base URL:** `http://localhost:4000/api`

### Autenticação

#### `POST /api/auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string (min 6 caracteres)"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "user": { "id": "string", "name": "string", "email": "string" },
    "token": "string (JWT)"
  }
  ```

#### `POST /api/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "user": { "id": "string", "name": "string", "email": "string" },
    "token": "string (JWT)"
  }
  ```

---

### Upload e Processamento

#### `POST /api/upload`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `multipart/form-data`
  - `file`: arquivo XML ou imagem (PNG, JPG, JPEG)
- **Validações:**
  - Tamanho máximo: 10MB
  - Tipos aceitos: `.xml`, `.png`, `.jpg`, `.jpeg`
  - Apenas 1 arquivo por requisição
- **Response:** `200 OK`
  ```json
  {
    "products": [
      {
        "name": "string",
        "code": "string (opcional)",
        "description": "string (opcional)",
        "price": number,
        "quantity": number,
        "source": "xml | image"
      }
    ],
    "sourceFile": "string"
  }
  ```
- **Fluxo:**
  1. Recebe arquivo via Multer
  2. Identifica tipo (XML ou imagem)
  3. Se XML: parser extrai produtos
  4. Se imagem: OCR extrai texto e identifica produtos
  5. Para cada produto, consulta API externa (ProductCodeService) para enriquecer dados
  6. Retorna lista de produtos extraídos (ainda não salva no banco)

---

### Produtos

#### `GET /api/products`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `page` (opcional, default: 1)
  - `limit` (opcional, default: 20)
  - `search` (opcional, busca por nome ou código)
- **Response:** `200 OK`
  ```json
  {
    "products": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "description": "string",
        "metadata": {},
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
  ```

#### `GET /api/products/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "code": "string",
    "description": "string",
    "metadata": {},
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
  ```

#### `POST /api/products`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "name": "string",
    "code": "string (opcional)",
    "description": "string (opcional)",
    "metadata": {}
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "string",
    "name": "string",
    "code": "string",
    "description": "string",
    "metadata": {},
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
  ```

#### `PUT /api/products/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):** (campos opcionais)
  ```json
  {
    "name": "string",
    "code": "string",
    "description": "string",
    "metadata": {}
  }
  ```
- **Response:** `200 OK` (produto atualizado)

#### `DELETE /api/products/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `204 No Content`

---

### Histórico de Preços

#### `GET /api/history`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `page` (opcional, default: 1)
  - `limit` (opcional, default: 20)
  - `productId` (opcional, filtrar por produto)
  - `startDate` (opcional, ISO date)
  - `endDate` (opcional, ISO date)
- **Response:** `200 OK`
  ```json
  {
    "entries": [
      {
        "id": "string",
        "product": {
          "id": "string",
          "name": "string",
          "code": "string"
        },
        "price": number,
        "quantity": number,
        "source": "string",
        "sourceFile": "string",
        "date": "ISO date",
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
  ```

#### `POST /api/history`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "productId": "string",
    "price": number,
    "quantity": number (opcional),
    "source": "string",
    "sourceFile": "string",
    "date": "ISO date"
  }
  ```
- **Response:** `201 Created` (entrada criada)

---

## Schemas de Validação (Zod)

### auth.schema.ts
```typescript
export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
```

### product.schema.ts
```typescript
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const updateProductSchema = createProductSchema.partial();
```

### upload.schema.ts
```typescript
export const uploadResponseSchema = z.object({
  products: z.array(z.object({
    name: z.string(),
    code: z.string().optional(),
    description: z.string().optional(),
    price: z.number(),
    quantity: z.number().optional(),
    source: z.enum(['xml', 'image'])
  })),
  sourceFile: z.string()
});
```

---

## Middlewares

### auth.middleware.ts
- Verifica presença e validade do token JWT no header `Authorization: Bearer <token>`
- Decodifica token e anexa `req.user` com dados do usuário
- Retorna `401 Unauthorized` se token inválido/ausente

### upload.middleware.ts
- Configura Multer:
  - Destino: pasta `uploads/`
  - Limite de tamanho: 10MB
  - Filtro de tipos: `.xml`, `.png`, `.jpg`, `.jpeg`
  - Apenas 1 arquivo por requisição

### validation.middleware.ts
- Recebe schema Zod e valida `req.body`, `req.query` ou `req.params`
- Retorna `400 Bad Request` com erros de validação formatados

### error.middleware.ts
- Captura erros globais
- Formata resposta de erro padronizada:
  ```json
  {
    "error": "string",
    "message": "string",
    "details": [] (opcional, erros de validação)
  }
  ```

---

## Serviços

### auth.service.ts
- `register(name, email, password)`: cria usuário, hash de senha, retorna user + token
- `login(email, password)`: valida credenciais, retorna user + token
- `hashPassword(password)`: bcrypt hash
- `comparePassword(plain, hashed)`: bcrypt compare

### product.service.ts
- `createProduct(userId, data)`: cria produto no banco
- `getProducts(userId, filters, pagination)`: lista produtos do usuário
- `getProductById(userId, productId)`: busca produto específico
- `updateProduct(userId, productId, data)`: atualiza produto
- `deleteProduct(userId, productId)`: remove produto

### upload.service.ts
- `processFile(file, userId)`: orquestra processamento
  - Identifica tipo de arquivo
  - Chama `xmlService` ou `ocrService`
  - Enriquece produtos via `productCodeService`
  - Retorna lista de produtos extraídos

### ocr.service.ts
- `extractTextFromImage(filePath)`: usa Tesseract.js ou API externa
- `parseProductsFromText(text)`: regex/heurísticas para identificar produtos, preços, quantidades

### xml.service.ts
- `parseXML(filePath)`: lê XML de nota fiscal (NF-e)
- `extractProducts(xmlData)`: extrai produtos do XML estruturado

### productCode.service.ts
- `enrichProduct(productData)`: consulta API externa (usando `API_KEY`) para buscar código/descrição
- Retorna dados enriquecidos ou originais se não encontrar

---

## Variáveis de Ambiente (.env)

```env
# Server
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017/price-history

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# External API
API_KEY=your-external-api-key-for-product-enrichment

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Validação com Zod (config/env.ts)
```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  API_KEY: z.string(),
  MAX_FILE_SIZE: z.string().transform(Number),
  UPLOAD_DIR: z.string()
});

export const env = envSchema.parse(process.env);
```

---

## Segurança e Boas Práticas

- **Helmet:** proteção de headers HTTP
- **CORS:** configurar origens permitidas (frontend)
- **Rate Limiting:** express-rate-limit para prevenir abuso
- **Sanitização:** validar e sanitizar inputs com Zod
- **Senha:** bcrypt com salt rounds >= 10
- **JWT:** usar secret forte, expiração adequada
- **Uploads:** validar tipo MIME real (não apenas extensão), limitar tamanho
- **Erros:** não expor stack traces em produção
- **Logs:** usar Winston ou Pino para logging estruturado

---

## Scripts package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write 'src/**/*.ts'",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Dependências Principais

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "zod": "^3.22.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0",
    "xml2js": "^0.6.0",
    "tesseract.js": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/multer": "^1.4.0",
    "@types/cors": "^2.8.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "prettier": "^3.2.0",
    "vitest": "^1.2.0"
  }
}
```

---

## Fluxo de Processamento de Upload

1. **Cliente** envia arquivo via `POST /api/upload`
2. **Multer** valida e salva arquivo temporariamente
3. **upload.service** identifica tipo (XML ou imagem)
4. **xml.service** ou **ocr.service** extrai dados brutos
5. **productCode.service** enriquece cada produto via API externa
6. **Resposta** retorna lista de produtos (ainda não persistidos)
7. **Frontend** permite revisão/edição
8. **Cliente** envia produtos revisados via `POST /api/history` (cria entradas de preço)
9. **Backend** cria/atualiza produtos e registra entradas no histórico

---

## Testes

- **Unitários:** serviços e utils (Vitest)
- **Integração:** rotas e middlewares (Supertest + Vitest)
- **Mocks:** MongoDB (mongodb-memory-server), APIs externas (msw)
- **Cobertura:** mínimo 70%

---

## Próximos Passos

1. **Inicializar projeto:**
   ```bash
   npm init -y
   npm install <dependências>
   npm install -D <devDependencies>
   ```

2. **Configurar TypeScript:**
   ```bash
   npx tsc --init
   ```
   - Ajustar `tsconfig.json`: `strict: true`, `outDir: "./dist"`, `rootDir: "./src"`

3. **Criar estrutura de pastas** conforme arquitetura

4. **Implementar modelos Mongoose** (User, Product, PriceEntry)

5. **Configurar Express** (app.ts):
   - Middlewares globais: helmet, cors, express.json(), rate-limit
   - Rotas: auth, products, history, upload
   - Error handler

6. **Implementar autenticação** (JWT + bcrypt)

7. **Implementar upload e processamento** (Multer + OCR/XML)

8. **Implementar CRUD de produtos e histórico**

9. **Testes e validações**

10. **Documentação OpenAPI/Swagger** (opcional)

---

## Observações Finais

- **Processamento síncrono inicial:** upload retorna produtos imediatamente. Se demorar muito, migrar para fila (Bull/BullMQ) e polling/WebSocket
- **Limpeza de arquivos:** implementar job para deletar arquivos temporários após processamento
- **Logs:** adicionar Winston/Pino para rastreabilidade
- **Monitoramento:** considerar Sentry para erros em produção
- **CI/CD:** GitHub Actions para lint, testes e deploy

---

**Pronto para gerar o código!** 🚀
