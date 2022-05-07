import type { SimilarityFunction } from "../types";
import { getCalcIndex } from "../utils/getCalcIndex";

export const ssd: SimilarityFunction = (
  baseImage,
  tempImage,
  dx,
  dy,
  pixelReader
) => {
  const calcBaseIndex = getCalcIndex(baseImage);
  const calcTempIndex = getCalcIndex(tempImage);
  let sum = 0;

  for (let y = 0, yL = tempImage.height; y < yL; y++) {
    for (let x = 0, xL = tempImage.width; x < xL; x++) {
      const gk = pixelReader(baseImage, calcBaseIndex(dx + x, dy + y));
      const fk = pixelReader(tempImage, calcTempIndex(x, y));

      sum += (gk - fk) ** 2;
    }
  }

  return -sum;
};
