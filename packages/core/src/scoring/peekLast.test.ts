import { describe, it, expect } from "vitest";
import { peekLast } from "./peekLast";

describe("peekLast", () => {
  it("0個のときエラー", () => {
    expect(() => peekLast([])).toThrow("something wrong");
  });
  it("最後の値を返す（スコアの追加方法に依存している）", () => {
    expect(peekLast([1, 2, 3])).toBe(3);
  });
});
