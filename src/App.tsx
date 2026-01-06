import { Cat } from 'lucide-react';
import { useEffect } from 'react';
import { CompareModal } from './components/CompareModal';
import { ExportPanel } from './components/ExportPanel';
import { GlobalSettings } from './components/GlobalSettings';
import { ImageGrid } from './components/ImageGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { useImageProcessor } from './hooks/useImageProcessor';
import { useImageStore } from './store/useImageStore';

function App() {
  const images = useImageStore((state) => state.images);
  const settings = useImageStore((state) => state.settings);
  const { processImage } = useImageProcessor();

  // 新图片添加时自动处理
  useEffect(() => {
    const pendingImages = images.filter((img) => img.status === 'pending');
    for (const image of pendingImages) {
      processImage(image.id, settings);
    }
  }, [images, settings, processImage]);

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cat className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">压缩喵</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* 主体 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧控制面板 */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className="p-4 rounded-lg border bg-card">
                <h2 className="font-medium mb-4">压缩设置</h2>
                <GlobalSettings />
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h2 className="font-medium mb-4">导出</h2>
                <ExportPanel />
              </div>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>所有处理均在浏览器本地完成</p>
                <p>图片不会上传到服务器</p>
              </div>
            </div>
          </aside>

          {/* 右侧内容区 */}
          <main className="flex-1 min-w-0">
            <ImageGrid />
          </main>
        </div>
      </div>

      {/* 对比模态框 */}
      <CompareModal />
    </div>
  );
}

export default App;
