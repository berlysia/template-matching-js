export type MyImageData = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Candidate = {
  pos: Position;
  meta: {
    scores?: number[];
  };
};

export type SimilarityFunction = (
  baseImage: MyImageData,
  templateImage: MyImageData,
  dx: number,
  dy: number,
  pixelReader: PixelReaderFunction
) => number;

export type PixelReaderFunction = (image: MyImageData, index: number) => number;

export type ScoreCalculator = (scores: number[]) => number;
export type RetrieverFactory = () => Retriever;
export type Retriever = {
  retrieve: (candidate: Candidate, score: number) => void;
  first: () => Candidate;
  all: () => Candidate[];
};

export type CandidateSelector =
  | MultipleCandidateSelector
  | SingleCandidateSelector;

export type SingleCandidateSelector = (
  candidates: Candidate[],
  calcScore: ScoreCalculator
) => Candidate;

export type MultipleCandidateSelector = (
  candidates: Candidate[],
  calcScore: ScoreCalculator
) => Candidate[];

export type PartialImageData = {
  /** 分割されたImageData */
  data: ImageData;
  /** 分割された領域が元のImageDataのどこにあるか: X座標 */
  offsetX: number;
  /** 分割された領域が元のImageDataのどこにあるか: Y座標 */
  offsetY: number;
  /** 分割された領域の元のImageDataの寸法: width */
  originW: number;
  /** 分割された領域の元のImageDataの寸法: height */
  originH: number;
};

export type Logger = {
  log: (...msgs: any[]) => void;
};
