import { ThresholdRetriever } from "../retriever/threshold";
import type {
  MyImageData,
  PixelReaderFunction,
  Position,
  Retriever,
  SimilarityFunction,
  PartialImageData,
  Candidate,
} from "../types";
import { sliceImages } from "../slicer/index";
import { offsetIterator } from "../iterator/offset";
import { OffsetRetriever } from "../retriever/offset";
import { MaxOneRetriever } from "../retriever/maxOne";
import { partialTemplateIterator } from "../iterator/partialTemplate";
import { average } from "../scoring/average";
import { maxOneCandidateSelector } from "../selector/maxOne";
import { peekMax } from "../scoring/peekMax";
import { basicTemplateMatching } from "./basic";
import { partialTemplateMatching } from "./partialTemplate";

type SlicingFunction = (imageData: MyImageData) => PartialImageData[];

export function slicedTemplateMatching(
  base: MyImageData,
  temp: MyImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction,
  threshold = 0.6,
  slicingFunction: SlicingFunction = (temp) => sliceImages(temp, 24)
): Position {
  const slicedTemp = slicingFunction(temp);

  if (slicedTemp.length === 1) {
    return partialTemplateMatching(
      base,
      slicedTemp[0]!.data,
      slicedTemp[0]!,
      similarity,
      pixelReader,
      () => new MaxOneRetriever()
    ).first().pos;
  }

  let candidates: Candidate[] = [];

  for (const sliced of slicedTemp) {
    const offset = { x: sliced.offsetX, y: sliced.offsetY };
    const nextCandidates = basicTemplateMatching(
      base,
      sliced.data,
      similarity,
      pixelReader,
      // eslint-disable-next-line @typescript-eslint/no-loop-func, no-loop-func -- candidatesがどうしようもない
      () =>
        offsetIterator(
          offset,
          sliced === slicedTemp[0]
            ? partialTemplateIterator(base, sliced)
            : candidates
        ),
      () =>
        new OffsetRetriever(offset, new ThresholdRetriever(average, threshold))
    ).all();
    candidates = nextCandidates;
    if (candidates.length === 1 && candidates[0]) {
      return candidates[0].pos;
    }
  }

  return maxOneCandidateSelector(candidates, peekMax).pos;
}
