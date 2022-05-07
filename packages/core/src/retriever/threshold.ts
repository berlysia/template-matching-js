import type { Candidate, Retriever, ScoreCalculator } from "../types";

export class ThresholdRetriever implements Retriever {
  #threshold: number;
  #results: Candidate[] = [];
  #calcScore: ScoreCalculator;

  constructor(scoreCalc: ScoreCalculator, threshold: number) {
    this.#calcScore = scoreCalc;
    this.#threshold = threshold;
  }

  retrieve(candidate: Candidate, score: number) {
    const computedScore = this.#calcScore(
      (candidate.meta.scores ?? []).concat(score)
    );
    if (computedScore > this.#threshold) {
      const newCand = structuredClone(candidate);
      const scores = newCand.meta.scores ?? [];
      scores.push(computedScore);
      newCand.meta.scores = scores;
      this.#results.push(newCand);
    }
  }

  first() {
    const result = this.#results[0];
    if (!result) {
      throw new Error("something wrong: result is empty");
    }
    return result;
  }

  all() {
    return this.#results.slice();
  }
}
