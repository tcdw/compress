import type { WorkerRequest, WorkerResponse } from '../types';

// https://stackoverflow.com/a/19144434/9436804
function downScaleCanvas(cv: OffscreenCanvas, scale: number): OffscreenCanvas {
  const sqScale = scale * scale;
  const sw = cv.width;
  const sh = cv.height;
  const tw = Math.floor(sw * scale);
  const th = Math.floor(sh * scale);

  const srcCtx = cv.getContext('2d');
  if (!srcCtx) {
    throw new Error('无法获取源 canvas context');
  }

  const sBuffer = srcCtx.getImageData(0, 0, sw, sh).data;
  const tBuffer = new Float32Array(3 * tw * th);

  let sIndex = 0;

  for (let sy = 0; sy < sh; sy++) {
    const ty = sy * scale;
    const tY = Math.floor(ty);
    const yIndex = 3 * tY * tw;
    const crossY = tY !== Math.floor(ty + scale);
    const wy = crossY ? tY + 1 - ty : 0;
    const nwy = crossY ? ty + scale - tY - 1 : 0;

    for (let sx = 0; sx < sw; sx++, sIndex += 4) {
      const tx = sx * scale;
      const tX = Math.floor(tx);
      const tIndex = yIndex + tX * 3;
      const crossX = tX !== Math.floor(tx + scale);
      const wx = crossX ? tX + 1 - tx : 0;
      const nwx = crossX ? tx + scale - tX - 1 : 0;

      const sR = sBuffer[sIndex];
      const sG = sBuffer[sIndex + 1];
      const sB = sBuffer[sIndex + 2];

      if (!crossX && !crossY) {
        tBuffer[tIndex] += sR * sqScale;
        tBuffer[tIndex + 1] += sG * sqScale;
        tBuffer[tIndex + 2] += sB * sqScale;
      } else if (crossX && !crossY) {
        const w = wx * scale;
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        const nw = nwx * scale;
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
      } else if (crossY && !crossX) {
        const w = wy * scale;
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        const nw = nwy * scale;
        tBuffer[tIndex + 3 * tw] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
      } else {
        const w = wx * wy;
        tBuffer[tIndex] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        const nw1 = nwx * wy;
        tBuffer[tIndex + 3] += sR * nw1;
        tBuffer[tIndex + 4] += sG * nw1;
        tBuffer[tIndex + 5] += sB * nw1;
        const nw2 = wx * nwy;
        tBuffer[tIndex + 3 * tw] += sR * nw2;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw2;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw2;
        const nw3 = nwx * nwy;
        tBuffer[tIndex + 3 * tw + 3] += sR * nw3;
        tBuffer[tIndex + 3 * tw + 4] += sG * nw3;
        tBuffer[tIndex + 3 * tw + 5] += sB * nw3;
      }
    }
  }

  const resCV = new OffscreenCanvas(tw, th);
  const resCtx = resCV.getContext('2d');
  if (!resCtx) {
    throw new Error('无法创建目标 canvas context');
  }

  const imgRes = resCtx.getImageData(0, 0, tw, th);
  const tByteBuffer = imgRes.data;

  let pxIndex = 0;
  for (
    let sIdx = 0, tIdx = 0;
    pxIndex < tw * th;
    sIdx += 3, tIdx += 4, pxIndex++
  ) {
    tByteBuffer[tIdx] = Math.ceil(tBuffer[sIdx]);
    tByteBuffer[tIdx + 1] = Math.ceil(tBuffer[sIdx + 1]);
    tByteBuffer[tIdx + 2] = Math.ceil(tBuffer[sIdx + 2]);
    tByteBuffer[tIdx + 3] = 255;
  }

  resCtx.putImageData(imgRes, 0, 0);
  return resCV;
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, imageData, quality, maxWidth, outputFormat } = e.data;

  try {
    let scale = 1;

    if (maxWidth && imageData.width > maxWidth) {
      scale = maxWidth / imageData.width;
    }

    // 先将 ImageBitmap 绘制到源 canvas
    const srcCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    const srcCtx = srcCanvas.getContext('2d');

    if (!srcCtx) {
      throw new Error('无法创建 OffscreenCanvas context');
    }

    srcCtx.drawImage(imageData, 0, 0);

    let canvas: OffscreenCanvas;

    // 如果需要缩小，使用高质量下采样算法
    if (scale < 1) {
      canvas = downScaleCanvas(srcCanvas, scale);
    } else {
      canvas = srcCanvas;
    }

    // 如果输出格式是 JPEG，需要填充白色背景
    if (outputFormat === 'image/jpeg') {
      const jpegCanvas = new OffscreenCanvas(canvas.width, canvas.height);
      const jpegCtx = jpegCanvas.getContext('2d');
      if (!jpegCtx) {
        throw new Error('无法创建 JPEG canvas context');
      }
      jpegCtx.fillStyle = '#FFFFFF';
      jpegCtx.fillRect(0, 0, canvas.width, canvas.height);
      jpegCtx.drawImage(canvas, 0, 0);
      canvas = jpegCanvas;
    }

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
        width: canvas.width,
        height: canvas.height,
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
