import type { ChangeEvent } from 'react';
import { Button } from './Button';

type FileInputProps = {
  accept?: string;
  onFileChange: (file: File | null) => void;
  label: string;
};

export function FileInput({ accept, onFileChange, label }: FileInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };

  return (
    <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500 transition hover:border-primary">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <p className="text-sm font-medium">{label}</p>
      <span className="mt-2 text-xs">
        Arraste e solte ou clique para selecionar
      </span>
      <Button variant="ghost" className="mt-4" type="button">
        Procurar arquivo
      </Button>
    </label>
  );
}
