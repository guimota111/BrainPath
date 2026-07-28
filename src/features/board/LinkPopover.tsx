import type { Widget } from '../../types/widget'

interface LinkPopoverProps {
  widget: Widget
  otherWidgets: Widget[]
  onChange: (patch: Record<string, unknown>) => void
  onClose: () => void
}

export function LinkPopover({ widget, otherWidgets, onChange, onClose }: LinkPopoverProps) {
  const linkedTo = widget.linkedTo ?? []

  function toggle(id: string) {
    const next = linkedTo.includes(id) ? linkedTo.filter((c) => c !== id) : [...linkedTo, id]
    onChange({ linkedTo: next })
  }

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-7 z-20 w-56 rounded-lg border border-hairline bg-surface p-2 shadow-card">
        <p className="px-1.5 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Reagir a cliques em</p>
        {otherWidgets.length === 0 ? (
          <p className="px-1.5 py-2 text-xs text-ink-muted">Adicione outro widget para vincular.</p>
        ) : (
          <div className="flex max-h-48 flex-col gap-0.5 overflow-y-auto">
            {otherWidgets.map((other) => (
              <label
                key={other.id}
                className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-ink-secondary hover:bg-ink/5"
              >
                <input
                  type="checkbox"
                  checked={linkedTo.includes(other.id)}
                  onChange={() => toggle(other.id)}
                  className="accent-series-1"
                />
                <span className="truncate">{other.title || other.type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
