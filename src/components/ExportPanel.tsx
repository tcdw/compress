import { Button } from '@tuuject/koi-react/button';
import { Dialog } from '@tuuject/koi-react/dialog';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useToast } from '@tuuject/koi-react/toast';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useState } from 'react';
import { useFileSystemAccess } from '../hooks/useFileSystemAccess';
import { getOutputFileName } from '../lib/format';
import { useImageStore } from '../store/useImageStore';
import { DownloadIcon, FolderIcon, TrashIcon } from './icons';

export function ExportPanel() {
  const images = useImageStore((state) => state.images);
  const settings = useImageStore((state) => state.settings);
  const clearAllImages = useImageStore((state) => state.clearAllImages);
  const { isSupported, isExporting, exportToDirectory } = useFileSystemAccess();
  const { toast } = useToast();
  const [isZipping, setIsZipping] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

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
      toast({
        tone: 'success',
        title: '压缩包已生成',
        description: `${completedImages.length} 张图片`,
      });
    } catch (error) {
      console.error('打包失败:', error);
      toast({ tone: 'error', title: '打包失败，请重试' });
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

      const written = await exportToDirectory(files);
      if (written) {
        toast({
          tone: 'success',
          title: '已保存到文件夹',
          description: `${files.length} 张图片`,
        });
      }
    } catch (error) {
      console.error('导出失败:', error);
      toast({ tone: 'error', title: '导出失败，请确认文件夹权限后重试' });
    }
  };

  const handleClearAll = () => {
    clearAllImages();
    setConfirmClearOpen(false);
  };

  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}
    >
      <Button
        fullWidth
        onClick={handleDownloadZip}
        disabled={!hasImages}
        loading={isZipping}
        iconStart={<DownloadIcon />}
      >
        {isZipping ? '打包中' : '下载 ZIP'}
      </Button>

      {isSupported && (
        <Button
          fullWidth
          color="secondary"
          variant="outline"
          onClick={handleExportToFolder}
          disabled={!hasImages}
          loading={isExporting}
          iconStart={<FolderIcon />}
        >
          {isExporting ? '导出中' : '保存到文件夹'}
        </Button>
      )}

      <Button
        fullWidth
        color="error"
        variant="ghost"
        onClick={() => setConfirmClearOpen(true)}
        disabled={images.length === 0}
        iconStart={<TrashIcon />}
      >
        清空全部
      </Button>

      {hasImages && (
        <p
          className={css({
            margin: '0',
            textStyle: 'small',
            color: 'text-muted',
            textAlign: 'center',
          })}
        >
          {completedImages.length} 张图片已就绪
        </p>
      )}

      <Dialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        role="alertdialog"
        title="清空全部图片？"
        description="已压缩的结果不会保留，需要重新导入图片。"
        hideClose
        footer={
          <>
            <Button
              color="secondary"
              variant="ghost"
              onClick={() => setConfirmClearOpen(false)}
            >
              取消
            </Button>
            <Button color="error" onClick={handleClearAll}>
              清空
            </Button>
          </>
        }
      />
    </div>
  );
}
