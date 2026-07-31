import type { MarkerEntity, MarkerResult } from '../../content/schema'

export type Constraint = 'pos' | 'neg'

/**
 * Um resultado observado na bancada bate com o que a entidade costuma mostrar?
 *
 * `subset` e `variable` batem com qualquer constraint de propósito: uma entidade
 * que expressa o marcador em parte dos casos não pode ser descartada por ele.
 * Excluir com base em expressão inconstante é justamente o erro que o filtro
 * existe para evitar.
 */
export function matchesConstraint(result: MarkerResult | undefined, constraint: Constraint) {
  if (result === undefined) return true
  if (result === 'subset' || result === 'variable') return true
  return result === constraint
}

export function entityMatches(entity: MarkerEntity, constraints: Record<string, Constraint>) {
  return Object.entries(constraints).every(([markerId, constraint]) =>
    matchesConstraint(entity.results[markerId], constraint),
  )
}

/**
 * Quais colunas de fato separam as entidades ainda em jogo.
 *
 * Calculado a partir dos dados a cada render, nunca marcado à mão no conteúdo:
 * conforme o filtro estreita o diferencial, o realce se move sozinho para os
 * marcadores que ainda decidem alguma coisa — e some dos que já não decidem.
 */
export function discriminatingMarkers(entities: MarkerEntity[], markerIds: string[]): Set<string> {
  const result = new Set<string>()
  if (entities.length < 2) return result

  for (const markerId of markerIds) {
    let positives = 0
    let negatives = 0
    for (const entity of entities) {
      if (entity.results[markerId] === 'pos') positives++
      else if (entity.results[markerId] === 'neg') negatives++
    }
    // Só discrimina se separa o grupo de forma inequívoca dos dois lados.
    if (positives > 0 && negatives > 0) result.add(markerId)
  }

  return result
}
