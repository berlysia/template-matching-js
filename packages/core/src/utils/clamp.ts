export function clamp(value: number, begin: number, end: number) {
  if (value <= begin) return begin;
  if (value >= end) return end - 1;
  return value;
}
