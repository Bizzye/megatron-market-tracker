import { useQuery } from '@tanstack/react-query';
import {
  getProductById,
  getProductHistory,
  getProductPurchases,
} from '../lib/apiClient';

export function useProductDetail(id: string | undefined) {
  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const historyQuery = useQuery({
    queryKey: ['product', id, 'history'],
    queryFn: () => getProductHistory(id!),
    enabled: !!id,
  });

  const purchasesQuery = useQuery({
    queryKey: ['product', id, 'purchases'],
    queryFn: () => getProductPurchases(id!),
    enabled: !!id,
  });

  return { productQuery, historyQuery, purchasesQuery };
}
