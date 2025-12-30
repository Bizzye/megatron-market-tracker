import axios from 'axios';
import type {
  PriceEntry,
  Product,
  BackendProduct,
  BackendPriceEntry,
  BackendUploadResponse,
} from './types';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação se existir
client.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const fallbackProducts: Product[] = [
  {
    id: 'sample-1',
    name: 'Produto Demonstrativo',
    code: 'SKU-001',
    description: 'Item cadastrado para validação do fluxo',
    quantity: 1,
    unit: 'UN',
    price: 19.9,
    totalPrice: 19.9,
    currency: 'BRL',
    updatedAt: new Date().toISOString(),
  },
];

const fallbackHistory: PriceEntry[] = [
  {
    id: 'history-1',
    productId: 'sample-1',
    price: 18.5,
    currency: 'BRL',
    origin: 'ocr',
    capturedAt: new Date().toISOString(),
  },
];

async function safeRequest<T>(request: () => Promise<T>, fallback: T) {
  try {
    return await request();
  } catch {
    return fallback;
  }
}

// Auth API
export async function register(email: string, password: string, name: string) {
  const { data } = await client.post<{
    user: { id: string; email: string; name: string };
    token: string;
  }>('/auth/register', { email, password, name });
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await client.post<{
    user: { id: string; email: string; name: string };
    token: string;
  }>('/auth/login', { email, password });
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Products API
export function getProducts(): Promise<Product[]> {
  return safeRequest(async () => {
    const { data } = await client.get<BackendProduct[]>('/products');
    // Transformar resposta do backend para o formato do frontend
    return data.map(
      (p): Product => ({
        id: p._id,
        name: p.name,
        code: p.code || '',
        description: p.description,
        quantity: 0,
        unit: undefined,
        price: 0,
        totalPrice: 0,
        currency: 'BRL',
        updatedAt: p.updatedAt,
      })
    );
  }, fallbackProducts);
}

export async function createProduct(product: {
  name: string;
  code?: string;
  description?: string;
}): Promise<Product> {
  const { data } = await client.post<BackendProduct>('/products', product);
  return {
    id: data._id,
    name: data.name,
    code: data.code || '',
    description: data.description,
    quantity: 0,
    unit: undefined,
    price: 0,
    totalPrice: 0,
    currency: 'BRL',
    updatedAt: data.updatedAt,
  };
}

export async function updateProduct(
  id: string,
  product: Partial<{ name: string; code: string; description: string }>
): Promise<Product> {
  const { data } = await client.patch<BackendProduct>(
    `/products/${id}`,
    product
  );
  return {
    id: data._id,
    name: data.name,
    code: data.code || '',
    description: data.description,
    quantity: 0,
    unit: undefined,
    price: 0,
    totalPrice: 0,
    currency: 'BRL',
    updatedAt: data.updatedAt,
  };
}

export async function deleteProduct(id: string) {
  await client.delete(`/products/${id}`);
}

// History API
export function getHistory(): Promise<PriceEntry[]> {
  return safeRequest(async () => {
    const { data } = await client.get<BackendPriceEntry[]>('/history');
    // Transformar resposta do backend para o formato do frontend
    return data.map(
      (entry): PriceEntry => ({
        id: entry._id,
        productId:
          typeof entry.productId === 'string'
            ? entry.productId
            : entry.productId._id,
        price: entry.price,
        currency: 'BRL',
        origin: entry.source,
        capturedAt: entry.date || entry.createdAt,
      })
    );
  }, fallbackHistory);
}

export async function getProductHistory(
  productId: string
): Promise<PriceEntry[]> {
  const { data } = await client.get<BackendPriceEntry[]>(
    `/products/${productId}/history`
  );
  return data.map(
    (entry): PriceEntry => ({
      id: entry._id,
      productId: entry.productId as string,
      price: entry.price,
      currency: 'BRL',
      origin: entry.source,
      capturedAt: entry.date || entry.createdAt,
    })
  );
}

// Upload API
export async function uploadInvoice(file: File) {
  const body = new FormData();
  body.append('file', file);
  const { data } = await client.post<BackendUploadResponse>('/upload', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Transformar resposta do backend para o formato do frontend
  return {
    products: data.products.map(
      (p): Product => ({
        id: p.id,
        name: p.name,
        code: p.code,
        description: undefined,
        quantity: p.quantity,
        unit: p.unit,
        price: p.price,
        totalPrice: p.totalPrice,
        currency: 'BRL',
        updatedAt: new Date().toISOString(),
      })
    ),
  };
}

export async function persistProduct(
  product: Partial<Product> & { id: string }
): Promise<Product> {
  const { data } = await client.patch<BackendProduct>(
    `/products/${product.id}`,
    {
      name: product.name,
      code: product.code,
      description: product.description,
    }
  );
  return {
    id: data._id,
    name: data.name,
    code: data.code || '',
    description: data.description,
    quantity: product.quantity || 0,
    unit: product.unit,
    price: product.price || 0,
    totalPrice: product.totalPrice || 0,
    currency: 'BRL',
    updatedAt: data.updatedAt,
  };
}
