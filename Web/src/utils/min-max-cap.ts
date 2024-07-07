export function maxCap(x: number, max: number) {
  return Math.min(x, max);
}

export function minCap(x: number, min: number) {
  return Math.max(x, min);
}

export function minMaxCap(x: number, min: number, max: number): number {
  return Math.max(Math.min(x, max), min);
}
