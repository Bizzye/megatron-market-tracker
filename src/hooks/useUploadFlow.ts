import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { uploadInvoice } from '../lib/apiClient';
import type { UploadStep } from '../lib/types';
import { useProductStore } from '../store/useProductStore';

export function useUploadFlow() {
  const [step, setStep] = useState<UploadStep>('upload');
  const replaceAll = useProductStore(state => state.replaceAll);

  const uploadMutation = useMutation({
    mutationFn: uploadInvoice,
    onSuccess: payload => {
      replaceAll(payload.products);
      setStep('review');
    },
  });

  const goToHistory = () => setStep('history');
  const resetFlow = () => setStep('upload');

  return {
    step,
    isUploading: uploadMutation.isPending,
    uploadInvoice: uploadMutation.mutateAsync,
    goToHistory,
    resetFlow,
  };
}
