import { useState } from 'react'
import { Plus } from 'lucide-react'
import { widgetList } from '../../widgets/registry'
import type { WidgetType } from '../../types/widget'

interface AddWidgetPaletteProps {
  onAdd: (type: WidgetType) => void
}

const GROUP_ORDER = ['Conteúdo', 'Dados & Gráficos', 'Estudo'] as const

export function AddWidgetPalette({ onAdd }: AddWidgetPaletteProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {open ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-14 right-0 z-20 w-64 rounded-card border border-hairline bg-surface p-2 shadow-card">
            {GROUP_ORDER.map((group) => {
              const items = widgetList.filter((w) => w.group === group)
              if (items.length === 0) return null
              return (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-muted">{group}</p>
                  {items.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          onAdd(item.type)
                          setOpen(false)
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-ink-secondary hover:bg-ink/5 hover:text-ink"
                      >
                        <Icon size={15} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-surface shadow-card transition hover:scale-105"
        title="Adicionar elemento"
      >
        <Plus size={20} />
      </button>
    </div>
  )
}
