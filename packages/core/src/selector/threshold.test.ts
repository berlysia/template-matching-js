import { describe, expect, it } from "vitest";
import { last } from "../scoring/last";
import { thresholdCandidateSelector } from "./threshold";

const c = (x: number, y: number, scores: number[]) => ({
  pos: { x, y },
  meta: { scores },
});

describe("thresholdCandidateSelector", () => {
  it("0個のとき空配列", () => {
    expect(thresholdCandidateSelector([], last)).toHaveLength(0);
  });
  it("閾値を越えるものが0個のとき空配列", () => {
    expect(thresholdCandidateSelector([c(0, 0, [0])], last, 1)).toHaveLength(0);
  });
  it("閾値を越えるものがあるとき全てを含んだ配列", () => {
    expect(
      thresholdCandidateSelector(
        [c(0, 0, [0]), c(0, 0, [1]), c(0, 0, [2])],
        last,
        0.5
      )
    ).toHaveLength(2);
  });
});
