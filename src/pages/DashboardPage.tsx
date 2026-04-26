import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProductsApi';
import { usePurchases } from '../hooks/usePurchasesApi';
import { useProductSearch } from '../hooks/useProductSearch';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: purchases = [], isLoading: loadingPurchases } = usePurchases();
  const { query, setQuery, results, isSearching, hasSearched } =
    useProductSearch();
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const totalSpent = purchases.reduce((s, p) => s + (p.totalAmount || 0), 0);
    return {
      totalProducts: products.length,
      totalPurchases: purchases.length,
      totalSpent,
    };
  }, [products, purchases]);

  const recentPurchases = purchases.slice(0, 6);
  const recentProducts = products.slice(0, 10);
  const showResults = searchFocused && hasSearched;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-zinc-900">Encontrar produtos</h1>
        <button
          type="button"
          onClick={() => navigate('/nova-compra')}
          className="flex items-center justify-center rounded-full bg-white p-2.5 shadow-sm"
          title="Nova compra"
        >
          <svg
            className="h-5 w-5 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div ref={searchRef} className="relative">
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 h-4 w-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Buscar produto por nome ou código..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            className="w-full rounded-2xl bg-white py-3 pl-11 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-zinc-500"
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707A1 1 0 012.707 1.293L6 4.586z" />
              </svg>
            </button>
          )}
        </div>

        {/* Search results */}
        {showResults && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-zinc-900">
                Resultados da busca
              </p>
              <p className="text-xs text-zinc-400">
                {isSearching ? 'Buscando...' : `${results.length} resultados`}
              </p>
            </div>

            {!isSearching && results.length === 0 && (
              <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-zinc-400">
                Nenhum produto encontrado.
              </p>
            )}

            {results.length > 0 && (
              <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
                {results.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-zinc-50"
                    onMouseDown={() => navigate(`/produtos/${product.id}`)}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xs font-bold text-zinc-500">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {product.name}
                      </p>
                      {product.code && (
                        <p className="text-xs text-zinc-400">{product.code}</p>
                      )}
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-zinc-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {!showResults && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Produtos',
              value: loadingProducts ? '—' : stats.totalProducts,
            },
            {
              label: 'Compras',
              value: loadingPurchases ? '—' : stats.totalPurchases,
            },
            {
              label: 'Total gasto',
              value: loadingPurchases
                ? '—'
                : `R$\u00A0${stats.totalSpent.toFixed(0)}`,
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-4 text-center"
            >
              <p className="text-lg font-bold text-zinc-900">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Purchases */}
      {!showResults && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-zinc-900">
              Últimas compras
            </h2>
            <span className="text-xs text-zinc-400">
              {purchases.length} total
            </span>
          </div>

          {loadingPurchases && (
            <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-zinc-400">
              Carregando...
            </p>
          )}

          {!loadingPurchases && recentPurchases.length === 0 && (
            <div className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-zinc-400">
              Nenhuma compra ainda.{' '}
              <button
                type="button"
                onClick={() => navigate('/nova-compra')}
                className="font-medium text-zinc-700 underline"
              >
                Adicionar
              </button>
            </div>
          )}

          {recentPurchases.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
              {recentPurchases.map(purchase => (
                <Link
                  key={purchase.id}
                  to={`/compras/${purchase.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition active:bg-zinc-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                    <svg
                      className="h-4 w-4 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {purchase.storeName}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(purchase.purchaseDate).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-medium text-zinc-700">
                      R$ {purchase.totalAmount.toFixed(2)}
                    </p>
                    <svg
                      className="h-4 w-4 text-zinc-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Products */}
      {!showResults && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-zinc-900">Produtos</h2>
            <span className="text-xs text-zinc-400">
              {products.length} total
            </span>
          </div>

          {loadingProducts && (
            <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-zinc-400">
              Carregando...
            </p>
          )}

          {!loadingProducts && recentProducts.length === 0 && (
            <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-zinc-400">
              Nenhum produto cadastrado ainda.
            </p>
          )}

          {recentProducts.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
              {recentProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/produtos/${product.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition active:bg-zinc-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xs font-bold text-zinc-500">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {product.name}
                    </p>
                    {product.code && (
                      <p className="text-xs text-zinc-400">{product.code}</p>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 shrink-0 text-zinc-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
