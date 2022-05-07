import type { Candidate, ScoreCalculator } from "../types";
import type { CandidateBuf } from "./CandidateBuf";

export function thresholdCandidateSelector(
  candidates: Candidate[],
  calcScore: ScoreCalculator,
  threshold = 0.8
) {
  let buffer: CandidateBuf[] = [];
  for (const candidate of candidates) {
    const score = calcScore(candidate.meta.scores ?? []);
    if (score > threshold) {
      buffer.push({ candidate, score });
    }
  }

  return buffer.map((x) => x.candidate);
}
