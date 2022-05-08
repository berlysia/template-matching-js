import { describe, it, expect } from "vitest";
import type { Candidate } from "../types";
import { offsetIterator } from "./offset";
import { partialTemplateIterator } from "./partialTemplate";

function summaryIterable(x: Iterable<Candidate>): {
  x: { min: number; max: number };
  y: { min: number; max: number };
} {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const v of x) {
    if (v.pos.x < minX) minX = v.pos.x;
    if (v.pos.y < minY) minY = v.pos.y;
    if (v.pos.x > maxX) maxX = v.pos.x;
    if (v.pos.y > maxY) maxY = v.pos.y;
  }
  return {
    x: {
      min: minX,
      max: maxX,
    },
    y: {
      min: minY,
      max: maxY,
    },
  };
}
describe("partialTemplateIterator", () => {
  it("works", () => {
    expect(
      summaryIterable(
        partialTemplateIterator(
          { width: 8, height: 8 },
          {
            offsetX: 1,
            offsetY: 1,
            originW: 4,
            originH: 4,
          }
        )
      )
    ).toMatchInlineSnapshot(`
      {
        "x": {
          "max": 3,
          "min": 1,
        },
        "y": {
          "max": 3,
          "min": 1,
        },
      }
    `);
  });
  it("real value", () => {
    expect(
      summaryIterable(
        partialTemplateIterator(
          { width: 256, height: 256 },
          {
            offsetX: 7,
            offsetY: 37,
            originW: 41,
            originH: 43,
          }
        )
      )
    ).toMatchInlineSnapshot(`
      {
        "x": {
          "max": 214,
          "min": 7,
        },
        "y": {
          "max": 212,
          "min": 37,
        },
      }
    `);
  });
  it("offseted value", () => {
    expect(
      summaryIterable(
        offsetIterator(
          { x: 7, y: 37 },
          partialTemplateIterator(
            { width: 256, height: 256 },
            {
              offsetX: 7,
              offsetY: 37,
              originW: 41,
              originH: 43,
            }
          )
        )
      )
    ).toMatchInlineSnapshot(`
      {
        "x": {
          "max": 221,
          "min": 14,
        },
        "y": {
          "max": 249,
          "min": 74,
        },
      }
    `);
  });
});
