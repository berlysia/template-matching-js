export function last(scores: number[]): number {
  const r = scores.at(-1);
  if (r === undefined)
    throw new Error("something wrong: last takes zero scores");
  return r;
}
