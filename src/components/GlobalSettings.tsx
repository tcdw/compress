import { Button } from '@tuuject/koi-react/button';
import { Field } from '@tuuject/koi-react/field';
import { Input } from '@tuuject/koi-react/input';
import { Select } from '@tuuject/koi-react/select';
import { Slider } from '@tuuject/koi-react/slider';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useImageStore } from '../store/useImageStore';
import type { OutputFormat } from '../types';

const WIDTH_PRESETS: Array<{ label: string; value: number | null }> = [
  { label: '800', value: 800 },
  { label: '1200', value: 1200 },
  { label: '1920', value: 1920 },
  { label: '不限制', value: null },
];

const FORMAT_OPTIONS = [
  { value: 'original', label: '保持原格式' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/jpeg', label: 'JPEG' },
];

const FORMAT_HELP: Record<OutputFormat, string> = {
  original: 'PNG 保持无损，压缩质量设置对它不起作用',
  'image/webp': '压缩率更高的现代格式，主流浏览器都支持',
  'image/jpeg': '兼容性最好，压缩率略逊于 WebP',
};

export function GlobalSettings() {
  const settings = useImageStore((state) => state.settings);
  const setQuality = useImageStore((state) => state.setQuality);
  const setMaxWidth = useImageStore((state) => state.setMaxWidth);
  const setOutputFormat = useImageStore((state) => state.setOutputFormat);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setMaxWidth(null);
      return;
    }
    const num = Number.parseInt(value, 10);
    if (!Number.isNaN(num) && num > 0) {
      setMaxWidth(num);
    }
  };

  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}
    >
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}
      >
        <Slider
          label="压缩质量"
          showValue
          formatValue={(value) => `${Math.round(value * 100)}%`}
          min={0.1}
          max={1}
          step={0.05}
          value={settings.quality}
          onValueChange={(value) => setQuality(value)}
        />
        <p
          className={css({
            margin: '0',
            textStyle: 'small',
            color: 'text-muted',
          })}
        >
          数值越低压缩率越高，但图片质量会下降
        </p>
      </div>

      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}
      >
        <Field label="最大宽度（px）" help="超过此宽度的图片会按比例缩小">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="不限制"
            min={0}
            value={settings.maxWidth ?? ''}
            onChange={handleWidthChange}
          />
        </Field>
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {WIDTH_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              size="sm"
              color={
                settings.maxWidth === preset.value ? 'primary' : 'secondary'
              }
              variant={settings.maxWidth === preset.value ? 'solid' : 'outline'}
              aria-pressed={settings.maxWidth === preset.value}
              onClick={() => setMaxWidth(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <Field label="输出格式" help={FORMAT_HELP[settings.outputFormat]}>
        <Select
          options={FORMAT_OPTIONS}
          value={settings.outputFormat}
          onChange={(e) =>
            setOutputFormat(e.currentTarget.value as OutputFormat)
          }
        />
      </Field>
    </div>
  );
}
