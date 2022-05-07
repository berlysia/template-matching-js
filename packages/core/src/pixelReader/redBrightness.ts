import type { PixelReaderFunction } from "../types";

export const redBrightness: PixelReaderFunction = (image, index) => {
  return image.data[index]!;
};
