export type ProductSource = 'xml' | 'ocr' | 'manual';

export type Product = {
  id: string;
  name: string;
  code: string;
  description?: string;
  quantity: number;
  unit?: string;
  price: number;
  totalPrice: number;
  currency: string;
  updatedAt: string;
};

export type PriceEntry = {
  id: string;
  productId: string;
  price: number;
  currency: string;
  origin: ProductSource;
  capturedAt: string;
};

export type UploadResponse = {
  products: Product[];
};

export type UploadStep = 'upload' | 'review' | 'history';

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

export interface BackendPriceEntry {
  _id: string;
  productId: string | { _id: string; name: string; code?: string };
  price: number;
  quantity?: number;
  source: ProductSource;
  date: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BackendUploadResponse {
  success: boolean;
  products: {
    id: string;
    name: string;
    code: string;
    quantity: number;
    unit?: string;
    price: number;
    totalPrice: number;
    priceEntryId: string;
  }[];
  metadata?: {
    fileName: string;
    fileType: string;
    processedAt: string;
  };
}
