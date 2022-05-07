import { describe, it, expect } from "vitest";
import { peekMax } from "./peekMax";

describe("peekMax", () => {
  it("0個のとき-Infinityを返す", () => {
    expect(peekMax([])).toBe(-Infinity);
  });
  it("最大の値を返す", () => {
    expect(peekMax([1, 2, 3])).toBe(3);
    expect(peekMax([1, 3, 2])).toBe(3);
    expect(peekMax([3, 1, 2])).toBe(3);
    expect(peekMax([3, 3, 4])).toBe(4);
    expect(peekMax([3, 4, 4])).toBe(4);
  });
});
