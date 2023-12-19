export function clampUnit(x: number): number {
  if (x < 0) x = 0
  if (x > 1) x = 1
  return x
}
