export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export function formatCompressionRatio(
  original: number,
  compressed: number,
): string {
  if (original === 0) return '0%';
  const ratio = ((original - compressed) / original) * 100;
  return `-${ratio.toFixed(0)}%`;
}

export function getOutputExtension(format: string): string {
  switch (format) {
    case 'image/webp':
      return '.webp';
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      return '.jpg';
  }
}

export function getOutputFileName(
  originalName: string,
  outputFormat: string,
  originalType: string,
): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const actualFormat =
    outputFormat === 'original' ? originalType : outputFormat;
  const ext = getOutputExtension(actualFormat);
  return `${baseName}${ext}`;
}
