import type { Candidate, Position } from "../types";

export function* offsetIterator(
  offset: Position,
  values: Iterable<Candidate>
): Iterable<Candidate> {
  for (const v of values) {
    const x = v.pos.x + offset.x;
    const y = v.pos.y + offset.y;
    yield {
      ...v,
      pos: {
        x,
        y,
      },
    };
  }
}
