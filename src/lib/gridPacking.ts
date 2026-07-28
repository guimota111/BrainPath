interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** First-fit placement: scans row by row, left to right, for the first free slot. */
export function findFreeSlot(existing: Rect[], w: number, h: number, cols = 12): { x: number; y: number } {
  const overlaps = (x: number, y: number) =>
    existing.some((item) => x < item.x + item.w && x + w > item.x && y < item.y + item.h && y + h > item.y)

  const maxY = existing.reduce((acc, item) => Math.max(acc, item.y + item.h), 0)

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= cols - w; x++) {
      if (!overlaps(x, y)) return { x, y }
    }
  }
  return { x: 0, y: maxY }
}
