import type { Candidate, Position } from "../types";

export function* offsetIterator(
  offset: Position,
  values: Iterable<Candidate>
): Iterable<Candidate> {
  for (const v of values) {
    yield {
      ...v,
      pos: {
        x: v.pos.x + offset.x,
        y: v.pos.y + offset.y,
      },
    };
  }
}
