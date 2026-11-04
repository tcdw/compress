import { Alert } from '@tuuject/koi-react/alert';
import { Button } from '@tuuject/koi-react/button';
import { DropZone as KoiDropZone } from '@tuuject/koi-react/drop-zone';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useCallback, useRef, useState } from 'react';
import {
  generateId,
  generateThumbnail,
  getImageDimensions,
  validateFile,
} from '../lib/image-utils';
import { useImageStore } from '../store/useImageStore';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons';

interface DropZoneProps {
  compact?: boolean;
}

export function DropZone({ compact = false }: DropZoneProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addImages = useImageStore((state) => state.addImages);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const rejected: string[] = [];
      const validFiles: File[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          rejected.push(`${file.name}：${validation.error}`);
        }
      }

      if (validFiles.length === 0) {
        setErrors(rejected);
        return;
      }

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
          rejected.push(
            `${file.name}：${err instanceof Error ? err.message : '处理失败'}`,
          );
        }
      }

      if (newImages.length > 0) {
        addImages(newImages);
      }

      setErrors(rejected);
    },
    [addImages],
  );

  const openPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files) {
        processFiles(files);
      }
      // Let the same file be picked again after it was removed.
      e.currentTarget.value = '';
    },
    [processFiles],
  );

  const errorAlert =
    errors.length > 0 ? (
      <Alert tone="error" title="有文件没能添加">
        {errors.map((message, index) => (
          <p key={`${index}-${message}`} className={css({ margin: '0' })}>
            {message}
          </p>
        ))}
      </Alert>
    ) : null;

  if (compact) {
    return (
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}
      >
        <Button
          fullWidth
          color="secondary"
          variant="outline"
          iconStart={<UploadIcon />}
          onClick={openPicker}
        >
          添加更多图片
        </Button>
        {errorAlert}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleFileInputChange}
        />
      </div>
    );
  }

  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}
    >
      <KoiDropZone
        title="拖拽图片到这里，或直接点我选择文件"
        description="支持 JPG、PNG、WebP 格式，单张最大 100MB"
        accept="image/jpeg,image/png,image/webp"
        onFiles={(files) => {
          void processFiles(files);
        }}
      />
      {errorAlert}
    </div>
  );
}
