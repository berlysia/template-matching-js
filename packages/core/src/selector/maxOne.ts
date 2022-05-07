import type {
  Candidate,
  ScoreCalculator,
  SingleCandidateSelector,
} from "../types";
import { maxCandidateSelector } from "./maxN";

export const maxOneCandidateSelector: SingleCandidateSelector = (
  candidates: Candidate[],
  calcScore: ScoreCalculator
) => {
  const result = maxCandidateSelector(candidates, calcScore, 1)[0];
  if (!result) throw new Error("something wrong");
  return result;
};
