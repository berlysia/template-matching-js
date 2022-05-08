export function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  let sum = 0;
  let hasNonFinite = false;
  for (const v of scores) {
    if (Number.isFinite(v)) {
      sum += v;
    } else {
      hasNonFinite = true;
    }
  }
  if (hasNonFinite) {
    console.error(`average takes some non-finite value: ${scores.join(", ")}`);
  }
  return sum / scores.length;
}
