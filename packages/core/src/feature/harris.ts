/*
Harris Corner Detector
1. Take the grayscale of the original image
2. Apply a Gaussian filter to smooth out any noise
3. Apply Sobel operator to find the x and y gradient values for every pixel in the grayscale image
4. For each pixel p in the grayscale image, consider a 3×3 window around it and compute the corner strength function. Call this its Harris value.
5. Find all pixels that exceed a certain threshold and are the local maxima within a certain window (to prevent redundant dupes of features)
6. For each pixel that meets the criteria in 5, compute a feature descriptor.

https://medium.com/@deepanshut041/introduction-to-harris-corner-detector-32a88850b3f6
*/

import { gaussianFilter } from "../filter/gaussian";
import { sobel } from "../filter/sobelFilter";
import { pixelReaderGrayScaleBrightness } from "../pixelReader/index";
import type { MyImageData, Position } from "../types";
import { writePixel } from "../utils/writePixel";
import { clamp } from "../utils/clamp";

export type HarrisFeature = Position & { radius: number };
export function harrisCornerDetection(
  imageData: MyImageData,
  threshold = 1e7,
  radius = 3
): HarrisFeature[] {
  // 1
  const grayscaled = new ImageData(imageData.width, imageData.height);
  for (let y = 0; y < imageData.height; ++y) {
    for (let x = 0; x < imageData.width; ++x) {
      const i = y * imageData.width + x;
      const v = pixelReaderGrayScaleBrightness(imageData, i * 4);
      writePixel(grayscaled.data, i, { r: v, g: v, b: v });
    }
  }

  // 2
  const blurred = gaussianFilter(grayscaled, 3);

  // 3
  const sobelValues = sobel(blurred);

  // 4
  const harrisValues: number[] = [];
  for (let y = 0; y < imageData.height; ++y) {
    for (let x = 0; x < imageData.width; ++x) {
      const matrixM = [0, 0, 0, 0];
      for (let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx) {
          const i =
            clamp(y + dy, 0, imageData.height) * imageData.width +
            clamp(x + dx, 0, imageData.width);

          const sv = sobelValues[i]!;
          matrixM[0] += sv.h ** 2;
          matrixM[1] += sv.h * sv.v;
          matrixM[2] += sv.h * sv.v;
          matrixM[3] += sv.v ** 2;
        }
      }
      const detM = matrixM[0]! * matrixM[3]! - matrixM[1]! * matrixM[2]!;
      const traceM = matrixM[0]! + matrixM[3]!;
      const r = detM - 0.05 * traceM ** 2;
      harrisValues.push(r);
    }
  }

  const features: HarrisFeature[] = [];
  for (let y = 0; y < imageData.height; ++y) {
    for (let x = 0; x < imageData.width; ++x) {
      const i = y * imageData.width + x;
      const hi = harrisValues[i]!;
      if (hi > threshold) {
        let max = { x, y, v: hi };
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ydy = clamp(y + dy, 0, imageData.height);
            const xdx = clamp(x + dx, 0, imageData.width);
            const j = ydy * imageData.width + xdx;
            const hj = harrisValues[j]!;
            if (hj > max.v) {
              max = { x: xdx, y: ydy, v: hj };
            }
          }
        }
        if (x === max.x && y === max.y) {
          features.push({ x, y, radius });
        }
      }
    }
  }

  return features;

  // const harris = new ImageData(imageData.width, imageData.height);
  // for (let y = 0; y < imageData.height; ++y) {
  //   for (let x = 0; x < imageData.width; ++x) {
  //     const i = y * imageData.width + x;
  //     if (harrisValues[i]! > 1000000) {
  //       writePixel(harris.data, i, { r: 255, g: 0, b: 0 });
  //     } else if (harrisValues[i]! < -1000000) {
  //       writePixel(harris.data, i, { r: 0, g: 255, b: 0 });
  //     } else {
  //       writePixel(harris.data, i, { r: 0, g: 0, b: 255 });
  //     }
  //   }
  // }
  // return harris;

  // for (const f of features) {
  //   for (let dy = -1; dy <= 1; ++dy) {
  //     for (let dx = -1; dx <= 1; ++dx) {
  //       const i =
  //         clamp(f.y + dy, 0, imageData.height) * imageData.width +
  //         clamp(f.x + dx, 0, imageData.width);
  //       writePixel(grayscaled.data, i, { r: 255, g: 0, b: 0 });
  //     }
  //   }
  // }
  // return grayscaled;
}
