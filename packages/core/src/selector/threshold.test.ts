import { describe, expect, it } from "vitest";
import { peekLast } from "../scoring/peekLast";
import { thresholdCandidateSelector } from "./threshold";

const c = (x: number, y: number, scores: number[]) => ({
  pos: { x, y },
  meta: { scores },
});

describe("thresholdCandidateSelector", () => {
  it("0個のとき空配列", () => {
    expect(thresholdCandidateSelector([], peekLast)).toHaveLength(0);
  });
  it("閾値を越えるものが0個のとき空配列", () => {
    expect(
      thresholdCandidateSelector([c(0, 0, [0])], peekLast, 1)
    ).toHaveLength(0);
  });
  it("閾値を越えるものがあるとき全てを含んだ配列", () => {
    expect(
      thresholdCandidateSelector(
        [c(0, 0, [0]), c(0, 0, [1]), c(0, 0, [2])],
        peekLast,
        0.5
      )
    ).toHaveLength(2);
  });
});
