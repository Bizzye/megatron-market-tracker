import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { uploadInvoice, createPurchase } from '../lib/apiClient';

export type ParsedProduct = {
  name: string;
  originalName?: string;
  code?: string;
  price: number;
  quantity: number;
};

export type ReviewStep = 'upload' | 'review' | 'done';

export function useUploadFlow() {
  const [step, setStep] = useState<ReviewStep>('upload');
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [storeName, setStoreName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [fileType, setFileType] = useState<string>('manual');
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      // Clear previous data before starting new upload
      setParsedProducts([]);
      setStoreName('');
      setPurchaseDate('');
      setFileType('manual');
      return uploadInvoice(file);
    },
    onSuccess: (data) => {
      setStoreName(data.storeName || '');
      setPurchaseDate(
        data.purchaseDate
          ? new Date(data.purchaseDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setFileType(data.metadata?.fileType || 'manual');
      setParsedProducts(
        data.products.map((p) => ({
          name: p.resolvedName || p.name,
          originalName: p.resolvedName ? p.name : undefined,
          code: p.code,
          price: p.price,
          quantity: p.quantity || 1,
        }))
      );
      setStep('review');
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (edited: {
      storeName: string;
      date: string;
      items: ParsedProduct[];
    }) => {
      const result = await createPurchase({
        storeName: edited.storeName,
        date: edited.date,
        source: fileType as 'xml' | 'pdf' | 'image' | 'manual',
        items: edited.items.map((item) => ({
          name: item.name,
          code: item.code,
          price: item.price,
          quantity: item.quantity,
        })),
      });
      return result;
    },
    onSuccess: (result) => {
      setPurchaseId(result.purchase.id);
      setStep('done');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const resetFlow = () => {
    setStep('upload');
    setPurchaseId(null);
    setParsedProducts([]);
    setStoreName('');
    setPurchaseDate('');
    setFileType('manual');
  };

  return {
    step,
    purchaseId,
    parsedProducts,
    storeName,
    purchaseDate,
    isUploading: uploadMutation.isPending,
    isConfirming: confirmMutation.isPending,
    uploadError: uploadMutation.error,
    confirmError: confirmMutation.error,
    upload: uploadMutation.mutateAsync,
    confirm: confirmMutation.mutateAsync,
    resetFlow,
  };
}
