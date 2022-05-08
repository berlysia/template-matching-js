export function writePixel(
  data: Uint8ClampedArray,
  index: number,
  value: { r: number; g: number; b: number; a?: number }
) {
  if (index * 4 > data.length) {
    throw new Error(
      `out of bounds - current: ${index * 4}...${index * 4 + 3}, length: ${
        data.length
      }`
    );
  }
  data[index * 4] = value.r;
  data[index * 4 + 1] = value.g;
  data[index * 4 + 2] = value.b;
  data[index * 4 + 3] = value.a ?? 255;
}
