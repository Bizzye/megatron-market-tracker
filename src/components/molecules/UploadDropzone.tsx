import { Badge } from '../atoms/Badge';
import { FileInput } from '../atoms/FileInput';

type UploadDropzoneProps = {
  accept?: string;
  selectedFile: File | null;
  onSelect: (file: File | null) => void;
};

export function UploadDropzone({
  accept,
  selectedFile,
  onSelect,
}: UploadDropzoneProps) {
  return (
    <div className="space-y-4">
      <FileInput
        accept={accept}
        onFileChange={onSelect}
        label="XML, PDF ou imagem da nota fiscal"
      />
      {selectedFile && (
        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Badge tone="success">Pronto para envio</Badge>
        </div>
      )}
    </div>
  );
}
