import { useState } from 'react'
import { ListChecks, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { ChecklistItem, Widget } from '../../types/widget'

type ChecklistWidget = Extract<Widget, { type: 'checklist' }>

function ChecklistView({ widget, selections, onSelect, onChange }: WidgetViewProps<ChecklistWidget>) {
  const [draft, setDraft] = useState('')
  const channel = widget.emits ?? widget.id
  const active = selections[channel] ?? null

  function toggle(id: string) {
    onChange({ items: widget.items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)) })
  }

  function remove(id: string) {
    onChange({ items: widget.items.filter((item) => item.id !== id) })
  }

  function addItem() {
    const label = draft.trim()
    if (!label) return
    const item: ChecklistItem = { id: crypto.randomUUID(), label, done: false }
    onChange({ items: [...widget.items, item] })
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col gap-1">
      <div className="flex-1 space-y-0.5 overflow-y-auto">
        {widget.items.map((item) => (
          <div
            key={item.id}
            className={clsx(
              'group flex items-center gap-2 rounded px-1.5 py-1 text-sm',
              active === item.id ? 'bg-series-1/10' : 'hover:bg-ink/5',
            )}
          >
            <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} className="accent-series-1" />
            <button
              type="button"
              onClick={() => onSelect(channel, item.id)}
              className={clsx('min-w-0 flex-1 truncate text-left', item.done && 'text-ink-muted line-through')}
            >
              {item.label}
            </button>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="hidden h-4 w-4 items-center justify-center rounded text-ink-muted hover:text-status-critical group-hover:flex"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        {widget.items.length === 0 ? <p className="px-1.5 py-2 text-xs text-ink-muted">Sem itens ainda.</p> : null}
      </div>
      <div className="flex items-center gap-1 border-t border-hairline pt-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="Adicionar item…"
          className="min-w-0 flex-1 rounded bg-transparent px-1.5 py-1 text-xs text-ink outline-none placeholder:text-ink-muted"
        />
        <button
          type="button"
          onClick={addItem}
          className="flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}

export const checklistWidget: WidgetDescriptor<ChecklistWidget> = {
  type: 'checklist',
  label: 'Checklist',
  group: 'Conteúdo',
  icon: ListChecks,
  defaultLayout: { x: 0, y: 0, w: 3, h: 4 },
  createDefault: (boardId) => ({
    boardId,
    type: 'checklist',
    layout: { x: 0, y: 0, w: 3, h: 4 },
    title: 'Checklist',
    items: [],
  }),
  View: ChecklistView,
}
