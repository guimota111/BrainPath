import type { MarkerResult } from '../content/schema'

/** Nome legível de cada resultado — usado em aria-label, title e legenda. */
export const RESULT_LABEL: Record<MarkerResult, string> = {
  pos: 'positivo',
  neg: 'negativo',
  subset: 'subgrupo de casos',
  variable: 'variável',
}
