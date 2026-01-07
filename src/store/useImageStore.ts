import { create } from "zustand";
import type { GlobalSettings, ImageFile } from "../types";

interface ImageStore {
  images: ImageFile[];
  settings: GlobalSettings;
  selectedImageId: string | null;

  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  clearAllImages: () => void;
  updateImage: (id: string, updates: Partial<ImageFile>) => void;

  setQuality: (quality: number) => void;
  setMaxWidth: (maxWidth: number | null) => void;
  setOutputFormat: (format: GlobalSettings["outputFormat"]) => void;

  selectImage: (id: string | null) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  settings: {
    quality: 0.8,
    maxWidth: null,
    outputFormat: "image/webp",
  },
  selectedImageId: null,

  addImages: (newImages) =>
    set((state) => ({
      images: [...state.images, ...newImages],
    })),

  removeImage: (id) =>
    set((state) => {
      const image = state.images.find((img) => img.id === id);
      if (image) {
        if (image.originalUrl) URL.revokeObjectURL(image.originalUrl);
        if (image.thumbnailUrl) URL.revokeObjectURL(image.thumbnailUrl);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      }
      return {
        images: state.images.filter((img) => img.id !== id),
        selectedImageId:
          state.selectedImageId === id ? null : state.selectedImageId,
      };
    }),

  clearAllImages: () =>
    set((state) => {
      for (const image of state.images) {
        if (image.originalUrl) URL.revokeObjectURL(image.originalUrl);
        if (image.thumbnailUrl) URL.revokeObjectURL(image.thumbnailUrl);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      }
      return { images: [], selectedImageId: null };
    }),

  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),

  setQuality: (quality) =>
    set((state) => ({
      settings: { ...state.settings, quality },
    })),

  setMaxWidth: (maxWidth) =>
    set((state) => ({
      settings: { ...state.settings, maxWidth },
    })),

  setOutputFormat: (outputFormat) =>
    set((state) => ({
      settings: { ...state.settings, outputFormat },
    })),

  selectImage: (id) => set({ selectedImageId: id }),
}));
