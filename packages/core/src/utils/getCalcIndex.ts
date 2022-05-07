export function getCalcIndex({
  width,
}: {
  width: number;
}): (x: number, y: number) => number {
  return function calcIndex(x: number, y: number): number {
    return (y * width + x) * 4;
  };
}
