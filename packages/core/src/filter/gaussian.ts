import type { MyImageData } from "../types";
import { clamp } from "../utils/clamp";
import { readPixel } from "../utils/readPixel";
import { writePixel } from "../utils/writePixel";

export function gaussianFilter(input: MyImageData, radius: number) {
  const sigma = Math.max(radius / 2, 1);
  const kernelWidth = 2 * radius + 1;
  const kernel = Array.from({ length: kernelWidth ** 2 }, () => 0);
  let sum = 0;
  for (let y = -radius; y <= radius; ++y) {
    for (let x = -radius; x <= radius; ++x) {
      const value =
        (1 / (2 * Math.PI * sigma ** 2)) *
        Math.E ** (-(x ** 2 + y ** 2) / (2 * sigma ** 2));
      kernel[(y + radius) * kernelWidth + (x + radius)] = value;
      sum += value;
    }
  }
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum;
  }

  const bluredImage = new Uint8ClampedArray(input.width * input.height * 4);
  for (let y = 0; y < input.height - 0; y++) {
    for (let x = 0; x < input.width - 0; x++) {
      let r = 0,
        g = 0,
        b = 0;
      for (let kx = -radius; kx <= radius; ++kx) {
        for (let ky = -radius; ky <= radius; ++ky) {
          const i =
            clamp(y + ky, 0, input.height) * input.width +
            clamp(x + kx, 0, input.width);
          const kv = kernel[(ky + radius) * kernelWidth + (kx + radius)]!;
          const p = readPixel(input.data, i);
          r += p.r * kv;
          g += p.g * kv;
          b += p.b * kv;
        }
      }

      writePixel(bluredImage, y * input.width + x, {
        r: clamp(Math.floor(r), 0, 256),
        g: clamp(Math.floor(g), 0, 256),
        b: clamp(Math.floor(b), 0, 256),
      });
    }
  }

  return new ImageData(bluredImage, input.width, input.height);
}
