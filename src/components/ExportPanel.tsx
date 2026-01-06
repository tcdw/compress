import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Download, FolderOpen, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFileSystemAccess } from '../hooks/useFileSystemAccess';
import { getOutputFileName } from '../lib/format';
import { useImageStore } from '../store/useImageStore';
import { Button } from './ui/button';

export function ExportPanel() {
  const images = useImageStore((state) => state.images);
  const settings = useImageStore((state) => state.settings);
  const clearAllImages = useImageStore((state) => state.clearAllImages);
  const { isSupported, isExporting, exportToDirectory } = useFileSystemAccess();
  const [isZipping, setIsZipping] = useState(false);

  const completedImages = images.filter(
    (img) => img.status === 'done' && img.compressedBlob,
  );

  const hasImages = completedImages.length > 0;

  const handleDownloadZip = async () => {
    if (!hasImages) return;

    setIsZipping(true);

    try {
      const zip = new JSZip();

      for (const image of completedImages) {
        if (image.compressedBlob) {
          const fileName = getOutputFileName(
            image.name,
            settings.outputFormat,
            image.originalType,
          );
          zip.file(fileName, image.compressedBlob);
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, '压缩喵-images.zip');
    } catch (error) {
      console.error('打包失败:', error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleExportToFolder = async () => {
    if (!hasImages) return;

    try {
      const files: Array<{ name: string; blob: Blob }> = [];
      for (const image of completedImages) {
        if (image.compressedBlob) {
          files.push({
            name: getOutputFileName(
              image.name,
              settings.outputFormat,
              image.originalType,
            ),
            blob: image.compressedBlob,
          });
        }
      }

      await exportToDirectory(files);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  const handleClearAll = () => {
    if (images.length > 0 && window.confirm('确定要清空所有图片吗？')) {
      clearAllImages();
    }
  };

  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        onClick={handleDownloadZip}
        disabled={!hasImages || isZipping}
      >
        {isZipping ? (
          <Loader2 className=" animate-spin" />
        ) : (
          <Download className="" />
        )}
        {isZipping ? '打包中...' : '下载 ZIP'}
      </Button>

      {isSupported && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleExportToFolder}
          disabled={!hasImages || isExporting}
        >
          {isExporting ? (
            <Loader2 className=" animate-spin" />
          ) : (
            <FolderOpen className="" />
          )}
          {isExporting ? '导出中...' : '保存到文件夹'}
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive"
        onClick={handleClearAll}
        disabled={images.length === 0}
      >
        <Trash2 className="" />
        清空全部
      </Button>

      {hasImages && (
        <p className="text-xs text-center text-muted-foreground">
          {completedImages.length} 张图片已就绪
        </p>
      )}
    </div>
  );
}
