import type { MyImageData, PixelReaderFunction } from "../types";
import { calcRangeToColor } from "./calcRangeToColor";

function max(values: number[]) {
  let result = -Infinity;
  for (const v of values) {
    if (v > result) result = v;
  }
  return result;
}

export function getCoOccurrenceMatrix(
  temp: MyImageData,
  pixelReader: PixelReaderFunction
) {
  const coocc = Array.from({ length: 256 ** 2 }, () => 0);

  for (let y = 0, yL = temp.height - 1; y < yL; ++y) {
    for (let x = 0, xL = temp.width - 1; x < xL; ++x) {
      const p = Math.floor(pixelReader(temp, y * temp.width + x));
      for (let yd = 0; yd < temp.height; ++yd) {
        for (let xd = 0; xd < temp.width; ++xd) {
          const q = Math.floor(pixelReader(temp, yd * temp.width + xd));
          coocc[p * 256 + q]++;
        }
      }
    }
  }
  return coocc;
}

export function getCoOccurrenceMap(
  temp: MyImageData,
  pixelReader: PixelReaderFunction
): ImageData {
  const coocc = getCoOccurrenceMatrix(temp, pixelReader);
  const maxValue = max(coocc);

  const data = new Uint8ClampedArray(256 * 256 * 4);
  for (let y = 0; y < 256; ++y) {
    for (let x = 0; x < 256; ++x) {
      const p = y * 256 + x;
      const score = coocc[p]!;
      const i = p * 4;
      const color = calcRangeToColor(score, 0, maxValue);

      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = 255;
    }
  }
  return new ImageData(data, 256, 256);
}
