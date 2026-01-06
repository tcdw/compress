import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
  generateId,
  generateThumbnail,
  getImageDimensions,
  validateFile,
} from '../lib/image-utils';
import { useImageStore } from '../store/useImageStore';
import type { ImageFile } from '../types';
import { Button } from './ui/button';

interface DropZoneProps {
  compact?: boolean;
}

export function DropZone({ compact = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addImages = useImageStore((state) => state.addImages);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);
      const errors: string[] = [];
      const validFiles: File[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (errors.length > 0) {
        setError(errors.join('\n'));
      }

      if (validFiles.length === 0) return;

      const newImages: ImageFile[] = [];

      for (const file of validFiles) {
        try {
          const [dimensions, thumbnailUrl] = await Promise.all([
            getImageDimensions(file),
            generateThumbnail(file),
          ]);

          newImages.push({
            id: generateId(),
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: dimensions.width,
            originalHeight: dimensions.height,
            originalType: file.type,
            originalUrl: URL.createObjectURL(file),
            thumbnailUrl,
            compressedBlob: null,
            compressedSize: null,
            compressedUrl: null,
            status: 'pending',
          });
        } catch (err) {
          errors.push(
            `${file.name}: ${err instanceof Error ? err.message : '处理失败'}`,
          );
        }
      }

      if (newImages.length > 0) {
        addImages(newImages);
      }

      if (errors.length > 0) {
        setError(errors.join('\n'));
      }
    },
    [addImages],
  );

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
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        processFiles(files);
      }
    };
    input.click();
  }, [processFiles]);

  if (compact) {
    return (
      <Button variant="outline" onClick={handleFileSelect} className="w-full">
        <Upload className="mr-2 h-4 w-4" />
        添加更多图片
      </Button>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`
        flex flex-col items-center justify-center gap-4 p-12
        border-2 border-dashed rounded-lg transition-colors cursor-pointer
        ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleFileSelect();
        }
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className={`
            p-4 rounded-full transition-colors
            ${isDragging ? 'bg-primary/10' : 'bg-muted'}
          `}
        >
          <Upload
            className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
          />
        </div>
        <div>
          <p className="text-lg font-medium">拖拽图片到这里</p>
          <p className="text-sm text-muted-foreground">
            或点击下方按钮选择文件
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          支持 JPG、PNG、WebP 格式
        </p>
      </div>

      <Button onClick={handleFileSelect}>
        <Upload className="mr-2 h-4 w-4" />
        选择图片
      </Button>

      {error && (
        <div className="text-sm text-destructive text-center whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
}
