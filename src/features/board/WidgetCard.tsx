import { useState } from 'react'
import { GripVertical, Link2, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import type { Widget } from '../../types/widget'
import { widgetRegistry } from '../../widgets/registry'
import { LinkPopover } from './LinkPopover'

interface WidgetCardProps {
  widget: Widget
  otherWidgets: Widget[]
  selections: Record<string, string | null>
  onSelect: (channel: string, value: string | null) => void
  onChange: (patch: Record<string, unknown>) => void
  onDelete: () => void
}

export function WidgetCard({ widget, otherWidgets, selections, onSelect, onChange, onDelete }: WidgetCardProps) {
  const descriptor = widgetRegistry[widget.type]
  const [linkOpen, setLinkOpen] = useState(false)
  const isLinked = (widget.linkedTo?.length ?? 0) > 0
  const View = descriptor.View

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-surface shadow-card">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-hairline px-1.5 py-2">
        <span className="widget-drag-handle flex shrink-0 cursor-grab items-center px-1 text-ink-muted/60 active:cursor-grabbing">
          <GripVertical size={13} />
        </span>
        <input
          value={widget.title ?? descriptor.label}
          onChange={(e) => onChange({ title: e.target.value })}
          className="min-w-0 flex-1 truncate bg-transparent text-xs font-medium text-ink-secondary outline-none focus:text-ink"
        />
        <div className="relative flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => setLinkOpen((v) => !v)}
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink',
              isLinked && 'text-series-1',
            )}
            title="Vincular a outro widget"
          >
            <Link2 size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-status-critical/10 hover:text-status-critical"
            title="Excluir"
          >
            <Trash2 size={13} />
          </button>
          {linkOpen ? (
            <LinkPopover widget={widget} otherWidgets={otherWidgets} onChange={onChange} onClose={() => setLinkOpen(false)} />
          ) : null}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <View widget={widget} selections={selections} onSelect={onSelect} onChange={onChange} />
      </div>
    </div>
  )
}
