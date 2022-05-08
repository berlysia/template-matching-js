import { describe, it, expect } from "vitest";
import { naiveIterator } from "./naive";

describe("naiveIterator", () => {
  it("works", () => {
    expect([...naiveIterator(0, 3, 100, 103)].map((x) => x.pos))
      .toMatchInlineSnapshot(`
        [
          {
            "x": 0,
            "y": 100,
          },
          {
            "x": 1,
            "y": 100,
          },
          {
            "x": 2,
            "y": 100,
          },
          {
            "x": 0,
            "y": 101,
          },
          {
            "x": 1,
            "y": 101,
          },
          {
            "x": 2,
            "y": 101,
          },
          {
            "x": 0,
            "y": 102,
          },
          {
            "x": 1,
            "y": 102,
          },
          {
            "x": 2,
            "y": 102,
          },
        ]
      `);
  });
});
