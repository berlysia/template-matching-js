import { describe, expect, it } from "vitest";
import { peekLast } from "../scoring/peekLast";
import { maxCandidateSelector } from "./maxN";

const c = (x: number, y: number, scores: number[]) => ({
  pos: { x, y },
  meta: { scores },
});

describe("maxCandidateSelector", () => {
  it("0個のとき空配列", () => {
    expect(maxCandidateSelector([], peekLast)).toHaveLength(0);
  });
  it("スコアが最大となるものを大きい方から指定個返す", () => {
    expect(
      maxCandidateSelector(
        [c(0, 0, [1]), c(0, 0, [2]), c(0, 0, [3]), c(0, 0, [4]), c(0, 0, [5])],
        peekLast,
        3
      ).map((c) => c.meta.scores)
    ).toMatchInlineSnapshot(`
      [
        [
          5,
        ],
        [
          4,
        ],
        [
          3,
        ],
      ]
    `);
  });
  it("指定個に満たなければ全部返す", () => {
    expect(
      maxCandidateSelector(
        [c(0, 0, [0]), c(0, 0, [1]), c(0, 0, [2])],
        peekLast,
        5
      )
    ).toHaveLength(3);
  });
});
