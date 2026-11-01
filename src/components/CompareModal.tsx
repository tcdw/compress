import { Badge } from '@tuuject/koi-react/badge';
import { Dialog } from '@tuuject/koi-react/dialog';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useEffect, useState } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import { formatCompressionRatio, formatFileSize } from '../lib/format';
import { useImageStore } from '../store/useImageStore';
import type { ImageFile } from '../types';

export function CompareModal() {
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const images = useImageStore((state) => state.images);
  const selectImage = useImageStore((state) => state.selectImage);

  const selectedImage = images.find(
    (img) => img.id === selectedImageId && img.compressedUrl,
  );

  // Keep the last image while the dialog's exit animation plays; `open` is what closes it.
  const [shownImage, setShownImage] = useState<ImageFile | null>(null);
  useEffect(() => {
    if (selectedImage) {
      setShownImage(selectedImage);
    }
  }, [selectedImage]);

  const open = Boolean(selectedImage);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          selectImage(null);
        }
      }}
      size="lg"
      title={
        shownImage && (
          <span
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3',
              minWidth: '0',
            })}
          >
            <span
              className={css({
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              })}
            >
              {shownImage.name}
            </span>
            {shownImage.compressedSize !== null && (
              <Badge tone="primary">
                {formatCompressionRatio(
                  shownImage.originalSize,
                  shownImage.compressedSize,
                )}
              </Badge>
            )}
          </span>
        )
      }
      description="拖动滑块对比压缩前后效果，左侧为原图，右侧为压缩后"
    >
      {shownImage?.compressedUrl && (
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
          })}
        >
          <div
            className={css({
              overflow: 'hidden',
              borderRadius: 'lg',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              bg: 'surface-muted',
            })}
          >
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={shownImage.originalUrl}
                  alt="原图"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={shownImage.compressedUrl}
                  alt="压缩后"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              }
              style={{ height: 'min(52vh, 480px)' }}
            />
          </div>

          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '4',
            })}
          >
            <div
              className={css({
                padding: '3',
                borderRadius: 'xl',
                bg: 'surface-muted',
                display: 'flex',
                flexDirection: 'column',
                gap: '1',
              })}
            >
              <p className={css({ margin: '0', textStyle: 'label' })}>原图</p>
              <p
                className={css({
                  margin: '0',
                  textStyle: 'small',
                  color: 'text-muted',
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {shownImage.originalWidth} × {shownImage.originalHeight} px
              </p>
              <p
                className={css({
                  margin: '0',
                  textStyle: 'small',
                  color: 'text-muted',
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {formatFileSize(shownImage.originalSize)}
              </p>
            </div>

            <div
              className={css({
                padding: '3',
                borderRadius: 'xl',
                bg: 'surface-muted',
                display: 'flex',
                flexDirection: 'column',
                gap: '1',
              })}
            >
              <p className={css({ margin: '0', textStyle: 'label' })}>压缩后</p>
              {shownImage.compressedSize !== null && (
                <>
                  <p
                    className={css({
                      margin: '0',
                      textStyle: 'small',
                      color: 'text-muted',
                      fontVariantNumeric: 'tabular-nums',
                    })}
                  >
                    {formatFileSize(shownImage.compressedSize)}
                  </p>
                  <p
                    className={css({
                      margin: '0',
                      textStyle: 'label',
                      color: 'text',
                      fontVariantNumeric: 'tabular-nums',
                    })}
                  >
                    节省{' '}
                    {formatFileSize(
                      shownImage.originalSize - shownImage.compressedSize,
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
