import { PriceTag } from '../atoms/PriceTag';
import type { PriceEntry } from '../../lib/types';

type HistoryTableProps = {
  entries: PriceEntry[];
  isLoading: boolean;
  productNameById?: Record<string, string>;
};

export function HistoryTable({
  entries,
  isLoading,
  productNameById = {},
}: HistoryTableProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando histórico...</p>;
  }

  if (!entries.length) {
    return (
      <p className="text-sm text-slate-500">
        Ainda não há histórico registrado.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Produto</th>
            <th className="px-4 py-3">Preço</th>
            <th className="px-4 py-3">Origem</th>
            <th className="px-4 py-3">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {entries.map(entry => (
            <tr key={entry.id}>
              <td className="px-4 py-3 font-medium text-slate-800">
                {productNameById[entry.productId] ?? entry.productId}
              </td>
              <td className="px-4 py-3">
                <PriceTag>
                  {entry.currency} {entry.price.toFixed(2)}
                </PriceTag>
              </td>
              <td className="px-4 py-3 capitalize text-slate-600">
                {entry.origin}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(entry.capturedAt).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
