import {
  staticArrayFilter,
  staticArrayFilterOnlyValues,
} from "./staticArrayFilter";
import type { FilterArray } from "./staticArrayFilter";

const SOBEL_H: FilterArray = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
const SOBEL_V: FilterArray = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

export const sobelFilter = staticArrayFilter(SOBEL_H, SOBEL_V);
export const sobel = staticArrayFilterOnlyValues(SOBEL_H, SOBEL_V);
