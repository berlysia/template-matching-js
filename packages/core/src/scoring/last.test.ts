import { describe, it, expect } from "vitest";
import { last } from "./last";

describe("last", () => {
  it("0個のときエラー", () => {
    expect(() => last([])).toThrow("something wrong");
  });
  it("最後の値を返す（スコアの追加方法に依存している）", () => {
    expect(last([1, 2, 3])).toBe(3);
  });
});
