import { css } from '@tuuject/koi-react/styled-system/css';
import { useImageStore } from '../store/useImageStore';
import { DropZone } from './DropZone';
import { ImageCard } from './ImageCard';

export function ImageGrid() {
  const images = useImageStore((state) => state.images);

  if (images.length === 0) {
    return <DropZone />;
  }

  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '4',
          md: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
        })}
      >
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
      <DropZone compact />
    </div>
  );
}
