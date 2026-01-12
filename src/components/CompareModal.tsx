import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { formatCompressionRatio, formatFileSize } from "../lib/format";
import { useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function CompareModal() {
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const images = useImageStore((state) => state.images);
  const selectImage = useImageStore((state) => state.selectImage);

  const selectedImage = images.find((img) => img.id === selectedImageId);

  const handleClose = () => {
    selectImage(null);
  };

  if (!selectedImage || !selectedImage.compressedUrl) {
    return null;
  }

  return (
    <Dialog
      open={!!selectedImageId}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="truncate">{selectedImage.name}</span>
            {selectedImage.compressedSize !== null && (
              <Badge
                variant="secondary"
                className="text-green-600 dark:text-green-400"
              >
                {formatCompressionRatio(
                  selectedImage.originalSize,
                  selectedImage.compressedSize
                )}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 对比滑块 */}
          <div className="rounded-lg overflow-hidden border">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={selectedImage.originalUrl}
                  alt="原图"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={selectedImage.compressedUrl}
                  alt="压缩后"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                />
              }
              style={{ height: "60vh" }}
            />
          </div>

          {/* 信息对比 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium mb-1">原图</p>
              <p className="text-muted-foreground">
                {selectedImage.originalWidth} × {selectedImage.originalHeight}{" "}
                px
              </p>
              <p className="text-muted-foreground">
                {formatFileSize(selectedImage.originalSize)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium mb-1">压缩后</p>
              <p className="text-muted-foreground">
                {selectedImage.compressedBlob &&
                  selectedImage.compressedSize !== null && (
                    <span>{formatFileSize(selectedImage.compressedSize)}</span>
                  )}
              </p>
              {selectedImage.compressedSize !== null && (
                <p className="text-green-600 dark:text-green-400 font-medium">
                  节省{" "}
                  {formatFileSize(
                    selectedImage.originalSize - selectedImage.compressedSize
                  )}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            拖动滑块对比压缩前后效果 ・ 左侧为原图，右侧为压缩后
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
