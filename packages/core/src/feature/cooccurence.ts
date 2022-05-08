import { grayScaleBrightness } from "../pixelReader/grayScaleBrightness";
import type { MyImageData, Position } from "../types";
import { clamp } from "../utils/clamp";

function calcMax(values: number[]) {
  let result = -Infinity;
  for (const v of values) {
    if (v > result) result = v;
  }
  return result;
}

export type CoOccurenceFeature = Position & { radius: number };
export function coOccurrenceFeatureDetection(
  imageData: MyImageData
): CoOccurenceFeature[] {
  const coocc = Array.from({ length: 256 ** 2 }, () => 0);

  for (let y = 0, yL = imageData.height - 1; y < yL; ++y) {
    for (let x = 0, xL = imageData.width - 1; x < xL; ++x) {
      const p = Math.floor(
        grayScaleBrightness(imageData, y * imageData.width + x)
      );
      for (let yd = 0; yd < imageData.height; ++yd) {
        for (let xd = 0; xd < imageData.width; ++xd) {
          const q = Math.floor(
            grayScaleBrightness(imageData, yd * imageData.width + xd)
          );
          coocc[p * 256 + q]++;
        }
      }
    }
  }
  const globalMaxValue = calcMax(coocc);

  const radius = 1;
  const features: CoOccurenceFeature[] = [];
  for (let y = 0; y < imageData.height; ++y) {
    for (let x = 0; x < imageData.width; ++x) {
      const p = Math.floor(
        grayScaleBrightness(imageData, (y * imageData.width + x) * 4)
      );
      let maxValue = -Infinity;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ydy = clamp(y + dy, 0, imageData.height);
          const xdx = clamp(x + dx, 0, imageData.width);
          const q = Math.floor(
            grayScaleBrightness(imageData, (ydy * imageData.width + xdx) * 4)
          );
          const cooccValue = coocc[p * 256 + q]!;
          if (cooccValue > maxValue) {
            maxValue = cooccValue;
          }
        }
      }

      if (maxValue / globalMaxValue > 0.8) {
        // implement me...
        // いや多分これだと動かない
      }
    }
  }

  return features;
}
