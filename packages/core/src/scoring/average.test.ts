import { describe, it, expect } from "vitest";
import { average } from "./average";

describe("average", () => {
  it("0個のとき0を返す", () => {
    expect(average([])).toBe(0);
  });
  it("加算平均を返す", () => {
    expect(average([1, 2, 3])).toBe(2);
  });
  it("中央値ではなく平均値を返す", () => {
    expect(average([0, 1, 2, 3, 3])).toBe(1.8);
  });
});
