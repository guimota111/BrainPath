import { useState } from 'react'
import { BarChart3, Pencil, Plus, X } from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { DataPoint, Widget } from '../../types/widget'
import { SERIES_COLORS } from '../seriesColors'

type BarWidget = Extract<Widget, { type: 'bar' }>

function DataEditor({ data, onChange }: { data: DataPoint[]; onChange: (data: DataPoint[]) => void }) {
  function update(index: number, patch: Partial<DataPoint>) {
    onChange(data.map((d, i) => (i === index ? { ...d, ...patch } : d)))
  }
  function add() {
    onChange([...data, { key: crypto.randomUUID(), label: 'Novo', value: 1 }])
  }
  function remove(index: number) {
    onChange(data.filter((_, i) => i !== index))
  }
  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto pr-5 text-xs">
      {data.map((d, i) => (
        <div key={d.key} className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
          <input
            value={d.label}
            onChange={(e) => update(i, { label: e.target.value })}
            className="min-w-0 flex-1 rounded border border-hairline bg-page px-1.5 py-1 text-ink outline-none"
          />
          <input
            type="number"
            value={d.value}
            onChange={(e) => update(i, { value: Number(e.target.value) })}
            className="w-14 rounded border border-hairline bg-page px-1.5 py-1 tabular-nums text-ink outline-none"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:text-status-critical"
          >
            <X size={11} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex items-center gap-1 self-start rounded-full border border-hairline px-2 py-0.5 text-ink-secondary hover:bg-ink/5"
      >
        <Plus size={10} /> Barra
      </button>
    </div>
  )
}

function BarView({ widget, selections, onSelect, onChange }: WidgetViewProps<BarWidget>) {
  const [editing, setEditing] = useState(widget.data.length === 0)
  const channel = widget.emits ?? widget.id
  const active = selections[channel] ?? null

  return (
    <div className="relative h-full">
      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        className="absolute right-0 top-0 z-10 flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink"
        title="Editar dados"
      >
        <Pencil size={11} />
      </button>
      {editing ? (
        <DataEditor data={widget.data} onChange={(data) => onChange({ data })} />
      ) : widget.data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-center text-xs text-ink-muted">
          Sem dados. Clique no lápis para adicionar barras.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={widget.data} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={{ stroke: 'var(--color-hairline)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'var(--color-hairline)', opacity: 0.4 }}
              contentStyle={{ borderRadius: 8, border: '1px solid var(--color-hairline)', fontSize: 12 }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              onClick={(entry) => {
                const point = entry.payload as DataPoint
                onSelect(channel, point.key)
              }}
              cursor="pointer"
            >
              {widget.data.map((d, i) => (
                <Cell key={d.key} fill={SERIES_COLORS[i % SERIES_COLORS.length]} opacity={active && active !== d.key ? 0.35 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export const barWidget: WidgetDescriptor<BarWidget> = {
  type: 'bar',
  label: 'Gráfico de barra',
  group: 'Dados & Gráficos',
  icon: BarChart3,
  defaultLayout: { x: 0, y: 0, w: 4, h: 8 },
  createDefault: (boardId) => ({
    boardId,
    type: 'bar',
    layout: { x: 0, y: 0, w: 4, h: 8 },
    title: 'Gráfico de barra',
    data: [],
  }),
  View: BarView,
}
