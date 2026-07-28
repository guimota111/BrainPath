import { Plus, Table2, X } from 'lucide-react'
import clsx from 'clsx'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { Widget } from '../../types/widget'

type TableWidget = Extract<Widget, { type: 'table' }>

function TableView({ widget, selections, onSelect, onChange }: WidgetViewProps<TableWidget>) {
  const channel = widget.emits ?? widget.id
  const active = selections[channel] ?? null

  function updateCell(rowIndex: number, col: string, value: string) {
    const rows = widget.rows.map((row, i) => (i === rowIndex ? { ...row, [col]: value } : row))
    onChange({ rows })
  }

  function addRow() {
    const row: Record<string, string> = {}
    widget.columns.forEach((c) => (row[c] = ''))
    onChange({ rows: [...widget.rows, row] })
  }

  function addColumn() {
    const name = window.prompt('Nome da coluna')?.trim()
    if (!name || widget.columns.includes(name)) return
    onChange({
      columns: [...widget.columns, name],
      rows: widget.rows.map((row) => ({ ...row, [name]: '' })),
    })
  }

  function removeRow(index: number) {
    onChange({ rows: widget.rows.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex h-full flex-col gap-2 text-sm">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse tabular-nums">
          <thead>
            <tr>
              {widget.columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-hairline px-1.5 py-1 text-left text-[11px] font-medium uppercase tracking-wide text-ink-muted"
                >
                  {col}
                </th>
              ))}
              <th className="w-6 border-b border-hairline" />
            </tr>
          </thead>
          <tbody>
            {widget.rows.map((row, rowIndex) => {
              const key = row[widget.columns[0]] || String(rowIndex)
              return (
                <tr
                  key={rowIndex}
                  onClick={() => onSelect(channel, key)}
                  className={clsx('group cursor-pointer', active === key && 'bg-series-1/10')}
                >
                  {widget.columns.map((col) => (
                    <td key={col} className="border-b border-hairline/60 px-1.5 py-1">
                      <input
                        value={row[col] ?? ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateCell(rowIndex, col, e.target.value)}
                        className="w-full min-w-0 bg-transparent text-ink outline-none"
                      />
                    </td>
                  ))}
                  <td className="border-b border-hairline/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRow(rowIndex)
                      }}
                      className="hidden h-4 w-4 items-center justify-center rounded text-ink-muted hover:text-status-critical group-hover:flex"
                    >
                      <X size={10} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 border-t border-hairline pt-1.5">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 text-xs text-ink-secondary hover:bg-ink/5"
        >
          <Plus size={10} /> Linha
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 text-xs text-ink-secondary hover:bg-ink/5"
        >
          <Plus size={10} /> Coluna
        </button>
      </div>
    </div>
  )
}

export const tableWidget: WidgetDescriptor<TableWidget> = {
  type: 'table',
  label: 'Tabela',
  group: 'Dados & Gráficos',
  icon: Table2,
  defaultLayout: { x: 0, y: 0, w: 5, h: 4 },
  createDefault: (boardId) => ({
    boardId,
    type: 'table',
    layout: { x: 0, y: 0, w: 5, h: 4 },
    title: 'Tabela',
    columns: ['Item', 'Valor'],
    rows: [{ Item: 'Exemplo', Valor: '' }],
  }),
  View: TableView,
}
