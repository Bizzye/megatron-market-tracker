import { useState } from 'react';
import type { Product } from '../../lib/types';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

type ProductRowProps = {
  product: Product;
  onSave: (product: Product) => Promise<void> | void;
  onRemove: (id: string) => void;
  isSaving: boolean;
};

export function ProductRow({
  product,
  onSave,
  onRemove,
  isSaving,
}: ProductRowProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    code: product.code,
    quantity: product.quantity.toString(),
    unit: product.unit || '',
    price: product.price.toFixed(2),
    totalPrice: product.totalPrice.toFixed(2),
  });

  const handleSave = () => {
    const parsedQuantity = Number(formData.quantity.replace(',', '.'));
    const parsedPrice = Number(formData.price.replace(',', '.'));
    const parsedTotalPrice = Number(formData.totalPrice.replace(',', '.'));

    onSave({
      ...product,
      name: formData.name.trim(),
      code: formData.code.trim(),
      quantity: Number.isFinite(parsedQuantity)
        ? parsedQuantity
        : product.quantity,
      unit: formData.unit.trim() || undefined,
      price: Number.isFinite(parsedPrice) ? parsedPrice : product.price,
      totalPrice: Number.isFinite(parsedTotalPrice)
        ? parsedTotalPrice
        : product.totalPrice,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Nome */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold text-slate-500">
            Nome do Produto
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={event =>
              setFormData(prev => ({ ...prev, name: event.target.value }))
            }
            placeholder="Nome do produto"
          />
        </div>

        {/* Código */}
        <div>
          <label className="text-xs font-semibold text-slate-500">Código</label>
          <Input
            type="text"
            value={formData.code}
            onChange={event =>
              setFormData(prev => ({ ...prev, code: event.target.value }))
            }
            placeholder="Código"
          />
        </div>

        {/* Unidade */}
        <div>
          <label className="text-xs font-semibold text-slate-500">
            Unidade
          </label>
          <select
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={formData.unit}
            onChange={event =>
              setFormData(prev => ({ ...prev, unit: event.target.value }))
            }
          >
            <option value="">Selecione</option>
            <option value="Un">Un - Unidade</option>
            <option value="Kg">Kg - Quilograma</option>
            <option value="Gl">Gl - Galão</option>
            <option value="Gf">Gf - Garrafa</option>
            <option value="PC">PC - Peça</option>
            <option value="Am">Am - Ampola</option>
            <option value="Fr">Fr - Frasco</option>
          </select>
        </div>

        {/* Quantidade */}
        <div>
          <label className="text-xs font-semibold text-slate-500">
            Quantidade
          </label>
          <Input
            type="number"
            step="0.001"
            min="0"
            value={formData.quantity}
            onChange={event =>
              setFormData(prev => ({ ...prev, quantity: event.target.value }))
            }
          />
        </div>

        {/* Preço Unitário */}
        <div>
          <label className="text-xs font-semibold text-slate-500">
            Preço Unitário
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={event =>
              setFormData(prev => ({ ...prev, price: event.target.value }))
            }
          />
        </div>

        {/* Preço Total */}
        <div>
          <label className="text-xs font-semibold text-slate-500">
            Preço Total
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.totalPrice}
            onChange={event =>
              setFormData(prev => ({ ...prev, totalPrice: event.target.value }))
            }
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onRemove(product.id)}
        >
          Remover
        </Button>
        <Button type="button" onClick={handleSave} isLoading={isSaving}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
