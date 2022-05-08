import { ThresholdRetriever } from "../retriever/threshold";
import type {
  MyImageData,
  PixelReaderFunction,
  Position,
  SimilarityFunction,
  PartialImageData,
} from "../types";
import { sliceImages } from "../slicer/index";
import { offsetIterator } from "../iterator/offset";
import { OffsetRetriever } from "../retriever/offset";
import { partialTemplateIterator } from "../iterator/partialTemplate";
import { average } from "../scoring/average";
import { maxOneCandidateSelector } from "../selector/maxOne";
import { sum } from "../scoring/sum";
import { basicTemplateMatching } from "./basic";

type SlicingFunction = (imageData: MyImageData) => PartialImageData[];

export function cumulativeTemplateMatching(
  base: MyImageData,
  temp: MyImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction,
  threshold = 0.6,
  slicingFunction: SlicingFunction = (temp) => sliceImages(temp, 24)
) {
  const slicedTemp = slicingFunction(temp);
  const map = new Map<`${number}:${number}`, number[]>();

  for (const sliced of slicedTemp) {
    const offset = {
      x: sliced.offsetX,
      y: sliced.offsetY,
    };
    const results = basicTemplateMatching(
      base,
      sliced.data,
      similarity,
      pixelReader,

      () => offsetIterator(offset, partialTemplateIterator(base, sliced)),
      () =>
        new OffsetRetriever(offset, new ThresholdRetriever(average, threshold))
    ).all();
    for (const cand of results) {
      const key = `${cand.pos.x}:${cand.pos.y}` as const;
      const arr = (map.get(key) ?? []).concat(cand.meta.scores!);
      map.set(key, arr);
    }
  }

  const candidates = [...map.entries()].map(([key, scores]) => {
    const [x, y] = key.split(":").map((v) => parseInt(v, 10)) as [
      number,
      number
    ];
    return { pos: { x, y }, meta: { scores } };
  });

  return candidates;
}
