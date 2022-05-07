import type {
  Candidate,
  Logger,
  MyImageData,
  PixelReaderFunction,
  Position,
  Retriever,
  RetrieverFactory,
  SimilarityFunction,
} from "../types";

export function basicTemplateMatching(
  base: MyImageData,
  temp: MyImageData,
  similarity: SimilarityFunction,
  pixelReader: PixelReaderFunction,
  iteratorFactory: () => Iterable<Candidate>,
  retrieverFactory: RetrieverFactory
): Retriever {
  const retriever = retrieverFactory();
  for (const candidate of iteratorFactory()) {
    const currScore = similarity(
      base,
      temp,
      candidate.pos.x,
      candidate.pos.y,
      pixelReader
    );
    retriever.retrieve(candidate, currScore);
  }

  return retriever;
}
