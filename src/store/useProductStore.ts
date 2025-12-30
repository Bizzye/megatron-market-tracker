import { create } from 'zustand';
import type { Product } from '../lib/types';

type ProductState = {
  products: Product[];
};

type ProductActions = {
  replaceAll: (products: Product[]) => void;
  upsert: (product: Product) => void;
  patch: (id: string, patch: Partial<Product>) => void;
  remove: (id: string) => void;
};

export const useProductStore = create<ProductState & ProductActions>(set => ({
  products: [],
  replaceAll: products =>
    set(state => (state.products === products ? state : { products })),
  upsert: product =>
    set(state => {
      const exists = state.products.some(item => item.id === product.id);
      return {
        products: exists
          ? state.products.map(item =>
              item.id === product.id ? product : item
            )
          : [...state.products, product],
      };
    }),
  patch: (id, patchValue) =>
    set(state => ({
      products: state.products.map(item =>
        item.id === id ? { ...item, ...patchValue } : item
      ),
    })),
  remove: id =>
    set(state => ({ products: state.products.filter(item => item.id !== id) })),
}));
