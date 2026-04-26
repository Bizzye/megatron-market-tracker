import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { searchProducts } from '../lib/apiClient';

export function useProductSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = useQuery({
    queryKey: ['products', 'search', debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    query,
    setQuery,
    results: searchQuery.data ?? [],
    isSearching: searchQuery.isFetching,
    hasSearched: debouncedQuery.length >= 2,
  };
}
