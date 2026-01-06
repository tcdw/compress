import type { WorkerRequest, WorkerResponse } from '../types';

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, imageData, quality, maxWidth, outputFormat } = e.data;

  try {
    let targetWidth = imageData.width;
    let targetHeight = imageData.height;

    if (maxWidth && imageData.width > maxWidth) {
      const ratio = maxWidth / imageData.width;
      targetWidth = maxWidth;
      targetHeight = Math.round(imageData.height * ratio);
    }

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('无法创建 OffscreenCanvas context');
    }

    // 如果输出格式是 JPEG 且原图可能有透明背景，填充白色背景
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(imageData, 0, 0, targetWidth, targetHeight);

    const blob = await canvas.convertToBlob({
      type: outputFormat,
      quality: quality,
    });

    imageData.close();

    const response: WorkerResponse = {
      type: 'complete',
      id,
      result: {
        blob,
        width: targetWidth,
        height: targetHeight,
      },
    };

    self.postMessage(response);
  } catch (error) {
    imageData.close();

    const response: WorkerResponse = {
      type: 'error',
      id,
      error: error instanceof Error ? error.message : String(error),
    };

    self.postMessage(response);
  }
};
