import { describe, expect, it } from "vitest";
import { calcRangeToColor } from "./calcRangeToColor";

describe("calcRangeToColor", () => {
  it("kt works", () => {
    expect(calcRangeToColor(0, 0, 1)).toMatchInlineSnapshot(`
      {
        "b": 255,
        "g": 136,
        "r": 0,
      }
    `);
    expect(calcRangeToColor(0.5, 0, 1)).toMatchInlineSnapshot(`
      {
        "b": 60,
        "g": 255,
        "r": 0,
      }
    `);
    expect(calcRangeToColor(1, 0, 1)).toMatchInlineSnapshot(`
      {
        "b": 0,
        "g": 24,
        "r": 251,
      }
    `);
  });
});
