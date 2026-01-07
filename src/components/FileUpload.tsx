import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  description: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  icon?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  accept,
  onFileSelect,
  selectedFile,
  icon,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileSelect(null);
    },
    [onFileSelect]
  );

  return (
    <div
      className={cn(
        'upload-zone cursor-pointer group relative',
        isDragging && 'upload-zone-active',
        selectedFile && 'border-success bg-success/5'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-${label}`)?.click()}
    >
      <input
        id={`file-${label}`}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        {selectedFile ? (
          <>
            <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
              <Check className="w-7 h-7 text-success" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              {icon || <Upload className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors" />}
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Click or drag to upload</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
