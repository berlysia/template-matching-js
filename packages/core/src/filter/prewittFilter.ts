import { staticArrayFilter } from "./staticArrayFilter";
import type { FilterArray } from "./staticArrayFilter";

const PREWITT_H: FilterArray = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const PREWITT_V: FilterArray = [-1, -1, -1, 0, 0, 0, 1, 1, 1];

export const prewittFilter = staticArrayFilter(PREWITT_H, PREWITT_V);
