import { describe, it, expect } from "vitest";
import { max } from "./max";

describe("peekMax", () => {
  it("0個のとき-Infinityを返す", () => {
    expect(max([])).toBe(-Infinity);
  });
  it("最大の値を返す", () => {
    expect(max([1, 2, 3])).toBe(3);
    expect(max([1, 3, 2])).toBe(3);
    expect(max([3, 1, 2])).toBe(3);
    expect(max([3, 3, 4])).toBe(4);
    expect(max([3, 4, 4])).toBe(4);
  });
});
