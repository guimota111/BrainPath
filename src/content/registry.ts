import type { AreaId, Topic } from './schema'
import { linfomasBPequenasCelulas } from './topics/linfomas-b-pequenas-celulas'

/** Todo tema do site entra aqui. É o único ponto de registro. */
export const topics: Topic[] = [linfomasBPequenasCelulas]

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}

export function topicsByArea(area: AreaId): Topic[] {
  return topics.filter((topic) => topic.area === area)
}

export interface FindingEntry {
  finding: string
  topic: Topic
}

/**
 * O índice da porta "por achado".
 *
 * Derivado dos temas em vez de mantido à mão: um tema novo aparece na busca no
 * mesmo commit em que é escrito, sem ninguém lembrar de atualizar uma lista.
 */
export const findingsIndex: FindingEntry[] = topics
  .flatMap((topic) => topic.findings.map((finding) => ({ finding, topic })))
  .sort((a, b) => a.finding.localeCompare(b.finding, 'pt-BR'))

/** Normaliza para busca tolerante a acento e caixa. */
function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function searchFindings(query: string): FindingEntry[] {
  const needle = fold(query.trim())
  if (!needle) return findingsIndex
  return findingsIndex.filter(
    (entry) => fold(entry.finding).includes(needle) || fold(entry.topic.title).includes(needle),
  )
}
