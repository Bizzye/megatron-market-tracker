type ProductSummaryCardProps = {
  total: number;
  reviewed: number;
  currency?: string;
};

export function ProductSummaryCard({
  total,
  reviewed,
  currency = 'BRL',
}: ProductSummaryCardProps) {
  const pending = Math.max(total - reviewed, 0);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Resumo do lote</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold text-slate-900">{total}</p>
          <p className="text-xs text-slate-500">Produtos identificados</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-emerald-600">
            {reviewed} revisados
          </p>
          <p className="text-sm font-semibold text-amber-600">
            {pending} pendentes
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
        Moeda padrão {currency}
      </p>
    </div>
  );
}
