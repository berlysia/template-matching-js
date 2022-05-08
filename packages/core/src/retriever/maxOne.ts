import { last } from "../scoring/last";
import type { Candidate, Retriever, ScoreCalculator } from "../types";

export class MaxOneRetriever implements Retriever {
  #maxCandidate: Candidate | null = null;
  #maxScore = -Infinity;
  #calcScore: ScoreCalculator;

  constructor(scoreCalc: ScoreCalculator = last) {
    this.#calcScore = scoreCalc;
  }

  retrieve(candidate: Candidate, score: number) {
    const computedScore = this.#calcScore(
      (candidate.meta.scores ?? []).concat(score)
    );
    if (computedScore > this.#maxScore) {
      const newCand = structuredClone(candidate);
      const scores = newCand.meta.scores ?? [];
      scores.push(computedScore);
      newCand.meta.scores = scores;
      this.#maxScore = computedScore;
      this.#maxCandidate = newCand;
    }
  }

  first() {
    if (this.#maxCandidate === null) {
      throw new Error("something wrong: result is null");
    }
    return structuredClone(this.#maxCandidate);
  }

  all() {
    return [this.first()];
  }
}
