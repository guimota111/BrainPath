import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Eye, TriangleAlert } from 'lucide-react'
import clsx from 'clsx'
import type { Depth, DetailBlock } from '../content/schema'
import { useDisclosure } from './useDisclosure'

/**
 * O corpo revelado de qualquer elemento do site: L2 (uma frase), L3 (o painel)
 * e, no modo treino, a pergunta que vem antes das duas.
 *
 * Não desenha moldura nem se posiciona — quem chama decide onde isso vive.
 */
export function DepthBody({ depth, className }: { depth: Depth; className?: string }) {
  const { stage, hasDetail, reveal, toggleDetail } = useDisclosure(depth)

  if (stage === 'probe') {
    return (
      <div className={clsx('flex flex-col items-start gap-3', className)}>
        <p className="text-[15px] leading-snug font-medium text-balance text-ink">{depth.probe}</p>
        <button
          type="button"
          onClick={reveal}
          className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-[color:var(--accent)] uppercase hover:underline"
        >
          <Eye size={13} />
          Revelar
        </button>
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col items-start gap-3', className)}>
      {depth.brief ? (
        <p className="text-[15px] leading-relaxed text-pretty text-ink-secondary">{depth.brief}</p>
      ) : null}

      {hasDetail ? (
        <button
          type="button"
          onClick={toggleDetail}
          className="flex items-center gap-1 text-xs font-medium tracking-wide text-[color:var(--accent)] uppercase hover:underline"
        >
          <ChevronDown
            size={13}
            className={clsx('transition-transform', stage === 'detail' && 'rotate-180')}
          />
          {stage === 'detail' ? 'Recolher' : 'Aprofundar'}
        </button>
      ) : null}

      <AnimatePresence initial={false}>
        {stage === 'detail' ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-1">
              {depth.detail?.map((block, i) => <DetailBlockView key={i} block={block} />)}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function DetailBlockView({ block }: { block: DetailBlock }) {
  switch (block.kind) {
    case 'text':
      return <p className="text-sm leading-relaxed text-pretty text-ink-secondary">{block.body}</p>

    case 'list':
      return (
        <div className="flex flex-col gap-1.5">
          {block.title ? (
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
              {block.title}
            </p>
          ) : null}
          <ul className="flex flex-col gap-1.5">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm leading-snug text-ink-secondary">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[color:var(--accent)]" />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'pitfall':
      return (
        <div className="flex gap-2 border-l-2 border-status-critical py-0.5 pl-3">
          <TriangleAlert size={14} className="mt-0.5 shrink-0 text-status-critical" />
          <p className="text-sm leading-snug text-pretty text-ink-secondary">{block.body}</p>
        </div>
      )

    case 'rule':
      return (
        <p className="border-l-2 border-[color:var(--accent)] py-0.5 pl-3 text-sm leading-snug font-medium text-pretty text-ink">
          {block.body}
        </p>
      )
  }
}
