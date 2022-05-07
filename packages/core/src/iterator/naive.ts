import type { Candidate } from "../types";

export function* naiveIterator(
  beginX: number,
  endX: number,
  beginY: number,
  endY: number
): Iterable<Candidate> {
  for (let y = beginY; y < endY; ++y) {
    for (let x = beginX; x < endX; ++x) {
      yield { pos: { x, y }, meta: {} };
    }
  }
}
