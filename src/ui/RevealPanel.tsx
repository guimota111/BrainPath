import { motion } from 'motion/react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import type { Depth } from '../content/schema'
import { DepthBody } from './Depth'

/**
 * O contêiner da informação revelada. Sem borda em volta e sem sombra de card —
 * só um filete de acento no topo e fundo levemente destacado, para o painel
 * pousar sobre a arte sem virar uma caixinha.
 */
export function RevealPanel({
  depth,
  onClose,
  className,
  eyebrow,
}: {
  depth: Depth
  onClose?: () => void
  className?: string
  eyebrow?: string
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={clsx(
        'border-t-2 border-[color:var(--accent)] bg-surface/95 p-4 backdrop-blur-sm',
        className,
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-0.5 text-[10px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="text-base leading-tight font-semibold text-balance text-ink">
            {depth.glance}
          </h3>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-m-1 shrink-0 p-1 text-ink-muted transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
      <DepthBody depth={depth} />
    </motion.aside>
  )
}
