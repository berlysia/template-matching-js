import type { MyImageData, PartialImageData } from "../types";

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

      const buf = new Uint8ClampedArray(sizeY * sizeX * 4);
      const offsetY = dy * sliceSize;
      const offsetX = dx * sliceSize;
      for (let y = 0; y < sizeY; ++y) {
        for (let x = 0; x < sizeX; ++x) {
          const tPos = (y * sizeX + x) * 4,
            oPos = ((offsetY + y) * originW + (offsetX + x)) * 4;
          buf[tPos] = imageData.data[oPos]!;
          buf[tPos + 1] = imageData.data[oPos + 1]!;
          buf[tPos + 2] = imageData.data[oPos + 2]!;
          buf[tPos + 3] = imageData.data[oPos + 3]!;
        }
      }
      results.push({
        data: new ImageData(buf, sizeX, sizeY),
        offsetX,
        offsetY,
        originH,
        originW,
      });
    }
  }
  return results;
}
