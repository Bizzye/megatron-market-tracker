import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { HistoryTable } from '../components/organisms/HistoryTable';
import { useProductsApi } from '../hooks/useProductsApi';
import { useProductStore } from '../store/useProductStore';

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { historyQuery, productsQuery } = useProductsApi();
  const products = useProductStore(state => state.products);

  const {
    totalProducts,
    manualCount,
    averagePrice,
    lastUpdateLabel,
    productNameById,
  } = useMemo(() => {
    const total = products.length;
    const manual = products.filter(
      product => product.origin === 'manual'
    ).length;
    const avg = total
      ? products.reduce((sum, product) => sum + product.price, 0) / total
      : 0;
    const lastUpdate = products.reduce<Date | null>((latest, product) => {
      const currentDate = new Date(product.updatedAt);
      if (!latest || currentDate > latest) {
        return currentDate;
      }
      return latest;
    }, null);

    return {
      totalProducts: total,
      manualCount: manual,
      averagePrice: avg,
      lastUpdateLabel: lastUpdate
        ? lastUpdate.toLocaleString('pt-BR')
        : 'Sem atualizações',
      productNameById: Object.fromEntries(
        products.map(product => [product.id, product.name])
      ),
    };
  }, [products]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Histórico de preços
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Monitoramento inteligente de notas
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Acompanhe extrações recentes, atualize valores e mantenha o
            histórico consolidado de cada item enviado.
          </p>
        </div>
        <Button type="button" onClick={() => navigate('/upload')}>
          Novo upload
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Produtos monitorados"
          value={totalProducts}
          hint={`Origem manual: ${manualCount}`}
        />
        <StatCard
          label="Preço médio"
          value={`R$ ${averagePrice.toFixed(2)}`}
          hint="Último lote processado"
        />
        <StatCard label="Atualização mais recente" value={lastUpdateLabel} />
        <StatCard
          label="Status"
          value={productsQuery.isFetching ? 'Sincronizando...' : 'Atualizado'}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Últimas entradas
          </h2>
          <p className="text-sm text-slate-500">
            {historyQuery.data?.length ?? 0} registros encontrados
          </p>
        </div>
        <HistoryTable
          entries={historyQuery.data ?? []}
          isLoading={historyQuery.isLoading}
          productNameById={productNameById}
        />
      </section>
    </div>
  );
}
