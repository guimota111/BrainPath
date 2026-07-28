import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Layers, Pencil } from 'lucide-react'
import clsx from 'clsx'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { Widget } from '../../types/widget'

type FlashcardWidget = Extract<Widget, { type: 'flashcard' }>

function FlashcardView({ widget, onChange }: WidgetViewProps<FlashcardWidget>) {
  const [flipped, setFlipped] = useState(false)
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div className="flex h-full flex-col gap-2">
        <label className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Pergunta</label>
        <textarea
          value={widget.question}
          onChange={(e) => onChange({ question: e.target.value })}
          className="flex-1 resize-none rounded-lg border border-hairline bg-page p-2 text-sm text-ink outline-none focus:border-series-1"
        />
        <label className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Resposta</label>
        <textarea
          value={widget.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
          className="flex-1 resize-none rounded-lg border border-hairline bg-page p-2 text-sm text-ink outline-none focus:border-series-1"
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="self-end rounded-full bg-ink px-3 py-1 text-xs font-medium text-surface"
        >
          Pronto
        </button>
      </div>
    )
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((v) => !v)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={handleKeyDown}
      className={clsx(
        'group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition',
        flipped ? 'bg-series-1/8' : 'bg-page',
      )}
    >
      <span className="absolute left-2 top-2 text-[10px] font-medium uppercase tracking-wide text-ink-muted">
        {flipped ? 'Resposta' : 'Pergunta'}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-ink-muted opacity-0 hover:bg-ink/10 group-hover:opacity-100"
      >
        <Pencil size={11} />
      </button>
      <p className="text-sm font-medium text-ink">
        {flipped ? widget.answer || 'Sem resposta ainda' : widget.question || 'Sem pergunta ainda'}
      </p>
      <span className="text-[11px] text-ink-muted">Clique para virar</span>
    </div>
  )
}

export const flashcardWidget: WidgetDescriptor<FlashcardWidget> = {
  type: 'flashcard',
  label: 'Flashcard',
  group: 'Estudo',
  icon: Layers,
  defaultLayout: { x: 0, y: 0, w: 3, h: 3 },
  createDefault: (boardId) => ({
    boardId,
    type: 'flashcard',
    layout: { x: 0, y: 0, w: 3, h: 3 },
    title: 'Flashcard',
    question: 'Qual é a pergunta?',
    answer: 'Qual é a resposta?',
  }),
  View: FlashcardView,
}
