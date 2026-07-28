import { useMemo } from 'react'
import GridLayoutBase, { WidthProvider } from 'react-grid-layout/legacy'
import type { Layout } from 'react-grid-layout/legacy'
import { LayoutGrid } from 'lucide-react'
import { useActiveBoard } from './useActiveBoard'
import { WidgetCard } from './WidgetCard'
import { AddWidgetPalette } from './AddWidgetPalette'
import { widgetRegistry } from '../../widgets/registry'
import type { WidgetLayout, WidgetType } from '../../types/widget'
import { findFreeSlot } from '../../lib/gridPacking'

const GridLayout = WidthProvider(GridLayoutBase)

interface BoardCanvasProps {
  boardId: string
  boardTitle: string
}

export function BoardCanvas({ boardId, boardTitle }: BoardCanvasProps) {
  const { widgets, loading, selections, addWidget, updateWidget, deleteWidget, updateLayouts, select } =
    useActiveBoard(boardId)

  const layout: Layout = useMemo(
    () => widgets.map((w) => ({ i: w.id, x: w.layout.x, y: w.layout.y, w: w.layout.w, h: w.layout.h })),
    [widgets],
  )

  function persistLayout(next: Layout) {
    const changes: { id: string; layout: WidgetLayout }[] = []
    for (const item of next) {
      const widget = widgets.find((w) => w.id === item.i)
      if (!widget) continue
      const { x, y, w, h } = item
      if (widget.layout.x !== x || widget.layout.y !== y || widget.layout.w !== w || widget.layout.h !== h) {
        changes.push({ id: widget.id, layout: { x, y, w, h } })
      }
    }
    if (changes.length > 0) void updateLayouts(changes)
  }

  function handleAdd(type: WidgetType) {
    const descriptor = widgetRegistry[type]
    const created = descriptor.createDefault(boardId)
    const { w, h } = created.layout
    const { x, y } = findFreeSlot(
      widgets.map((widget) => widget.layout),
      w,
      h,
    )
    void addWidget({ ...created, layout: { x, y, w, h } })
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight text-ink">{boardTitle}</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loading ? (
          <p className="text-sm text-ink-muted">Carregando…</p>
        ) : widgets.length === 0 ? (
          <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-series-1/10 text-series-1">
              <LayoutGrid size={22} />
            </div>
            <p className="text-sm text-ink-muted">
              Este quadro está vazio. Use o botão “+” no canto para adicionar o primeiro elemento.
            </p>
          </div>
        ) : (
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={32}
            margin={[12, 12]}
            draggableHandle=".widget-drag-handle"
            onDragStop={(next: Layout) => persistLayout(next)}
            onResizeStop={(next: Layout) => persistLayout(next)}
          >
            {widgets.map((widget) => (
              <div key={widget.id}>
                <WidgetCard
                  widget={widget}
                  otherWidgets={widgets.filter((w) => w.id !== widget.id)}
                  selections={selections}
                  onSelect={select}
                  onChange={(patch) => void updateWidget(widget.id, patch)}
                  onDelete={() => void deleteWidget(widget.id)}
                />
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      <AddWidgetPalette onAdd={handleAdd} />
    </div>
  )
}
