import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import type { LayerScene } from '../../content/schema'
import { useSceneState } from '../../lib/useSceneState'
import { DepthBody } from '../../ui/Depth'
import { layerArt } from '../art/registry'

/**
 * Camadas sobre a mesma arte.
 *
 * A escada à esquerda desce um nível por vez e o desenho ganha informação sem
 * ser trocado — o que já apareceu continua ali, atenuado. É a forma mais direta
 * do "desenrolar": a profundidade se acumula em vez de paginar.
 */
export function LayerStack({ scene }: { scene: LayerScene }) {
  const [layerId, setLayerId] = useSceneState(`${scene.id}.l`, scene.layers[0]?.id ?? null)
  const [markId, setMarkId] = useState<string | null>(null)

  const Art = layerArt[scene.art]
  const activeIndex = Math.max(
    0,
    scene.layers.findIndex((l) => l.id === layerId),
  )
  const active = scene.layers[activeIndex]

  if (!Art || !active) return null

  function selectLayer(id: string) {
    setMarkId(null)
    setLayerId(id)
  }

  // As marcas se acumulam: o nível 3 mostra também o que os níveis 1 e 2 marcaram.
  const visibleMarks = scene.layers
    .slice(0, activeIndex + 1)
    .flatMap((layer, index) => (layer.marks ?? []).map((mark) => ({ ...mark, depthIndex: index })))

  return (
    <div className="grid gap-6 md:grid-cols-[7.5rem_minmax(0,1fr)] lg:grid-cols-[8rem_minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
      {/* A escada. Rótulos curtos — é índice, não texto. */}
      <ol className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {scene.layers.map((layer, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex
          return (
            <li key={layer.id} className="shrink-0">
              <button
                type="button"
                onClick={() => selectLayer(layer.id)}
                className="group flex items-center gap-2 md:w-full"
              >
                <span
                  className={clsx(
                    'h-6 w-0.5 shrink-0 rounded-full transition-colors md:h-7',
                    isActive
                      ? 'bg-[color:var(--accent)]'
                      : isPast
                        ? 'bg-[color:var(--accent)]/35'
                        : 'bg-hairline',
                  )}
                />
                <span
                  className={clsx(
                    'text-left text-[13px] leading-tight whitespace-nowrap transition-colors',
                    isActive
                      ? 'font-semibold text-ink'
                      : 'text-ink-muted group-hover:text-ink-secondary',
                  )}
                >
                  {layer.step}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="relative mx-auto w-full max-w-[26rem]">
        <svg viewBox="0 0 100 100" className="block w-full">
          <Art activeIndex={activeIndex} />
        </svg>

        {visibleMarks.map((mark) => {
          const isCurrent = mark.depthIndex === activeIndex
          const isOpen = markId === mark.id
          return (
            <button
              key={mark.id}
              type="button"
              onClick={() => setMarkId(isOpen ? null : mark.id)}
              style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
              className={clsx(
                'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 transition-opacity',
                isCurrent ? 'opacity-100' : 'opacity-40 hover:opacity-90',
              )}
            >
              <span
                className={clsx(
                  'size-2 shrink-0 rounded-full ring-2 ring-page transition-colors',
                  isOpen || isCurrent ? 'bg-[color:var(--accent)]' : 'bg-ink/45',
                )}
              />
              {/*
                Só a camada atual mostra o texto da marca. As anteriores ficam
                como ponto: o desenho acumula, a legenda não — senão quatro
                camadas de rótulo se atropelam sobre o mesmo campo.
              */}
              {isCurrent || isOpen ? (
                <span
                  className={clsx(
                    'rounded-sm bg-page/85 px-1 text-[10px] leading-tight font-medium whitespace-nowrap sm:text-[11px]',
                    isOpen ? 'text-[color:var(--accent)]' : 'text-ink-secondary',
                  )}
                >
                  {mark.label}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="min-w-0 lg:sticky lg:top-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="border-l-2 border-[color:var(--accent)] pl-4"
          >
            <p className="mb-1 text-[10px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
              {active.step}
            </p>
            <h3 className="mb-2 text-base leading-tight font-semibold text-balance text-ink">
              {active.depth.glance}
            </h3>
            <DepthBody depth={active.depth} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {markId ? <MarkNote key={markId} scene={scene} markId={markId} /> : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MarkNote({ scene, markId }: { scene: LayerScene; markId: string }) {
  const mark = scene.layers.flatMap((l) => l.marks ?? []).find((m) => m.id === markId)
  if (!mark?.note) return null

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="mt-4 overflow-hidden border-l-2 border-hairline pl-4 text-sm leading-relaxed text-pretty text-ink-secondary"
    >
      <span className="font-medium text-ink">{mark.label}. </span>
      {mark.note}
    </motion.p>
  )
}
