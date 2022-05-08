import type { MyImageData, PartialImageData } from "../types";
import { readPixel } from "../utils/readPixel";
import { writePixel } from "../utils/writePixel";

export function sliceImages(
  imageData: MyImageData,
  sliceSize: number
): PartialImageData[] {
  const originW = imageData.width,
    originH = imageData.height;
  const slicesX = Math.ceil(originW / sliceSize),
    slicesY = Math.ceil(originH / sliceSize);

  let results: PartialImageData[] = [];
  for (let dx = 0; dx < slicesX; dx++) {
    for (let dy = 0; dy < slicesY; dy++) {
      const isRemainY = originH % sliceSize > 0 && dy === slicesY - 1;
      const isRemainX = originW % sliceSize > 0 && dx === slicesX - 1;
      const sizeY = isRemainY ? originH % sliceSize : sliceSize;
      const sizeX = isRemainX ? originW % sliceSize : sliceSize;
      const offsetY = dy * sliceSize;
      const offsetX = dx * sliceSize;

      const buf = new Uint8ClampedArray(sizeX * sizeY * 4);
      for (let y = 0; y < sizeY; ++y) {
        for (let x = 0; x < sizeX; ++x) {
          const i = y * sizeX + x;
          const j = (y + offsetY) * imageData.width + (x + offsetX);
          writePixel(buf, i, readPixel(imageData.data, j));
        }
      }

      results.push({
        data: new ImageData(buf, sizeX, sizeY),
        offsetX,
        offsetY,
        originH: imageData.height,
        originW: imageData.width,
      });
    }
  }
  return results;
}
