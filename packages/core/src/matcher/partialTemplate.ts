import { partialTemplateIterator } from "../iterator/partialTemplate";
import type {
  MyImageData,
  PixelReaderFunction,
  Retriever,
  SimilarityFunction,
  PartialImageData,
  Logger,
} from "../types";
import { basicTemplateMatching } from "./basic";

export function partialTemplateMatching(
  base: MyImageData,
  temp: MyImageData,
  partialTemp: PartialImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction,
  retrieverFactory: () => Retriever
): Retriever {
  return basicTemplateMatching(
    base,
    temp,
    similarity,
    pixelReader,
    () => partialTemplateIterator(base, partialTemp),
    retrieverFactory
  );
}
