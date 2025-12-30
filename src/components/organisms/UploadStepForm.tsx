import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import { UploadDropzone } from '../molecules/UploadDropzone';
import { ProductSummaryCard } from '../molecules/ProductSummaryCard';

const schema = z.object({
  file: z.instanceof(File, { message: 'Selecione um arquivo válido' }),
});

type UploadFormValues = z.infer<typeof schema>;

type UploadStepFormProps = {
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
  totalProducts: number;
  reviewedProducts: number;
};

export function UploadStepForm({
  isUploading,
  onUpload,
  totalProducts,
  reviewedProducts,
}: UploadStepFormProps) {
  const {
    handleSubmit,
    setValue,
    resetField,
    control,
    formState: { errors },
  } = useForm<UploadFormValues>({ resolver: zodResolver(schema) });

  const selectedFile = useWatch({ control, name: 'file' }) ?? null;

  const onSubmit = handleSubmit(async ({ file }) => {
    await onUpload(file);
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <UploadDropzone
          accept=".xml,.pdf,image/*"
          selectedFile={selectedFile}
          onSelect={file => {
            if (file) {
              setValue('file', file, { shouldValidate: true });
            } else {
              resetField('file');
            }
          }}
        />
        {errors.file && (
          <p className="text-sm text-rose-600">{errors.file.message}</p>
        )}
        <Button
          type="submit"
          isLoading={isUploading}
          disabled={!selectedFile}
          className="w-full"
        >
          Enviar e processar
        </Button>
      </div>
      <ProductSummaryCard total={totalProducts} reviewed={reviewedProducts} />
    </form>
  );
}
