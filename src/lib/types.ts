export type ProductSource = 'xml' | 'ocr' | 'manual' | 'pdf' | 'image';

export type Product = {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Purchase = {
  id: string;
  storeName: string;
  purchaseDate: string;
  totalAmount: number;
  source: ProductSource;
  sourceFile?: string;
  notes?: string;
  createdAt: string;
};

export type PurchaseItem = {
  id: string;
  purchaseId: string;
  productId: string;
  productName?: string;
  productCode?: string;
  price: number;
  quantity?: number;
};

export type PurchaseDetail = {
  purchase: Purchase;
  items: PurchaseItem[];
};

export type PriceHistoryEntry = {
  id: string;
  price: number;
  quantity?: number;
  storeName?: string;
  source?: string;
};

export type UploadStep = 'upload' | 'review';

// Backend API types
export interface BackendProduct {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendPurchase {
  _id: string;
  userId: string;
  storeName: string;
  purchaseDate: string;
  totalAmount: number;
  source: ProductSource;
  sourceFile?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BackendPurchaseItem {
  _id: string;
  purchaseId:
    | string
    | { _id: string; storeName: string; purchaseDate: string; source: string };
  productId: string | { _id: string; name: string; code?: string };
  price: number;
  quantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendUploadResponse {
  success: boolean;
  storeName?: string;
  purchaseDate?: string;
  products: {
    name: string;
    code?: string;
    price: number;
    quantity?: number;
    resolvedName?: string;
  }[];
  metadata?: {
    fileName: string;
    fileType: string;
    processedAt: string;
    itemCount: number;
    totalAmount: number;
  };
}
