import { Badge } from '@tuuject/koi-react/badge';
import { IconButton } from '@tuuject/koi-react/button';
import { Card } from '@tuuject/koi-react/card';
import { Spinner } from '@tuuject/koi-react/spinner';
import { css } from '@tuuject/koi-react/styled-system/css';
import { formatCompressionRatio, formatFileSize } from '../lib/format';
import { focusRing } from '../lib/styles';
import { useImageStore } from '../store/useImageStore';
import type { ImageFile } from '../types';
import { ArrowRightIcon, CloseIcon, ErrorIcon } from './icons';

interface ImageCardProps {
  image: ImageFile;
}

export function ImageCard({ image }: ImageCardProps) {
  const removeImage = useImageStore((state) => state.removeImage);
  const selectImage = useImageStore((state) => state.selectImage);

  const isDone = image.status === 'done';
  const isProcessing = image.status === 'processing';

  const thumbnail = (
    <img
      src={image.thumbnailUrl}
      alt={image.name}
      className={css({
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      })}
    />
  );

  return (
    <Card
      padding="none"
      className={css({
        overflow: 'hidden',
        transitionProperty: 'border-color',
        transitionDuration: 'fast',
        _hover: isDone ? { borderColor: 'action' } : undefined,
      })}
      media={
        <div
          className={css({
            position: 'relative',
            aspectRatio: '1',
            bg: 'surface-muted',
          })}
        >
          {isDone ? (
            <button
              type="button"
              onClick={() => selectImage(image.id)}
              aria-label={`对比 ${image.name} 的压缩效果`}
              className={css({
                display: 'block',
                width: '100%',
                height: '100%',
                padding: '0',
                border: 'none',
                bg: 'transparent',
                cursor: 'pointer',
                _focusVisible: focusRing,
              })}
            >
              {thumbnail}
            </button>
          ) : (
            thumbnail
          )}

          <IconButton
            size="sm"
            color="secondary"
            variant="solid"
            icon={<CloseIcon size={14} />}
            label={`移除 ${image.name}`}
            onClick={() => removeImage(image.id)}
            className={css({
              position: 'absolute',
              top: '2',
              right: '2',
              zIndex: 1,
            })}
          />

          {isProcessing && (
            <div
              className={css({
                position: 'absolute',
                inset: '0',
                display: 'grid',
                placeItems: 'center',
                bg: 'surface-glass',
                backdropBlur: 'panel',
              })}
            >
              <Spinner size="lg" label="正在压缩" />
            </div>
          )}

          {image.status === 'error' && (
            <div
              className={css({
                position: 'absolute',
                inset: '0',
                display: 'grid',
                placeItems: 'center',
                bg: 'error-surface',
              })}
            >
              <ErrorIcon size={16} className={css({ color: 'error-text' })} />
            </div>
          )}
        </div>
      }
    >
      <div
        className={css({
          padding: '3',
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
        })}
      >
        <p
          title={image.name}
          className={css({
            margin: '0',
            textStyle: 'label',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          })}
        >
          {image.name}
        </p>

        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2',
            textStyle: 'small',
            color: 'text-muted',
          })}
        >
          <span
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            })}
          >
            {formatFileSize(image.originalSize)}
            {isDone && image.compressedSize !== null && (
              <>
                <ArrowRightIcon size={12} />
                <span className={css({ color: 'text' })}>
                  {formatFileSize(image.compressedSize)}
                </span>
              </>
            )}
          </span>

          {isDone && image.compressedSize !== null && (
            <Badge tone="primary">
              {formatCompressionRatio(image.originalSize, image.compressedSize)}
            </Badge>
          )}

          {isProcessing && (
            <span className={css({ color: 'text-brand' })}>处理中</span>
          )}

          {image.status === 'error' && (
            <span
              title={image.error}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1',
                color: 'error-text',
              })}
            >
              <ErrorIcon size={12} />
              失败
            </span>
          )}

          {image.status === 'pending' && <span>等待中</span>}
        </div>
      </div>
    </Card>
  );
}
