import { clamp } from "./clamp";

function sigmoid(value: number, gain = 1, offset = 0) {
  return Math.tanh((((value + offset) * gain) / 2 + 1) / 2);
}

const gain = 10;
const offset = 0.2;
const offsetGreen = 0.6;

export function calcRangeToColor(
  value: number,
  bottom: number,
  top: number
): { r: number; g: number; b: number } {
  const ratio = (value - bottom) / (top - bottom);
  const x = ratio * 2 - 1;
  return {
    r: clamp(Math.floor(sigmoid(x, gain, -1 * offset) * 255), 0, 256),
    g: clamp(
      Math.floor(
        (sigmoid(x, gain, offsetGreen) - sigmoid(x, gain, -offsetGreen)) * 255
      ),
      0,
      256
    ),
    b: clamp(Math.floor((1 - sigmoid(x, gain, offset)) * 255), 0, 256),
  };
}

export function calcRangeToColorForNormalized(value: number): {
  r: number;
  g: number;
  b: number;
} {
  return calcRangeToColor(value, 0, 1);
}
