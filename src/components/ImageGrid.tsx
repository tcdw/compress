import { useImageStore } from "../store/useImageStore";
import { DropZone } from "./DropZone";
import { ImageCard } from "./ImageCard";

export function ImageGrid() {
  const images = useImageStore((state) => state.images);

  if (images.length === 0) {
    return <DropZone />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xl:gap-6">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
      <DropZone compact />
    </div>
  );
}
