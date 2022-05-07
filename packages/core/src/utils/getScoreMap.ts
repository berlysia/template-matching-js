import type {
  MyImageData,
  PixelReaderFunction,
  SimilarityFunction,
} from "../types";
import { calcRangeToColorForNormalized } from "./calcRangeToColor";

export function getScoreMap(
  base: MyImageData,
  temp: MyImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction
): ImageData {
  const data = new Uint8ClampedArray(base.height * base.width * 4);
  for (let y = 0, yL = base.height - temp.height; y < yL; ++y) {
    for (let x = 0, xL = base.width - temp.width; x < xL; ++x) {
      const score = similarity(base, temp, x, y, pixelReader);
      const i = (y * base.width + x) * 4;
      const color = calcRangeToColorForNormalized(score);
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = 255;
    }
  }
  return new ImageData(data, base.width, base.height);
}

export function getSampleMap(size: number): ImageData {
  const height = 20;
  const data = new Uint8ClampedArray(size * height * 4);
  for (let x = 0; x < size; ++x) {
    const score = x / size;
    const color = calcRangeToColorForNormalized(score);
    for (let y = 0; y < height; ++y) {
      const i = (y * size + x) * 4;
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = 255;
    }
  }
  return new ImageData(data, size);
}
