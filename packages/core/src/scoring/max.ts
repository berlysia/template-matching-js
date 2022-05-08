export function max(scores: number[]): number {
  let max = -Infinity;
  for (const v of scores) {
    if (v > max) {
      max = v;
    }
  }
  return max;
}
