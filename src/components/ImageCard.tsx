import { AlertCircle, Loader2, X } from 'lucide-react';
import { formatCompressionRatio, formatFileSize } from '../lib/format';
import { useImageStore } from '../store/useImageStore';
import type { ImageFile } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface ImageCardProps {
  image: ImageFile;
}

export function ImageCard({ image }: ImageCardProps) {
  const removeImage = useImageStore((state) => state.removeImage);
  const selectImage = useImageStore((state) => state.selectImage);

  const handleClick = () => {
    if (image.status === 'done') {
      selectImage(image.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeImage(image.id);
  };

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer transition-shadow hover:shadow-md py-0 gap-0
        ${image.status === 'done' ? 'hover:ring-2 hover:ring-primary' : ''}
      `}
      onClick={handleClick}
    >
      {/* 删除按钮 */}
      <Button
        variant="destructive"
        size="icon-sm"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 hover:opacity-100"
        onClick={handleRemove}
        style={{ opacity: 1 }}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* 缩略图 */}
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img
          src={image.thumbnailUrl}
          alt={image.name}
          className="w-full h-full object-contain"
        />

        {/* 处理中遮罩 */}
        {image.status === 'processing' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* 错误遮罩 */}
        {image.status === 'error' && (
          <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        )}
      </div>

      {/* 信息区域 */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-medium truncate" title={image.name}>
          {image.name}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>{formatFileSize(image.originalSize)}</span>
            {image.status === 'done' && image.compressedSize !== null && (
              <>
                <span>→</span>
                <span>{formatFileSize(image.compressedSize)}</span>
              </>
            )}
          </div>
          {image.status === 'done' && image.compressedSize !== null && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-green-600 dark:text-green-400"
              >
                {formatCompressionRatio(
                  image.originalSize,
                  image.compressedSize,
                )}
              </Badge>
            </div>
          )}

          {image.status === 'processing' && (
            <span className="text-primary">处理中...</span>
          )}

          {image.status === 'error' && (
            <span className="text-destructive" title={image.error}>
              失败
            </span>
          )}

          {image.status === 'pending' && (
            <span className="text-muted-foreground">等待中</span>
          )}
        </div>

        {image.status === 'processing' && (
          <Progress value={undefined} className="h-1" />
        )}
      </div>
    </Card>
  );
}
