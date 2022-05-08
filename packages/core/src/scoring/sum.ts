export function sum(scores: number[]): number {
  let sum = 0;
  for (const v of scores) {
    sum += v;
  }
  return sum;
}
