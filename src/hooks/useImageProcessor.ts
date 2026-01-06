import { useCallback, useEffect, useRef } from 'react';
import { useImageStore } from '../store/useImageStore';
import type { GlobalSettings, WorkerResponse } from '../types';

export function useImageProcessor() {
  const workerRef = useRef<Worker | null>(null);
  const { images, settings, updateImage } = useImageStore();
  const settingsRef = useRef(settings);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/image.worker.ts', import.meta.url),
      { type: 'module' },
    );

    workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const { type, id, result, error } = e.data;

      if (type === 'complete' && result) {
        const compressedUrl = URL.createObjectURL(result.blob);
        updateImage(id, {
          compressedBlob: result.blob,
          compressedSize: result.blob.size,
          compressedUrl,
          status: 'done',
        });
      } else if (type === 'error') {
        updateImage(id, {
          status: 'error',
          error: error || '压缩失败',
        });
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [updateImage]);

  const processImage = useCallback(
    async (imageId: string, currentSettings: GlobalSettings) => {
      const image = useImageStore
        .getState()
        .images.find((img) => img.id === imageId);
      if (!image || !workerRef.current) return;

      // 释放旧的压缩结果
      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }

      updateImage(imageId, {
        status: 'processing',
        compressedBlob: null,
        compressedSize: null,
        compressedUrl: null,
      });

      try {
        const bitmap = await createImageBitmap(image.file);
        const outputFormat =
          currentSettings.outputFormat === 'original'
            ? image.originalType
            : currentSettings.outputFormat;

        workerRef.current.postMessage(
          {
            type: 'compress',
            id: imageId,
            imageData: bitmap,
            quality: currentSettings.quality,
            maxWidth: currentSettings.maxWidth,
            outputFormat,
          },
          [bitmap],
        );
      } catch (error) {
        updateImage(imageId, {
          status: 'error',
          error: error instanceof Error ? error.message : '处理失败',
        });
      }
    },
    [updateImage],
  );

  const processAllImages = useCallback(
    (currentSettings: GlobalSettings) => {
      const allImages = useImageStore.getState().images;
      for (const image of allImages) {
        processImage(image.id, currentSettings);
      }
    },
    [processImage],
  );

  // 设置变更时防抖重新处理所有图片
  useEffect(() => {
    if (images.length === 0) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      processAllImages(settings);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [settings, processAllImages, images.length]);

  return { processImage, processAllImages };
}
