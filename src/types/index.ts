export type OutputFormat = 'original' | 'image/webp' | 'image/jpeg';

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalUrl: string;
  thumbnailUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number | null;
  compressedUrl: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export interface GlobalSettings {
  quality: number;
  maxWidth: number | null;
  outputFormat: OutputFormat;
}

export interface WorkerRequest {
  type: 'compress';
  id: string;
  imageData: ImageBitmap;
  quality: number;
  maxWidth: number | null;
  outputFormat: string;
}

export interface WorkerResponse {
  type: 'complete' | 'error';
  id: string;
  result?: {
    blob: Blob;
    width: number;
    height: number;
  };
  error?: string;
}
