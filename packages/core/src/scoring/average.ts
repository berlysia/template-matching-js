export function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  let sum = 0;
  for (const v of scores) sum += v;
  return sum / scores.length;
}
