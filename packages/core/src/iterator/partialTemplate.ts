import type { Candidate, MyImageData, PartialImageData } from "../types";
import { naiveIterator } from "./naive";

export function* partialTemplateIterator(
  base: Omit<MyImageData, "data">,
  partialTemp: Omit<PartialImageData, "data">
): Iterable<Candidate> {
  yield* naiveIterator(
    partialTemp.offsetX,
    base.width + -partialTemp.originW,
    partialTemp.offsetY,
    base.height + -partialTemp.originH
  );
}
