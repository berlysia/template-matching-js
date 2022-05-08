import type { HarrisFeature } from "../feature/index";
import type { PartialImageData } from "../types";
import { clamp } from "../utils/clamp";
import { readPixel } from "../utils/readPixel";
import { writePixel } from "../utils/writePixel";

export function calcPatch(
  originW: number,
  originH: number,
  x: number,
  y: number,
  radius: number
) {
  const overflowNegativeX = Math.abs(Math.min(x - radius, 0));
  const overflowNegativeY = Math.abs(Math.min(y - radius, 0));
  const overflowPositiveX = Math.max(x + radius - originW, 0);
  const overflowPositiveY = Math.max(y + radius - originH, 0);
  return {
    x: Math.max(x - radius, 0),
    y: Math.max(y - radius, 0),
    w: radius * 2 + 1 - overflowNegativeX - overflowPositiveX,
    h: radius * 2 + 1 - overflowNegativeY - overflowPositiveY,
    overflowNegativeX,
    overflowPositiveX,
    overflowNegativeY,
    overflowPositiveY,
  };
}

export function sliceByFeatures(
  image: ImageData,
  features: HarrisFeature[]
): PartialImageData[] {
  const result: PartialImageData[] = [];
  for (const { x, y, radius } of features) {
    const patchRect = calcPatch(image.width, image.height, x, y, radius);
    const data = new ImageData(patchRect.w, patchRect.h);
    for (let dy = -radius; dy <= radius - patchRect.overflowPositiveY; ++dy) {
      for (let dx = -radius; dx <= radius - patchRect.overflowPositiveX; ++dx) {
        const i =
          clamp(dy + radius - patchRect.overflowNegativeY, 0, patchRect.h) *
            patchRect.w +
          clamp(dx + radius - patchRect.overflowNegativeX, 0, patchRect.w);
        const j =
          clamp(y + dy, 0, image.height) * image.width +
          clamp(x + dx, 0, image.width);
        writePixel(data.data, i, readPixel(image.data, j));
      }
    }
    result.push({
      data,
      offsetX: patchRect.x,
      offsetY: patchRect.y,
      originH: image.height,
      originW: image.width,
    });
  }
  return result;
}
