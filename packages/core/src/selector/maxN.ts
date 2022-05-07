import type { Candidate, ScoreCalculator } from "../types";

function byScore(a: CandidateBuf, b: CandidateBuf) {
  if (a.score < b.score) return 1;
  if (b.score < a.score) return -1;
  return 0;
}

type CandidateBuf = { candidate: Candidate; score: number };

export function maxCandidateSelector(
  candidates: Candidate[],
  calcScore: ScoreCalculator,
  bufferSize = 1
) {
  let buffer: CandidateBuf[] = [];
  for (const candidate of candidates) {
    const score = calcScore(candidate.meta.scores ?? []);
    const minScore = buffer.at(-1)?.score ?? -Infinity;
    if (score > minScore) {
      buffer.push({ candidate, score });
    }
    buffer.sort(byScore);
    buffer = buffer.slice(0, bufferSize);
  }

  return buffer.map((x) => x.candidate);
}
