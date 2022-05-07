import type { SimilarityFunction } from "../types";
import { getCalcIndex } from "../utils/getCalcIndex";

export const ncc: SimilarityFunction = (
  baseImage,
  templateImage,
  dx,
  dy,
  pixelReader
) => {
  let a = 0,
    b = 0,
    c = 0;
  const calcBaseIndex = getCalcIndex(baseImage);
  const calcTempIndex = getCalcIndex(templateImage);
  // inner product
  for (let y = 0, yL = templateImage.height; y < yL; y += 4) {
    for (let x = 0, xL = templateImage.width; x < xL; x += 4) {
      const base = pixelReader(baseImage, calcBaseIndex(dx + x, dy + y));
      const temp = pixelReader(templateImage, calcTempIndex(x, y));
      a += base * temp;
      b += base * base;
      c += temp * temp;
    }
  }
  return a / (Math.sqrt(b) * Math.sqrt(c));
};
