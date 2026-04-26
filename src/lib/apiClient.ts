import axios from 'axios';
import type {
  Product,
  Purchase,
  PurchaseItem,
  PurchaseDetail,
  PriceHistoryEntry,
  BackendProduct,
  BackendPurchase,
  BackendPurchaseItem,
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

// --- Helpers ---

function mapProduct(p: BackendProduct): Product {
  return {
    id: p._id,
    name: p.name,
    code: p.code || '',
    description: p.description,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function mapPurchase(p: BackendPurchase): Purchase {
  return {
    id: p._id,
    storeName: p.storeName,
    totalAmount: p.totalAmount,
    source: p.source,
    sourceFile: p.sourceFile,
    notes: p.notes,
    purchaseDate: p.purchaseDate,
    createdAt: p.createdAt,
  };
}

function mapPurchaseItem(item: BackendPurchaseItem): PurchaseItem {
  const productId =
    typeof item.productId === 'string' ? item.productId : item.productId._id;
  const productName =
    typeof item.productId === 'object' ? item.productId.name : undefined;
  const productCode =
    typeof item.productId === 'object' ? item.productId.code : undefined;

  return {
    id: item._id,
    purchaseId:
      typeof item.purchaseId === 'string'
        ? item.purchaseId
        : item.purchaseId._id,
    productId,
    productName,
    productCode,
    price: item.price,
    quantity: item.quantity,
  };
}

// --- Auth API ---

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

// --- Products API ---

export async function getProducts(): Promise<Product[]> {
  const { data } = await client.get<BackendProduct[]>('/products');
  return data.map(mapProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await client.get<BackendProduct[]>('/products/search', {
    params: { q: query },
  });
  return data.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await client.get<BackendProduct>(`/products/${id}`);
  return mapProduct(data);
}

export async function getProductHistory(
  productId: string
): Promise<PriceHistoryEntry[]> {
  const { data } = await client.get<BackendPurchaseItem[]>(
    `/products/${productId}/history`
  );
  return data.map((entry): PriceHistoryEntry => {
    const purchase =
      typeof entry.purchaseId === 'object' ? entry.purchaseId : null;
    return {
      id: entry._id,
      price: entry.price,
      quantity: entry.quantity,
      storeName: purchase?.storeName,
      source: purchase?.source,
    };
  });
}

export async function getProductPurchases(
  productId: string
): Promise<Purchase[]> {
  const { data } = await client.get<BackendPurchase[]>(
    `/products/${productId}/purchases`
  );
  return data.map(mapPurchase);
}

export async function createProduct(product: {
  name: string;
  code?: string;
  description?: string;
}): Promise<Product> {
  const { data } = await client.post<BackendProduct>('/products', product);
  return mapProduct(data);
}

export async function updateProduct(
  id: string,
  product: Partial<{ name: string; code: string; description: string }>
): Promise<Product> {
  const { data } = await client.patch<BackendProduct>(
    `/products/${id}`,
    product
  );
  return mapProduct(data);
}

export async function deleteProduct(id: string) {
  await client.delete(`/products/${id}`);
}

// --- Purchases API ---

export async function getPurchases(): Promise<Purchase[]> {
  const { data } = await client.get<BackendPurchase[]>('/purchases');
  return data.map(mapPurchase);
}

export async function getPurchaseById(id: string): Promise<PurchaseDetail> {
  const { data } = await client.get<{
    purchase: BackendPurchase;
    items: BackendPurchaseItem[];
  }>(`/purchases/${id}`);
  return {
    purchase: mapPurchase(data.purchase),
    items: data.items.map(mapPurchaseItem),
  };
}

export async function createPurchase(input: {
  storeName: string;
  date?: string;
  totalAmount?: number;
  notes?: string;
  source?: string;
  items: { name: string; code?: string; price: number; quantity?: number }[];
}): Promise<PurchaseDetail> {
  const { data } = await client.post<{
    purchase: BackendPurchase;
    items: BackendPurchaseItem[];
  }>('/purchases', input);
  return {
    purchase: mapPurchase(data.purchase),
    items: data.items.map(mapPurchaseItem),
  };
}

export async function deletePurchase(id: string) {
  await client.delete(`/purchases/${id}`);
}

export async function updatePurchase(
  id: string,
  data: Partial<{
    storeName: string;
    date: string;
    totalAmount: number;
    notes: string;
  }>
): Promise<Purchase> {
  const { data: updated } = await client.patch<BackendPurchase>(
    `/purchases/${id}`,
    data
  );
  return mapPurchase(updated);
}

// --- Upload API ---

export async function uploadInvoice(file: File) {
  const body = new FormData();
  body.append('file', file);
  const { data } = await client.post<BackendUploadResponse>('/upload', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return data;
}
