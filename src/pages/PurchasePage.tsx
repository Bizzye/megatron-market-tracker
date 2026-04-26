import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  usePurchaseDetail,
  useDeletePurchase,
  useUpdatePurchase,
} from '../hooks/usePurchasesApi';

export function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePurchaseDetail(id);
  const deleteMutation = useDeletePurchase();
  const updateMutation = useUpdatePurchase();
  const [isEditing, setIsEditing] = useState(false);
  const [editStoreName, setEditStoreName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-zinc-400">
        Carregando compra...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-sm text-zinc-400">Compra não encontrada.</p>
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

  const { purchase, items } = data;

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta compra?')) return;
    await deleteMutation.mutateAsync(purchase.id);
    navigate('/');
  };

  const startEditing = () => {
    setEditStoreName(purchase.storeName);
    setEditDate(purchase.purchaseDate.slice(0, 10));
    setEditNotes(purchase.notes ?? '');
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id: purchase.id,
      data: {
        storeName: editStoreName.trim(),
        date: editDate,
        notes: editNotes.trim() || undefined,
      },
    });
    setIsEditing(false);
  };

  const sourceLabels: Record<string, string> = {
    xml: 'XML',
    ocr: 'OCR',
    manual: 'Manual',
    pdf: 'PDF',
    image: 'Imagem',
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/')}
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
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-500">
                  Estabelecimento
                </label>
                <input
                  type="text"
                  value={editStoreName}
                  onChange={e => setEditStoreName(e.target.value)}
                  autoFocus
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-500">
                  Data da compra
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-500">
                  Observações
                </label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={2}
                  placeholder="Opcional"
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateMutation.isPending || !editStoreName.trim()}
                  className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white transition active:bg-zinc-800 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex-1 rounded-xl bg-zinc-100 py-2.5 text-sm font-medium text-zinc-600 transition active:bg-zinc-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-zinc-900 leading-tight">
                    {purchase.storeName}
                  </h1>
                  <p className="mt-1 text-sm text-zinc-400">
                    {new Date(purchase.purchaseDate).toLocaleDateString(
                      'pt-BR',
                      {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-zinc-900">
                    R$ {purchase.totalAmount.toFixed(2)}
                  </p>
                  <span className="inline-block mt-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-500">
                    {sourceLabels[purchase.source] ?? purchase.source}
                  </span>
                </div>
              </div>
              {purchase.notes && (
                <p className="mt-3 text-sm text-zinc-500">{purchase.notes}</p>
              )}
              {purchase.sourceFile && (
                <p className="mt-1 text-xs text-zinc-400">
                  Arquivo: {purchase.sourceFile}
                </p>
              )}
              <button
                type="button"
                onClick={startEditing}
                className="mt-3 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Items list */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-zinc-900">Itens</h2>
          <span className="text-xs text-zinc-400">{items.length} produtos</span>
        </div>

        {items.length === 0 && (
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-zinc-400">
            Nenhum item nesta compra.
          </p>
        )}

        {items.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
            {items.map(item => (
              <Link
                key={item.id}
                to={`/produtos/${item.productId}`}
                className="flex items-center gap-3 px-4 py-3.5 transition active:bg-zinc-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xs font-bold text-zinc-500">
                  {(item.productName ?? 'P').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {item.productName || 'Produto'}
                  </p>
                  {item.productCode && (
                    <p className="text-xs text-zinc-400">{item.productCode}</p>
                  )}
                  {item.quantity && item.quantity > 1 && (
                    <p className="text-xs text-zinc-400">
                      Qtd: {item.quantity}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-sm font-medium text-zinc-700">
                    R$ {item.price.toFixed(2)}
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

      {/* Danger zone */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="w-full rounded-2xl border border-rose-100 bg-rose-50 py-3 text-sm font-medium text-rose-500 transition active:bg-rose-100 disabled:opacity-50"
        >
          {deleteMutation.isPending ? 'Excluindo...' : 'Excluir compra'}
        </button>
      </div>
    </div>
  );
}
