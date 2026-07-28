import { useEffect } from 'react'
import { useActiveBoardStore } from '../../state/activeBoardStore'

export function useActiveBoard(boardId: string) {
  const widgets = useActiveBoardStore((s) => s.widgets)
  const loading = useActiveBoardStore((s) => s.loading)
  const selections = useActiveBoardStore((s) => s.selections)
  const open = useActiveBoardStore((s) => s.open)
  const close = useActiveBoardStore((s) => s.close)
  const addWidget = useActiveBoardStore((s) => s.addWidget)
  const updateWidget = useActiveBoardStore((s) => s.updateWidget)
  const deleteWidget = useActiveBoardStore((s) => s.deleteWidget)
  const updateLayouts = useActiveBoardStore((s) => s.updateLayouts)
  const select = useActiveBoardStore((s) => s.select)

  useEffect(() => {
    open(boardId)
    return () => close()
  }, [boardId, open, close])

  return { widgets, loading, selections, addWidget, updateWidget, deleteWidget, updateLayouts, select }
}
