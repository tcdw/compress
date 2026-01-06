import { useCallback, useState } from 'react';

interface FileSystemAccess {
  isSupported: boolean;
  isExporting: boolean;
  exportToDirectory: (
    files: Array<{ name: string; blob: Blob }>,
  ) => Promise<boolean>;
}

export function useFileSystemAccess(): FileSystemAccess {
  const [isExporting, setIsExporting] = useState(false);

  const isSupported = 'showDirectoryPicker' in window;

  const exportToDirectory = useCallback(
    async (files: Array<{ name: string; blob: Blob }>): Promise<boolean> => {
      if (!isSupported) return false;

      setIsExporting(true);

      try {
        const directoryHandle = await window.showDirectoryPicker({
          mode: 'readwrite',
        });

        for (const file of files) {
          const fileHandle = await directoryHandle.getFileHandle(file.name, {
            create: true,
          });
          const writable = await fileHandle.createWritable();
          await writable.write(file.blob);
          await writable.close();
        }

        return true;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // 用户取消了选择
          return false;
        }
        throw error;
      } finally {
        setIsExporting(false);
      }
    },
    [isSupported],
  );

  return {
    isSupported,
    isExporting,
    exportToDirectory,
  };
}

// 类型声明扩展
declare global {
  interface Window {
    showDirectoryPicker: (options?: {
      mode?: 'read' | 'readwrite';
    }) => Promise<FileSystemDirectoryHandle>;
  }
}
