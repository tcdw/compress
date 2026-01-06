import { useImageStore } from '../store/useImageStore';
import type { OutputFormat } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';

const WIDTH_PRESETS = [
  { label: '800px', value: 800 },
  { label: '1200px', value: 1200 },
  { label: '1920px', value: 1920 },
  { label: '不限制', value: null },
];

export function GlobalSettings() {
  const settings = useImageStore((state) => state.settings);
  const setQuality = useImageStore((state) => state.setQuality);
  const setMaxWidth = useImageStore((state) => state.setMaxWidth);
  const setOutputFormat = useImageStore((state) => state.setOutputFormat);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setMaxWidth(null);
    } else {
      const num = Number.parseInt(value, 10);
      if (!Number.isNaN(num) && num > 0) {
        setMaxWidth(num);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 压缩质量 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>压缩质量</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(settings.quality * 100)}%
          </span>
        </div>
        <Slider
          value={[settings.quality]}
          onValueChange={([value]) => setQuality(value)}
          min={0.1}
          max={1}
          step={0.05}
        />
        <p className="text-xs text-muted-foreground">
          数值越低压缩率越高，但图片质量会下降
        </p>
      </div>

      {/* 最大宽度 */}
      <div className="space-y-3">
        <Label>最大宽度 (px)</Label>
        <Input
          type="number"
          placeholder="不限制"
          value={settings.maxWidth ?? ''}
          onChange={handleWidthChange}
          min={0}
        />
        <div className="flex flex-wrap gap-2">
          {WIDTH_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={
                settings.maxWidth === preset.value ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setMaxWidth(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          超过此宽度的图片会按比例缩小
        </p>
      </div>

      {/* 输出格式 */}
      <div className="space-y-3">
        <Label>输出格式</Label>
        <Select
          value={settings.outputFormat}
          onValueChange={(value) => setOutputFormat(value as OutputFormat)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original">保持原格式</SelectItem>
            <SelectItem value="image/webp">WebP (推荐)</SelectItem>
            <SelectItem value="image/jpeg">JPEG</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          WebP 格式压缩率更高，但部分老旧软件可能不支持
        </p>
      </div>
    </div>
  );
}
