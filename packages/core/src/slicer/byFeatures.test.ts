import { describe, it, expect } from "vitest";
import { calcPatch } from "./byFeatures";

const radius = 2;

describe("calcPatch", () => {
  it("めり込みなし", () => {
    const ans = calcPatch(100, 100, 50, 50, radius);
    expect(ans).toContain({
      x: 48,
      y: 48,
      w: 5,
      h: 5,
    });
  });
  it("x方向負めり込み", () => {
    const ans = calcPatch(100, 100, 1, 50, radius);
    expect(ans).toContain({
      x: 0,
      y: 48,
      w: 4,
      h: 5,
    });
  });
  it("x方向正めり込み", () => {
    const ans = calcPatch(100, 100, 99, 50, radius);
    expect(ans).toContain({
      x: 97,
      y: 48,
      w: 4,
      h: 5,
    });
  });
  it("y方向負めり込み", () => {
    const ans = calcPatch(100, 100, 50, 1, radius);
    expect(ans).toContain({
      x: 48,
      y: 0,
      w: 5,
      h: 4,
    });
  });
  it("y方向正めり込み", () => {
    const ans = calcPatch(100, 100, 50, 99, radius);
    expect(ans).toContain({
      x: 48,
      y: 97,
      w: 5,
      h: 4,
    });
  });
});
