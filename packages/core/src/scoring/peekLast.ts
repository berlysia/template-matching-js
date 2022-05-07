export function peekLast(scores: number[]): number {
  const r = scores.at(-1);
  if (r === undefined)
    throw new Error("something wrong: peekLast takes zero scores");
  return r;
}
