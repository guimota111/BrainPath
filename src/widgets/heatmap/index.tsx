import { Fragment, useState } from 'react'
import { Grid3x3, Pencil, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { Widget } from '../../types/widget'
import { HEAT_COLORS } from '../seriesColors'

type HeatmapWidget = Extract<Widget, { type: 'heatmap' }>

function colorFor(value: number, min: number, max: number) {
  if (max === min) return HEAT_COLORS[Math.floor(HEAT_COLORS.length / 2)]
  const ratio = (value - min) / (max - min)
  const index = Math.min(HEAT_COLORS.length - 1, Math.floor(ratio * HEAT_COLORS.length))
  return HEAT_COLORS[index]
}

function HeatmapView({ widget, selections, onSelect, onChange }: WidgetViewProps<HeatmapWidget>) {
  const [editing, setEditing] = useState(widget.rows.length === 0)
  const channel = widget.emits ?? widget.id
  const active = selections[channel] ?? null

  const flat = widget.values.flat()
  const min = flat.length ? Math.min(...flat) : 0
  const max = flat.length ? Math.max(...flat) : 1

  function setValue(r: number, c: number, value: number) {
    const values = widget.values.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? value : v)) : row))
    onChange({ values })
  }

  function setRowLabel(r: number, label: string) {
    onChange({ rows: widget.rows.map((row, ri) => (ri === r ? label : row)) })
  }

  function setColLabel(c: number, label: string) {
    onChange({ cols: widget.cols.map((col, ci) => (ci === c ? label : col)) })
  }

  function addRow() {
    onChange({
      rows: [...widget.rows, `Linha ${widget.rows.length + 1}`],
      values: [...widget.values, widget.cols.map(() => 0)],
    })
  }

  function addCol() {
    onChange({
      cols: [...widget.cols, `Col ${widget.cols.length + 1}`],
      values: widget.values.map((row) => [...row, 0]),
    })
  }

  function removeRow(r: number) {
    onChange({ rows: widget.rows.filter((_, i) => i !== r), values: widget.values.filter((_, i) => i !== r) })
  }

  if (editing || widget.rows.length === 0 || widget.cols.length === 0) {
    return (
      <div className="flex h-full flex-col gap-2 overflow-auto text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Dados</span>
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={widget.rows.length === 0 || widget.cols.length === 0}
            className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-surface disabled:opacity-40"
          >
            Pronto
          </button>
        </div>
        <table className="border-collapse">
          <thead>
            <tr>
              <th />
              {widget.cols.map((col, c) => (
                <th key={c} className="p-0.5">
                  <input
                    value={col}
                    onChange={(e) => setColLabel(c, e.target.value)}
                    className="w-14 rounded border border-hairline bg-page px-1 py-0.5 text-center text-ink outline-none"
                  />
                </th>
              ))}
              <th className="p-0.5">
                <button
                  type="button"
                  onClick={addCol}
                  className="flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:bg-ink/10"
                >
                  <Plus size={10} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {widget.rows.map((row, r) => (
              <tr key={r}>
                <td className="p-0.5">
                  <input
                    value={row}
                    onChange={(e) => setRowLabel(r, e.target.value)}
                    className="w-16 rounded border border-hairline bg-page px-1 py-0.5 text-ink outline-none"
                  />
                </td>
                {widget.cols.map((_, c) => (
                  <td key={c} className="p-0.5">
                    <input
                      type="number"
                      value={widget.values[r]?.[c] ?? 0}
                      onChange={(e) => setValue(r, c, Number(e.target.value))}
                      className="w-14 rounded border border-hairline bg-page px-1 py-0.5 tabular-nums text-ink outline-none"
                    />
                  </td>
                ))}
                <td className="p-0.5">
                  <button
                    type="button"
                    onClick={() => removeRow(r)}
                    className="flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:text-status-critical"
                  >
                    <X size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 self-start rounded-full border border-hairline px-2 py-0.5 text-ink-secondary hover:bg-ink/5"
        >
          <Plus size={10} /> Linha
        </button>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="absolute right-0 top-0 z-10 flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink"
        title="Editar dados"
      >
        <Pencil size={11} />
      </button>
      <div
        className="grid h-full auto-rows-fr gap-1 overflow-auto text-[11px]"
        style={{ gridTemplateColumns: `auto repeat(${widget.cols.length}, minmax(0, 1fr))` }}
      >
        <div />
        {widget.cols.map((col) => (
          <div key={col} className="flex items-end justify-center pb-1 text-center font-medium text-ink-muted">
            {col}
          </div>
        ))}
        {widget.rows.map((row, r) => (
          <Fragment key={row}>
            <div className="flex items-center pr-1 font-medium text-ink-muted">{row}</div>
            {widget.cols.map((col, c) => {
              const value = widget.values[r]?.[c] ?? 0
              const cellKey = `${row}::${col}`
              return (
                <button
                  key={cellKey}
                  type="button"
                  onClick={() => onSelect(channel, cellKey)}
                  className={clsx(
                    'flex min-h-6 items-center justify-center rounded font-medium tabular-nums transition',
                    active === cellKey && 'ring-2 ring-ink',
                  )}
                  style={{
                    background: colorFor(value, min, max),
                    color: value > (min + max) / 2 ? '#fff' : 'var(--color-ink)',
                  }}
                >
                  {value}
                </button>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export const heatmapWidget: WidgetDescriptor<HeatmapWidget> = {
  type: 'heatmap',
  label: 'Heatmap',
  group: 'Dados & Gráficos',
  icon: Grid3x3,
  defaultLayout: { x: 0, y: 0, w: 4, h: 6 },
  createDefault: (boardId) => ({
    boardId,
    type: 'heatmap',
    layout: { x: 0, y: 0, w: 4, h: 6 },
    title: 'Heatmap',
    rows: [],
    cols: [],
    values: [],
  }),
  View: HeatmapView,
}
