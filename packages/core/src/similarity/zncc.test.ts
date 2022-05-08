import { describe, it, expect } from "vitest";
import { grayScaleBrightness } from "../pixelReader/grayScaleBrightness";
import { zncc } from "./zncc";

describe("zncc", () => {
  it("works", () => {
    expect(
      zncc(
        { data: new Uint8ClampedArray(3 * 3 * 4), width: 3, height: 3 },
        { data: new Uint8ClampedArray(3 * 3 * 4), width: 3, height: 3 },
        0,
        0,
        grayScaleBrightness
      )
    ).toMatchInlineSnapshot("1");
  });
});
