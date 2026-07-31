/**
 * Aleatoriedade determinística para as artes histológicas.
 *
 * Um campo de linfócitos precisa parecer irregular, mas precisa ser *o mesmo*
 * campo irregular a cada render — senão as células dançam quando o leitor troca
 * de camada. Semente fixa resolve os dois lados.
 */
export function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export interface Cell {
  x: number
  y: number
  r: number
}

/** Espalha células dentro de um retângulo, com raio variando em torno de `radius`. */
export function scatter(
  seed: number,
  box: { x: number; y: number; w: number; h: number },
  count: number,
  radius = 1.05,
): Cell[] {
  const rand = seeded(seed)
  const cells: Cell[] = []
  for (let i = 0; i < count; i++) {
    cells.push({
      x: box.x + rand() * box.w,
      y: box.y + rand() * box.h,
      r: radius * (0.75 + rand() * 0.5),
    })
  }
  return cells
}

/** Espalha células dentro de um disco — usado para folículos e centros claros. */
export function scatterDisc(
  seed: number,
  cx: number,
  cy: number,
  discRadius: number,
  count: number,
  radius = 1.05,
): Cell[] {
  const rand = seeded(seed)
  const cells: Cell[] = []
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2
    // sqrt distribui uniformemente na área em vez de acumular no centro.
    const dist = Math.sqrt(rand()) * discRadius
    cells.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: radius * (0.75 + rand() * 0.5),
    })
  }
  return cells
}
