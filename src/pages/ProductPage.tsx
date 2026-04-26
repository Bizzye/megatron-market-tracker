import { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productQuery, historyQuery, purchasesQuery } = useProductDetail(id);

  const product = productQuery.data;
  const history = historyQuery.data ?? [];
  const purchases = purchasesQuery.data ?? [];

  const stats = useMemo(() => {
    if (history.length === 0)
      return { min: 0, max: 0, avg: 0, totalSpent: 0, count: 0 };
    const prices = history.map(h => h.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
    const totalSpent = history.reduce(
      (s, h) => s + h.price * (h.quantity ?? 1),
      0
    );
    return { min, max, avg, totalSpent, count: history.length };
  }, [history]);

  if (productQuery.isLoading) {
    return (
      <div className="py-20 text-center text-sm text-zinc-400">
        Carregando produto...
      </div>
    );
  }

  if (productQuery.error || !product) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-sm text-zinc-400">Produto não encontrado.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-medium text-zinc-700 underline"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Voltar
      </button>

      {/* Header card */}
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="h-1.5 bg-zinc-900" />
        <div className="px-5 py-5">
          <h1 className="text-xl font-bold text-zinc-900 leading-tight">
            {product.name}
          </h1>
          {product.code && (
            <p className="mt-0.5 text-sm text-zinc-400">
              Código: {product.code}
            </p>
          )}
          {product.description && (
            <p className="mt-2 text-sm text-zinc-500">{product.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats.count > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Menor preço', value: `R$ ${stats.min.toFixed(2)}` },
            { label: 'Maior preço', value: `R$ ${stats.max.toFixed(2)}` },
            { label: 'Preço médio', value: `R$ ${stats.avg.toFixed(2)}` },
            {
              label: 'Total gasto',
              value: `R$ ${stats.totalSpent.toFixed(2)}`,
            },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-white p-4 text-center">
              <p className="text-base font-bold text-zinc-900">{s.value}</p>
              <p className="mt-0.5 text-[11px] text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Price history */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-zinc-900">
            Histórico de preços
          </h2>
          <span className="text-xs text-zinc-400">
            {history.length} registros
          </span>
        </div>

        {historyQuery.isLoading && (
          <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-zinc-400">
            Carregando...
          </p>
        )}

        {!historyQuery.isLoading && history.length === 0 && (
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-zinc-400">
            Nenhum registro de preço encontrado.
          </p>
        )}

        {history.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
            {history.map(entry => (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-4 py-3.5"
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
                  {entry.storeName && (
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {entry.storeName}
                    </p>
                  )}
                  <p className="text-xs text-zinc-400">
                    {entry.date
                      ? new Date(entry.date).toLocaleDateString('pt-BR')
                      : '—'}
                    {entry.quantity &&
                      entry.quantity > 1 &&
                      ` · Qtd: ${entry.quantity}`}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-zinc-900">
                  R$ {entry.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Purchases with this product */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-zinc-900">
            Compras com este produto
          </h2>
          <span className="text-xs text-zinc-400">
            {purchases.length} compras
          </span>
        </div>

        {purchasesQuery.isLoading && (
          <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-zinc-400">
            Carregando...
          </p>
        )}

        {!purchasesQuery.isLoading && purchases.length === 0 && (
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-zinc-400">
            Este produto não aparece em nenhuma compra.
          </p>
        )}

        {purchases.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
            {purchases.map(purchase => (
              <Link
                key={purchase.id}
                to={`/compras/${purchase.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition active:bg-zinc-50"
              >
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
    </div>
  );
}
