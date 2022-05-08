import { ThresholdRetriever } from "../retriever/threshold";
import type {
  MyImageData,
  PixelReaderFunction,
  SimilarityFunction,
  PartialImageData,
  Candidate,
} from "../types";
import { offsetIterator } from "../iterator/offset";
import { OffsetRetriever } from "../retriever/offset";
import { partialTemplateIterator } from "../iterator/partialTemplate";
import { average } from "../scoring/average";
import { basicTemplateMatching } from "./basic";

type SlicingFunction = (imageData: MyImageData) => PartialImageData[];

function* iteratorLogger(x: Iterable<Candidate>): Iterable<Candidate> {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const v of x) {
    if (v.pos.x < minX) minX = v.pos.x;
    if (v.pos.y < minY) minY = v.pos.y;
    if (v.pos.x > maxX) maxX = v.pos.x;
    if (v.pos.y > maxY) maxY = v.pos.y;
    yield v;
  }
  console.log({ minX, maxX, minY, maxY });
}

export function narrowingDownTemplateMatching(
  base: MyImageData,
  temp: MyImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction,
  threshold: number,
  slicingFunction: SlicingFunction,
  onEachCandidates?: (candidates: Candidate[]) => void
) {
  const slicedTemp = slicingFunction(temp);
  let candidates: Candidate[] = [];

  for (const sliced of slicedTemp) {
    const offset = {
      x: sliced.offsetX,
      y: sliced.offsetY,
    };
    const nextCandidates = basicTemplateMatching(
      base,
      sliced.data,
      similarity,
      pixelReader,
      // eslint-disable-next-line @typescript-eslint/no-loop-func, no-loop-func -- candidatesがどうしようもない
      () =>
        sliced === slicedTemp[0]
          ? offsetIterator(offset, partialTemplateIterator(base, sliced))
          : offsetIterator(offset, candidates),
      () =>
        new OffsetRetriever(offset, new ThresholdRetriever(average, threshold))
    ).all();
    candidates = nextCandidates;

    onEachCandidates?.(candidates);

    if (candidates.length === 1 && candidates[0]) {
      return candidates;
    }
  }

  return candidates;
}
