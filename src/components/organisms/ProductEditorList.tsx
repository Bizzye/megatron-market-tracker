import type { Product } from '../../lib/types';
import { ProductRow } from '../molecules/ProductRow';

type ProductEditorListProps = {
  products: Product[];
  isSaving: boolean;
  onSave: (product: Product) => Promise<void> | void;
  onRemove: (id: string) => void;
};

export function ProductEditorList({
  products,
  isSaving,
  onSave,
  onRemove,
}: ProductEditorListProps) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Nenhum produto disponível para revisão.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map(product => (
        <ProductRow
          key={product.id}
          product={product}
          onSave={onSave}
          onRemove={onRemove}
          isSaving={isSaving}
        />
      ))}
    </div>
  );
}
