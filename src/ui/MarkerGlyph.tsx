import clsx from 'clsx'
import type { MarkerResult } from '../content/schema'
import { RESULT_LABEL } from './markerResult'

/**
 * Um resultado imuno desenhado como forma, não escrito como palavra.
 *
 * A matriz precisa ser lida em varredura, e disco cheio contra anel vazio se
 * distingue na visão periférica — "positivo" contra "negativo" não. A forma
 * carrega a informação sozinha; a cor só reforça, para funcionar em daltonismo.
 */
export function MarkerGlyph({
  result,
  dimmed = false,
  size = 18,
}: {
  result: MarkerResult
  dimmed?: boolean
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={RESULT_LABEL[result]}
      className={clsx('transition-opacity', dimmed && 'opacity-25')}
    >
      {result === 'pos' ? <circle cx="12" cy="12" r="8" fill="var(--accent)" /> : null}

      {result === 'neg' ? (
        <circle
          cx="12"
          cy="12"
          r="7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-ink-muted/45"
        />
      ) : null}

      {result === 'subset' ? (
        <>
          <path d="M12 4 A8 8 0 0 0 12 20 Z" fill="var(--accent)" />
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        </>
      ) : null}

      {result === 'variable' ? (
        <circle
          cx="12"
          cy="12"
          r="7.5"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="2.5 2.5"
          opacity="0.75"
        />
      ) : null}
    </svg>
  )
}

/** A legenda das formas. Fica sempre visível junto da matriz. */
export function GlyphLegend({ className }: { className?: string }) {
  const entries: MarkerResult[] = ['pos', 'neg', 'subset', 'variable']
  return (
    <div className={clsx('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {entries.map((result) => (
        <span key={result} className="flex items-center gap-1.5">
          <MarkerGlyph result={result} size={14} />
          <span className="text-[11px] text-ink-muted">{RESULT_LABEL[result]}</span>
        </span>
      ))}
    </div>
  )
}
