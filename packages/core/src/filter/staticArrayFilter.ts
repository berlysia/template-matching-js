import { pixelReaderFirstBrightness } from "../pixelReader/index";
import type { MyImageData } from "../types";
import { clamp } from "../utils/clamp";
import { readPixel } from "../utils/readPixel";
import { writePixel } from "../utils/writePixel";

export type FilterArray = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const DX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const DY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
export function staticArrayFilter(
  horizontal: FilterArray,
  vertical: FilterArray
) {
  return (input: MyImageData) => {
    const result = new Uint8ClampedArray(input.width * input.height * 4);
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        const i = y * input.width + x;

        let hValue = 0,
          vValue = 0;
        for (let d = 0; d < 9; ++d) {
          const dx = DX[d]!,
            dy = DY[d]!;
          // 端っこ処理( Replication )。バリエーションは convolution の border handling とかでぐぐる
          const dv = readPixel(
            input.data,
            clamp(y + dy, 0, input.height) * input.width +
              clamp(x + dx, 0, input.width)
          ).r;
          hValue += dv * horizontal[d]!;
          vValue += dv * vertical[d]!;
        }

        const v = clamp(
          Math.floor(Math.sqrt(hValue ** 2 + vValue ** 2)),
          0,
          256
        );
        // const v = input.data[i * 4]!;
        writePixel(result, i, { r: v, g: v, b: v });
      }
    }

    return new ImageData(result, input.width, input.height);
  };
}

export function staticArrayFilterOnlyValues(
  horizontal: FilterArray,
  vertical: FilterArray
) {
  return (input: MyImageData) => {
    const result: { h: number; v: number }[] = [];
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        const i = y * input.width + x;

        let hValue = 0,
          vValue = 0;
        for (let d = 0; d < 9; ++d) {
          const dx = DX[d]!,
            dy = DY[d]!;
          // 端っこ処理( Replication )。バリエーションは convolution の border handling とかでぐぐる
          const dv = readPixel(
            input.data,
            clamp(y + dy, 0, input.height) * input.width +
              clamp(x + dx, 0, input.width)
          ).r;
          hValue += dv * horizontal[d]!;
          vValue += dv * vertical[d]!;
        }

        result[i] = { h: hValue, v: vValue };
      }
    }

    return result;
  };
}
