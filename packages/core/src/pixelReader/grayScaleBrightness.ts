import type { PixelReaderFunction } from "../types";

export const grayScaleBrightness: PixelReaderFunction = (image, index) => {
  return (
    image.data[index]! * 0.3 +
    image.data[index + 1]! * 0.59 +
    image.data[index + 2]! * 0.11
  );
};
