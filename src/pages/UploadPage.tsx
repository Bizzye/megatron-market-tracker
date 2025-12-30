import { useNavigate } from 'react-router-dom';
import { ProductEditorList } from '../components/organisms/ProductEditorList';
import { UploadStepForm } from '../components/organisms/UploadStepForm';
import { Button } from '../components/atoms/Button';
import { useProductsApi } from '../hooks/useProductsApi';
import { useUploadFlow } from '../hooks/useUploadFlow';
import { useProductStore } from '../store/useProductStore';
import type { Product } from '../lib/types';

export function UploadPage() {
  const navigate = useNavigate();
  const products = useProductStore(state => state.products);
  const remove = useProductStore(state => state.remove);
  const { updateProduct, isUpdating } = useProductsApi();
  const { uploadInvoice, isUploading, step, resetFlow } = useUploadFlow();

  const totalProducts = products.length;
  const reviewedProducts = products.length;

  const handleUpload = async (file: File) => {
    try {
      await uploadInvoice(file);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (product: Product) => {
    await updateProduct(product);
  };

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Upload de notas
          </h1>
          <p className="text-sm text-slate-500">
            Envie arquivos XML, PDF ou imagens para extrair automaticamente os
            produtos.
          </p>
        </div>
        <UploadStepForm
          isUploading={isUploading}
          onUpload={handleUpload}
          totalProducts={totalProducts}
          reviewedProducts={reviewedProducts}
        />
      </section>

      {step !== 'upload' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Revisão de produtos
            </h2>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/')}
              >
                Historico
              </Button>
              <Button variant="ghost" type="button" onClick={resetFlow}>
                Novo upload
              </Button>
            </div>
          </div>
          <ProductEditorList
            products={products}
            isSaving={isUpdating}
            onSave={handleSave}
            onRemove={remove}
          />
        </section>
      )}
    </div>
  );
}
