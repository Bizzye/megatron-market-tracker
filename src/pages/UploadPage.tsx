import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useUploadFlow } from '../hooks/useUploadFlow';

type ReviewForm = {
  storeName: string;
  date: string;
  items: { name: string; originalName?: string; code?: string; price: number; quantity: number }[];
};

export function UploadPage() {
  const navigate = useNavigate();
  const flow = useUploadFlow();
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReviewForm>({
    defaultValues: { storeName: '', date: '', items: [] },
  });
  const { fields } = useFieldArray({ control: form.control, name: 'items' });

  // Sync parsed data into form when entering review step
  useEffect(() => {
    if (flow.step === 'review' && flow.parsedProducts.length > 0) {
      form.reset({
        storeName: flow.storeName,
        date: flow.purchaseDate,
        items: flow.parsedProducts.map((p) => ({
          name: p.name,
          originalName: p.originalName,
          code: p.code,
          price: p.price,
          quantity: p.quantity,
        })),
      });
    }
  }, [flow.step, flow.parsedProducts, flow.storeName, flow.purchaseDate, form]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected
    e.target.value = '';
    // Reset form to clear any leftover items
    form.reset({ storeName: '', date: '', items: [] });
    try {
      await flow.upload(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = form.handleSubmit(async (data) => {
    await flow.confirm({
      storeName: data.storeName.trim(),
      date: data.date,
      items: data.items,
    });
  });

  // ── Step: UPLOAD ──────────────────────────────────────────
  if (flow.step === 'upload') {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="pt-2">
          <h1 className="text-2xl font-bold text-zinc-900">Nova compra</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Envie o XML ou PDF da nota fiscal para importar os produtos automaticamente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={flow.isUploading}
          className="w-full rounded-2xl bg-white px-5 py-12 text-center transition active:bg-zinc-50 disabled:opacity-60"
        >
          {flow.isUploading ? (
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
              <p className="text-sm text-zinc-500">Processando nota fiscal...</p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-900">Selecionar arquivo</p>
              <p className="mt-1 text-xs text-zinc-400">XML, PDF ou imagem da NF</p>
            </>
          )}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".xml,.pdf,image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {flow.uploadError && (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
            {flow.uploadError instanceof Error ? flow.uploadError.message : 'Erro ao processar arquivo'}
          </div>
        )}
      </div>
    );
  }

  // ── Step: REVIEW (store + date + items) ───────────────────
  if (flow.step === 'review') {
    return (
      <form onSubmit={handleConfirm} className="space-y-5">
        <button
          type="button"
          onClick={() => flow.resetFlow()}
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Cancelar
        </button>

        <div className="pt-2">
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">Revisar compra</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {flow.parsedProducts.length} produtos encontrados. Edite o que for necessário.
          </p>
        </div>

        {/* Store name + date */}
        <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
          <div className="px-5 py-4">
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
              Estabelecimento
            </label>
            <input
              type="text"
              placeholder="Ex: Sendas, Guanabara, Assaí..."
              autoFocus
              {...form.register('storeName', { required: true })}
              className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
          <div className="px-5 py-4">
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
              Data da compra
            </label>
            <input
              type="date"
              {...form.register('date', { required: true })}
              className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        </div>

        {/* Items list */}
        <div>
          <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Produtos
          </p>
          <div className="overflow-hidden rounded-2xl bg-white divide-y divide-zinc-100">
            {fields.map((field, idx) => (
              <div key={field.id} className="px-4 py-3.5 space-y-1.5">
                <input
                  type="text"
                  {...form.register(`items.${idx}.name`, { required: true })}
                  className="w-full rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
                {field.originalName && (
                  <p className="text-[11px] text-zinc-400 truncate">
                    NF: {field.originalName}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>R$ {field.price.toFixed(2)}</span>
                  <span>×{field.quantity}</span>
                  <span className="ml-auto font-medium text-zinc-600">
                    R$ {(field.price * field.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {flow.confirmError && (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
            {flow.confirmError instanceof Error ? flow.confirmError.message : 'Erro ao salvar compra'}
          </div>
        )}

        <button
          type="submit"
          disabled={flow.isConfirming}
          className="w-full rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition active:bg-zinc-800 disabled:opacity-50"
        >
          {flow.isConfirming ? 'Salvando...' : `Confirmar ${flow.parsedProducts.length} produtos`}
        </button>
      </form>
    );
  }

  // ── Step: DONE ────────────────────────────────────────────
  return (
    <div className="space-y-5 pt-10">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Compra registrada!</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {flow.parsedProducts.length} produtos importados com sucesso.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        {flow.purchaseId && (
          <button
            type="button"
            onClick={() => navigate(`/compras/${flow.purchaseId}`)}
            className="w-full rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition active:bg-zinc-800"
          >
            Ver compra
          </button>
        )}
        <button
          type="button"
          onClick={() => flow.resetFlow()}
          className="w-full rounded-2xl bg-white py-3.5 text-sm font-semibold text-zinc-500 transition active:bg-zinc-50"
        >
          Nova importação
        </button>
      </div>
    </div>
  );
}
