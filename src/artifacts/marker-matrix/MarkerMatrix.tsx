import { useCallback, useMemo } from 'react'
import { AnimatePresence } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import type { Depth, MatrixScene } from '../../content/schema'
import { useSceneState } from '../../lib/useSceneState'
import { GlyphLegend, MarkerGlyph } from '../../ui/MarkerGlyph'
import { RESULT_LABEL } from '../../ui/markerResult'
import { RevealPanel } from '../../ui/RevealPanel'
import { discriminatingMarkers, entityMatches, type Constraint } from './discriminators'

/**
 * O painel imuno-histoquímico interativo.
 *
 * Em repouso é só uma grade de formas — nenhuma frase. A informação chega por
 * três gestos: clicar na entidade para isolá-la, clicar no marcador para saber
 * o que ele significa, e declarar o que se viu no microscópio (+/− sob cada
 * coluna) para o diferencial se estreitar sozinho.
 */
export function MarkerMatrix({ scene }: { scene: MatrixScene }) {
  const [entityId, setEntityId] = useSceneState(`${scene.id}.e`)
  const [markerId, setMarkerId] = useSceneState(`${scene.id}.m`)
  const [cellId, setCellId] = useSceneState(`${scene.id}.c`)
  const [rawFilters, setRawFilters] = useSceneState(`${scene.id}.f`)

  const constraints = useMemo(() => parseConstraints(rawFilters), [rawFilters])
  const constraintCount = Object.keys(constraints).length

  const markerIds = useMemo(() => scene.columns.map((c) => c.id), [scene.columns])

  const survivors = useMemo(
    () => scene.entities.filter((entity) => entityMatches(entity, constraints)),
    [scene.entities, constraints],
  )

  /**
   * O realce só aparece depois da primeira declaração.
   *
   * Em repouso quase toda coluna separa alguma coisa, e destacar nove de dez não
   * informa nada — além de encher de tinta uma grade que precisa começar limpa.
   * A partir do primeiro +/− o realce vira resposta: dado o que você já viu,
   * estes são os marcadores que ainda decidem.
   */
  const discriminating = useMemo(
    () => (constraintCount > 0 ? discriminatingMarkers(survivors, markerIds) : new Set<string>()),
    [survivors, markerIds, constraintCount],
  )

  const survivorIds = useMemo(() => new Set(survivors.map((e) => e.id)), [survivors])

  const toggleConstraint = useCallback(
    (marker: string, constraint: Constraint) => {
      // Parte do filtro que está na URL agora: declarar dois marcadores em
      // sequência rápida não pode fazer o segundo apagar o primeiro.
      setRawFilters((current) => {
        const next = parseConstraints(current)
        if (next[marker] === constraint) delete next[marker]
        else next[marker] = constraint
        return serializeConstraints(next)
      })
    },
    [setRawFilters],
  )

  const clearAll = useCallback(() => {
    setRawFilters(null)
    setEntityId(null)
  }, [setRawFilters, setEntityId])

  function openEntity(id: string) {
    setCellId(null)
    setMarkerId(null)
    setEntityId(entityId === id ? null : id)
  }

  function openMarker(id: string) {
    setCellId(null)
    setEntityId(null)
    setMarkerId(markerId === id ? null : id)
  }

  function openCell(entity: string, marker: string) {
    const id = `${entity}:${marker}`
    setEntityId(null)
    setMarkerId(null)
    setCellId(cellId === id ? null : id)
  }

  const openDepth = useOpenDepth(scene, { entityId, markerId, cellId })

  function closePanel() {
    setEntityId(null)
    setMarkerId(null)
    setCellId(null)
  }

  const gridTemplate = `minmax(9rem, 13rem) repeat(${scene.columns.length}, minmax(2.5rem, 1fr))`

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <GlyphLegend />
        <div className="flex items-center gap-3">
          <p className="text-[11px] text-ink-muted">
            {constraintCount > 0 ? (
              <>
                <span className="font-semibold tabular-nums text-ink">{survivors.length}</span>
                {survivors.length === 1 ? ' entidade compatível' : ' entidades compatíveis'}
              </>
            ) : (
              'Marque + ou − sob um marcador para estreitar'
            )}
          </p>
          {constraintCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-[11px] font-medium text-[color:var(--accent)] hover:underline"
            >
              <RotateCcw size={11} />
              limpar
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[34rem]">
          {/* Cabeçalho: nome do marcador (abre o significado) + declaração do que se viu. */}
          <div className="grid items-end" style={{ gridTemplateColumns: gridTemplate }}>
            <div />
            {scene.columns.map((column) => {
              const decisive = discriminating.has(column.id)
              const constraint = constraints[column.id]
              return (
                <div key={column.id} className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openMarker(column.id)}
                    title={`O que é ${column.label}`}
                    className={clsx(
                      'rotate-180 py-1 text-[11px] font-medium whitespace-nowrap [writing-mode:vertical-rl] transition-colors',
                      markerId === column.id
                        ? 'text-[color:var(--accent)]'
                        : decisive
                          ? 'text-ink'
                          : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {column.label}
                  </button>
                  <span
                    aria-hidden
                    className={clsx(
                      // Menos que a largura da coluna: colunas decisivas vizinhas
                      // precisam ler como dois realces, não como uma barra só.
                      'h-0.5 w-3/5 transition-colors',
                      decisive ? 'bg-[color:var(--accent)]' : 'bg-transparent',
                    )}
                  />
                  <div className="flex gap-0.5 pb-1">
                    {(['pos', 'neg'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleConstraint(column.id, option)}
                        aria-pressed={constraint === option}
                        aria-label={`${column.label} ${RESULT_LABEL[option]}`}
                        className={clsx(
                          'flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-bold transition-colors',
                          constraint === option
                            ? 'bg-[color:var(--accent)] text-surface'
                            : 'text-ink-muted/60 hover:bg-ink/10 hover:text-ink',
                        )}
                      >
                        {option === 'pos' ? '+' : '−'}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Corpo: uma linha por entidade. */}
          <div className="border-t border-hairline">
            {scene.entities.map((entity) => {
              const excluded = !survivorIds.has(entity.id)
              const isolated = entityId !== null && entityId !== entity.id
              return (
                <div
                  key={entity.id}
                  className={clsx(
                    'grid items-center border-b border-hairline transition-opacity duration-300',
                    excluded ? 'opacity-15' : isolated ? 'opacity-30' : 'opacity-100',
                  )}
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  <button
                    type="button"
                    onClick={() => openEntity(entity.id)}
                    disabled={excluded}
                    className={clsx(
                      'flex min-w-0 flex-col items-start py-2.5 pr-3 text-left transition-colors',
                      entityId === entity.id ? 'text-[color:var(--accent)]' : 'text-ink',
                      !excluded && 'hover:text-[color:var(--accent)]',
                    )}
                  >
                    <span className="text-sm leading-tight font-semibold">{entity.short}</span>
                    <span className="w-full truncate text-[11px] leading-tight text-ink-muted">
                      {entity.name}
                    </span>
                  </button>

                  {scene.columns.map((column) => {
                    const result = entity.results[column.id]
                    const note = entity.notes?.[column.id]
                    const id = `${entity.id}:${column.id}`
                    if (!result) return <span key={column.id} aria-hidden />
                    return (
                      <button
                        key={column.id}
                        type="button"
                        onClick={() => (note ? openCell(entity.id, column.id) : openEntity(entity.id))}
                        disabled={excluded}
                        title={`${entity.short} · ${column.label}: ${RESULT_LABEL[result]}`}
                        className={clsx(
                          'flex h-full items-center justify-center py-2.5 transition-colors',
                          cellId === id && 'bg-[color:var(--accent)]/10',
                          !excluded && 'hover:bg-ink/5',
                        )}
                      >
                        <MarkerGlyph result={result} />
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {openDepth ? (
          <RevealPanel
            key={openDepth.key}
            depth={openDepth.depth}
            eyebrow={openDepth.eyebrow}
            onClose={closePanel}
            className="max-w-2xl"
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/** Resolve qual das três seleções possíveis está aberta e monta o painel dela. */
function useOpenDepth(
  scene: MatrixScene,
  selection: { entityId: string | null; markerId: string | null; cellId: string | null },
) {
  const { entityId, markerId, cellId } = selection

  return useMemo((): { key: string; depth: Depth; eyebrow: string } | null => {
    if (cellId) {
      const [eId, mId] = cellId.split(':')
      const entity = scene.entities.find((e) => e.id === eId)
      const column = scene.columns.find((c) => c.id === mId)
      const note = entity?.notes?.[mId]
      if (entity && column && note) {
        return {
          key: cellId,
          eyebrow: `${entity.short} · ${column.label}`,
          depth: {
            glance: `${column.label} ${RESULT_LABEL[entity.results[mId]] ?? ''}`.trim(),
            brief: note,
          },
        }
      }
    }

    if (markerId) {
      const column = scene.columns.find((c) => c.id === markerId)
      if (column) return { key: markerId, eyebrow: 'Marcador', depth: column.depth }
    }

    if (entityId) {
      const entity = scene.entities.find((e) => e.id === entityId)
      if (entity) return { key: entityId, eyebrow: entity.name, depth: entity.depth }
    }

    return null
  }, [scene, entityId, markerId, cellId])
}

function parseConstraints(raw: string | null): Record<string, Constraint> {
  if (!raw) return {}
  const out: Record<string, Constraint> = {}
  for (const chunk of raw.split(',')) {
    const [marker, value] = chunk.split(':')
    if (marker && (value === 'pos' || value === 'neg')) out[marker] = value
  }
  return out
}

function serializeConstraints(constraints: Record<string, Constraint>): string | null {
  const entries = Object.entries(constraints)
  return entries.length > 0 ? entries.map(([k, v]) => `${k}:${v}`).join(',') : null
}
