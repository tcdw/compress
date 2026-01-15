const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `不支持的格式: ${file.type || "未知"}。仅支持 JPG、PNG、WebP`,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `文件过大: ${(file.size / 1024 / 1024).toFixed(
        1
      )}MB。最大支持 100MB`,
    };
  }
  return { valid: true };
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close();
  return { width, height };
}

export async function generateThumbnail(
  file: File,
  maxSize = 400
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetWidth = width;
  let targetHeight = height;

  if (width > height) {
    if (width > maxSize) {
      targetWidth = maxSize;
      targetHeight = Math.round((height / width) * maxSize);
    }
  } else {
    if (height > maxSize) {
      targetHeight = maxSize;
      targetWidth = Math.round((width / height) * maxSize);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("无法创建 canvas context");
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.7);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
