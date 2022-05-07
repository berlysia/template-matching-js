import type { SimilarityFunction } from "../types";
import { getCalcIndex } from "../utils/getCalcIndex";

export const zncc: SimilarityFunction = (
  baseImage,
  tempImage,
  dx,
  dy,
  pixelReader
) => {
  const calcBaseIndex = getCalcIndex(baseImage);
  const calcTempIndex = getCalcIndex(tempImage);
  const numberOfPixels = tempImage.width * tempImage.height;
  let basePow2Sum = 0;
  let baseSum = 0;
  let tempPow2Sum = 0;
  let tempSum = 0;
  let prodSum = 0;

  for (let y = 0, yL = tempImage.height; y < yL; y++) {
    for (let x = 0, xL = tempImage.width; x < xL; x++) {
      const gk = pixelReader(baseImage, calcBaseIndex(dx + x, dy + y));
      const fk = pixelReader(tempImage, calcTempIndex(x, y));
      basePow2Sum += gk ** 2;
      baseSum += gk;
      tempPow2Sum += fk ** 2;
      tempSum += fk;
      prodSum += gk * fk;
    }
  }
  const baseAverage = baseSum / numberOfPixels;
  const tempAverage = tempSum / numberOfPixels;
  const prodAverage = prodSum / numberOfPixels;

  const basePow2Average = basePow2Sum / numberOfPixels;
  const tempPow2Average = tempPow2Sum / numberOfPixels;

  const covariance = prodAverage - baseAverage * tempAverage;
  const baseVariance = basePow2Average - baseAverage ** 2;
  const tempVariance = tempPow2Average - tempAverage ** 2;

  return covariance / (Math.sqrt(baseVariance) * Math.sqrt(tempVariance));
};
