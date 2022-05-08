export function readPixel(data: Readonly<Uint8ClampedArray>, index: number) {
  if (index * 4 > data.length) {
    throw new Error(
      `out of bounds - current: ${index * 4}...${index * 4 + 3}, length: ${
        data.length
      }`
    );
  }
  return {
    r: data[index * 4]!,
    g: data[index * 4 + 1]!,
    b: data[index * 4 + 2]!,
    a: data[index * 4 + 3]!,
  };
}
