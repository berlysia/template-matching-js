import { describe, it, expect } from "vitest";
import { offsetIterator } from "./offset";
import { naiveIterator } from "./naive";

describe("offsetIterator", () => {
  it("zero offset", () => {
    expect(
      [...offsetIterator({ x: 0, y: 0 }, naiveIterator(0, 3, 100, 103))].map(
        (x) => x.pos
      )
    ).toMatchInlineSnapshot(`
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

  it("some offset", () => {
    expect(
      [...offsetIterator({ x: 10, y: 20 }, naiveIterator(0, 3, 100, 103))].map(
        (x) => x.pos
      )
    ).toMatchInlineSnapshot(`
      [
        {
          "x": 10,
          "y": 120,
        },
        {
          "x": 11,
          "y": 120,
        },
        {
          "x": 12,
          "y": 120,
        },
        {
          "x": 10,
          "y": 121,
        },
        {
          "x": 11,
          "y": 121,
        },
        {
          "x": 12,
          "y": 121,
        },
        {
          "x": 10,
          "y": 122,
        },
        {
          "x": 11,
          "y": 122,
        },
        {
          "x": 12,
          "y": 122,
        },
      ]
    `);
  });
});
