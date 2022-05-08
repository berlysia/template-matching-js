import { partialTemplateIterator } from "../iterator/partialTemplate";
import { MaxOneRetriever } from "../retriever/maxOne";
import type {
  MyImageData,
  PixelReaderFunction,
  Position,
  RetrieverFactory,
  SimilarityFunction,
} from "../types";
import { basicTemplateMatching } from "./basic";

export function naiveTemplateMatching(
  base: MyImageData,
  temp: MyImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction,
  retrieverFactory: RetrieverFactory = () => new MaxOneRetriever()
): Position {
  return basicTemplateMatching(
    base,
    temp,
    similarity,
    pixelReader,
    () =>
      partialTemplateIterator(base, {
        offsetX: 0,
        offsetY: 0,
        originW: temp.width,
        originH: temp.height,
      }),
    retrieverFactory
  ).first().pos;
}
