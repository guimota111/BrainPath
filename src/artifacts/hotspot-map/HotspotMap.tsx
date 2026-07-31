import { useId } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import type { HotspotScene } from '../../content/schema'
import { useSceneState } from '../../lib/useSceneState'
import { RevealPanel } from '../../ui/RevealPanel'
import { hotspotArt } from '../art/registry'

/**
 * A arte esquemática com regiões clicáveis.
 *
 * O leitor chega numa figura e em quatro rótulos — nada mais. Clicar numa região
 * traz o resto do campo para trás e desenrola a informação ao lado, sem tirar a
 * figura da tela: o texto explica algo que continua visível.
 */
export function HotspotMap({
  scene,
  onSuggest,
}: {
  scene: HotspotScene
  onSuggest?: (entityId: string) => void
}) {
  const [activeId, setActiveId] = useSceneState(`${scene.id}.h`)
  const clipId = useId()
  const Art = hotspotArt[scene.art]

  const active = scene.hotspots.find((h) => h.id === activeId) ?? null

  if (!Art) return null

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="relative mx-auto w-full max-w-[34rem]">
        <svg viewBox="0 0 100 100" className="block w-full">
          <Art activeId={activeId} clipId={clipId} />

          <g clipPath={`url(#${clipId})`}>
            {scene.hotspots.map((hotspot) => {
              const isActive = hotspot.id === activeId
              return (
                <path
                  key={hotspot.id}
                  d={hotspot.path}
                  role="button"
                  tabIndex={0}
                  aria-label={hotspot.depth.glance}
                  aria-pressed={isActive}
                  onClick={() => setActiveId(isActive ? null : hotspot.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveId(isActive ? null : hotspot.id)
                    }
                  }}
                  className={clsx(
                    'cursor-pointer outline-none transition-[fill,stroke] duration-200',
                    isActive
                      ? 'fill-[color:var(--accent)]/10 stroke-[color:var(--accent)]'
                      : 'fill-transparent stroke-transparent hover:fill-[color:var(--accent)]/8',
                  )}
                  strokeWidth={isActive ? 1.4 : 0}
                />
              )
            })}
          </g>
        </svg>

        {/* Rótulos como HTML sobre o SVG: texto nítido em qualquer tamanho de tela. */}
        {scene.hotspots.map((hotspot) => {
          const isActive = hotspot.id === activeId
          return (
            <button
              key={hotspot.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : hotspot.id)}
              style={{ left: `${hotspot.label.x}%`, top: `${hotspot.label.y}%` }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
            >
              <span
                className={clsx(
                  'size-1.5 rounded-full transition-colors',
                  isActive ? 'bg-[color:var(--accent)]' : 'bg-ink/40',
                )}
              />
              <span
                className={clsx(
                  'rounded-sm bg-page/85 px-1 py-0.5 text-[11px] leading-none font-medium tracking-tight whitespace-nowrap transition-colors sm:text-xs',
                  isActive ? 'text-[color:var(--accent)]' : 'text-ink-secondary hover:text-ink',
                )}
              >
                {hotspot.depth.glance}
              </span>
            </button>
          )
        })}
      </div>

      <div className="lg:sticky lg:top-6">
        <AnimatePresence mode="wait">
          {active ? (
            <RevealPanel
              key={active.id}
              depth={active.depth}
              eyebrow="Padrão arquitetural"
              onClose={() => setActiveId(null)}
            />
          ) : (
            <p key="hint" className="text-[13px] text-ink-muted">
              Clique num padrão.
            </p>
          )}
        </AnimatePresence>

        {active?.suggests?.length && onSuggest ? (
          <div className="mt-3 flex flex-col items-start gap-1.5 pl-4">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
              Ver no painel imuno
            </p>
            {active.suggests.map((suggestion) => (
              <button
                key={suggestion.entityId}
                type="button"
                onClick={() => onSuggest(suggestion.entityId)}
                className="flex items-center gap-1 text-[13px] font-medium text-[color:var(--accent)] hover:underline"
              >
                {suggestion.label}
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
