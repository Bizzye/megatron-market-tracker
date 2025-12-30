import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getHistory, getProducts, persistProduct } from '../lib/apiClient';
import { useProductStore } from '../store/useProductStore';

export function useProductsApi() {
  const queryClient = useQueryClient();
  const replaceAll = useProductStore(state => state.replaceAll);
  const upsert = useProductStore(state => state.upsert);

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });

  useEffect(() => {
    if (productsQuery.data && productsQuery.data.length) {
      replaceAll(productsQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsQuery.data]);

  const updateMutation = useMutation({
    mutationFn: persistProduct,
    onSuccess: product => {
      upsert(product);
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  return {
    productsQuery,
    historyQuery,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
